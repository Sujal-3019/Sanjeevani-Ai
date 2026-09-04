import React from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    HeartPulse,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const PREGNANCY_MIN_AGE = 13;
const PREGNANCY_MAX_AGE = 55;

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate = new Date(`${dateOfBirth}T00:00:00`);

    if (Number.isNaN(birthDate.getTime())) {
        return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
            today.getDate() < birthDate.getDate())
    ) {
        age -= 1;
    }

    return age;
}

function PatientProfileSetup() {
    const navigate = useNavigate();

    const [section, setSection] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const [formData, setFormData] = React.useState({
        dob: '',
        gender: '',
        bloodGroup: '',

        emergencyContactName: '',
        emergencyContactRelation: '',
        emergencyContactNumber: '',

        allergies: '',
        chronicConditions: '',
        currentMedications: '',
        majorSurgeries: '',
        disabilities: '',
        pregnancyStatus: '',

        height: '',
        weight: '',

        address: '',
        city: '',
        state: '',
        pincode: '',

        medicalSharingAccepted: false,
        termsAccepted: false,
    });

    const sections = [
        {
            title: 'Personal',
            description: 'Basic information',
        },
        {
            title: 'Emergency',
            description: 'Emergency contact',
        },
        {
            title: 'Medical',
            description: 'Medical information',
        },
        {
            title: 'Address',
            description: 'Location details',
        },
        {
            title: 'Review',
            description: 'Confirm information',
        },
    ];

    const patientAge = calculateAge(formData.dob);

    const shouldAskPregnancyStatus =
        formData.gender === 'female' &&
        patientAge !== null &&
        patientAge >= PREGNANCY_MIN_AGE &&
        patientAge <= PREGNANCY_MAX_AGE;

    React.useEffect(() => {
        /*
         * If the patient changes their DOB or gender and pregnancy status
         * is no longer relevant, clear the previously selected value.
         */
        if (!shouldAskPregnancyStatus && formData.pregnancyStatus) {
            setFormData((current) => ({
                ...current,
                pregnancyStatus: '',
            }));
        }
    }, [
        shouldAskPregnancyStatus,
        formData.pregnancyStatus,
    ]);

    const updateField = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const validateSection = () => {
        if (section === 0) {
            if (!formData.dob) {
                return 'Please enter your date of birth.';
            }

            if (patientAge === null || patientAge < 0) {
                return 'Please enter a valid date of birth.';
            }

            if (patientAge > 120) {
                return 'Please enter a valid date of birth.';
            }

            return '';
        }

        if (section === 1) {
            if (!formData.emergencyContactName.trim()) {
                return 'Please enter your emergency contact name.';
            }

            if (!formData.emergencyContactRelation) {
                return 'Please select your relationship with the emergency contact.';
            }

            if (!formData.emergencyContactNumber.trim()) {
                return 'Please enter the emergency contact number.';
            }

            return '';
        }

        if (section === 2) {
            return '';
        }

        if (section === 3) {
            if (!formData.city.trim()) {
                return 'Please enter your city.';
            }

            if (!formData.state.trim()) {
                return 'Please enter your state.';
            }

            if (!formData.pincode.trim()) {
                return 'Please enter your pincode.';
            }

            if (formData.pincode.length !== 6) {
                return 'Please enter a valid 6-digit pincode.';
            }

            return '';
        }

        if (section === 4) {
            if (!formData.medicalSharingAccepted) {
                return 'Please provide consent to share relevant emergency medical information.';
            }

            if (!formData.termsAccepted) {
                return 'Please accept the terms and privacy policy.';
            }

            return '';
        }

        return '';
    };

    const handleNext = () => {
        setError('');

        const validationError = validateSection();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (section < sections.length - 1) {
            setSection((current) => current + 1);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleBack = () => {
        setError('');

        if (section > 0) {
            setSection((current) => current - 1);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleComplete = () => {
        setError('');

        const validationError = validateSection();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        /*
         * Temporary frontend-only profile completion.
         *
         * Later this will call the FastAPI backend to:
         *
         * 1. Save patient profile information.
         * 2. Save emergency contact.
         * 3. Save medical profile.
         * 4. Save address/location.
         * 5. Save emergency medical-data consent.
         * 6. Save pregnancy status only when relevant.
         * 7. Mark patient onboarding as completed.
         */

        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard/patient');
        }, 800);
    };

    return (
        <AuthLayout
            eyebrow="Emergency profile setup"
            title="Let's make your profile emergency-ready."
            description="Complete the important information emergency teams may need. You can update these details later from your patient dashboard."
        >
            {/* =========================================================
                PROGRESS HEADER
            ========================================================= */}
            <div className="mb-8">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step {section + 1} of {sections.length}
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            {sections[section].title}
                        </h2>

                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                            {sections[section].description}
                        </p>
                    </div>

                    <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-(--sj-primary)/10 text-sm font-black text-(--sj-primary) sm:flex">
                        {Math.round(
                            ((section + 1) / sections.length) * 100,
                        )}
                        %
                    </div>
                </div>

                
                {/* Section indicators */}
                <div className="mt-5 grid grid-cols-5 gap-1">
                    {sections.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                                if (index <= section) {
                                    setError('');
                                    setSection(index);
                                }
                            }}
                            disabled={index > section}
                            className={`text-center text-[10px] font-bold transition ${
                                index === section
                                    ? 'text-(--sj-primary)'
                                    : index < section
                                      ? 'text-(--sj-text-soft)'
                                      : 'text-(--sj-text-muted)'
                            }`}
                        >
                            <span
                                className={`mx-auto mb-1 block h-1.5 rounded-full ${
                                    index <= section
                                        ? 'bg-(--sj-primary)'
                                        : 'bg-(--sj-border)'
                                }`}
                            />

                            {item.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* =========================================================
                SECTION 1 — PERSONAL
            ========================================================= */}
            {section === 0 && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            This information helps emergency personnel
                            identify you and understand basic requirements
                            during an emergency.
                        </p>
                    </div>

                    {/* Date of birth */}
                    <div>
                        <label
                            htmlFor="patient-dob"
                            className="sj-label"
                        >
                            Date of birth *
                        </label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                id="patient-dob"
                                type="date"
                                value={formData.dob}
                                onChange={(event) =>
                                    updateField(
                                        'dob',
                                        event.target.value,
                                    )
                                }
                                className="sj-input h-12 pl-11 pr-4 text-sm"
                            />
                        </div>

                        {patientAge !== null && patientAge >= 0 && (
                            <p className="mt-2 text-xs text-(--sj-text-muted)">
                                Age: {patientAge} years
                            </p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label
                            htmlFor="patient-gender"
                            className="sj-label"
                        >
                            Gender
                        </label>

                        <select
                            id="patient-gender"
                            value={formData.gender}
                            onChange={(event) =>
                                updateField(
                                    'gender',
                                    event.target.value,
                                )
                            }
                            className="sj-input h-12 px-4 text-sm"
                        >
                            <option value="">
                                Prefer not to say
                            </option>

                            <option value="male">
                                Male
                            </option>

                            <option value="female">
                                Female
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* Blood group */}
                    <div>
                        <label
                            htmlFor="patient-blood-group"
                            className="sj-label"
                        >
                            Blood group
                        </label>

                        <select
                            id="patient-blood-group"
                            value={formData.bloodGroup}
                            onChange={(event) =>
                                updateField(
                                    'bloodGroup',
                                    event.target.value,
                                )
                            }
                            className="sj-input h-12 px-4 text-sm"
                        >
                            <option value="">
                                Select blood group
                            </option>

                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                </div>
            )}

            {/* =========================================================
                SECTION 2 — EMERGENCY CONTACT
            ========================================================= */}
            {section === 1 && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl bg-red-500/5 p-4">
                        <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Your emergency contact may be contacted when
                            urgent assistance is required and you cannot
                            respond yourself.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="emergency-contact-name"
                            className="sj-label"
                        >
                            Contact name *
                        </label>

                        <input
                            id="emergency-contact-name"
                            type="text"
                            value={formData.emergencyContactName}
                            onChange={(event) =>
                                updateField(
                                    'emergencyContactName',
                                    event.target.value,
                                )
                            }
                            placeholder="e.g. Rahul Sharma"
                            className="sj-input h-12 px-4 text-sm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="emergency-contact-relation"
                            className="sj-label"
                        >
                            Relationship *
                        </label>

                        <select
                            id="emergency-contact-relation"
                            value={formData.emergencyContactRelation}
                            onChange={(event) =>
                                updateField(
                                    'emergencyContactRelation',
                                    event.target.value,
                                )
                            }
                            className="sj-input h-12 px-4 text-sm"
                        >
                            <option value="">
                                Select relationship
                            </option>

                            <option value="parent">
                                Parent
                            </option>

                            <option value="spouse">
                                Spouse
                            </option>

                            <option value="sibling">
                                Sibling
                            </option>

                            <option value="child">
                                Child
                            </option>

                            <option value="friend">
                                Friend
                            </option>

                            <option value="relative">
                                Relative
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="emergency-contact-number"
                            className="sj-label"
                        >
                            Contact number *
                        </label>

                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                id="emergency-contact-number"
                                type="tel"
                                value={formData.emergencyContactNumber}
                                onChange={(event) =>
                                    updateField(
                                        'emergencyContactNumber',
                                        event.target.value,
                                    )
                                }
                                placeholder="+91 98765 43210"
                                className="sj-input h-12 pl-11 pr-4 text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                SECTION 3 — MEDICAL
            ========================================================= */}
            {section === 2 && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl bg-blue-500/5 p-4">
                        <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Accurate medical information can help paramedics
                            and hospitals make safer decisions during an
                            emergency. Optional fields can be left blank.
                        </p>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label
                            htmlFor="patient-allergies"
                            className="sj-label"
                        >
                            Allergies
                        </label>

                        <textarea
                            id="patient-allergies"
                            value={formData.allergies}
                            onChange={(event) =>
                                updateField(
                                    'allergies',
                                    event.target.value,
                                )
                            }
                            placeholder="List any known allergies, or write 'None known'"
                            rows={3}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Chronic conditions */}
                    <div>
                        <label
                            htmlFor="patient-chronic-conditions"
                            className="sj-label"
                        >
                            Chronic conditions
                        </label>

                        <textarea
                            id="patient-chronic-conditions"
                            value={formData.chronicConditions}
                            onChange={(event) =>
                                updateField(
                                    'chronicConditions',
                                    event.target.value,
                                )
                            }
                            placeholder="e.g. Diabetes, asthma, hypertension"
                            rows={3}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Current medications */}
                    <div>
                        <label
                            htmlFor="patient-medications"
                            className="sj-label"
                        >
                            Current medications
                        </label>

                        <textarea
                            id="patient-medications"
                            value={formData.currentMedications}
                            onChange={(event) =>
                                updateField(
                                    'currentMedications',
                                    event.target.value,
                                )
                            }
                            placeholder="List medications you currently take"
                            rows={3}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Major surgeries */}
                    <div>
                        <label
                            htmlFor="patient-surgeries"
                            className="sj-label"
                        >
                            Major surgeries or illnesses
                        </label>

                        <textarea
                            id="patient-surgeries"
                            value={formData.majorSurgeries}
                            onChange={(event) =>
                                updateField(
                                    'majorSurgeries',
                                    event.target.value,
                                )
                            }
                            placeholder="Mention any important previous surgeries or illnesses"
                            rows={3}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Disabilities */}
                    <div>
                        <label
                            htmlFor="patient-disabilities"
                            className="sj-label"
                        >
                            Disabilities or important medical conditions
                        </label>

                        <textarea
                            id="patient-disabilities"
                            value={formData.disabilities}
                            onChange={(event) =>
                                updateField(
                                    'disabilities',
                                    event.target.value,
                                )
                            }
                            placeholder="Add anything emergency personnel should know"
                            rows={3}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    {/* Conditional pregnancy status */}
                    {shouldAskPregnancyStatus && (
                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <label
                                htmlFor="patient-pregnancy"
                                className="sj-label"
                            >
                                Pregnancy status
                            </label>

                            <p className="mb-3 text-xs leading-5 text-(--sj-text-muted)">
                                This information may help emergency teams
                                provide appropriate care.
                            </p>

                            <select
                                id="patient-pregnancy"
                                value={formData.pregnancyStatus}
                                onChange={(event) =>
                                    updateField(
                                        'pregnancyStatus',
                                        event.target.value,
                                    )
                                }
                                className="sj-input h-12 px-4 text-sm"
                            >
                                <option value="">
                                    Prefer not to say
                                </option>

                                <option value="not_pregnant">
                                    Not pregnant
                                </option>

                                <option value="pregnant">
                                    Pregnant
                                </option>
                            </select>
                        </div>
                    )}

                    {/* Height + weight */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="patient-height"
                                className="sj-label"
                            >
                                Height
                            </label>

                            <div className="relative">
                                <input
                                    id="patient-height"
                                    type="number"
                                    min="0"
                                    value={formData.height}
                                    onChange={(event) =>
                                        updateField(
                                            'height',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 170"
                                    className="sj-input h-12 px-4 pr-14 text-sm"
                                />

                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-(--sj-text-muted)">
                                    cm
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="patient-weight"
                                className="sj-label"
                            >
                                Weight
                            </label>

                            <div className="relative">
                                <input
                                    id="patient-weight"
                                    type="number"
                                    min="0"
                                    value={formData.weight}
                                    onChange={(event) =>
                                        updateField(
                                            'weight',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 65"
                                    className="sj-input h-12 px-4 pr-14 text-sm"
                                />

                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-(--sj-text-muted)">
                                    kg
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                SECTION 4 — ADDRESS
            ========================================================= */}
            {section === 3 && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Your saved location helps Sanjeevani AI identify
                            the appropriate emergency area. During an SOS,
                            your live location can be captured separately.
                        </p>
                    </div>

                    {/* Address */}
                    <div>
                        <label
                            htmlFor="patient-address"
                            className="sj-label"
                        >
                            Address
                        </label>

                        <textarea
                            id="patient-address"
                            value={formData.address}
                            onChange={(event) =>
                                updateField(
                                    'address',
                                    event.target.value,
                                )
                            }
                            placeholder="House number, street, locality"
                            rows={4}
                            className="sj-input resize-none px-4 py-3 text-sm"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {/* City */}
                        <div>
                            <label
                                htmlFor="patient-city"
                                className="sj-label"
                            >
                                City *
                            </label>

                            <input
                                id="patient-city"
                                type="text"
                                value={formData.city}
                                onChange={(event) =>
                                    updateField(
                                        'city',
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. Delhi"
                                className="sj-input h-12 px-4 text-sm"
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label
                                htmlFor="patient-state"
                                className="sj-label"
                            >
                                State *
                            </label>

                            <input
                                id="patient-state"
                                type="text"
                                value={formData.state}
                                onChange={(event) =>
                                    updateField(
                                        'state',
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. Delhi"
                                className="sj-input h-12 px-4 text-sm"
                            />
                        </div>

                        {/* Pincode */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="patient-pincode"
                                className="sj-label"
                            >
                                Pincode *
                            </label>

                            <input
                                id="patient-pincode"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={formData.pincode}
                                onChange={(event) =>
                                    updateField(
                                        'pincode',
                                        event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6),
                                    )
                                }
                                placeholder="110001"
                                className="sj-input h-12 px-4 text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                SECTION 5 — REVIEW & CONSENT
            ========================================================= */}
            {section === 4 && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <div>
                            <p className="text-sm font-bold text-(--sj-text)">
                                Review before continuing
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Please make sure the information below is
                                accurate. You can update your profile later.
                            </p>
                        </div>
                    </div>

                    {/* Personal summary */}
                    <div className="sj-card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-(--sj-text-muted)">
                                    Personal
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    {formData.dob ||
                                        'Date of birth not entered'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setSection(0);
                                }}
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Age
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {patientAge !== null
                                        ? `${patientAge} years`
                                        : 'Not available'}
                                </p>
                            </div>

                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Gender
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {formData.gender || 'Not specified'}
                                </p>
                            </div>

                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Blood group
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {formData.bloodGroup ||
                                        'Not specified'}
                                </p>
                            </div>

                            {shouldAskPregnancyStatus && (
                                <div>
                                    <p className="text-(--sj-text-muted)">
                                        Pregnancy
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {formData.pregnancyStatus ||
                                            'Not specified'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Emergency summary */}
                    <div className="sj-card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-(--sj-text-muted)">
                                    Emergency contact
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    {formData.emergencyContactName ||
                                        'Not entered'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setSection(1);
                                }}
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-(--sj-text-soft)">
                            {formData.emergencyContactRelation ||
                                'Relationship not specified'}

                            {formData.emergencyContactNumber
                                ? ` · ${formData.emergencyContactNumber}`
                                : ''}
                        </p>
                    </div>

                    {/* Medical summary */}
                    <div className="sj-card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-(--sj-text-muted)">
                                    Medical information
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    Medical profile
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setSection(2);
                                }}
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Allergies
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {formData.allergies ||
                                        'None provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Conditions
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {formData.chronicConditions ||
                                        'None provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Medications
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {formData.currentMedications ||
                                        'None provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-(--sj-text-muted)">
                                    Pregnancy
                                </p>

                                <p className="mt-1 font-semibold text-(--sj-text)">
                                    {shouldAskPregnancyStatus
                                        ? formData.pregnancyStatus ||
                                          'Not specified'
                                        : 'Not applicable'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Address summary */}
                    <div className="sj-card p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-(--sj-text-muted)">
                                    Address
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    {formData.city}, {formData.state}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setSection(3);
                                }}
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-(--sj-text-soft)">
                            {formData.address ||
                                'Address not provided'}{' '}
                            · {formData.pincode}
                        </p>
                    </div>

                    {/* Consent */}
                    <div className="space-y-4 border-t border-(--sj-border) pt-5">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    formData.medicalSharingAccepted
                                }
                                onChange={(event) =>
                                    updateField(
                                        'medicalSharingAccepted',
                                        event.target.checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-(--sj-primary)"
                            />

                            <span className="text-xs leading-5 text-(--sj-text-soft)">
                                I consent to sharing relevant emergency
                                medical information with authorized hospitals
                                and paramedics when required for emergency
                                coordination. *
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={formData.termsAccepted}
                                onChange={(event) =>
                                    updateField(
                                        'termsAccepted',
                                        event.target.checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-(--sj-primary)"
                            />

                            <span className="text-xs leading-5 text-(--sj-text-soft)">
                                I agree to the Sanjeevani AI terms of service
                                and privacy policy. *
                            </span>
                        </label>
                    </div>
                </div>
            )}

            {/* =========================================================
                ERROR
            ========================================================= */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium leading-6 text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* =========================================================
                NAVIGATION
            ========================================================= */}
            <div className="mt-8 flex items-center gap-3 border-t border-(--sj-border) pt-6">
                {section === 0 ? (
                    <Link
                        to="/login/patient"
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Exit
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                )}

                {section < sections.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark)"
                    >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={loading}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            'Saving profile...'
                        ) : (
                            <>
                                Complete profile
                                <CheckCircle2 className="h-4 w-4" />
                            </>
                        )}
                    </button>
                )}
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-(--sj-text-muted)">
                You can update your emergency profile information later from
                your patient dashboard.
            </p>
        </AuthLayout>
    );
}

export default PatientProfileSetup;
