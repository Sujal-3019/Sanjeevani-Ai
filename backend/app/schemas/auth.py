import uuid
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


# ============================================================================
# Common
# ============================================================================

class MessageResponse(BaseModel):
    message: str


class OTPResponse(BaseModel):
    message: str
    channel: Literal["SMS", "EMAIL"]
    destination: str


# ============================================================================
# Patient Registration
# ============================================================================

class PatientRegisterRequest(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )
    email: EmailStr
    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    confirm_password: str = Field(
        min_length=8,
        max_length=128,
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        digits = value.strip().replace(" ", "")

        if digits.startswith("+91"):
            digits = digits[3:]

        if not digits.isdigit() or len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if digits[0] not in "6789":
            raise ValueError(
                "Mobile number must start with 6, 7, 8, or 9."
            )

        return digits

    @field_validator("confirm_password")
    @classmethod
    def validate_passwords(
        cls,
        value: str,
        info,
    ) -> str:
        password = info.data.get("password")

        if password is not None and value != password:
            raise ValueError("Passwords do not match.")

        return value


# ============================================================================
# Hospital Admin Registration
# ============================================================================

class HospitalAdminRegisterRequest(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )
    email: EmailStr
    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    confirm_password: str = Field(
        min_length=8,
        max_length=128,
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        digits = value.strip().replace(" ", "")

        if digits.startswith("+91"):
            digits = digits[3:]

        if not digits.isdigit() or len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if digits[0] not in "6789":
            raise ValueError(
                "Mobile number must start with 6, 7, 8, or 9."
            )

        return digits

    @field_validator("confirm_password")
    @classmethod
    def validate_passwords(
        cls,
        value: str,
        info,
    ) -> str:
        password = info.data.get("password")

        if password is not None and value != password:
            raise ValueError("Passwords do not match.")

        return value


# ============================================================================
# Password Login
# ============================================================================

class PasswordLoginRequest(BaseModel):
    identifier: str = Field(
        min_length=3,
        max_length=255,
    )
    password: str = Field(
        min_length=1,
        max_length=128,
    )

    @field_validator("identifier")
    @classmethod
    def normalize_identifier(cls, value: str) -> str:
        return value.strip()


# ============================================================================
# OTP Requests
# ============================================================================

class SendOTPRequest(BaseModel):
    identifier: str = Field(
        min_length=3,
        max_length=255,
    )

    @field_validator("identifier")
    @classmethod
    def normalize_identifier(cls, value: str) -> str:
        return value.strip()


class VerifyOTPRequest(BaseModel):
    identifier: str = Field(
        min_length=3,
        max_length=255,
    )
    otp: str = Field(
        min_length=6,
        max_length=6,
    )

    @field_validator("identifier")
    @classmethod
    def normalize_identifier(cls, value: str) -> str:
        return value.strip()

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("OTP must contain only digits.")

        return value


# ============================================================================
# Paramedic OTP
# ============================================================================

class ParamedicOTPRequest(BaseModel):
    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        digits = value.strip().replace(" ", "")

        if digits.startswith("+91"):
            digits = digits[3:]

        if not digits.isdigit() or len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if digits[0] not in "6789":
            raise ValueError(
                "Mobile number must start with 6, 7, 8, or 9."
            )

        return digits


class VerifyParamedicOTPRequest(BaseModel):
    mobile_number: str = Field(
        min_length=10,
        max_length=15,
    )
    otp: str = Field(
        min_length=6,
        max_length=6,
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        digits = value.strip().replace(" ", "")

        if digits.startswith("+91"):
            digits = digits[3:]

        if not digits.isdigit() or len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if digits[0] not in "6789":
            raise ValueError(
                "Mobile number must start with 6, 7, 8, or 9."
            )

        return digits

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, value: str) -> str:
        if not value.isdigit():
            raise ValueError("OTP must contain only digits.")

        return value


# ============================================================================
# Token Responses
# ============================================================================

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: uuid.UUID
    role: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(
        min_length=1,
    )


class LogoutRequest(BaseModel):
    refresh_token: str = Field(
        min_length=1,
    )


# ============================================================================
# Current User
# ============================================================================

class CurrentUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    role: str
    full_name: str
    email: str | None
    mobile_number: str | None
    status: str
    is_active: bool
    is_verified: bool