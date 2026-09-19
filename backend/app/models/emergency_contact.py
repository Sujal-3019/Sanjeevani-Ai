import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    __table_args__ = (
        Index(
            "uq_emergency_contacts_primary_per_patient",
            "patient_profile_id",
            unique=True,
            postgresql_where=(
                # PostgreSQL partial unique index:
                # only rows where is_primary = TRUE participate.
                # This guarantees at most one primary contact per patient.
                "is_primary = true"
            ),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    patient_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "patient_profiles.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    contact_relationship: Mapped[str] = mapped_column(
        "relationship",
        String(50),
        nullable=False,
    )

    mobile_number: Mapped[str] = mapped_column(
        String(15),
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    patient_profile = relationship(
        "PatientProfile",
        back_populates="emergency_contacts",
    )