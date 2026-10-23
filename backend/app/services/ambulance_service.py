
from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.ambulance import Ambulance
from app.models.ambulance_crew import AmbulanceCrew
from app.models.hospital import Hospital
from app.models.user import User


class HospitalProfileRequiredError(Exception):
    pass


class AmbulanceNotFoundError(Exception):
    pass


def get_hospital_for_admin(
    db: Session,
    admin: User,
) -> Hospital:
    hospital = (
        db.query(Hospital)
        .filter(Hospital.admin_user_id == admin.id)
        .first()
    )

    if hospital is None:
        raise HospitalProfileRequiredError(
            "Create your hospital profile before managing ambulances."
        )

    return hospital


def get_ambulance(
    db: Session,
    hospital_id: UUID,
    ambulance_id: UUID,
) -> Ambulance:
    ambulance = (
        db.query(Ambulance)
        .options(joinedload(Ambulance.crew))
        .filter(
            Ambulance.id == ambulance_id,
            Ambulance.hospital_id == hospital_id,
        )
        .first()
    )

    if ambulance is None:
        raise AmbulanceNotFoundError(
            "Ambulance not found for this hospital."
        )

    return ambulance


def list_ambulances(
    db: Session,
    hospital_id: UUID,
) -> list[Ambulance]:
    return (
        db.query(Ambulance)
        .options(joinedload(Ambulance.crew))
        .filter(Ambulance.hospital_id == hospital_id)
        .order_by(Ambulance.created_at.desc())
        .all()
    )


def create_ambulance(
    db: Session,
    hospital_id: UUID,
    data,
) -> Ambulance:
    values = data.model_dump(exclude={"crew"})

    ambulance = Ambulance(
        hospital_id=hospital_id,
        **values,
        crew=[
            AmbulanceCrew(**member.model_dump())
            for member in data.crew
        ],
    )

    db.add(ambulance)
    db.commit()

    return get_ambulance(db, hospital_id, ambulance.id)


def update_ambulance(
    db: Session,
    hospital_id: UUID,
    ambulance_id: UUID,
    data,
) -> Ambulance:
    ambulance = get_ambulance(db, hospital_id, ambulance_id)

    values = data.model_dump(exclude={"crew"})

    for field, value in values.items():
        setattr(ambulance, field, value)

    ambulance.crew = [
        AmbulanceCrew(**member.model_dump())
        for member in data.crew
    ]

    db.commit()

    return get_ambulance(db, hospital_id, ambulance.id)


def delete_ambulance(
    db: Session,
    hospital_id: UUID,
    ambulance_id: UUID,
) -> None:
    ambulance = get_ambulance(db, hospital_id, ambulance_id)

    db.delete(ambulance)
    db.commit()
