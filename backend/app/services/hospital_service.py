from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.hospital import Hospital
from app.models.user import User
from app.schemas.hospital import HospitalCreate, HospitalUpdate


class HospitalAlreadyExistsError(Exception):
    pass


class HospitalNotFoundError(Exception):
    pass


class InvalidHospitalDataError(Exception):
    pass


class HospitalService:

    @staticmethod
    def get_by_admin(
        db: Session,
        admin_user_id,
    ) -> Hospital | None:
        return db.scalar(
            select(Hospital).where(
                Hospital.admin_user_id == admin_user_id,
            )
        )

    @staticmethod
    def get_by_id(
        db: Session,
        hospital_id,
    ) -> Hospital | None:
        return db.get(Hospital, hospital_id)

    @staticmethod
    def _validate_values(values: dict) -> None:
        latitude = values.get("latitude")
        longitude = values.get("longitude")

        if (latitude is None) != (longitude is None):
            raise InvalidHospitalDataError(
                "Latitude and longitude must be provided together."
            )

        total_beds = values.get("total_beds", 0)
        available_beds = values.get("available_beds", 0)
        icu_beds = values.get("icu_beds", 0)

        if available_beds > total_beds:
            raise InvalidHospitalDataError(
                "Available beds cannot exceed total beds."
            )

        if icu_beds > total_beds:
            raise InvalidHospitalDataError(
                "ICU beds cannot exceed total beds."
            )

    @classmethod
    def create(
        cls,
        db: Session,
        admin: User,
        data: HospitalCreate,
    ) -> Hospital:
        existing_hospital = cls.get_by_admin(
            db,
            admin.id,
        )

        if existing_hospital is not None:
            raise HospitalAlreadyExistsError(
                "You have already registered a hospital."
            )

        existing_registration = db.scalar(
            select(Hospital).where(
                Hospital.registration_number
                == data.registration_number,
            )
        )

        if existing_registration is not None:
            raise HospitalAlreadyExistsError(
                "This hospital registration number is already registered."
            )

        values = data.model_dump()
        cls._validate_values(values)

        hospital = Hospital(
            **values,
            admin_user_id=admin.id,
            verification_status="PENDING",
            rejection_reason=None,
        )

        db.add(hospital)

        try:
            db.commit()
            db.refresh(hospital)
        except Exception:
            db.rollback()
            raise

        return hospital

    @classmethod
    
    @classmethod
    def update(
        cls,
        db: Session,
        admin: User,
        data: HospitalUpdate,
    ) -> Hospital:
        hospital = cls.get_by_admin(db, admin.id)

        if hospital is None:
            raise HospitalNotFoundError(
                "No hospital is registered for this account."
            )

        updates = data.model_dump(exclude_unset=True)

        candidate = {
            "latitude": hospital.latitude,
            "longitude": hospital.longitude,
            "total_beds": hospital.total_beds,
            "available_beds": hospital.available_beds,
            "icu_beds": hospital.icu_beds,
        }
        candidate.update(updates)

        try:
            cls._validate_values(candidate)

            registration_number = updates.get(
                "registration_number"
            )

            if registration_number is not None:
                existing = db.scalar(
                    select(Hospital).where(
                        Hospital.registration_number
                        == registration_number,
                        Hospital.id != hospital.id,
                    )
                )

                if existing is not None:
                    raise HospitalAlreadyExistsError(
                        "This hospital registration number "
                        "is already registered."
                    )

            for field, value in updates.items():
                setattr(hospital, field, value)

            if hospital.verification_status == "REJECTED":
                hospital.verification_status = "PENDING"
                hospital.rejection_reason = None

            db.commit()
            db.refresh(hospital)

        except (
            InvalidHospitalDataError,
            HospitalAlreadyExistsError,
        ):
            db.rollback()
            raise

        except Exception:
            db.rollback()
            raise

        return hospital


    @classmethod
    def get_profile(
        cls,
        db: Session,
        admin: User,
    ) -> Hospital:
        hospital = cls.get_by_admin(
            db,
            admin.id,
        )

        if hospital is None:
            raise HospitalNotFoundError(
                "No hospital is registered for this account."
            )

        return hospital