import React from 'react';
import {
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

import PatientNavbar from '../../components/layout/PatientNavbar';
import { useAuth } from '../../context/AuthContext';
import {
    getPatientProfile,
    updatePatientProfile,
} from '../../services/patientService';

const ACCESS_TOKEN_KEY = 'sanjeevani_access_token';

const PREGNANCY_MIN_AGE = 12;
const PREGNANCY_MAX_AGE = 55;

const emptyProfile = {
    dob: '',
    gender: '',
    bloodGroup: '',

    address: '',
    city: '',
    state: '',
    pincode: '',

    allergies: '',
    chronicConditions: '',
    medications: '',
    majorIllnesses: '',
    disabilities: '',
    pregnancyStatus: '',

    height: '',
    weight: '',

    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactNumber: '',
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

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age -= 1;
    }

    return age;
}

function FieldLabel({
    children,
    required = false,
}) {
    return (
        <label className="sj-label">
            {children}

            {required && (
                <span className="ml-1 text-red-500">
                    *
                </span>
            )}
        </label>
    );
}

function getErrorMessage(error) {
    const detail = error?.data?.detail;

    /*
     * FastAPI validation errors normally look like:
     *
     * {
     *   detail: [
     *     {
     *       type: "...",
     *       loc: ["body", "city"],
     *       msg: "Field required"
     *     }
     *   ]
     * }
     */

    if (Array.isArray(detail)) {
        return detail
            .map((item) => {
                if (typeof item === 'string') {
                    return item;
                }

                if (
                    item?.msg &&
                    Array.isArray(item?.loc)
                ) {
                    const location =
                        item.loc
                            .filter(
                                (part) =>
                                    part !== 'body' &&
                                    part !== 'query' &&
                                    part !== 'path',
                            )
                            .join('.');

                    return location
                        ? `${location}: ${item.msg}`
                        : item.msg;
                }

                return (
                    item?.msg ||
                    item?.message ||
                    'Invalid information.'
                );
            })
            .join(' ');
    }

    if (typeof detail === 'string') {
        return detail;
    }

    if (
        detail &&
        typeof detail === 'object'
    ) {
        return (
            detail?.msg ||
            detail?.message ||
            'Invalid information.'
        );
    }

    if (
        typeof error?.data?.message ===
        'string'
    ) {
        return error.data.message;
    }

    if (
        typeof error?.message === 'string'
    ) {
        return error.message;
    }

    return 'Something went wrong. Please try again.';
}

