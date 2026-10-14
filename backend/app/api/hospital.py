
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.hospital import (
    HospitalCreate,
    HospitalResponse,
    HospitalUpdate,
)
from app.services.hospital_service import (
    HospitalAlreadyExistsError,
    HospitalNotFoundError,
    HospitalService,
    InvalidHospitalDataError,
)


router = APIRouter(
    prefix="/hospital",
    tags=["Hospital"],
)


hospital_admin_dependency = require_roles(
    UserRole.HOSPITAL_ADMIN,
)


@router.post(
    "/profile",
    response_model=HospitalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_hospital_profile(
    data: HospitalCreate,
    current_user: User = Depends(
        hospital_admin_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        return HospitalService.create(
            db=db,
            admin=current_user,
            data=data,
        )

    except HospitalAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except InvalidHospitalDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except IntegrityError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The hospital or registration number "
                "already exists."
            ),
        ) from exc


@router.get(
    "/profile",
    response_model=HospitalResponse,
)
def get_hospital_profile(
    current_user: User = Depends(
        hospital_admin_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        return HospitalService.get_profile(
            db=db,
            admin=current_user,
        )

    except HospitalNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.put(
    "/profile",
    response_model=HospitalResponse,
)
def update_hospital_profile(
    data: HospitalUpdate,
    current_user: User = Depends(
        hospital_admin_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        return HospitalService.update(
            db=db,
            admin=current_user,
            data=data,
        )

    except HospitalNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except HospitalAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except InvalidHospitalDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    except IntegrityError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The requested hospital data conflicts "
                "with an existing record."
            ),
        ) from exc


@router.get(
    "/dashboard",
)
def get_hospital_dashboard(
    current_user: User = Depends(
        hospital_admin_dependency,
    ),
    db: Session = Depends(get_db),
):
    try:
        hospital = HospitalService.get_profile(
            db=db,
            admin=current_user,
        )

    except HospitalNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return {
        "hospital_id": str(hospital.id),
        "hospital_name": hospital.name,
        "verification_status": hospital.verification_status,
        "rejection_reason": hospital.rejection_reason,
        "hospital_type": hospital.hospital_type,
        "city": hospital.city,
        "state": hospital.state,
        "total_beds": hospital.total_beds,
        "available_beds": hospital.available_beds,
        "icu_beds": hospital.icu_beds,
        "trauma_capable": hospital.trauma_capable,
        "can_receive_emergencies": (
            hospital.verification_status == "VERIFIED"
        ),
    }
