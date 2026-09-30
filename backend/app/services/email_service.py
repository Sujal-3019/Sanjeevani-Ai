import smtplib
from email.message import EmailMessage

from app.core.config import settings


class EmailServiceError(Exception):
    """Raised when an email cannot be sent."""


class EmailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
    ) -> None:
        """
        Send a plain-text email using the configured SMTP server.
        """

        if not settings.SMTP_HOST:
            raise EmailServiceError(
                "SMTP_HOST is not configured."
            )

        if not settings.SMTP_USERNAME:
            raise EmailServiceError(
                "SMTP_USERNAME is not configured."
            )

        if not settings.SMTP_PASSWORD:
            raise EmailServiceError(
                "SMTP_PASSWORD is not configured."
            )

        from_email = (
            settings.SMTP_FROM_EMAIL
            or settings.SMTP_USERNAME
        )

        message = EmailMessage()

        message["Subject"] = subject
        message["From"] = (
            f"{settings.SMTP_FROM_NAME} "
            f"<{from_email}>"
        )
        message["To"] = to_email

        message.set_content(body)

        try:
            with smtplib.SMTP(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=20,
            ) as server:

                server.ehlo()
                server.starttls()
                server.ehlo()

                server.login(
                    settings.SMTP_USERNAME,
                    settings.SMTP_PASSWORD,
                )

                server.send_message(message)

        except Exception as exc:
            raise EmailServiceError(
                "Failed to send email."
            ) from exc