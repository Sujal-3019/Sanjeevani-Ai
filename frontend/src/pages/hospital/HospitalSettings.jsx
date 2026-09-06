import React from 'react';
import {
    AlertCircle,
    Bell,
    Building2,
    Check,
    ChevronDown,
    Clock3,
    Eye,
    EyeOff,
    Hospital,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import HospitalNavbar from '../../components/layout/HospitalNavbar';

const HOSPITAL_TYPES = [
    'Multi-Specialty Hospital',
    'General Hospital',
    'Specialty Hospital',
    'Government Hospital',
    'Private Hospital',
    'Trauma Center',
    'Teaching Hospital',
    'Medical College Hospital',
    'Clinic',
];

const STATES = [
    'Delhi',
    'Haryana',
    'Uttar Pradesh',
    'Rajasthan',
    'Punjab',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Telangana',
    'West Bengal',
];

const INITIAL_FORM = {
    hospitalName: 'Sanjeevani Emergency Hospital',
    hospitalType: 'Multi-Specialty Hospital',
    registrationNumber: 'DL-HOSP-2026-00421',
    registrationAuthority: 'Delhi Health Department',
    establishedYear: '2012',

    officialPhone: '+91 11 4567 8900',
    officialEmail: 'admin@sanjeevanihospital.example',

    address: '24 Kasturba Gandhi Marg',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',

    emergencyPhone: '+91 11 4567 8911',

    emergencyNotifications: true,
    ambulanceNotifications: true,
    criticalEmergencyNotifications: true,
    emailNotifications: true,
    smsNotifications: true,

    emergencyAvailability: true,
    ambulanceAcceptance: true,

    adminName: 'Dr. Amit Sharma',
    adminEmail: 'amit.sharma@example.com',
    adminPhone: '+91 98765 43210',
};

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

function SectionHeader({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <h2 className="text-base font-black text-(--sj-text)">
                    {title}
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-(--sj-text-soft)">
                    {description}
                </p>
            </div>
        </div>
    );
}

function Toggle({
    checked,
    onChange,
    label,
    description,
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4 transition hover:border-(--sj-primary)">
            <div className="min-w-0">
                <p className="text-sm font-bold text-(--sj-text)">
                    {label}
                </p>

                {description && (
                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                        {description}
                    </p>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? 'bg-(--sj-primary)'
                        : 'bg-(--sj-text-muted)/40'
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        checked
                            ? 'left-6'
                            : 'left-1'
                    }`}
                />
            </button>
        </label>
    );
}

export default function HospitalSettings() {
    const [formData, setFormData] =
        React.useState(INITIAL_FORM);

    const [isSaving, setIsSaving] =
        React.useState(false);

    const [savedMessage, setSavedMessage] =
        React.useState('');

    const [error, setError] =
        React.useState('');

    const [showCurrentPassword, setShowCurrentPassword] =
        React.useState(false);

    const [showNewPassword, setShowNewPassword] =
        React.useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        React.useState(false);

    const [passwordData, setPasswordData] =
        React.useState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError('');
        setSavedMessage('');
    };

    const handleToggle = (name, value) => {
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setSavedMessage('');
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordData((current) => ({
            ...current,
            [name]: value,
        }));

        setError('');
        setSavedMessage('');
    };

    const validateForm = () => {
        if (!formData.hospitalName.trim()) {
            return 'Hospital name is required.';
        }

        if (!formData.hospitalType) {
            return 'Hospital type is required.';
        }

        if (!formData.registrationNumber.trim()) {
            return 'Registration number is required.';
        }

        if (!formData.registrationAuthority.trim()) {
            return 'Registration authority is required.';
        }

        if (!formData.officialPhone.trim()) {
            return 'Official hospital phone number is required.';
        }

        if (!formData.officialEmail.trim()) {
            return 'Official hospital email is required.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            formData.officialEmail,
        )) {
            return 'Please enter a valid official hospital email.';
        }

        if (!formData.address.trim()) {
            return 'Hospital address is required.';
        }

        if (!formData.city.trim()) {
            return 'City is required.';
        }

        if (!formData.state) {
            return 'State is required.';
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            return 'Pincode must contain exactly 6 digits.';
        }

        if (!formData.emergencyPhone.trim()) {
            return 'Emergency contact number is required.';
        }

        return '';
    };

    const handleSaveChanges = () => {
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setSavedMessage('');
        setIsSaving(true);

        window.setTimeout(() => {
            localStorage.setItem(
                'sanjeevani_hospital_settings',
                JSON.stringify(formData),
            );

            setIsSaving(false);
            setSavedMessage(
                'Hospital settings saved successfully.',
            );

            window.setTimeout(() => {
                setSavedMessage('');
            }, 3500);
        }, 900);
    };

    const handlePasswordUpdate = (event) => {
        event.preventDefault();

        if (!passwordData.currentPassword) {
            setError(
                'Please enter your current password.',
            );
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError(
                'New password must contain at least 8 characters.',
            );
            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {
            setError(
                'New password and confirmation password do not match.',
            );
            return;
        }

        setError('');
        setSavedMessage('');
        setIsSaving(true);

        window.setTimeout(() => {
            setIsSaving(false);

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setSavedMessage(
                'Password updated successfully.',
            );

            window.setTimeout(() => {
                setSavedMessage('');
            }, 3500);
        }, 900);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Page header */}
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-(--sj-text-muted)">
                            <span>
                                Hospital dashboard
                            </span>

                            <span>/</span>

                            <span className="text-(--sj-text-soft)">
                                Settings
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary) sm:flex">
                                <Hospital className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-(--sj-text) sm:text-3xl">
                                    Hospital settings
                                </h1>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-(--sj-text-soft)">
                                    Manage your hospital profile,
                                    emergency contact details,
                                    notifications, and administrator
                                    account settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
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

                {/* Success message */}
                {savedMessage && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-950/20 dark:text-green-300">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/40">
                            <Check className="h-4 w-4" />
                        </div>

                        {savedMessage}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <span>{error}</span>
                    </div>
                )}

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Main settings */}
                    <div className="space-y-8">
                        {/* Hospital information */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={Building2}
                                title="Hospital information"
                                description="Basic information about your registered healthcare facility."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <FieldLabel required>
                                        Hospital name
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={
                                            formData.hospitalName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input h-11"
                                    />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Hospital type
                                    </FieldLabel>

                                    <div className="relative">
                                        <select
                                            name="hospitalType"
                                            value={
                                                formData.hospitalType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="sj-input h-11 appearance-none pr-10"
                                        >
                                            {HOSPITAL_TYPES.map(
                                                (type) => (
                                                    <option
                                                        key={
                                                            type
                                                        }
                                                        value={
                                                            type
                                                        }
                                                    >
                                                        {
                                                            type
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>

                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Established year
                                    </FieldLabel>

                                    <input
                                        type="number"
                                        name="establishedYear"
                                        value={
                                            formData.establishedYear
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="1800"
                                        max={
                                            new Date().getFullYear()
                                        }
                                        className="sj-input h-11"
                                    />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Registration number
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={
                                            formData.registrationNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input h-11"
                                    />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Registration authority
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        name="registrationAuthority"
                                        value={
                                            formData.registrationAuthority
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input h-11"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contact and location */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={MapPin}
                                title="Contact & location"
                                description="Official contact information and hospital location used for coordination."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <FieldLabel required>
                                        Official phone
                                    </FieldLabel>

                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                        <input
                                            type="tel"
                                            name="officialPhone"
                                            value={
                                                formData.officialPhone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="sj-input h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Official email
                                    </FieldLabel>

                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                        <input
                                            type="email"
                                            name="officialEmail"
                                            value={
                                                formData.officialEmail
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="sj-input h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <FieldLabel required>
                                        Hospital address
                                    </FieldLabel>

                                    <textarea
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={3}
                                        className="sj-input min-h-22.5 resize-y py-3"
                                    />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        City
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="sj-input h-11"
                                    />
                                </div>

                                <div>
                                    <FieldLabel required>
                                        State
                                    </FieldLabel>

                                    <div className="relative">
                                        <select
                                            name="state"
                                            value={
                                                formData.state
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="sj-input h-11 appearance-none pr-10"
                                        >
                                            {STATES.map(
                                                (state) => (
                                                    <option
                                                        key={
                                                            state
                                                        }
                                                        value={
                                                            state
                                                        }
                                                    >
                                                        {
                                                            state
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>

                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel required>
                                        Pincode
                                    </FieldLabel>

                                    <input
                                        type="text"
                                        name="pincode"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={
                                            formData.pincode
                                        }
                                        onChange={(event) => {
                                            const value =
                                                event.target.value
                                                    .replace(
                                                        /\D/g,
                                                        '',
                                                    )
                                                    .slice(
                                                        0,
                                                        6,
                                                    );

                                            setFormData(
                                                (
                                                    current,
                                                ) => ({
                                                    ...current,
                                                    pincode:
                                                        value,
                                                }),
                                            );

                                            setError(
                                                '',
                                            );
                                            setSavedMessage(
                                                '',
                                            );
                                        }}
                                        className="sj-input h-11"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-xs font-bold text-(--sj-text)">
                                            Location used for emergency
                                            coordination
                                        </p>

                                        <p className="mt-1 text-[11px] leading-5 text-(--sj-text-soft)">
                                            Sanjeevani AI derives the
                                            hospital's geographic
                                            coordinates from its verified
                                            address. Hospital Admins do not
                                            manually enter latitude or
                                            longitude.
                                        </p>

                                        <p className="mt-2 text-[11px] font-semibold text-(--sj-primary)">
                                            Current location:{' '}
                                            {
                                                formData.city
                                            }
                                            ,{' '}
                                            {
                                                formData.state
                                            }{' '}
                                            {
                                                formData.pincode
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Emergency contact */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={Phone}
                                title="Emergency coordination"
                                description="Configure the contact details and operational preferences used during emergency coordination."
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <FieldLabel required>
                                        Emergency contact number
                                    </FieldLabel>

                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                        <input
                                            type="tel"
                                            name="emergencyPhone"
                                            value={
                                                formData.emergencyPhone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="sj-input h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 text-xs font-bold text-green-700 dark:border-green-900/60 dark:bg-green-950/20 dark:text-green-300">
                                        <Check className="h-4 w-4" />
                                        Emergency coordination enabled
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <Toggle
                                    checked={
                                        formData.emergencyAvailability
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'emergencyAvailability',
                                            value,
                                        )
                                    }
                                    label="Accept emergency coordination"
                                    description="Allow Sanjeevani AI to send eligible emergency requests to this hospital."
                                />

                                <Toggle
                                    checked={
                                        formData.ambulanceAcceptance
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'ambulanceAcceptance',
                                            value,
                                        )
                                    }
                                    label="Accept ambulance coordination"
                                    description="Allow ambulance missions to be coordinated with this hospital."
                                />
                            </div>
                        </section>

                        {/* Notification settings */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={Bell}
                                title="Notification settings"
                                description="Choose which operational notifications the Hospital Admin receives."
                            />

                            <div className="grid gap-3">
                                <Toggle
                                    checked={
                                        formData.emergencyNotifications
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'emergencyNotifications',
                                            value,
                                        )
                                    }
                                    label="Emergency requests"
                                    description="Receive notifications when a new emergency request is assigned to your hospital."
                                />

                                <Toggle
                                    checked={
                                        formData.criticalEmergencyNotifications
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'criticalEmergencyNotifications',
                                            value,
                                        )
                                    }
                                    label="Critical emergency alerts"
                                    description="Receive high-priority alerts for critical and life-threatening emergencies."
                                />

                                <Toggle
                                    checked={
                                        formData.ambulanceNotifications
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'ambulanceNotifications',
                                            value,
                                        )
                                    }
                                    label="Ambulance updates"
                                    description="Receive updates about ambulance assignment, dispatch, arrival, and hospital arrival."
                                />

                                <Toggle
                                    checked={
                                        formData.emailNotifications
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'emailNotifications',
                                            value,
                                        )
                                    }
                                    label="Email notifications"
                                    description="Send operational notifications to the registered hospital email."
                                />

                                <Toggle
                                    checked={
                                        formData.smsNotifications
                                    }
                                    onChange={(value) =>
                                        handleToggle(
                                            'smsNotifications',
                                            value,
                                        )
                                    }
                                    label="SMS notifications"
                                    description="Send important emergency alerts to the registered hospital contact number."
                                />
                            </div>
                        </section>

                        {/* Security */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={ShieldCheck}
                                title="Security"
                                description="Update the Hospital Admin account password."
                            />

                            <form
                                onSubmit={
                                    handlePasswordUpdate
                                }
                                className="space-y-5"
                            >
                                <div>
                                    <FieldLabel required>
                                        Current password
                                    </FieldLabel>

                                    <div className="relative">
                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="currentPassword"
                                            value={
                                                passwordData.currentPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Enter current password"
                                            className="sj-input h-11 pr-11"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (
                                                        current,
                                                    ) =>
                                                        !current,
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <FieldLabel required>
                                            New password
                                        </FieldLabel>

                                        <div className="relative">
                                            <input
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="newPassword"
                                                value={
                                                    passwordData.newPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Minimum 8 characters"
                                                className="sj-input h-11 pr-11"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (
                                                            current,
                                                        ) =>
                                                            !current,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel required>
                                            Confirm new password
                                        </FieldLabel>

                                        <div className="relative">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                name="confirmPassword"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Repeat new password"
                                                className="sj-input h-11 pr-11"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (
                                                            current,
                                                        ) =>
                                                            !current,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-(--sj-border) pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[11px] leading-5 text-(--sj-text-muted)">
                                        Use at least 8 characters and avoid
                                        using easily guessed information.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 text-xs font-bold text-(--sj-text) transition hover:border-(--sj-primary) hover:text-(--sj-primary) disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Update password
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Verification */}
                        <section className="sj-card overflow-hidden">
                            <div className="border-b border-(--sj-border) p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                            Verification
                                        </p>

                                        <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                            Hospital status
                                        </h2>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
                                        <Clock3 className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                                    <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                                        Pending verification
                                    </span>
                                </div>

                                <p className="mt-3 text-xs leading-5 text-(--sj-text-soft)">
                                    Your hospital profile is currently under
                                    verification by the Sanjeevani AI
                                    verification team.
                                </p>

                                <div className="mt-4 rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Application ID
                                    </p>

                                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                                        HSP-2026-00421
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="mt-4 w-full rounded-xl border border-(--sj-border) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    onClick={() => {
                                        window.location.href =
                                            '/verification/hospital?applicationId=HSP-2026-00421';
                                    }}
                                >
                                    View verification status
                                </button>
                            </div>
                        </section>

                        {/* Admin account */}
                        <section className="sj-card p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Administrator
                                    </p>

                                    <h2 className="mt-1 text-base font-black text-(--sj-text)">
                                        Admin account
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Admin name
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {formData.adminName}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-xs font-semibold text-(--sj-text-soft)">
                                        {formData.adminEmail}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Mobile
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-(--sj-text-soft)">
                                        {formData.adminPhone}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-[10px] leading-5 text-(--sj-text-muted)">
                                Administrator identity and verified contact
                                details are managed through the Sanjeevani AI
                                authentication system.
                            </p>
                        </section>

                        {/* Operational reminder */}
                        <section className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <AlertCircle className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-(--sj-text)">
                                        Keep information current
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                                        Accurate contact, location, service,
                                        capacity, and emergency availability
                                        information helps Sanjeevani AI make
                                        better hospital coordination decisions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Privacy */}
                        <section className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                                <div>
                                    <h3 className="text-sm font-black text-(--sj-text)">
                                        Protected hospital data
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                                        Hospital account and operational
                                        settings are restricted to authorized
                                        Hospital Admin users.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Bottom save bar */}
                <div className="sticky bottom-4 z-20 mt-8">
                    <div className="flex flex-col gap-3 rounded-2xl border border-(--sj-border) bg-(--sj-surface)/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Save className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-(--sj-text)">
                                    Remember to save your changes
                                </p>

                                <p className="mt-0.5 text-[10px] text-(--sj-text-muted)">
                                    Updated settings will be used for future
                                    emergency coordination.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-xs font-bold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Check className="h-4 w-4" />
                            {isSaving
                                ? 'Saving...'
                                : 'Save changes'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}