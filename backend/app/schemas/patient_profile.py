from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EmergencyContactData(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    relationship: str = Field(min_length=2, max_length=50)
    mobile_number: str = Field(min_length=10, max_length=15)
    is_primary: bool = True

    @field_validator("name", "relationship")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        digits = "".join(
            character
            for character in value
            if character.isdigit()
        )

        if len(digits) != 10:
            raise ValueError(
                "Mobile number must contain exactly 10 digits."
            )

        if not digits.startswith(("6", "7", "8", "9")):
            raise ValueError(
                "Please enter a valid Indian mobile number."
            )

        return digits


class PatientMedicalProfileData(BaseModel):
    allergies: str | None = None
    chronic_conditions: str | None = None
    current_medications: str | None = None
    major_surgeries: str | None = None
    disabilities: str | None = None

    @field_validator(
        "allergies",
        "chronic_conditions",
        "current_medications",
        "major_surgeries",
        "disabilities",
        mode="before",
    )
    @classmethod
    def normalize_optional_text(cls, value):
        if value is None:
            return None

        value = str(value).strip()

        return value or None


class PatientProfileCreate(BaseModel):
    date_of_birth: date
    gender: str | None = None
    blood_group: str | None = None

    height_cm: int | None = Field(
        default=None,
        ge=30,
        le=250,
    )

    weight_kg: Decimal | None = Field(
        default=None,
        ge=1,
        le=500,
    )

    address: str | None = None
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(min_length=6, max_length=6)

    pregnancy_status: str | None = None

    medical_sharing_accepted: bool
    terms_accepted: bool

    emergency_contact: EmergencyContactData

    medical_profile: PatientMedicalProfileData

    @field_validator("gender", "blood_group", "address", "pregnancy_status", mode="before")
    @classmethod
    def normalize_optional_fields(cls, value):
        if value is None:
            return None

        value = str(value).strip()

        return value or None

    @field_validator("city", "state")
    @classmethod
    def normalize_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value: str) -> str:
        value = value.strip()

        if not value.isdigit() or len(value) != 6:
            raise ValueError(
                "Pincode must contain exactly 6 digits."
            )

        return value


class EmergencyContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    relationship: str
    mobile_number: str
    is_primary: bool


class PatientMedicalProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    allergies: str | None
    chronic_conditions: str | None
    current_medications: str | None
    major_surgeries: str | None
    disabilities: str | None


class PatientProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    date_of_birth: date
    gender: str | None
    blood_group: str | None
    height_cm: int | None
    weight_kg: Decimal | None
    address: str | None
    city: str
    state: str
    pincode: str
    pregnancy_status: str | None
    medical_sharing_accepted: bool
    terms_accepted: bool

    emergency_contacts: list[EmergencyContactResponse]
    medical_profile: PatientMedicalProfileResponse | None