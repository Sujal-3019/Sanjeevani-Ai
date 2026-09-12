import React, { useState } from 'react';
import {
    Ambulance,
    Award,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    Edit3,
    Hospital,
    IdCard,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    Stethoscope,
    UserRound,
    X,
} from 'lucide-react';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

const INITIAL_PROFILE = {
    fullName: 'Rohan Mehta',
    mobile: '98765 43210',
    email: 'rohan.mehta@example.com',
    qualification: 'Emergency Medical Technician',
    specialization: 'Emergency Medical Services',
    experience: '6 years',
    licenseNumber: 'EMT-DEL-2020-0421',
    licenseExpiry: '31 December 2027',
    dateOfJoining: '12 March 2024',
    hospital: 'Sanjeevani Emergency Hospital',
    hospitalType: 'Multi-Specialty Hospital',
    hospitalCity: 'New Delhi',
    hospitalState: 'Delhi',
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
    ambulanceRegistration: 'DL-01-AB-2042',
    ambulanceStatus: 'READY',
    accountStatus: 'ACTIVE',
};

const SPECIALIZATION_OPTIONS = [
    'Emergency Medical Services',
    'Critical Care Transport',
    'Trauma Care',
    'Pre-Hospital Emergency Care',
    'Basic Life Support',
    'Advanced Life Support',
];

const EXPERIENCE_OPTIONS = [
    'Less than 1 year',
    '1 year',
    '2 years',
    '3 years',
    '4 years',
    '5 years',
    '6 years',
    '7 years',
    '8 years',
    '9 years',
    '10+ years',
];

