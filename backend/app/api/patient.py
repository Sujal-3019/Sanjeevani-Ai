import uuid
from geoalchemy2 import Geometry
from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import select , cast
from sqlalchemy.orm import Session

from app.models.patient_profile import PatientProfile
from app.models.emergency_event import EmergencyEvent
from app.models.sos_request import SOSRequest

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.patient_profile import (
    PatientProfileCreate,
    PatientProfileResponse,
)
from app.services.patient_profile_service import (
    InvalidPatientProfileError,
    PatientProfileNotFoundError,
    PatientProfileService,
)

from app.schemas.sos_request import (
    SOSRequestCreate,
    SOSRequestResponse,
)
from app.services.sos_service import (
    InvalidSOSRequestError,
    PatientProfileRequiredError,
    SOSService,
)


router = APIRouter(
    tags=["Patient"],
)


patient_role_dependency = require_roles(
    UserRole.PATIENT,
)


def _serialize_patient_profile(profile):
    emergency_contacts = [
        {
            "id": contact.id,
            "name": contact.name,
            "relationship": contact.contact_relationship,
            "mobile_number": contact.mobile_number,
            "email": contact.email,
            "is_primary": contact.is_primary,
        }
        for contact in profile.emergency_contacts
    ]

    medical_profile = None

    if profile.medical_profile is not None:
        medical_profile = {
            "id": profile.medical_profile.id,
            "allergies": profile.medical_profile.allergies,
            "chronic_conditions": (
                profile.medical_profile.chronic_conditions
            ),
            "current_medications": (
                profile.medical_profile.current_medications
            ),
            "major_surgeries": (
                profile.medical_profile.major_surgeries
            ),
            "disabilities": profile.medical_profile.disabilities,
        }

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "date_of_birth": profile.date_of_birth,
        "gender": profile.gender,
        "blood_group": profile.blood_group,
        "height_cm": profile.height_cm,
        "weight_kg": profile.weight_kg,
        "address": profile.address,
        "city": profile.city,
        "state": profile.state,
        "pincode": profile.pincode,
        "pregnancy_status": profile.pregnancy_status,
        "medical_sharing_accepted": (
            profile.medical_sharing_accepted
        ),
        "terms_accepted": profile.terms_accepted,
        "emergency_contacts": emergency_contacts,
        "medical_profile": medical_profile,
    }


@router.get(
    "/profile",
    response_model=PatientProfileResponse,
    status_code=status.HTTP_200_OK,
)
def get_patient_profile(
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        profile = PatientProfileService.get_profile(
            db=db,
            user=current_user,
        )

        return _serialize_patient_profile(profile)

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidPatientProfileError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc


@router.post(
    "/profile",
    response_model=PatientProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient_profile(
    data: PatientProfileCreate,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        existing_profile = None

        try:
            existing_profile = (
                PatientProfileService.get_profile(
                    db=db,
                    user=current_user,
                )
            )
        except PatientProfileNotFoundError:
            existing_profile = None

        if existing_profile is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Patient profile already exists. "
                    "Use PUT /patient/profile to update it."
                ),
            )

        profile = (
            PatientProfileService.create_or_update_profile(
                db=db,
                user=current_user,
                data=data,
            )
        )

        return _serialize_patient_profile(profile)

    except HTTPException:
        raise

    except InvalidPatientProfileError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.put(
    "/profile",
    response_model=PatientProfileResponse,
    status_code=status.HTTP_200_OK,
)
def update_patient_profile(
    data: PatientProfileCreate,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        try:
            PatientProfileService.get_profile(
                db=db,
                user=current_user,
            )
        except PatientProfileNotFoundError as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Patient profile does not exist yet. "
                    "Use POST /patient/profile first."
                ),
            ) from exc

        profile = (
            PatientProfileService.create_or_update_profile(
                db=db,
                user=current_user,
                data=data,
            )
        )

        return _serialize_patient_profile(profile)

    except HTTPException:
        raise

    except InvalidPatientProfileError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/emergency/sos",
    response_model=SOSRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_emergency_sos(
    data: SOSRequestCreate,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        sos_request, emergency_event = (
            SOSService.create_sos(
                db=db,
                user=current_user,
                data=data,
            )
        )

        return {
            "id": sos_request.id,
            "emergency_event_id": emergency_event.id,
            "status": emergency_event.status.value,
            "emergency_type": sos_request.emergency_type,
            "emergency_details": sos_request.emergency_details,
            "latitude": data.latitude,
            "longitude": data.longitude,
        }

    except PatientProfileRequiredError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except InvalidSOSRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/emergency/{sos_id}",
    response_model=SOSRequestResponse,
    status_code=status.HTTP_200_OK,
)
def get_emergency_sos(
    sos_id: uuid.UUID,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(
            SOSRequest,
            EmergencyEvent,
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
        )
        .join(
            PatientProfile,
            PatientProfile.id
            == SOSRequest.patient_profile_id,
        )
        .join(
            EmergencyEvent,
            EmergencyEvent.sos_request_id
            == SOSRequest.id,
        )
        .where(
            SOSRequest.id == sos_id,
            PatientProfile.user_id == current_user.id,
        )
    ).first()

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency request not found.",
        )

    (
        sos_request,
        emergency_event,
        latitude,
        longitude,
    ) = result

    return {
        "id": sos_request.id,
        "emergency_event_id": emergency_event.id,
        "status": emergency_event.status.value,
        "emergency_type": sos_request.emergency_type,
        "emergency_details": sos_request.emergency_details,
        "latitude": float(latitude),
        "longitude": float(longitude),
    }