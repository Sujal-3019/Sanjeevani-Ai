import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Ambulance(Base):
    __tablename__ = "ambulances"

    __table_args__ = (
        UniqueConstraint(
            "hospital_id",
            "ambulance_code",
            name="uq_ambulance_hospital_code",
        ),
        UniqueConstraint(
            "hospital_id",
            "registration_number",
            name="uq_ambulance_hospital_registration",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    hospital_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("hospitals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    ambulance_code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    registration_number: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    ambulance_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="BLS",
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="OFFLINE",
        index=True,
    )

    current_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Hospital Campus",
    )

    equipment: Mapped[list[Any]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    notes: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
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

    crew: Mapped[list["AmbulanceCrew"]] = relationship(
        "AmbulanceCrew",
        back_populates="ambulance",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="AmbulanceCrew.id",
    )
