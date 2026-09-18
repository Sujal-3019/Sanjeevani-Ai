from datetime import date, datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.emergency_contact import EmergencyContact
from app.models.patient_medical_profile import PatientMedicalProfile
from app.models.patient_profile import PatientProfile
from app.models.user import User, UserRole
from app.schemas.patient_profile import PatientProfileCreate


PREGNANCY_MIN_AGE = 13
PREGNANCY_MAX_AGE = 55

ALLOWED_GENDERS = {
    "male",
    "female",
    "other",
}

ALLOWED_BLOOD_GROUPS = {
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
}

ALLOWED_PREGNANCY_STATUSES = {
    "pregnant",
    "not_pregnant",
    "unknown",
}


class PatientProfileServiceError(Exception):
    """Base exception for patient profile service errors."""


class PatientProfileNotFoundError(PatientProfileServiceError):
    """Raised when a patient profile does not exist."""


class InvalidPatientProfileError(PatientProfileServiceError):
    """Raised when patient profile data is invalid."""


def calculate_age(date_of_birth: date) -> int:
    today = date.today()

    age = (
        today.year
        - date_of_birth.year
        - (
            (today.month, today.day)
            < (date_of_birth.month, date_of_birth.day)
        )
    )

    return age


def _validate_patient(
    user: User,
) -> None:
    if user.role != UserRole.PATIENT:
        raise InvalidPatientProfileError(
            "Only patient accounts can create or update patient profiles."
        )

    if not user.is_active:
        raise InvalidPatientProfileError(
            "Your account is inactive."
        )


def _validate_profile_data(
    data: PatientProfileCreate,
) -> None:
    if data.date_of_birth > date.today():
        raise InvalidPatientProfileError(
            "Date of birth cannot be in the future."
        )

    age = calculate_age(data.date_of_birth)

    if age < 0:
        raise InvalidPatientProfileError(
            "Invalid date of birth."
        )

    if age > 120:
        raise InvalidPatientProfileError(
            "Date of birth results in an invalid age."
        )

    if data.gender is not None:
        gender = data.gender.lower()

        if gender not in ALLOWED_GENDERS:
            raise InvalidPatientProfileError(
                "Invalid gender selected."
            )

    if data.blood_group is not None:
        if data.blood_group not in ALLOWED_BLOOD_GROUPS:
            raise InvalidPatientProfileError(
                "Invalid blood group selected."
            )

    if data.pregnancy_status is not None:
        pregnancy_status = data.pregnancy_status.lower()

        if pregnancy_status not in ALLOWED_PREGNANCY_STATUSES:
            raise InvalidPatientProfileError(
                "Invalid pregnancy status."
            )

        should_ask_pregnancy = (
            data.gender is not None
            and data.gender.lower() == "female"
            and PREGNANCY_MIN_AGE <= age <= PREGNANCY_MAX_AGE
        )

        if not should_ask_pregnancy:
            raise InvalidPatientProfileError(
                "Pregnancy status is not applicable for this profile."
            )

    if data.height_cm is not None:
        if not 30 <= data.height_cm <= 250:
            raise InvalidPatientProfileError(
                "Height must be between 30 cm and 250 cm."
            )

    if data.weight_kg is not None:
        if not 1 <= data.weight_kg <= 500:
            raise InvalidPatientProfileError(
                "Weight must be between 1 kg and 500 kg."
            )

    if not data.medical_sharing_accepted:
        raise InvalidPatientProfileError(
            "Medical information sharing consent is required."
        )

    if not data.terms_accepted:
        raise InvalidPatientProfileError(
            "Terms acceptance is required."
        )


def _load_patient_profile(
    db: Session,
    user_id: UUID,
) -> PatientProfile | None:
    statement = (
        select(PatientProfile)
        .where(PatientProfile.user_id == user_id)
        .options(
            joinedload(PatientProfile.emergency_contacts),
            joinedload(PatientProfile.medical_profile),
        )
    )

    return db.scalar(statement)


