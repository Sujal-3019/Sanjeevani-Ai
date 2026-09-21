from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.models.sos_request import EmergencyType


class SOSRequestCreate(BaseModel):
    emergency_type: EmergencyType

    emergency_details: str | None = Field(
        default=None,
        max_length=500,
    )

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )

    @field_validator("emergency_details")
    @classmethod
    def normalize_details(
        cls,
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        value = value.strip()

        return value or None


class SOSRequestResponse(BaseModel):
    id: UUID
    emergency_event_id: UUID
    status: str
    emergency_type: EmergencyType
    emergency_details: str | None
    latitude: float
    longitude: float