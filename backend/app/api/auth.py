from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.otp_verification import OTPChannel, OTPPurpose
from app.models.user import User, UserRole
from app.schemas.auth import (
    HospitalAdminRegisterRequest,
    LogoutRequest,
    MessageResponse,
    OTPResponse,
    ParamedicOTPRequest,
    PatientRegisterRequest,
    PasswordLoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    VerifyOTPRequest,
    VerifyParamedicOTPRequest,
)
from app.services.auth_service import (
    AccountInactiveError,
    AuthService,
    AuthServiceError,
    DuplicateAccountError,
    InvalidCredentialsError,
    InvalidOTPError,
)


router = APIRouter()


# ------------------------------------------------------------------
# Registration
# ------------------------------------------------------------------


@router.post(
    "/register/patient",
    response_model=OTPResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_patient(
    request: PatientRegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.register_patient(
            db=db,
            full_name=request.full_name,
            email=str(request.email),
            mobile_number=request.mobile_number,
            password=request.password,
        )

        otp = AuthService.create_and_send_otp(
            db=db,
            user_id=user.id,
            channel=OTPChannel.SMS,
            destination=user.mobile_number,
            purpose=OTPPurpose.REGISTRATION,
        )

        return OTPResponse(
            message="Patient account created. OTP sent to your mobile number.",
            channel=otp.channel.value,
            destination=otp.destination,
        )

    except DuplicateAccountError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/register/hospital-admin",
    response_model=OTPResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_hospital_admin(
    request: HospitalAdminRegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.register_hospital_admin(
            db=db,
            full_name=request.full_name,
            email=str(request.email),
            mobile_number=request.mobile_number,
            password=request.password,
        )

        otp = AuthService.create_and_send_otp(
            db=db,
            user_id=user.id,
            channel=OTPChannel.SMS,
            destination=user.mobile_number,
            purpose=OTPPurpose.REGISTRATION,
        )

        return OTPResponse(
            message="Hospital admin account created. OTP sent to your mobile number.",
            channel=otp.channel.value,
            destination=otp.destination,
        )

    except DuplicateAccountError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Registration OTP verification
# ------------------------------------------------------------------


@router.post(
    "/register/verify-otp",
    response_model=MessageResponse,
)
def verify_registration_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    try:
        otp_record = AuthService.verify_otp_code(
            db=db,
            destination=request.identifier,
            channel=OTPChannel.SMS,
            purpose=OTPPurpose.REGISTRATION,
            otp=request.otp,
        )

        if otp_record.user_id is None:
            raise InvalidOTPError("Invalid registration OTP.")

        user = db.get(User, otp_record.user_id)

        if user is None:
            raise InvalidOTPError("Associated user account was not found.")

        AuthService.mark_user_verified(
            db=db,
            user=user,
        )

        return MessageResponse(
            message="Account verified successfully.",
        )

    except InvalidOTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Password login
# ------------------------------------------------------------------


@router.post(
    "/login/password",
    response_model=OTPResponse,
)
def password_login(
    request: PasswordLoginRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.authenticate_with_password(
            db=db,
            identifier=request.identifier,
            password=request.password,
            allowed_roles=(
                UserRole.PATIENT,
                UserRole.HOSPITAL_ADMIN,
            ),
        )

        if not user.is_verified:
            raise AccountInactiveError(
                "Please verify your account before logging in."
            )

        if "@" in request.identifier:
            channel = OTPChannel.EMAIL
            destination = user.email

            if not destination:
                raise AuthServiceError(
                    "No email address is associated with this account."
                )
        else:
            channel = OTPChannel.SMS
            destination = user.mobile_number

            if not destination:
                raise AuthServiceError(
                    "No mobile number is associated with this account."
                )

        otp = AuthService.create_and_send_otp(
            db=db,
            user_id=user.id,
            channel=channel,
            destination=destination,
            purpose=OTPPurpose.LOGIN,
        )

        return OTPResponse(
            message="OTP sent successfully.",
            channel=otp.channel.value,
            destination=otp.destination,
        )

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    except AccountInactiveError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Login OTP verification
# ------------------------------------------------------------------


@router.post(
    "/login/verify-otp",
    response_model=TokenResponse,
)
def verify_login_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    identifier = request.identifier.strip()

    if "@" in identifier:
        channel = OTPChannel.EMAIL
        destination = identifier.lower()
    else:
        channel = OTPChannel.SMS
        destination = identifier

    try:
        otp_record = AuthService.verify_otp_code(
            db=db,
            destination=destination,
            channel=channel,
            purpose=OTPPurpose.LOGIN,
            otp=request.otp,
        )

        if otp_record.user_id is None:
            raise InvalidOTPError("Invalid login OTP.")

        user = db.get(User, otp_record.user_id)

        if user is None:
            raise InvalidCredentialsError(
                "User account no longer exists."
            )

        if user.role not in (
            UserRole.PATIENT,
            UserRole.HOSPITAL_ADMIN,
        ):
            raise InvalidCredentialsError(
                "Invalid login account."
            )

        if not user.is_verified:
            raise AccountInactiveError(
                "Please verify your account before logging in."
            )

        AuthService._ensure_account_can_authenticate(user)

        return AuthService.create_login_tokens(
            db=db,
            user=user,
        )

    except InvalidOTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    except AccountInactiveError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Paramedic login
# ------------------------------------------------------------------


@router.post(
    "/paramedic/otp/send",
    response_model=OTPResponse,
)
def send_paramedic_otp(
    request: ParamedicOTPRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.get_paramedic_for_login(
            db=db,
            mobile_number=request.mobile_number,
        )

        if not user.is_verified:
            raise AccountInactiveError(
                "This paramedic account has not been verified."
            )

        otp = AuthService.create_and_send_otp(
            db=db,
            user_id=user.id,
            channel=OTPChannel.SMS,
            destination=user.mobile_number,
            purpose=OTPPurpose.LOGIN,
        )

        return OTPResponse(
            message="OTP sent successfully.",
            channel=otp.channel.value,
            destination=otp.destination,
        )

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    except AccountInactiveError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/paramedic/otp/verify",
    response_model=TokenResponse,
)
def verify_paramedic_otp(
    request: VerifyParamedicOTPRequest,
    db: Session = Depends(get_db),
):
    try:
        paramedic = AuthService.get_paramedic_for_login(
            db=db,
            mobile_number=request.mobile_number,
        )

        if not paramedic.is_verified:
            raise AccountInactiveError(
                "This paramedic account has not been verified."
            )

        otp_record = AuthService.verify_otp_code(
            db=db,
            destination=paramedic.mobile_number,
            channel=OTPChannel.SMS,
            purpose=OTPPurpose.LOGIN,
            otp=request.otp,
        )

        if otp_record.user_id != paramedic.id:
            raise InvalidOTPError("Invalid OTP.")

        return AuthService.create_login_tokens(
            db=db,
            user=paramedic,
        )

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    except InvalidOTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except AccountInactiveError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Refresh token
# ------------------------------------------------------------------


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    try:
        user, token_data = AuthService.refresh_access_token(
            db=db,
            refresh_token=request.refresh_token,
        )

        return {
            **token_data,
            "refresh_token": request.refresh_token,
            "user_id": user.id,
            "role": user.role.value,
            "expires_in": settings.access_token_expire_minutes * 60,
        }

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    except AuthServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc


# ------------------------------------------------------------------
# Logout
# ------------------------------------------------------------------


@router.post(
    "/logout",
    response_model=MessageResponse,
)
def logout(
    request: LogoutRequest,
    db: Session = Depends(get_db),
):
    AuthService.revoke_refresh_token(
        db=db,
        refresh_token=request.refresh_token,
    )

    return MessageResponse(
        message="Logged out successfully.",
    )