class PatientProfileService:

    @staticmethod
    def get_profile(
        db: Session,
        user: User,
    ) -> PatientProfile:
        _validate_patient(user)

        profile = _load_patient_profile(
            db,
            user.id,
        )

        if profile is None:
            raise PatientProfileNotFoundError(
                "Patient profile has not been created yet."
            )

        return profile

    @staticmethod
    def create_or_update_profile(
        db: Session,
        user: User,
        data: PatientProfileCreate,
    ) -> PatientProfile:
        _validate_patient(user)
        _validate_profile_data(data)

        profile = _load_patient_profile(
            db,
            user.id,
        )

        try:
            if profile is None:
                profile = PatientProfile(
                    user_id=user.id,
                    date_of_birth=data.date_of_birth,
                    gender=data.gender.lower()
                    if data.gender
                    else None,
                    blood_group=data.blood_group,
                    height_cm=data.height_cm,
                    weight_kg=data.weight_kg,
                    address=data.address,
                    city=data.city,
                    state=data.state,
                    pincode=data.pincode,
                    pregnancy_status=(
                        data.pregnancy_status.lower()
                        if data.pregnancy_status
                        else None
                    ),
                    medical_sharing_accepted=(
                        data.medical_sharing_accepted
                    ),
                    terms_accepted=data.terms_accepted,
                )

                db.add(profile)
                db.flush()

            else:
                profile.date_of_birth = data.date_of_birth
                profile.gender = (
                    data.gender.lower()
                    if data.gender
                    else None
                )
                profile.blood_group = data.blood_group
                profile.height_cm = data.height_cm
                profile.weight_kg = data.weight_kg
                profile.address = data.address
                profile.city = data.city
                profile.state = data.state
                profile.pincode = data.pincode
                profile.pregnancy_status = (
                    data.pregnancy_status.lower()
                    if data.pregnancy_status
                    else None
                )
                profile.medical_sharing_accepted = (
                    data.medical_sharing_accepted
                )
                profile.terms_accepted = data.terms_accepted
                profile.updated_at = datetime.now(
                    timezone.utc
                )

            if profile.emergency_contacts:
                primary_contact = next(
                    (
                        contact
                        for contact
                        in profile.emergency_contacts
                        if contact.is_primary
                    ),
                    profile.emergency_contacts[0],
                )

                primary_contact.name = (
                    data.emergency_contact.name
                )
                primary_contact.contact_relationship = (
                    data.emergency_contact.relationship
                )
                primary_contact.mobile_number = (
                    data.emergency_contact.mobile_number
                )
                primary_contact.is_primary = True

                for contact in profile.emergency_contacts:
                    if contact.id != primary_contact.id:
                        contact.is_primary = False

            else:
                emergency_contact = EmergencyContact(
                    patient_profile_id=profile.id,
                    name=data.emergency_contact.name,
                    contact_relationship=(
                        data.emergency_contact.relationship
                    ),
                    mobile_number=(
                        data.emergency_contact.mobile_number
                    ),
                    is_primary=True,
                )

                db.add(emergency_contact)

            if profile.medical_profile is None:
                medical_profile = PatientMedicalProfile(
                    patient_profile_id=profile.id,
                    allergies=data.medical_profile.allergies,
                    chronic_conditions=(
                        data.medical_profile.chronic_conditions
                    ),
                    current_medications=(
                        data.medical_profile.current_medications
                    ),
                    major_surgeries=(
                        data.medical_profile.major_surgeries
                    ),
                    disabilities=data.medical_profile.disabilities,
                )

                db.add(medical_profile)

            else:
                medical_profile = profile.medical_profile

                medical_profile.allergies = (
                    data.medical_profile.allergies
                )
                medical_profile.chronic_conditions = (
                    data.medical_profile.chronic_conditions
                )
                medical_profile.current_medications = (
                    data.medical_profile.current_medications
                )
                medical_profile.major_surgeries = (
                    data.medical_profile.major_surgeries
                )
                medical_profile.disabilities = (
                    data.medical_profile.disabilities
                )
                medical_profile.updated_at = datetime.now(
                    timezone.utc
                )

            db.commit()

            return _load_patient_profile(
                db,
                user.id,
            )

        except Exception:
            db.rollback()
            raise