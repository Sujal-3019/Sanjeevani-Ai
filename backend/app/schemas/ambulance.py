
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AmbulanceCrewBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    phone: str = Field(min_length=1, max_length=20)
    role: str = Field(default="Other", min_length=1, max_length=50)
    qualification: str = Field(default="", max_length=150)
    is_primary: bool = False

    @field_validator("name", "phone", "role")
    @classmethod
    def strip_required_strings(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value

    @field_validator("qualification")
    @classmethod
    def strip_qualification(cls, value: str) -> str:
        return value.strip()


class AmbulanceCrewResponse(AmbulanceCrewBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID


class AmbulanceBase(BaseModel):
    ambulance_code: str = Field(min_length=1, max_length=50)
    registration_number: str = Field(min_length=1, max_length=30)
    ambulance_type: str = Field(default="BLS", min_length=1, max_length=20)
    status: str = Field(default="OFFLINE", min_length=1, max_length=20)
    current_location: str = Field(
        default="Hospital Campus",
        min_length=1,
        max_length=255,
    )
    equipment: list[str] = Field(default_factory=list)
    notes: str = Field(default="", max_length=5000)
    crew: list[AmbulanceCrewBase] = Field(default_factory=list)

    @field_validator("ambulance_code", "registration_number", "current_location")
    @classmethod
    def strip_required_fields(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value

    @field_validator("ambulance_type", "status")
    @classmethod
    def normalize_codes(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator("equipment")
    @classmethod
    def clean_equipment(cls, value: list[str]) -> list[str]:
        return list(dict.fromkeys(
            item.strip() for item in value if item.strip()
        ))

    @field_validator("notes")
    @classmethod
    def strip_notes(cls, value: str) -> str:
        return value.strip()


class AmbulanceCreate(AmbulanceBase):
    pass


class AmbulanceUpdate(AmbulanceBase):
    pass


class AmbulanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    hospital_id: uuid.UUID
    ambulance_code: str
    registration_number: str
    ambulance_type: str
    status: str
    current_location: str
    equipment: list[str]
    notes: str
    created_at: datetime
    updated_at: datetime
    crew: list[AmbulanceCrewResponse]
