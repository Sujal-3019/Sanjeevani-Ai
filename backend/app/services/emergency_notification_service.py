from datetime import datetime
from urllib.parse import quote
from app.core.config import settings
from app.models.emergency_contact import EmergencyContact
from app.models.patient_profile import PatientProfile
from app.models.sos_request import SOSRequest
from app.models.user import User
from app.services.email_service import (
    EmailService,
    EmailServiceError,
)


class EmergencyNotificationService:

    @staticmethod
    def _build_share_url(
        share_token: str,
    ) -> str:
        base_url = settings.EMERGENCY_SHARE_BASE_URL

        base_url = base_url.rstrip("/")

        return (
            f"{base_url}/emergency-share/"
            f"{quote(share_token, safe='')}"
        )

    @classmethod
    def notify_primary_contact(
        cls,
        patient_profile: PatientProfile,
        patient_user: User,
        sos_request: SOSRequest,
        share_token: str,
    ) -> bool:
        """
        Send the emergency notification to the patient's
        primary emergency contact.

        Returns True when an email was sent successfully.

        Returns False when:
        - no primary contact exists
        - primary contact has no email
        - SMTP/email delivery fails

        Email failure must never make the SOS creation fail.
        """

        primary_contact = next(
            (
                contact
                for contact
                in patient_profile.emergency_contacts
                if contact.is_primary
            ),
            None,
        )

        if primary_contact is None:
            return False

        if not primary_contact.email:
            return False

        share_url = cls._build_share_url(
            share_token,
        )

        emergency_type = (
            sos_request.emergency_type.value
            if hasattr(
                sos_request.emergency_type,
                "value",
            )
            else str(
                sos_request.emergency_type,
            )
        )

        created_at = sos_request.created_at

        if isinstance(created_at, datetime):
            created_at_text = created_at.astimezone().strftime(
                "%d %B %Y, %I:%M %p",
            )
        else:
            created_at_text = str(created_at)

        patient_name = (
            patient_user.full_name
            or "Sanjeevani AI patient"
        )

        details = (
            sos_request.emergency_details
            or "No additional emergency details were provided."
        )

        subject = (
            f"URGENT: Emergency alert for "
            f"{patient_name}"
        )

        body = f"""
Sanjeevani AI — Emergency Alert

Dear {primary_contact.name},

This is an emergency notification from Sanjeevani AI.

{patient_name} has activated an emergency SOS and listed you as their primary emergency contact.

EMERGENCY DETAILS
-----------------
Patient: {patient_name}
Emergency type: {emergency_type}
What happened: {details}
Alert time: {created_at_text}

LIVE PATIENT LOCATION
---------------------
The patient's location can be viewed through the secure Sanjeevani AI emergency link:

{share_url}

Open the link to view the latest available location.

From the emergency page, you can use the "Navigate to Patient" option to open Google Maps.

IMPORTANT
---------
This link is private and intended only for the emergency contact.

If you believe the situation is life-threatening, contact local emergency services immediately.

This notification was generated automatically by Sanjeevani AI.
""".strip()

        try:
            EmailService.send_email(
                to_email=primary_contact.email,
                subject=subject,
                body=body,
            )

            return True

        except EmailServiceError:
            return False

        except Exception:
            return False