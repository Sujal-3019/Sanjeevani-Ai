from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.emergency_contact import (
    EmergencyContactCreate,
    EmergencyContactResponse,
    EmergencyContactUpdate,
)
from app.services.emergency_contact_service import (
    EmergencyContactNotFoundError,
    EmergencyContactService,
    InvalidEmergencyContactError,
    PatientProfileNotFoundError,
)


router = APIRouter(
    prefix="/emergency-contacts",
    tags=["Emergency Contacts"],
)


patient_role_dependency = require_roles(
    UserRole.PATIENT,
)


def _serialize_contact(contact):
    return {
        "id": contact.id,
        "name": contact.name,
        "relationship": contact.contact_relationship,
        "mobile_number": contact.mobile_number,
        "email": contact.email,
        "is_primary": contact.is_primary,
    }


@router.get(
    "",
    response_model=list[EmergencyContactResponse],
    status_code=status.HTTP_200_OK,
)
def get_emergency_contacts(
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        contacts = (
            EmergencyContactService.list_contacts(
                db=db,
                user=current_user,
            )
        )

        return [
            _serialize_contact(contact)
            for contact in contacts
        ]

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidEmergencyContactError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "",
    response_model=EmergencyContactResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_emergency_contact(
    data: EmergencyContactCreate,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        contact = (
            EmergencyContactService.create_contact(
                db=db,
                user=current_user,
                data=data,
            )
        )

        return _serialize_contact(contact)

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidEmergencyContactError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except IntegrityError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The emergency contact could not be saved "
                "because of a conflicting primary-contact update."
            ),
        ) from exc


@router.put(
    "/{contact_id}",
    response_model=EmergencyContactResponse,
    status_code=status.HTTP_200_OK,
)
def update_emergency_contact(
    contact_id: UUID,
    data: EmergencyContactUpdate,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        contact = (
            EmergencyContactService.update_contact(
                db=db,
                user=current_user,
                contact_id=contact_id,
                data=data,
            )
        )

        return _serialize_contact(contact)

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except EmergencyContactNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidEmergencyContactError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except IntegrityError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The emergency contact could not be updated "
                "because of a conflicting primary-contact update."
            ),
        ) from exc


@router.patch(
    "/{contact_id}/primary",
    response_model=EmergencyContactResponse,
    status_code=status.HTTP_200_OK,
)
def make_emergency_contact_primary(
    contact_id: UUID,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        contact = (
            EmergencyContactService.make_primary(
                db=db,
                user=current_user,
                contact_id=contact_id,
            )
        )

        return _serialize_contact(contact)

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except EmergencyContactNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidEmergencyContactError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except IntegrityError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The primary contact could not be changed "
                "because of a conflicting update."
            ),
        ) from exc


@router.delete(
    "/{contact_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_emergency_contact(
    contact_id: UUID,
    current_user: User = Depends(
        patient_role_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        EmergencyContactService.delete_contact(
            db=db,
            user=current_user,
            contact_id=contact_id,
        )

    except PatientProfileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except EmergencyContactNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidEmergencyContactError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return None