const ParamedicProfile = () => {
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (field, value) => {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));

        setSaved(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);

        setTimeout(() => {
            localStorage.setItem(
                'sanjeevani_paramedic_profile',
                JSON.stringify(profile),
            );

            setIsSaving(false);
            setSaved(true);
            setIsEditing(false);
        }, 900);
    };

    const handleCancel = () => {
        setProfile(INITIAL_PROFILE);
        setIsEditing(false);
        setSaved(false);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Page header */}
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--sj-primary)">
                            Account
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-(--sj-text) sm:text-3xl">
                            Paramedic Profile
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                            View your operational profile, professional
                            information, and assigned ambulance details.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {saved && (
                            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                                <CheckCircle2 size={15} />
                                Changes saved
                            </div>
                        )}

                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-2.5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
                            >
                                <Edit3 size={16} />
                                Edit profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-2.5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save changes
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                    {/* Profile summary */}
                    <aside className="space-y-5">
                        <section className="sj-card overflow-hidden">
                            <div className="bg-(--sj-primary-soft) px-5 py-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-(--sj-primary) text-white shadow-lg shadow-(--sj-primary)/15">
                                        <UserRound size={40} />
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-(--sj-text)">
                                        {profile.fullName}
                                    </h2>

                                    <p className="mt-1 text-xs font-medium text-(--sj-text-soft)">
                                        {profile.qualification}
                                    </p>

                                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {profile.accountStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 p-5">
                                <SummaryRow
                                    icon={Phone}
                                    label="Mobile"
                                    value={`+91 ${profile.mobile}`}
                                />

                                <SummaryRow
                                    icon={Mail}
                                    label="Email"
                                    value={profile.email}
                                />

                                <SummaryRow
                                    icon={Hospital}
                                    label="Hospital"
                                    value={profile.hospital}
                                />

                                <SummaryRow
                                    icon={CalendarDays}
                                    label="Joined"
                                    value={profile.dateOfJoining}
                                />
                            </div>
                        </section>

                        {/* Account status */}
                        <section className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <ShieldCheck size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                        Account status
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        Active operational account
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-5 text-(--sj-text-soft)">
                                Your paramedic account is managed by the
                                hospital. Contact the hospital administrator
                                if your professional or assignment details
                                need to be changed.
                            </p>
                        </section>
                    </aside>

                    {/* Main profile */}
                    <div className="space-y-6">
                        {/* Personal information */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={UserRound}
                                title="Personal information"
                                description="Basic information associated with your paramedic account."
                            />

                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <ProfileField
                                    label="Full name"
                                    value={profile.fullName}
                                    editing={isEditing}
                                    onChange={(value) =>
                                        handleChange('fullName', value)
                                    }
                                    required
                                />

                                <ReadOnlyField
                                    label="Mobile number"
                                    value={`+91 ${profile.mobile}`}
                                    icon={Phone}
                                    note="Managed by hospital"
                                />

                                <ReadOnlyField
                                    label="Email address"
                                    value={profile.email}
                                    icon={Mail}
                                    note="Account contact"
                                />

                                <ReadOnlyField
                                    label="Date of joining"
                                    value={profile.dateOfJoining}
                                    icon={CalendarDays}
                                />
                            </div>
                        </section>

                        {/* Professional information */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={Stethoscope}
                                title="Professional information"
                                description="Your qualification, experience, and professional registration details."
                            />

                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <ReadOnlyField
                                    label="Qualification"
                                    value={profile.qualification}
                                    icon={Award}
                                    note="Managed by hospital"
                                />

                                <EditableSelectField
                                    label="Specialization"
                                    value={profile.specialization}
                                    editing={isEditing}
                                    options={SPECIALIZATION_OPTIONS}
                                    onChange={(value) =>
                                        handleChange(
                                            'specialization',
                                            value,
                                        )
                                    }
                                />

                                <EditableSelectField
                                    label="Experience"
                                    value={profile.experience}
                                    editing={isEditing}
                                    options={EXPERIENCE_OPTIONS}
                                    onChange={(value) =>
                                        handleChange(
                                            'experience',
                                            value,
                                        )
                                    }
                                />

                                <ReadOnlyField
                                    label="License / registration number"
                                    value={profile.licenseNumber}
                                    icon={IdCard}
                                    note="Managed by hospital"
                                />

                                <ReadOnlyField
                                    label="License expiry"
                                    value={profile.licenseExpiry}
                                    icon={CalendarDays}
                                />
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                <BadgeCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <div>
                                    <p className="text-xs font-bold text-(--sj-text)">
                                        Professional verification
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Your professional credentials are
                                        maintained and verified by the
                                        hospital administrator before you can
                                        participate in emergency missions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hospital association */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={Hospital}
                                title="Hospital association"
                                description="Your current hospital assignment is controlled by the hospital administrator."
                            />

                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                <ReadOnlyField
                                    label="Hospital"
                                    value={profile.hospital}
                                    icon={Hospital}
                                />

                                <ReadOnlyField
                                    label="Hospital type"
                                    value={profile.hospitalType}
                                    icon={Hospital}
                                />

                                <ReadOnlyField
                                    label="City"
                                    value={profile.hospitalCity}
                                    icon={MapPin}
                                />

                                <ReadOnlyField
                                    label="State"
                                    value={profile.hospitalState}
                                    icon={MapPin}
                                />
                            </div>

                            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck
                                        size={18}
                                        className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                                    />

                                    <div>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                                            Hospital-controlled information
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-amber-700/80 dark:text-amber-300/70">
                                            Hospital association, hospital
                                            status, and operational access
                                            cannot be changed from the
                                            paramedic profile.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assigned ambulance */}
                        <section className="sj-card p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <SectionHeader
                                    icon={Ambulance}
                                    title="Assigned ambulance"
                                    description="Your current operational ambulance assignment."
                                />

                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    {profile.ambulanceStatus}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-5 md:grid-cols-3">
                                <ReadOnlyField
                                    label="Ambulance ID"
                                    value={profile.ambulanceId}
                                    icon={Ambulance}
                                />

                                <ReadOnlyField
                                    label="Ambulance type"
                                    value={profile.ambulanceType}
                                    icon={Ambulance}
                                />

                                <ReadOnlyField
                                    label="Registration number"
                                    value={profile.ambulanceRegistration}
                                    icon={IdCard}
                                />
                            </div>

                            <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                <div className="flex items-start gap-3">
                                    <Ambulance
                                        size={18}
                                        className="mt-0.5 shrink-0 text-(--sj-primary)"
                                    />

                                    <div>
                                        <p className="text-xs font-bold text-(--sj-text)">
                                            Assignment is read-only
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            You cannot select, replace, or
                                            modify your assigned ambulance.
                                            Ambulance assignment is managed
                                            by the hospital and enforced by
                                            the emergency coordination
                                            system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Emergency role */}
                        <section className="sj-card p-5 sm:p-6">
                            <SectionHeader
                                icon={ShieldCheck}
                                title="Operational access"
                                description="Permissions available to your paramedic account."
                            />

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <AccessItem
                                    title="Emergency missions"
                                    description="Receive and manage assigned emergency missions."
                                    enabled
                                />

                                <AccessItem
                                    title="Live navigation"
                                    description="Access route guidance and emergency navigation."
                                    enabled
                                />

                                <AccessItem
                                    title="GPS location sharing"
                                    description="Share ambulance location during active missions."
                                    enabled
                                />

                                <AccessItem
                                    title="Mission history"
                                    description="Review your completed emergency missions."
                                    enabled
                                />
                            </div>
                        </section>

                        {/* Save bar */}
                        {isEditing && (
                            <div className="sticky bottom-4 z-20 rounded-2xl border border-(--sj-border) bg-(--sj-surface)/95 p-4 shadow-xl backdrop-blur">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Unsaved profile changes
                                        </p>

                                        <p className="mt-0.5 text-xs text-(--sj-text-soft)">
                                            Save your editable professional
                                            information before leaving.
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary) disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-2.5 text-xs font-bold text-white transition hover:bg-(--sj-primary-dark) disabled:opacity-60"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={15} />
                                                    Save changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title, description }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                <Icon size={19} />
            </div>

            <div>
                <h2 className="text-base font-bold text-(--sj-text)">
                    {title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                    {description}
                </p>
            </div>
        </div>
    );
};

