import React from 'react';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    Edit3,
    FileHeart,
    LockKeyhole,
    Mail,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientHeader from './PatientHeader';

const PREGNANCY_MIN_AGE = 12;
const PREGNANCY_MAX_AGE = 55;

const initialProfile = {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',

    dob: '2002-06-15',
    gender: 'male',
    bloodGroup: 'O+',

    allergies: 'No known allergies',
    chronicConditions: 'None reported',
    medications: 'None reported',
    majorIllnesses: 'None reported',
    disabilities: 'None reported',
    pregnancyStatus: '',

    height: '172',
    weight: '68',
};

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

function FieldLabel({ children, required = false }) {
    return (
        <label className="sj-label">
            {children}
            {required && (
                <span className="ml-1 text-red-500">*</span>
            )}
        </label>
    );
}

function MedicalProfile() {
    const [formData, setFormData] = React.useState(initialProfile);
    const [savedData, setSavedData] = React.useState(initialProfile);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveMessage, setSaveMessage] = React.useState('');

    const patientAge = calculateAge(formData.dob);

    const shouldAskPregnancyStatus =
        formData.gender === 'female' &&
        patientAge !== null &&
        patientAge >= PREGNANCY_MIN_AGE &&
        patientAge <= PREGNANCY_MAX_AGE;

    React.useEffect(() => {
        if (!shouldAskPregnancyStatus && formData.pregnancyStatus) {
            setFormData((current) => ({
                ...current,
                pregnancyStatus: '',
            }));
        }
    }, [shouldAskPregnancyStatus, formData.pregnancyStatus]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setSaveMessage('');
    };

    const handleEdit = () => {
        setFormData(savedData);
        setIsEditing(true);
        setSaveMessage('');
    };

    const handleCancel = () => {
        setFormData(savedData);
        setIsEditing(false);
        setSaveMessage('');
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage('');

        window.setTimeout(() => {
            setSavedData(formData);
            setIsSaving(false);
            setIsEditing(false);
            setSaveMessage('Profile updated successfully.');
        }, 700);
    };

    const displayValue = (value) => {
        if (!value || !value.trim()) {
            return 'Not provided';
        }

        return value;
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientHeader />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <section className="mb-8">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                        Patient profile
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                Medical profile
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-(--sj-text-soft) sm:text-base">
                                Keep your personal, contact, and medical
                                information updated so emergency teams can
                                access relevant information when needed.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="sj-ai-button w-full px-5 py-3 text-sm sm:w-auto"
                            >
                                <Edit3 className="h-4 w-4" />
                                Edit profile
                            </button>
                        )}
                    </div>

                    {saveMessage && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600">
                            <Check className="h-4 w-4" />
                            {saveMessage}
                        </div>
                    )}
                </section>

                <div className="space-y-6">
                    {/* Account information */}
                    <section className="sj-card overflow-hidden">
                        <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-black text-(--sj-text)">
                                        Account information
                                    </h2>

                                    <p className="mt-1 text-sm text-(--sj-text-soft)">
                                        Your basic identity and contact
                                        information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <div>
                                <FieldLabel required>
                                    Full name
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                        <UserRound className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                        <span className="text-sm font-semibold text-(--sj-text)">
                                            {displayValue(savedData.fullName)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel required>
                                    Email address
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                        placeholder="Enter your email"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                        <Mail className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                        <span className="truncate text-sm font-semibold text-(--sj-text)">
                                            {displayValue(savedData.email)}
                                        </span>
                                    </div>
                                )}

                                {isEditing && (
                                    <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                        Changing your email will require
                                        verification with OTP after backend
                                        integration.
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel required>
                                    Phone number
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                        <Phone className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                        <span className="text-sm font-semibold text-(--sj-text)">
                                            {displayValue(savedData.phone)}
                                        </span>
                                    </div>
                                )}

                                {isEditing && (
                                    <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                        Changing your phone number will require
                                        SMS OTP verification after backend
                                        integration.
                                    </p>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Account security
                                </FieldLabel>

                                <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <LockKeyhole className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Verified account
                                        </p>

                                        <p className="text-xs text-(--sj-text-soft)">
                                            Email and phone verification
                                            managed by Sanjeevani AI.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Personal information */}
                    <section className="sj-card overflow-hidden">
                        <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <CalendarDays className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-black text-(--sj-text)">
                                        Personal information
                                    </h2>

                                    <p className="mt-1 text-sm text-(--sj-text-soft)">
                                        Basic information that can help
                                        emergency teams identify appropriate
                                        care considerations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
                            <div>
                                <FieldLabel>
                                    Date of birth
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                    />
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {savedData.dob || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Gender
                                </FieldLabel>

                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                    >
                                        <option value="">
                                            Prefer not to say
                                        </option>
                                        <option value="female">
                                            Female
                                        </option>
                                        <option value="male">
                                            Male
                                        </option>
                                        <option value="non_binary">
                                            Non-binary
                                        </option>
                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold capitalize text-(--sj-text)">
                                        {savedData.gender === 'non_binary'
                                            ? 'Non-binary'
                                            : savedData.gender ||
                                              'Prefer not to say'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Blood group
                                </FieldLabel>

                                {isEditing ? (
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="sj-input px-4 py-3 text-sm"
                                    >
                                        <option value="">
                                            Not known
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
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {savedData.bloodGroup || 'Not known'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Medical information */}
                    <section className="sj-card overflow-hidden">
                        <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                    <FileHeart className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-black text-(--sj-text)">
                                        Medical information
                                    </h2>

                                    <p className="mt-1 text-sm text-(--sj-text-soft)">
                                        Information that may help emergency
                                        responders understand your medical
                                        context.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <div>
                                <FieldLabel>
                                    Allergies
                                </FieldLabel>

                                {isEditing ? (
                                    <textarea
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List known allergies"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(savedData.allergies)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Chronic conditions
                                </FieldLabel>

                                {isEditing ? (
                                    <textarea
                                        name="chronicConditions"
                                        value={formData.chronicConditions}
                                        onChange={handleChange}
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List chronic conditions"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(
                                            savedData.chronicConditions,
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Current medications
                                </FieldLabel>

                                {isEditing ? (
                                    <textarea
                                        name="medications"
                                        value={formData.medications}
                                        onChange={handleChange}
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List current medications"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(savedData.medications)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Major surgeries / serious illnesses
                                </FieldLabel>

                                {isEditing ? (
                                    <textarea
                                        name="majorIllnesses"
                                        value={formData.majorIllnesses}
                                        onChange={handleChange}
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List major surgeries or serious illnesses"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(
                                            savedData.majorIllnesses,
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <FieldLabel>
                                    Disabilities / important medical
                                    conditions
                                </FieldLabel>

                                {isEditing ? (
                                    <textarea
                                        name="disabilities"
                                        value={formData.disabilities}
                                        onChange={handleChange}
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="Add any disability or important medical condition emergency teams should know"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(
                                            savedData.disabilities,
                                        )}
                                    </div>
                                )}
                            </div>

                            {shouldAskPregnancyStatus && (
                                <div className="sm:col-span-2">
                                    <FieldLabel>
                                        Pregnancy status
                                    </FieldLabel>

                                    {isEditing ? (
                                        <>
                                            <select
                                                name="pregnancyStatus"
                                                value={
                                                    formData.pregnancyStatus
                                                }
                                                onChange={handleChange}
                                                className="sj-input px-4 py-3 text-sm"
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

                                            <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                                This information may help
                                                emergency teams provide
                                                appropriate care.
                                            </p>
                                        </>
                                    ) : (
                                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                            {savedData.pregnancyStatus ===
                                            'pregnant'
                                                ? 'Pregnant'
                                                : savedData.pregnancyStatus ===
                                                    'not_pregnant'
                                                  ? 'Not pregnant'
                                                  : 'Prefer not to say'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Physical information */}
                    <section className="sj-card overflow-hidden">
                        <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <h2 className="text-lg font-black text-(--sj-text)">
                                Physical information
                            </h2>

                            <p className="mt-1 text-sm text-(--sj-text-soft)">
                                Optional information that can support
                                emergency care.
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <div>
                                <FieldLabel>
                                    Height (cm)
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        min="0"
                                        className="sj-input px-4 py-3 text-sm"
                                        placeholder="e.g. 172"
                                    />
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {savedData.height
                                            ? `${savedData.height} cm`
                                            : 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <FieldLabel>
                                    Weight (kg)
                                </FieldLabel>

                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="0"
                                        className="sj-input px-4 py-3 text-sm"
                                        placeholder="e.g. 68"
                                    />
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {savedData.weight
                                            ? `${savedData.weight} kg`
                                            : 'Not provided'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Privacy */}
                    <section className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-sm font-black text-(--sj-text)">
                                    Medical information sharing
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    During an active emergency, relevant
                                    information may be shared with authorized
                                    emergency responders and healthcare
                                    providers according to your consent and
                                    the platform's access controls.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Save controls */}
                    {isEditing && (
                        <div className="sticky bottom-4 z-30 rounded-2xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-xl backdrop-blur-xl sm:p-4">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-5 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="sj-ai-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default MedicalProfile;