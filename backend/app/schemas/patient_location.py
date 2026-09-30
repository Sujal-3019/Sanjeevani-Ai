from pydantic import BaseModel, Field


class PatientLocationUpdateCreate(BaseModel):
    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )


class PatientLocationUpdateResponse(BaseModel):
    sos_request_id: str
    latitude: float
    longitude: float
    recorded_at: str