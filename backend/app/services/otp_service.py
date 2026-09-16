import logging

from app.models.otp_verification import OTPChannel


logger = logging.getLogger(__name__)


class OTPDeliveryService:
    """
    Development OTP delivery service.

    In development, OTPs are logged to the backend console.
    A real SMS/email provider can be connected later without
    changing the authentication service.
    """

    @staticmethod
    def send_sms(
        mobile_number: str,
        otp: str,
    ) -> None:
        """
        Send an OTP through SMS.

        Development implementation:
        logs the OTP to the backend console.
        """
        logger.warning(
            "DEV OTP | channel=%s | destination=%s | otp=%s",
            OTPChannel.SMS.value,
            mobile_number,
            otp,
        )

    @staticmethod
    def send_email(
        email: str,
        otp: str,
    ) -> None:
        """
        Send an OTP through email.

        Development implementation:
        logs the OTP to the backend console.
        """
        logger.warning(
            "DEV OTP | channel=%s | destination=%s | otp=%s",
            OTPChannel.EMAIL.value,
            email,
            otp,
        )

    @classmethod
    def send(
        cls,
        channel: OTPChannel,
        destination: str,
        otp: str,
    ) -> None:
        """Send an OTP using the requested delivery channel."""

        if channel == OTPChannel.SMS:
            cls.send_sms(destination, otp)
            return

        if channel == OTPChannel.EMAIL:
            cls.send_email(destination, otp)
            return

        raise ValueError(
            f"Unsupported OTP channel: {channel}"
        )