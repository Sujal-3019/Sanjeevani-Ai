import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.emergency_share_token import (
    EmergencyShareToken,
)
from app.models.sos_request import (
    SOSRequest,
    SOSRequestStatus,
)


class EmergencyShareServiceError(Exception):
    """Base exception for emergency share errors."""


class EmergencyShareTokenAlreadyExistsError(
    EmergencyShareServiceError,
):
    """Raised when an active share token already exists."""


class EmergencyShareTokenInvalidError(
    EmergencyShareServiceError,
):
    """Raised when a share token is invalid."""


class EmergencyShareService:

    TOKEN_BYTES = 32
    TOKEN_EXPIRY_HOURS = 24

    @staticmethod
    def _hash_token(token: str) -> str:
        return hashlib.sha256(
            token.encode("utf-8"),
        ).hexdigest()

    @classmethod
    def create_share_token(
        cls,
        db: Session,
        sos_request: SOSRequest,
    ) -> str:
        """
        Create a secure share token for an SOS.

        Only the SHA-256 hash is stored in the database.
        The raw token is returned to the caller.

        This method does not commit the transaction.
        The caller controls the transaction.
        """

        existing_token = db.scalar(
            select(EmergencyShareToken).where(
                EmergencyShareToken.sos_request_id
                == sos_request.id,
                EmergencyShareToken.revoked_at.is_(None),
            )
        )

        if existing_token is not None:
            if existing_token.expires_at > datetime.now(
                timezone.utc,
            ):
                raise EmergencyShareTokenAlreadyExistsError(
                    "An active emergency share link already exists."
                )

            existing_token.revoked_at = datetime.now(
                timezone.utc,
            )

            db.flush()

        raw_token = secrets.token_urlsafe(
            cls.TOKEN_BYTES,
        )

        token_hash = cls._hash_token(raw_token)

        expires_at = datetime.now(
            timezone.utc,
        ) + timedelta(
            hours=cls.TOKEN_EXPIRY_HOURS,
        )

        share_token = EmergencyShareToken(
            sos_request_id=sos_request.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        db.add(share_token)
        db.flush()

        return raw_token

    @classmethod
    def get_sos_by_token(
        cls,
        db: Session,
        raw_token: str,
    ) -> SOSRequest:
        """
        Validate an emergency share token and return
        its associated active SOS request.
        """

        token_hash = cls._hash_token(raw_token)

        share_token = db.scalar(
            select(EmergencyShareToken).where(
                EmergencyShareToken.token_hash
                == token_hash,
            )
        )

        if share_token is None:
            raise EmergencyShareTokenInvalidError(
                "Invalid emergency share link."
            )

        now = datetime.now(timezone.utc)

        if share_token.revoked_at is not None:
            raise EmergencyShareTokenInvalidError(
                "This emergency share link has been revoked."
            )

        if share_token.expires_at <= now:
            raise EmergencyShareTokenInvalidError(
                "This emergency share link has expired."
            )

        sos_request = db.scalar(
            select(SOSRequest).where(
                SOSRequest.id
                == share_token.sos_request_id,
            )
        )

        if sos_request is None:
            raise EmergencyShareTokenInvalidError(
                "The emergency request no longer exists."
            )

        if sos_request.status != SOSRequestStatus.CREATED:
            raise EmergencyShareTokenInvalidError(
                "This emergency is no longer active."
            )

        return sos_request

    @classmethod
    def revoke_share_token(
        cls,
        db: Session,
        sos_request_id: UUID,
    ) -> None:
        """
        Revoke the active share token belonging to an SOS.

        This method does not commit the transaction.
        """

        share_token = db.scalar(
            select(EmergencyShareToken).where(
                EmergencyShareToken.sos_request_id
                == sos_request_id,
                EmergencyShareToken.revoked_at.is_(None),
            )
        )

        if share_token is None:
            return

        share_token.revoked_at = datetime.now(
            timezone.utc,
        )

        db.flush()