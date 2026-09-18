from app.schemas.auth import (
    CurrentUserResponse,
    HospitalAdminRegisterRequest,
    LogoutRequest,
    MessageResponse,
    ParamedicOTPRequest,
    PasswordLoginRequest,
    PatientRegisterRequest,
    RefreshTokenRequest,
    SendOTPRequest,
    TokenResponse,
    VerifyOTPRequest,
    VerifyParamedicOTPRequest,
)

from app.schemas.patient_profile import (
    EmergencyContactData,
    EmergencyContactResponse,
    PatientMedicalProfileData,
    PatientMedicalProfileResponse,
    PatientProfileCreate,
    PatientProfileResponse,
)

__all__ = [
    # Authentication
    "MessageResponse",
    "CurrentUserResponse",
    "PatientRegisterRequest",
    "HospitalAdminRegisterRequest",
    "PasswordLoginRequest",
    "SendOTPRequest",
    "VerifyOTPRequest",
    "ParamedicOTPRequest",
    "VerifyParamedicOTPRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "LogoutRequest",

    # Patient profile
    "EmergencyContactData",
    "EmergencyContactResponse",
    "PatientMedicalProfileData",
    "PatientMedicalProfileResponse",
    "PatientProfileCreate",
    "PatientProfileResponse",
]