const SummaryRow = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-start gap-3">
            <Icon
                size={16}
                className="mt-0.5 shrink-0 text-(--sj-text-muted)"
            />

            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                    {label}
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-(--sj-text)">
                    {value}
                </p>
            </div>
        </div>
    );
};

const ProfileField = ({
    label,
    value,
    editing,
    onChange,
    required = false,
}) => {
    return (
        <div>
            <label className="sj-label">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            {editing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="sj-input"
                />
            ) : (
                <div className="flex min-h-11 items-center rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 text-sm font-semibold text-(--sj-text)">
                    {value}
                </div>
            )}
        </div>
    );
};

const EditableSelectField = ({
    label,
    value,
    editing,
    options,
    onChange,
}) => {
    return (
        <div>
            <label className="sj-label">{label}</label>

            {editing ? (
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="sj-input"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="flex min-h-11 items-center rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 text-sm font-semibold text-(--sj-text)">
                    {value}
                </div>
            )}
        </div>
    );
};

const ReadOnlyField = ({ label, value, icon: Icon, note }) => {
    return (
        <div>
            <label className="sj-label">{label}</label>

            <div className="flex min-h-11 items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3">
                {Icon && (
                    <Icon
                        size={15}
                        className="shrink-0 text-(--sj-text-muted)"
                    />
                )}

                <span className="min-w-0 truncate text-sm font-semibold text-(--sj-text)">
                    {value}
                </span>
            </div>

            {note && (
                <p className="mt-1.5 text-[10px] text-(--sj-text-muted)">
                    {note}
                </p>
            )}
        </div>
    );
};

const AccessItem = ({ title, description, enabled }) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2)/60 p-4">
            <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    enabled
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                }`}
            >
                <CheckCircle2 size={16} />
            </div>

            <div>
                <p className="text-xs font-bold text-(--sj-text)">
                    {title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-(--sj-text-soft)">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ParamedicProfile;