function formatDate(dateValue) {
    if (!dateValue) {
        return 'Not provided';
    }

    const date = new Date(
        `${dateValue}T00:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    ).format(date);
}

function formatGender(gender) {
    if (!gender) {
        return 'Prefer not to say';
    }

    const labels = {
        female: 'Female',
        male: 'Male',
        non_binary: 'Non-binary',
        other: 'Other',
    };

    return (
        labels[gender] ||
        gender
            .replaceAll('_', ' ')
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase(),
            )
    );
}

function formatPregnancyStatus(status) {
    if (status === 'pregnant') {
        return 'Pregnant';
    }

    if (status === 'not_pregnant') {
        return 'Not pregnant';
    }

    return 'Prefer not to say';
}

function displayValue(value) {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ''
    ) {
        return 'Not provided';
    }

    return String(value);
}

function mapProfileToForm(profile) {
    const emergencyContact =
        profile?.emergency_contacts?.find(
            (contact) =>
                contact.is_primary,
        ) ||
        profile?.emergency_contacts?.[0] ||
        null;

    const medicalProfile =
        profile?.medical_profile || {};

    return {
        dob:
            profile?.date_of_birth || '',

        gender:
            profile?.gender || '',

        bloodGroup:
            profile?.blood_group || '',

        /*
         * These fields are not edited on this page,
         * but MUST be preserved because the backend
         * requires them during PUT /patient/profile.
         */
        address:
            profile?.address || '',

        city:
            profile?.city || '',

        state:
            profile?.state || '',

        pincode:
            profile?.pincode || '',

        allergies:
            medicalProfile?.allergies || '',

        chronicConditions:
            medicalProfile?.chronic_conditions ||
            '',

        medications:
            medicalProfile?.current_medications ||
            '',

        majorIllnesses:
            medicalProfile?.major_surgeries ||
            '',

        disabilities:
            medicalProfile?.disabilities ||
            '',

        pregnancyStatus:
            profile?.pregnancy_status || '',

        height:
            profile?.height_cm !== null &&
            profile?.height_cm !== undefined
                ? String(profile.height_cm)
                : '',

        weight:
            profile?.weight_kg !== null &&
            profile?.weight_kg !== undefined
                ? String(profile.weight_kg)
                : '',

        emergencyContactName:
            emergencyContact?.name || '',

        emergencyContactRelation:
            emergencyContact?.relationship ||
            '',

        emergencyContactNumber:
            emergencyContact?.mobile_number ||
            '',
    };
}

function MedicalProfile() {
    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
    } = useAuth();

    const [formData, setFormData] =
        React.useState(emptyProfile);

    const [savedData, setSavedData] =
        React.useState(emptyProfile);

    /*
     * Keep the complete backend profile so
     * fields that aren't editable on this page
     * can still be preserved during PUT.
     */
    const [savedProfile, setSavedProfile] =
        React.useState(null);

    const [isEditing, setIsEditing] =
        React.useState(false);

    const [isLoading, setIsLoading] =
        React.useState(true);

    const [isSaving, setIsSaving] =
        React.useState(false);

    const [loadError, setLoadError] =
        React.useState('');

    const [saveMessage, setSaveMessage] =
        React.useState('');

    const [saveError, setSaveError] =
        React.useState('');

    const patientAge =
        calculateAge(formData.dob);

    const shouldAskPregnancyStatus =
        formData.gender === 'female' &&
        patientAge !== null &&
        patientAge >= PREGNANCY_MIN_AGE &&
        patientAge <= PREGNANCY_MAX_AGE;

    /*
     * =============================================================
     * GET ACCESS TOKEN
     * =============================================================
     */
    const getAccessToken = React.useCallback(
        () => {
            return localStorage.getItem(
                ACCESS_TOKEN_KEY,
            );
        },
        [],
    );

    /*
     * =============================================================
     * LOAD PROFILE
     * =============================================================
     */
    React.useEffect(() => {
        let isMounted = true;

        /*
         * Do not call the backend while AuthContext
         * is still restoring/verifying the session.
         */
        if (authLoading) {
            return () => {
                isMounted = false;
            };
        }

        const loadProfile = async () => {
            if (!isAuthenticated || !user) {
                if (!isMounted) {
                    return;
                }

                setLoadError(
                    'Authentication required. Please log in again.',
                );

                setIsLoading(false);

                return;
            }

            const accessToken =
                getAccessToken();

            if (!accessToken) {
                if (!isMounted) {
                    return;
                }

                setLoadError(
                    'Your login session could not be found. Please log in again.',
                );

                setIsLoading(false);

                return;
            }

            setIsLoading(true);
            setLoadError('');

            try {
                const profile =
                    await getPatientProfile(
                        accessToken,
                    );

                if (!isMounted) {
                    return;
                }

                setSavedProfile(profile);

                const mappedProfile =
                    mapProfileToForm(profile);

                setFormData(mappedProfile);
                setSavedData(mappedProfile);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                console.error(
                    'Failed to load patient profile:',
                    error,
                );

                if (error?.status === 401) {
                    setLoadError(
                        'Your session has expired. Please log in again.',
                    );
                } else if (
                    error?.status === 404
                ) {
                    setLoadError(
                        'Your patient profile has not been completed yet.',
                    );
                } else {
                    setLoadError(
                        getErrorMessage(error),
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [
        authLoading,
        isAuthenticated,
        user,
        getAccessToken,
    ]);

    /*
     * =============================================================
     * PREGNANCY VISIBILITY
     * =============================================================
     */
    React.useEffect(() => {
        if (
            !shouldAskPregnancyStatus &&
            formData.pregnancyStatus
        ) {
            setFormData((current) => ({
                ...current,
                pregnancyStatus: '',
            }));
        }
    }, [
        shouldAskPregnancyStatus,
        formData.pregnancyStatus,
    ]);

    /*
     * =============================================================
     * FORM CHANGE
     * =============================================================
     */
    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setSaveMessage('');
        setSaveError('');
    };

    /*
     * =============================================================
     * EDIT
     * =============================================================
     */
    const handleEdit = () => {
        setFormData(savedData);
        setIsEditing(true);
        setSaveMessage('');
        setSaveError('');
    };

    /*
     * =============================================================
     * CANCEL
     * =============================================================
     */
    const handleCancel = () => {
        setFormData(savedData);
        setIsEditing(false);
        setSaveMessage('');
        setSaveError('');
    };

    /*
     * =============================================================
     * SAVE
     * =============================================================
     */
    const handleSave = async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);
        setSaveMessage('');
        setSaveError('');

        const accessToken =
            getAccessToken();

        if (!accessToken) {
            setSaveError(
                'Authentication required. Please log in again.',
            );

            setIsSaving(false);

            return;
        }

        /*
         * Validate required backend fields before
         * making the PUT request.
         */
        if (
            !formData.city?.trim() ||
            !formData.state?.trim() ||
            !formData.pincode?.trim()
        ) {
            setSaveError(
                'Your profile is missing city, state, or pincode. Please complete your profile setup before saving.',
            );

            setIsSaving(false);

            return;
        }

        /*
         * Validate emergency contact because the
         * backend requires it.
         */
        if (
            !formData.emergencyContactName?.trim()
        ) {
            setSaveError(
                'Emergency contact name is missing. Please complete your patient profile setup.',
            );

            setIsSaving(false);

            return;
        }

        if (
            !formData.emergencyContactRelation?.trim()
        ) {
            setSaveError(
                'Emergency contact relationship is missing. Please complete your patient profile setup.',
            );

            setIsSaving(false);

            return;
        }

        if (
            !formData.emergencyContactNumber?.trim()
        ) {
            setSaveError(
                'Emergency contact mobile number is missing. Please complete your patient profile setup.',
            );

            setIsSaving(false);

            return;
        }

        try {
            /*
             * Preserve fields that this page does not
             * directly edit.
             */
            const payload = {
                date_of_birth:
                    formData.dob,

                gender:
                    formData.gender || null,

                blood_group:
                    formData.bloodGroup || null,

                /*
                 * Required by PatientProfileCreate.
                 * These values came from the existing
                 * patient profile.
                 */
                address:
                    formData.address?.trim() ||
                    null,

                city:
                    formData.city.trim(),

                state:
                    formData.state.trim(),

                pincode:
                    formData.pincode.trim(),

                height_cm:
                    formData.height
                        ? Number(formData.height)
                        : null,

                weight_kg:
                    formData.weight
                        ? Number(formData.weight)
                        : null,

                pregnancy_status:
                    shouldAskPregnancyStatus
                        ? formData.pregnancyStatus ||
                          null
                        : null,

                /*
                 * Preserve actual consent values from
                 * the backend instead of forcing them.
                 */
                medical_sharing_accepted:
                    Boolean(
                        savedProfile?.medical_sharing_accepted,
                    ),

                terms_accepted:
                    Boolean(
                        savedProfile?.terms_accepted,
                    ),

                /*
                 * Preserve the actual primary
                 * emergency contact.
                 */
                emergency_contact: {
                    name:
                        formData.emergencyContactName.trim(),

                    relationship:
                        formData.emergencyContactRelation.trim(),

                    mobile_number:
                        formData.emergencyContactNumber.trim(),

                    is_primary: true,
                },

                medical_profile: {
                    allergies:
                        formData.allergies.trim() ||
                        null,

                    chronic_conditions:
                        formData.chronicConditions.trim() ||
                        null,

                    current_medications:
                        formData.medications.trim() ||
                        null,

                    major_surgeries:
                        formData.majorIllnesses.trim() ||
                        null,

                    disabilities:
                        formData.disabilities.trim() ||
                        null,
                },
            };

            console.log(
                'Updating patient profile with payload:',
                payload,
            );

            const updatedProfile =
                await updatePatientProfile(
                    payload,
                    accessToken,
                );

            /*
             * Store the complete updated backend
             * response.
             */
            setSavedProfile(
                updatedProfile,
            );

            const updatedForm =
                mapProfileToForm(
                    updatedProfile,
                );

            setFormData(updatedForm);
            setSavedData(updatedForm);
            setIsEditing(false);

            setSaveMessage(
                'Medical profile updated successfully.',
            );
        } catch (error) {
            console.error(
                'Failed to update patient medical profile:',
                error,
            );

            if (error?.status === 401) {
                setSaveError(
                    'Your session has expired. Please log in again.',
                );
            } else if (
                error?.status === 422
            ) {
                setSaveError(
                    `Please check your profile information. ${getErrorMessage(error)}`,
                );
            } else {
                setSaveError(
                    getErrorMessage(error),
                );
            }
        } finally {
            setIsSaving(false);
        }
    };

    /*
     * =============================================================
     * AUTH LOADING
     * =============================================================
     */
    if (authLoading) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <PatientNavbar />

                <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary)/10">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-(--sj-primary)/20 border-t-(--sj-primary)" />
                        </div>

                        <h2 className="mt-5 text-lg font-black text-(--sj-text)">
                            Verifying your session
                        </h2>

                        <p className="mt-2 text-sm text-(--sj-text-soft)">
                            Please wait while we restore your
                            secure session...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    /*
     * =============================================================
     * PROFILE LOADING
     * =============================================================
     */
    if (isLoading) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <PatientNavbar />

                <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary)/10">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-(--sj-primary)/20 border-t-(--sj-primary)" />
                        </div>

                        <h2 className="mt-5 text-lg font-black text-(--sj-text)">
                            Loading your medical profile
                        </h2>

                        <p className="mt-2 text-sm text-(--sj-text-soft)">
                            Fetching your latest saved information...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* =====================================================
                    HEADER
                ===================================================== */}
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
                                Keep your personal, contact, and
                                medical information updated so
                                emergency teams can access relevant
                                information when needed.
                            </p>
                        </div>

                        {!isEditing &&
                            !loadError && (
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

                    {loadError && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
                            {loadError}
                        </div>
                    )}

                    {saveMessage && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check className="h-4 w-4" />
                            {saveMessage}
                        </div>
                    )}

                    {saveError && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
                            {saveError}
                        </div>
                    )}
                </section>

                <div className="space-y-6">
                    {/* =================================================
                        ACCOUNT INFORMATION
                    ================================================= */}
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

                                <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <UserRound className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                    <span className="truncate text-sm font-semibold text-(--sj-text)">
                                        {displayValue(
                                            user?.full_name,
                                        )}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                    Your name is managed through your
                                    Sanjeevani AI account.
                                </p>
                            </div>

                            <div>
                                <FieldLabel required>
                                    Email address
                                </FieldLabel>

                                <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <Mail className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                    <span className="truncate text-sm font-semibold text-(--sj-text)">
                                        {displayValue(
                                            user?.email,
                                        )}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                    Email changes require account-level
                                    verification.
                                </p>
                            </div>

                            <div>
                                <FieldLabel required>
                                    Phone number
                                </FieldLabel>

                                <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <Phone className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                    <span className="text-sm font-semibold text-(--sj-text)">
                                        {displayValue(
                                            user?.mobile_number,
                                        )}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                    Phone changes require SMS OTP
                                    verification.
                                </p>
                            </div>

                            <div>
                                <FieldLabel>
                                    Account security
                                </FieldLabel>

                                <div className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <LockKeyhole className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            {user?.is_verified
                                                ? 'Verified account'
                                                : 'Account verification pending'}
                                        </p>

                                        <p className="text-xs text-(--sj-text-soft)">
                                            Authentication is managed by
                                            Sanjeevani AI.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        PERSONAL INFORMATION
                    ================================================= */}
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
                                        value={
                                            formData.dob
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input px-4 py-3 text-sm"
                                    />
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {formatDate(
                                            savedData.dob,
                                        )}
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
                                        value={
                                            formData.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
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
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {formatGender(
                                            savedData.gender,
                                        )}
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
                                        value={
                                            formData.bloodGroup
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input px-4 py-3 text-sm"
                                    >
                                        <option value="">
                                            Not known
                                        </option>

                                        <option value="A+">
                                            A+
                                        </option>

                                        <option value="A-">
                                            A-
                                        </option>

                                        <option value="B+">
                                            B+
                                        </option>

                                        <option value="B-">
                                            B-
                                        </option>

                                        <option value="AB+">
                                            AB+
                                        </option>

                                        <option value="AB-">
                                            AB-
                                        </option>

                                        <option value="O+">
                                            O+
                                        </option>

                                        <option value="O-">
                                            O-
                                        </option>
                                    </select>
                                ) : (
                                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm font-semibold text-(--sj-text)">
                                        {savedData.bloodGroup ||
                                            'Not known'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        MEDICAL INFORMATION
                    ================================================= */}
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
                                        value={
                                            formData.allergies
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List known allergies"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(
                                            savedData.allergies,
                                        )}
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
                                        value={
                                            formData.chronicConditions
                                        }
                                        onChange={
                                            handleChange
                                        }
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
                                        value={
                                            formData.medications
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                        className="sj-input resize-none px-4 py-3 text-sm"
                                        placeholder="List current medications"
                                    />
                                ) : (
                                    <div className="min-h-20 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3 text-sm leading-6 text-(--sj-text)">
                                        {displayValue(
                                            savedData.medications,
                                        )}
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
                                        value={
                                            formData.majorIllnesses
                                        }
                                        onChange={
                                            handleChange
                                        }
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
                                        value={
                                            formData.disabilities
                                        }
                                        onChange={
                                            handleChange
                                        }
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
                                                onChange={
                                                    handleChange
                                                }
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
                                            {formatPregnancyStatus(
                                                savedData.pregnancyStatus,
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* =================================================
                        PHYSICAL INFORMATION
                    ================================================= */}
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
                                        value={
                                            formData.height
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="30"
                                        max="250"
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
                                        value={
                                            formData.weight
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="1"
                                        max="500"
                                        step="0.1"
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

                    {/* =================================================
                        PRIVACY
                    ================================================= */}
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

                    {/* =================================================
                        SAVE CONTROLS
                    ================================================= */}
                    {isEditing && (
                        <div className="sticky bottom-4 z-30 rounded-2xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-xl backdrop-blur-xl sm:p-4">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        isSaving
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-5 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSave
                                    }
                                    disabled={
                                        isSaving
                                    }
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