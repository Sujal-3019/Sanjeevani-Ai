import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    date_of_birth: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    gender: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    blood_group: Mapped[str | None] = mapped_column(
        String(5),
        nullable=True,
    )

    height_cm: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    weight_kg: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    pincode: Mapped[str] = mapped_column(
        String(6),
        nullable=False,
    )

    pregnancy_status: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    medical_sharing_accepted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    terms_accepted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    emergency_contacts: Mapped[list["EmergencyContact"]] = relationship(
        "EmergencyContact",
        back_populates="patient_profile",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    medical_profile: Mapped["PatientMedicalProfile | None"] = relationship(
        "PatientMedicalProfile",
        back_populates="patient_profile",
        cascade="all, delete-orphan",
        passive_deletes=True,
        uselist=False,
    )