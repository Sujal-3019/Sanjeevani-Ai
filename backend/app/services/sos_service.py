from geoalchemy2.functions import (
    ST_MakePoint,
    ST_SetSRID,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.emergency_event import (
    EmergencyEvent,
    EmergencyEventStatus,
)
from app.models.patient_profile import PatientProfile
from app.models.sos_request import (
    SOSRequest,
    SOSRequestStatus,
)
from app.models.user import User, UserRole
from app.schemas.sos_request import SOSRequestCreate
from app.services.emergency_share_service import (
    EmergencyShareService,
)
from app.services.emergency_notification_service import (
    EmergencyNotificationService,
)



class SOSServiceError(Exception):
    """Base exception for SOS service errors."""


class PatientProfileRequiredError(SOSServiceError):
    """Raised when the patient has no profile."""


class InvalidSOSRequestError(SOSServiceError):
    """Raised when the SOS request is invalid."""


class SOSService:

    @staticmethod
    def create_sos(
        db: Session,
        user: User,
        data: SOSRequestCreate,
    ) -> tuple[SOSRequest, EmergencyEvent, str]:

        if user.role != UserRole.PATIENT:
            raise InvalidSOSRequestError(
                "Only patient accounts can create an SOS request."
            )

        if not user.is_active:
            raise InvalidSOSRequestError(
                "Your account is inactive."
            )

        patient_profile = db.scalar(
            select(PatientProfile).where(
                PatientProfile.user_id == user.id,
            )
        )

        if patient_profile is None:
            raise PatientProfileRequiredError(
                "Please complete your patient profile before creating an emergency request."
            )

        location = ST_SetSRID(
            ST_MakePoint(
                data.longitude,
                data.latitude,
            ),
            4326,
        )

        sos_request = SOSRequest(
            patient_profile_id=patient_profile.id,
            emergency_type=data.emergency_type,
            emergency_details=data.emergency_details,
            location=location,
            status=SOSRequestStatus.CREATED,
        )

        db.add(sos_request)
        db.flush()

        emergency_event = EmergencyEvent(
            sos_request_id=sos_request.id,
            status=EmergencyEventStatus.CREATED,
        )

        db.add(emergency_event)
        db.flush()

        share_token = (
            EmergencyShareService.create_share_token(
                db=db,
                sos_request=sos_request,
            )
        )

        # Commit SOS, emergency event, and share token
        # together as one database transaction.
        db.commit()

        db.refresh(sos_request)
        db.refresh(emergency_event)

        EmergencyNotificationService.notify_primary_contact(
            patient_profile=patient_profile,
            patient_user=user,
            sos_request=sos_request,
            share_token=share_token,
        )

        return (
            sos_request,
            emergency_event,
            share_token,
        )