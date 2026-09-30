import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import cast, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.emergency_event import EmergencyEvent
from app.models.patient_location import PatientLocationUpdate
from app.models.patient_profile import PatientProfile
from app.models.sos_request import SOSRequest
from app.models.user import User
from app.schemas.sos_request import EmergencyType
from app.services.emergency_share_service import (
    EmergencyShareService,
    EmergencyShareTokenInvalidError,
)


router = APIRouter(
    prefix="/emergency-share",
    tags=["Emergency Location Share"],
)


@router.get(
    "/{token}",
)
def get_emergency_share(
    token: str,
    db: Session = Depends(get_db),
):
    try:
        sos_request = (
            EmergencyShareService.get_sos_by_token(
                db,
                token,
            )
        )
    except EmergencyShareTokenInvalidError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    patient_profile = db.scalar(
        select(PatientProfile).where(
            PatientProfile.id
            == sos_request.patient_profile_id,
        )
    )

    if patient_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    patient_user = db.scalar(
        select(User).where(
            User.id == patient_profile.user_id,
        )
    )

    if patient_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient account not found.",
        )

    emergency_event = db.scalar(
        select(EmergencyEvent).where(
            EmergencyEvent.sos_request_id
            == sos_request.id,
        )
    )

    latest_location = db.execute(
        select(
            ST_Y(
                cast(
                    PatientLocationUpdate.location,
                    Geometry,
                ),
            ).label("latitude"),
            ST_X(
                cast(
                    PatientLocationUpdate.location,
                    Geometry,
                ),
            ).label("longitude"),
            PatientLocationUpdate.recorded_at,
        )
        .where(
            PatientLocationUpdate.sos_request_id
            == sos_request.id,
        )
        .order_by(
            PatientLocationUpdate.recorded_at.desc(),
        )
        .limit(1)
    ).first()

    if latest_location is not None:
        latitude = float(latest_location.latitude)
        longitude = float(latest_location.longitude)
        recorded_at = latest_location.recorded_at
    else:
        initial_location = db.execute(
            select(
                ST_Y(
                    cast(
                        SOSRequest.location,
                        Geometry,
                    ),
                ).label("latitude"),
                ST_X(
                    cast(
                        SOSRequest.location,
                        Geometry,
                    ),
                ).label("longitude"),
            ).where(
                SOSRequest.id == sos_request.id,
            )
        ).first()

        latitude = (
            float(initial_location.latitude)
            if initial_location is not None
            else None
        )

        longitude = (
            float(initial_location.longitude)
            if initial_location is not None
            else None
        )

        recorded_at = sos_request.created_at

    return {
        "sos_request_id": str(sos_request.id),
        "patient": {
            "name": patient_user.full_name,
        },
        "emergency": {
            "type": (
                sos_request.emergency_type.value
                if isinstance(
                    sos_request.emergency_type,
                    EmergencyType,
                )
                else str(sos_request.emergency_type)
            ),
            "details": sos_request.emergency_details,
        },
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "recorded_at": (
                recorded_at.isoformat()
                if recorded_at is not None
                else None
            ),
        },
        "emergency_event": {
            "status": (
                emergency_event.status.value
                if emergency_event is not None
                else None
            ),
        },
    }