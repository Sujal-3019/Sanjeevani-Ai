import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    OTP_MAX_ATTEMPTS,
    create_access_token,
    create_refresh_token,
    generate_otp,
    get_otp_expiry,
    hash_otp,
    hash_password,
    hash_refresh_token,
    verify_otp,
    verify_password,
)
from app.models.otp_verification import (
    OTPChannel,
    OTPPurpose,
    OTPVerification,
)
from app.models.refresh_token import RefreshToken
from app.models.user import (
    User,
    UserRole,
    UserStatus,
)
from app.services.otp_service import OTPDeliveryService


class AuthServiceError(Exception):
    """Base exception for authentication service errors."""


class DuplicateAccountError(AuthServiceError):
    """Raised when an email or mobile number is already registered."""


class InvalidCredentialsError(AuthServiceError):
    """Raised when login credentials are invalid."""


class InvalidOTPError(AuthServiceError):
    """Raised when an OTP is invalid, expired, or unusable."""


class AccountInactiveError(AuthServiceError):
    """Raised when an account cannot currently authenticate."""


class AuthService:
    """
    Authentication business logic.

    This service intentionally does not depend on FastAPI request/response
    objects. API routes can call these methods and translate exceptions
    into HTTP responses.
    """

    # ------------------------------------------------------------------
    # Registration
    # ------------------------------------------------------------------

    @staticmethod
    def register_patient(
        db: Session,
        full_name: str,
        email: str,
        mobile_number: str,
        password: str,
    ) -> User:
        """Create a patient account."""

        normalized_email = email.strip().lower()
        normalized_mobile = mobile_number.strip()

        existing_email = db.scalar(
            select(User).where(
                User.email == normalized_email,
            )
        )

        if existing_email is not None:
            raise DuplicateAccountError(
                "An account with this email already exists."
            )

        existing_mobile = db.scalar(
            select(User).where(
                User.mobile_number == normalized_mobile,
            )
        )

        if existing_mobile is not None:
            raise DuplicateAccountError(
                "An account with this mobile number already exists."
            )

        user = User(
            role=UserRole.PATIENT,
            full_name=full_name.strip(),
            email=normalized_email,
            mobile_number=normalized_mobile,
            password_hash=hash_password(password),
            status=UserStatus.ACTIVE,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def register_hospital_admin(
        db: Session,
        full_name: str,
        email: str,
        mobile_number: str,
        password: str,
    ) -> User:
        """Create a hospital administrator account."""

        normalized_email = email.strip().lower()
        normalized_mobile = mobile_number.strip()

        existing_email = db.scalar(
            select(User).where(
                User.email == normalized_email,
            )
        )

        if existing_email is not None:
            raise DuplicateAccountError(
                "An account with this email already exists."
            )

        existing_mobile = db.scalar(
            select(User).where(
                User.mobile_number == normalized_mobile,
            )
        )

        if existing_mobile is not None:
            raise DuplicateAccountError(
                "An account with this mobile number already exists."
            )

        user = User(
            role=UserRole.HOSPITAL_ADMIN,
            full_name=full_name.strip(),
            email=normalized_email,
            mobile_number=normalized_mobile,
            password_hash=hash_password(password),
            status=UserStatus.ACTIVE,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    # ------------------------------------------------------------------
    # Password authentication
    # ------------------------------------------------------------------

    @staticmethod
    def authenticate_with_password(
        db: Session,
        identifier: str,
        password: str,
        allowed_roles: tuple[UserRole, ...],
    ) -> User:
        """
        Validate email/mobile + password.

        The caller supplies which roles are allowed to use this flow.
        """

        normalized_identifier = identifier.strip()

        if "@" in normalized_identifier:
            user = db.scalar(
                select(User).where(
                    User.email == normalized_identifier.lower(),
                )
            )
        else:
            user = db.scalar(
                select(User).where(
                    User.mobile_number == normalized_identifier,
                )
            )

        if user is None:
            raise InvalidCredentialsError(
                "Invalid credentials."
            )

        if user.role not in allowed_roles:
            raise InvalidCredentialsError(
                "Invalid credentials."
            )

        AuthService._ensure_account_can_authenticate(user)

        if not user.password_hash:
            raise InvalidCredentialsError(
                "Password authentication is not available for this account."
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise InvalidCredentialsError(
                "Invalid credentials."
            )

        return user

    # ------------------------------------------------------------------
    # Paramedic authentication
    # ------------------------------------------------------------------

    @staticmethod
    def get_paramedic_for_login(
        db: Session,
        mobile_number: str,
    ) -> User:
        """
        Find a paramedic account by mobile number.

        Additional paramedic/hospital/ambulance validation will be added
        once those domain models are implemented.
        """

        normalized_mobile = mobile_number.strip()

        user = db.scalar(
            select(User).where(
                User.mobile_number == normalized_mobile,
                User.role == UserRole.PARAMEDIC,
            )
        )

        if user is None:
            raise InvalidCredentialsError(
                "No paramedic account was found for this mobile number."
            )

        AuthService._ensure_account_can_authenticate(user)

        return user

    # ------------------------------------------------------------------
    # OTP creation
    # ------------------------------------------------------------------

    @staticmethod
    def create_and_send_otp(
        db: Session,
        *,
        user_id: uuid.UUID | None,
        channel: OTPChannel,
        destination: str,
        purpose: OTPPurpose,
    ) -> OTPVerification:
        """
        Generate, hash, store, and deliver an OTP.

        The plaintext OTP is never stored in PostgreSQL.
        """

        normalized_destination = destination.strip()

        otp = generate_otp()
        otp_hash_value = hash_otp(otp)
        expires_at = get_otp_expiry()

        # Invalidate previous unused OTPs for the same destination,
        # channel, and purpose.
        previous_otps = db.scalars(
            select(OTPVerification).where(
                OTPVerification.destination == normalized_destination,
                OTPVerification.channel == channel,
                OTPVerification.purpose == purpose,
                OTPVerification.used_at.is_(None),
            )
        ).all()

        for previous_otp in previous_otps:
            previous_otp.used_at = datetime.now(timezone.utc)

        otp_verification = OTPVerification(
            user_id=user_id,
            channel=channel,
            destination=normalized_destination,
            otp_hash=otp_hash_value,
            purpose=purpose,
            expires_at=expires_at,
            attempts=0,
        )

        db.add(otp_verification)
        db.commit()
        db.refresh(otp_verification)

        OTPDeliveryService.send(
            channel=channel,
            destination=normalized_destination,
            otp=otp,
        )

        return otp_verification

    # ------------------------------------------------------------------
    # OTP verification
    # ------------------------------------------------------------------

    @staticmethod
    def verify_otp_code(
        db: Session,
        *,
        destination: str,
        channel: OTPChannel,
        purpose: OTPPurpose,
        otp: str,
    ) -> OTPVerification:
        """Verify the latest valid OTP for a destination."""

        normalized_destination = destination.strip()

        otp_verification = db.scalar(
            select(OTPVerification)
            .where(
                OTPVerification.destination
                == normalized_destination,
                OTPVerification.channel == channel,
                OTPVerification.purpose == purpose,
                OTPVerification.used_at.is_(None),
            )
            .order_by(
                OTPVerification.created_at.desc()
            )
        )

        if otp_verification is None:
            raise InvalidOTPError(
                "Invalid or expired OTP."
            )

        now = datetime.now(timezone.utc)

        if otp_verification.expires_at <= now:
            raise InvalidOTPError(
                "This OTP has expired. Please request a new OTP."
            )

        if otp_verification.attempts >= OTP_MAX_ATTEMPTS:
            raise InvalidOTPError(
                "Maximum OTP attempts exceeded. Please request a new OTP."
            )

        otp_verification.attempts += 1

        if not verify_otp(
            otp,
            otp_verification.otp_hash,
        ):
            db.commit()

            raise InvalidOTPError(
                "Invalid OTP."
            )

        otp_verification.used_at = now

        db.commit()
        db.refresh(otp_verification)

        return otp_verification

    # ------------------------------------------------------------------
    # Login session creation
    # ------------------------------------------------------------------

    @staticmethod
    def create_login_tokens(
        db: Session,
        user: User,
        *,
        device_info: str | None = None,
        ip_address: str | None = None,
    ) -> dict:
        """
        Create access + refresh tokens and persist the refresh-token hash.
        """

        access_token = create_access_token(
            user_id=str(user.id),
            role=user.role.value,
        )

        refresh_token, refresh_expires_at = create_refresh_token(
            user_id=str(user.id),
        )

        refresh_token_record = RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=refresh_expires_at,
            revoked_at=None,
            is_revoked=False,
            device_info=device_info,
            ip_address=ip_address,
        )

        db.add(refresh_token_record)
        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    # ------------------------------------------------------------------
    # Refresh token
    # ------------------------------------------------------------------

    @staticmethod
    def refresh_access_token(
        db: Session,
        refresh_token: str,
    ) -> tuple[User, dict]:
        """Validate a refresh token and issue a new access token."""

        from app.core.security import decode_token

        try:
            payload = decode_token(refresh_token)
        except Exception as exc:
            raise InvalidCredentialsError(
                "Invalid refresh token."
            ) from exc

        if payload.get("type") != "refresh":
            raise InvalidCredentialsError(
                "Invalid refresh token."
            )

        user_id = payload.get("sub")

        if not user_id:
            raise InvalidCredentialsError(
                "Invalid refresh token."
            )

        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError as exc:
            raise InvalidCredentialsError(
                "Invalid refresh token."
            ) from exc

        token_hash = hash_refresh_token(refresh_token)

        stored_token = db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.user_id == user_uuid,
            )
        )

        if stored_token is None:
            raise InvalidCredentialsError(
                "Invalid refresh token."
            )

        now = datetime.now(timezone.utc)

        if stored_token.is_revoked:
            raise InvalidCredentialsError(
                "Refresh token has been revoked."
            )

        if stored_token.expires_at <= now:
            raise InvalidCredentialsError(
                "Refresh token has expired."
            )

        user = db.get(User, user_uuid)

        if user is None:
            raise InvalidCredentialsError(
                "User account no longer exists."
            )

        AuthService._ensure_account_can_authenticate(user)

        access_token = create_access_token(
            user_id=str(user.id),
            role=user.role.value,
        )

        return user, {
            "access_token": access_token,
            "token_type": "bearer",
        }

    # ------------------------------------------------------------------
    # Logout
    # ------------------------------------------------------------------

    @staticmethod
    def revoke_refresh_token(
        db: Session,
        refresh_token: str,
    ) -> None:
        """Revoke one refresh-token session."""

        token_hash = hash_refresh_token(refresh_token)

        stored_token = db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
            )
        )

        if stored_token is None:
            return

        if stored_token.is_revoked:
            return

        stored_token.is_revoked = True
        stored_token.revoked_at = datetime.now(timezone.utc)

        db.commit()

    # ------------------------------------------------------------------
    # Internal account validation
    # ------------------------------------------------------------------

    @staticmethod
    def _ensure_account_can_authenticate(
        user: User,
    ) -> None:
        """Ensure the account is allowed to authenticate."""

        if user.status != UserStatus.ACTIVE:
            raise AccountInactiveError(
                "This account is not active."
            )

        if not user.is_active:
            raise AccountInactiveError(
                "This account is inactive."
            )