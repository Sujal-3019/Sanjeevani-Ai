
from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


HospitalType = Literal[
    "GOVERNMENT",
    "PRIVATE",
    "MULTISPECIALTY",
    "SPECIALTY",
    "OTHER",
]


class HospitalCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    registration_number: str = Field(
        min_length=1,
        max_length=100,
    )
    hospital_type: HospitalType

    phone: str = Field(min_length=7, max_length=15)
    email: EmailStr

    address: str = Field(min_length=5, max_length=1000)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(pattern=r"^\d{6}$")

    latitude: float | None = Field(
        default=None, ge=-90, le=90,
    )
    longitude: float | None = Field(
        default=None, ge=-180, le=180,
    )

    total_beds: int = Field(default=0, ge=0)
    available_beds: int = Field(default=0, ge=0)
    icu_beds: int = Field(default=0, ge=0)
    trauma_capable: bool = False

    @field_validator(
        "name",
        "registration_number",
        "phone",
        "address",
        "city",
        "state",
        mode="before",
    )
    @classmethod
    def strip_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("registration_number")
    @classmethod
    def validate_registration_number(cls, value):
        if not value:
            raise ValueError(
                "Registration number cannot be blank."
            )
        return value

    @model_validator(mode="after")
    def validate_hospital_values(self):
        if (self.latitude is None) != (
            self.longitude is None
        ):
            raise ValueError(
                "Latitude and longitude must be provided together."
            )

        if self.available_beds > self.total_beds:
            raise ValueError(
                "Available beds cannot exceed total beds."
            )

        if self.icu_beds > self.total_beds:
            raise ValueError(
                "ICU beds cannot exceed total beds."
            )

        return self


class HospitalUpdate(BaseModel):
    name: str | None = Field(
        default=None, min_length=2, max_length=200,
    )
    registration_number: str | None = Field(
        default=None, min_length=1, max_length=100,
    )
    hospital_type: HospitalType | None = None

    phone: str | None = Field(
        default=None, min_length=7, max_length=15,
    )
    email: EmailStr | None = None

    address: str | None = Field(
        default=None, min_length=5, max_length=1000,
    )
    city: str | None = Field(
        default=None, min_length=2, max_length=100,
    )
    state: str | None = Field(
        default=None, min_length=2, max_length=100,
    )
    pincode: str | None = Field(
        default=None, pattern=r"^\d{6}$",
    )

    latitude: float | None = Field(
        default=None, ge=-90, le=90,
    )
    longitude: float | None = Field(
        default=None, ge=-180, le=180,
    )

    total_beds: int | None = Field(default=None, ge=0)
    available_beds: int | None = Field(default=None, ge=0)
    icu_beds: int | None = Field(default=None, ge=0)
    trauma_capable: bool | None = None

    @field_validator(
        "name",
        "registration_number",
        "phone",
        "address",
        "city",
        "state",
        mode="before",
    )
    @classmethod
    def strip_optional_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value

    @model_validator(mode="after")
    def reject_explicit_nulls(self):
        for field_name in self.model_fields_set:
            if getattr(self, field_name) is None:
                raise ValueError(
                    f"{field_name} cannot be null."
                )

        return self


class HospitalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    admin_user_id: UUID

    name: str
    registration_number: str
    hospital_type: str

    phone: str
    email: str

    address: str
    city: str
    state: str
    pincode: str

    latitude: Decimal | None
    longitude: Decimal | None

    total_beds: int
    available_beds: int
    icu_beds: int
    trauma_capable: bool

    verification_status: str
    rejection_reason: str | None

    created_at: datetime
    updated_at: datetime
