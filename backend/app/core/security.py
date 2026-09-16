import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.core.config import settings


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------

password_hash = PasswordHash(
    (
        Argon2Hasher(),
    )
)


def hash_password(password: str) -> str:
    """Hash a user password using Argon2."""
    return password_hash.hash(password)


def verify_password(password: str, password_hash_value: str) -> bool:
    """Verify a plain password against its Argon2 hash."""
    return password_hash.verify(
        password,
        password_hash_value,
    )


# ---------------------------------------------------------------------------
# OTP
# ---------------------------------------------------------------------------

OTP_LENGTH = 6
OTP_EXPIRE_MINUTES = 5
OTP_MAX_ATTEMPTS = 5


def generate_otp() -> str:
    """Generate a cryptographically secure six-digit OTP."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """Hash an OTP before storing it in the database."""
    return hashlib.sha256(
        otp.encode("utf-8"),
    ).hexdigest()


def verify_otp(otp: str, otp_hash_value: str) -> bool:
    """Verify a plain OTP against its stored hash."""
    expected_hash = hash_otp(otp)

    return secrets.compare_digest(
        expected_hash,
        otp_hash_value,
    )


def get_otp_expiry() -> datetime:
    """Return the expiration timestamp for a newly generated OTP."""
    return datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES,
    )


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------

def create_access_token(
    user_id: str,
    role: str,
) -> str:
    """Create a JWT access token."""
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        minutes=settings.access_token_expire_minutes,
    )

    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(
    user_id: str,
) -> tuple[str, datetime]:
    """Create a JWT refresh token and return its expiration time."""
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        days=settings.refresh_token_expire_days,
    )

    payload = {
        "sub": user_id,
        "type": "refresh",
        "iat": now,
        "exp": expires_at,
        "jti": secrets.token_urlsafe(32),
    }

    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    return token, expires_at


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )


# ---------------------------------------------------------------------------
# Refresh-token storage
# ---------------------------------------------------------------------------

def hash_refresh_token(token: str) -> str:
    """Hash a refresh token before storing it in the database."""
    return hashlib.sha256(
        token.encode("utf-8"),
    ).hexdigest()