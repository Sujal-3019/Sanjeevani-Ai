from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.emergency_contact import EmergencyContact
from app.models.patient_profile import PatientProfile
from app.models.user import User, UserRole
from app.schemas.emergency_contact import (
    EmergencyContactCreate,
    EmergencyContactUpdate,
)


class EmergencyContactServiceError(Exception):
    """Base emergency contact service error."""


class EmergencyContactNotFoundError(
    EmergencyContactServiceError
):
    """Raised when an emergency contact does not exist."""


class PatientProfileNotFoundError(
    EmergencyContactServiceError
):
    """Raised when the patient profile does not exist."""


class InvalidEmergencyContactError(
    EmergencyContactServiceError
):
    """Raised when emergency contact data is invalid."""


def _validate_patient(
    user: User,
) -> None:
    if user.role != UserRole.PATIENT:
        raise InvalidEmergencyContactError(
            "Only patient accounts can manage emergency contacts."
        )

    if not user.is_active:
        raise InvalidEmergencyContactError(
            "Your account is inactive."
        )


def _get_patient_profile(
    db: Session,
    user: User,
) -> PatientProfile:
    _validate_patient(user)

    profile = db.scalar(
        select(PatientProfile).where(
            PatientProfile.user_id == user.id,
        )
    )

    if profile is None:
        raise PatientProfileNotFoundError(
            "Patient profile has not been created yet."
        )

    return profile


def _get_contact(
    db: Session,
    profile_id: UUID,
    contact_id: UUID,
) -> EmergencyContact:
    contact = db.scalar(
        select(EmergencyContact).where(
            EmergencyContact.id == contact_id,
            EmergencyContact.patient_profile_id == profile_id,
        )
    )

    if contact is None:
        raise EmergencyContactNotFoundError(
            "Emergency contact was not found."
        )

    return contact


def _get_contacts(
    db: Session,
    profile_id: UUID,
) -> list[EmergencyContact]:
    statement = (
        select(EmergencyContact)
        .where(
            EmergencyContact.patient_profile_id
            == profile_id
        )
        .order_by(
            EmergencyContact.is_primary.desc(),
            EmergencyContact.created_at.asc(),
        )
    )

    return list(
        db.scalars(statement).all()
    )


def _clear_primary_contacts(
    db: Session,
    profile_id: UUID,
    except_contact_id: UUID | None = None,
) -> None:
    statement = select(EmergencyContact).where(
        EmergencyContact.patient_profile_id
        == profile_id,
        EmergencyContact.is_primary.is_(True),
    )

    if except_contact_id is not None:
        statement = statement.where(
            EmergencyContact.id
            != except_contact_id,
        )

    contacts = list(
        db.scalars(statement).all()
    )

    for contact in contacts:
        contact.is_primary = False
        contact.updated_at = datetime.now(
            timezone.utc,
        )


def _promote_replacement_contact(
    db: Session,
    profile_id: UUID,
) -> EmergencyContact | None:
    replacement = db.scalar(
        select(EmergencyContact)
        .where(
            EmergencyContact.patient_profile_id
            == profile_id,
        )
        .order_by(
            EmergencyContact.created_at.asc(),
        )
        .limit(1)
    )

    if replacement is None:
        return None

    replacement.is_primary = True
    replacement.updated_at = datetime.now(
        timezone.utc,
    )

    return replacement


class EmergencyContactService:

    @staticmethod
    def list_contacts(
        db: Session,
        user: User,
    ) -> list[EmergencyContact]:
        profile = _get_patient_profile(
            db,
            user,
        )

        return _get_contacts(
            db,
            profile.id,
        )

    @staticmethod
    def create_contact(
        db: Session,
        user: User,
        data: EmergencyContactCreate,
    ) -> EmergencyContact:
        profile = _get_patient_profile(
            db,
            user,
        )

        try:
            existing_contacts = _get_contacts(
                db,
                profile.id,
            )

            should_be_primary = (
                data.is_primary
                or not existing_contacts
            )

            if should_be_primary:
                _clear_primary_contacts(
                    db,
                    profile.id,
                )

            contact = EmergencyContact(
                patient_profile_id=profile.id,
                name=data.name,
                contact_relationship=data.relationship,
                mobile_number=data.mobile_number,
                email=(
                    str(data.email)
                    if data.email
                    else None
                ),
                is_primary=should_be_primary,
            )

            db.add(contact)
            db.commit()
            db.refresh(contact)

            return contact

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def update_contact(
        db: Session,
        user: User,
        contact_id: UUID,
        data: EmergencyContactUpdate,
    ) -> EmergencyContact:
        profile = _get_patient_profile(
            db,
            user,
        )

        contact = _get_contact(
            db,
            profile.id,
            contact_id,
        )

        try:
            contact.name = data.name
            contact.contact_relationship = (
                data.relationship
            )
            contact.mobile_number = (
                data.mobile_number
            )
            contact.email = (
                str(data.email)
                if data.email
                else None
            )

            if data.is_primary:
                _clear_primary_contacts(
                    db,
                    profile.id,
                    except_contact_id=contact.id,
                )

                db.flush()

                contact.is_primary = True

            elif contact.is_primary:
                # An existing primary contact remains primary
                # unless another contact is explicitly promoted.
                contact.is_primary = True

            else:
                contact.is_primary = False

            contact.updated_at = datetime.now(
                timezone.utc,
            )

            db.commit()
            db.refresh(contact)

            return contact

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def make_primary(
        db: Session,
        user: User,
        contact_id: UUID,
    ) -> EmergencyContact:
        profile = _get_patient_profile(
            db,
            user,
        )

        contact = _get_contact(
            db,
            profile.id,
            contact_id,
        )

        try:
            # If this contact is already primary, there is nothing
            # to change.
            if contact.is_primary:
                return contact

            # First remove the primary flag from the existing
            # primary contact(s).
            _clear_primary_contacts(
                db,
                profile.id,
                except_contact_id=contact.id,
            )

            # IMPORTANT:
            # Flush the demotion before promoting the new contact.
            # This prevents the PostgreSQL partial unique index
            # from temporarily seeing two primary contacts.
            db.flush()

            # Now promote the requested contact.
            contact.is_primary = True
            contact.updated_at = datetime.now(
                timezone.utc,
            )

            db.commit()
            db.refresh(contact)

            return contact

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def delete_contact(
        db: Session,
        user: User,
        contact_id: UUID,
    ) -> None:
        profile = _get_patient_profile(
            db,
            user,
        )

        contact = _get_contact(
            db,
            profile.id,
            contact_id,
        )

        was_primary = contact.is_primary

        try:
            db.delete(contact)
            db.flush()

            if was_primary:
                _clear_primary_contacts(
                    db,
                    profile.id,
                )

                _promote_replacement_contact(
                    db,
                    profile.id,
                )

            db.commit()

        except Exception:
            db.rollback()
            raise