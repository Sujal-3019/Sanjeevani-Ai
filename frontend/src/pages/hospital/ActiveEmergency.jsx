import React from 'react';
import {
    Activity,
    Ambulance,
    ArrowLeft,
    Bed,
    Bell,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Hospital,
    MapPin,
    Menu,
    MessageCircle,
    Moon,
    Navigation,
    Phone,
    ShieldCheck,
    Siren,
    Stethoscope,
    Sun,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo4.png';

const MOCK_EMERGENCY = {
    id: 'EM-2026-00131',
    severity: 'CRITICAL',
    patient: 'Patient #P-10428',
    age: 46,
    gender: 'Male',
    bloodGroup: 'O+',
    location: 'Connaught Place, New Delhi',
    distance: '3.8 km',
    coordinates: '28.6315° N, 77.2167° E',
    reportedAt: '2:34 PM',
    symptoms: [
        'Severe chest pain',
        'Difficulty breathing',
        'Dizziness',
    ],
    aiConfidence: '94%',
    aiSummary:
        'AI assessment indicates a potentially life-threatening cardiac emergency requiring immediate medical attention.',
    medicalAlerts: [
        'No known drug allergies reported',
        'Medical profile available',
    ],
};

const MOCK_AMBULANCES = [
    {
        id: 'AMB-038',
        type: 'BLS',
        paramedic: 'Amit Kumar',
        distance: '2.1 km',
        eta: '7 min',
        status: 'AVAILABLE',
    },
    {
        id: 'AMB-031',
        type: 'ALS',
        paramedic: 'Neeraj Singh',
        distance: '2.8 km',
        eta: '9 min',
        status: 'AVAILABLE',
    },
    {
        id: 'AMB-047',
        type: 'ALS',
        paramedic: 'Vikram Rao',
        distance: '4.3 km',
        eta: '13 min',
        status: 'AVAILABLE',
    },
];

function SeverityBadge({ severity }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {severity}
        </span>
    );
}

function MissionStatus({ status }) {
    const config = {
        WAITING: {
            label: 'Waiting for ambulance',
            className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            dot: 'bg-blue-500',
        },
        ASSIGNED: {
            label: 'Ambulance assigned',
            className:
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            dot: 'bg-emerald-500',
        },
        EN_ROUTE: {
            label: 'Ambulance en route',
            className:
                'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            dot: 'bg-amber-500',
        },
        ARRIVED: {
            label: 'At patient location',
            className:
                'bg-purple-500/10 text-purple-600 dark:text-purple-400',
            dot: 'bg-purple-500',
        },
        TRANSPORTING: {
            label: 'Patient transporting',
            className:
                'bg-orange-500/10 text-orange-600 dark:text-orange-400',
            dot: 'bg-orange-500',
        },
        ARRIVED_HOSPITAL: {
            label: 'Arrived at hospital',
            className:
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            dot: 'bg-emerald-500',
        },
        COMPLETED: {
            label: 'Emergency completed',
            className: 'bg-(--sj-surface-2) text-(--sj-text-soft)',
            dot: 'bg-(--sj-text-muted)',
        },
    };

    const current = config[status] || config.WAITING;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${current.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {current.label}
        </span>
    );
}

function ActiveEmergency() {
    const navigate = useNavigate();
    const { emergencyId } = useParams();
    const { theme, toggleTheme } = useTheme();

    const [missionStatus, setMissionStatus] = React.useState('WAITING');
    const [selectedAmbulance, setSelectedAmbulance] =
        React.useState(null);
    const [showAmbulanceSelector, setShowAmbulanceSelector] =
        React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [actionMessage, setActionMessage] = React.useState('');

    const isDark = theme === 'dark';

    const emergency = {
        ...MOCK_EMERGENCY,
        id: emergencyId || MOCK_EMERGENCY.id,
    };

    const assignAmbulance = (ambulance) => {
        setSelectedAmbulance(ambulance);
        setMissionStatus('ASSIGNED');
        setShowAmbulanceSelector(false);
        setActionMessage(
            `${ambulance.id} has been assigned to ${emergency.id}.`,
        );
    };

    const startMission = () => {
        if (!selectedAmbulance) {
            setActionMessage('Assign an ambulance before starting the mission.');
            return;
        }

        setMissionStatus('EN_ROUTE');
        setActionMessage(
            `${selectedAmbulance.id} is now en route to the patient.`,
        );
    };

    const simulateArrival = () => {
        setMissionStatus('ARRIVED');
        setActionMessage(
            `${selectedAmbulance?.id || 'Ambulance'} has reached the patient location.`,
        );
    };

    const simulateTransport = () => {
        setMissionStatus('TRANSPORTING');
        setActionMessage(
            'Patient transport to the hospital is now in progress.',
        );
    };

    const simulateHospitalArrival = () => {
        setMissionStatus('ARRIVED_HOSPITAL');
        setActionMessage(
            'Patient has arrived at the hospital. Prepare emergency intake.',
        );
    };

    const completeEmergency = () => {
        setMissionStatus('COMPLETED');
        setActionMessage(
            'Emergency coordination has been marked as completed.',
        );
    };

    const handleSignOut = () => {
        window.location.href = '/';
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <header className="sticky top-0 z-40 border-b border-(--sj-border) bg-(--sj-bg)/95 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/dashboard/hospital"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                            <img
                                src={logo}
                                alt="Sanjeevani AI"
                                className="h-full w-full object-contain p-1"
                            />
                        </div>

                        <div>
                            <div className="text-lg font-black tracking-tight text-(--sj-text)">
                                Sanjeevani
                                <span className="text-(--sj-primary)">
                                    {' '}
                                    AI
                                </span>
                            </div>

                            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-(--sj-text-muted) sm:block">
                                Hospital command center
                            </div>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 lg:flex">
                        <span className="rounded-full bg-(--sj-primary)/10 px-3 py-1.5 text-xs font-bold text-(--sj-primary)">
                            Hospital Admin
                        </span>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setNotificationOpen(
                                        (current) => !current,
                                    );
                                    setProfileOpen(false);
                                }}
                                aria-label="Notifications"
                                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--sj-surface)" />
                            </button>

                            {notificationOpen && (
                                <div className="absolute right-0 top-12 w-80 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-2xl">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Notifications
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="rounded-xl bg-red-500/5 p-3">
                                            <p className="text-xs font-black text-(--sj-text)">
                                                Critical emergency active
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                {emergency.id} requires immediate
                                                coordination.
                                            </p>
                                        </div>

                                        <div className="rounded-xl p-3 hover:bg-(--sj-surface-2)">
                                            <p className="text-xs font-black text-(--sj-text)">
                                                Ambulance availability
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                5 ambulances are currently
                                                available.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setProfileOpen((current) => !current);
                                    setNotificationOpen(false);
                                }}
                                className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2 text-left transition hover:border-(--sj-primary)/40"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <UserRound className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-black text-(--sj-text)">
                                        Admin
                                    </p>

                                    <p className="text-[10px] text-(--sj-text-muted)">
                                        Hospital Admin
                                    </p>
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-12 w-56 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-2xl">
                                    <Link
                                        to="/dashboard/hospital/settings"
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    >
                                        <Hospital className="h-4 w-4" />
                                        Hospital settings
                                    </Link>

                                    <Link
                                        to="/verification/hospital"
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Verification status
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/5"
                                    >
                                        <X className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen((current) => !current)
                        }
                        aria-label="Toggle navigation"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) lg:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-(--sj-border) px-4 py-4 lg:hidden">
                        <div className="mx-auto max-w-[1600px] space-y-2">
                            <Link
                                to="/dashboard/hospital"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) hover:bg-(--sj-surface-2)"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Hospital className="h-4 w-4" />
                                Dashboard
                            </Link>

                            <Link
                                to="/verification/hospital"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) hover:bg-(--sj-surface-2)"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Verification status
                            </Link>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) hover:bg-(--sj-surface-2)"
                            >
                                {isDark ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                Toggle theme
                            </button>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-500/5"
                            >
                                <X className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-6">
                    <Link
                        to="/dashboard/hospital/emergencies"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Emergency requests
                    </Link>

                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                    Active emergency
                                </p>

                                <SeverityBadge
                                    severity={emergency.severity}
                                />
                            </div>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                {emergency.id}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                Coordinate ambulance dispatch, paramedic
                                response and hospital preparation for this
                                emergency.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <MissionStatus status={missionStatus} />
                        </div>
                    </div>
                </div>

                {actionMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs font-bold leading-5 text-(--sj-text)">
                            {actionMessage}
                        </p>
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="min-w-0 space-y-6">
                        <section className="sj-card overflow-hidden">
                            <div className="flex flex-col gap-4 border-b border-(--sj-border) px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                        <Siren className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Patient emergency
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Emergency information
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xs font-bold text-(--sj-text-muted)">
                                    Reported at {emergency.reportedAt}
                                </span>
                            </div>

                            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Patient
                                    </p>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                            <UserRound className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-black text-(--sj-text)">
                                                {emergency.patient}
                                            </p>

                                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                {emergency.age} years ·{' '}
                                                {emergency.gender}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Blood group
                                    </p>

                                    <p className="mt-3 text-2xl font-black text-red-500">
                                        {emergency.bloodGroup}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-(--sj-border) px-5 py-5 sm:px-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-(--sj-primary)" />

                                    <p className="text-sm font-black text-(--sj-text)">
                                        Incident location
                                    </p>
                                </div>

                                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                                    <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                        <p className="text-sm font-black text-(--sj-text)">
                                            {emergency.location}
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            GPS: {emergency.coordinates}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:flex">
                                        <div className="rounded-xl bg-(--sj-surface-2) px-4 py-3 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                                Distance
                                            </p>

                                            <p className="mt-1 text-sm font-black text-(--sj-text)">
                                                {emergency.distance}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-(--sj-surface-2) px-4 py-3 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                                ETA
                                            </p>

                                            <p className="mt-1 text-sm font-black text-(--sj-text)">
                                                8 min
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-(--sj-border) px-5 py-5 sm:px-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    Reported symptoms
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {emergency.symptoms.map((symptom) => (
                                        <span
                                            key={symptom}
                                            className="rounded-lg border border-(--sj-border) bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft)"
                                        >
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="sj-card overflow-hidden">
                            <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Activity className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            AI triage assessment
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Decision support for emergency
                                            coordination
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <p className="max-w-2xl text-sm font-bold leading-6 text-(--sj-text)">
                                            {emergency.aiSummary}
                                        </p>

                                        <div className="shrink-0 rounded-xl bg-(--sj-surface) px-3 py-2 text-center">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                                                Confidence
                                            </p>

                                            <p className="mt-1 text-lg font-black text-(--sj-primary)">
                                                {emergency.aiConfidence}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {emergency.medicalAlerts.map((alert) => (
                                        <div
                                            key={alert}
                                            className="flex items-start gap-3 rounded-xl bg-(--sj-surface-2) p-3"
                                        >
                                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                                            <p className="text-xs font-bold leading-5 text-(--sj-text-soft)">
                                                {alert}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-4 text-[10px] leading-5 text-(--sj-text-muted)">
                                    AI output is decision support and does not
                                    replace clinical judgment.
                                </p>
                            </div>
                        </section>

                        <section className="sj-card overflow-hidden">
                            <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Ambulance coordination
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Assign the most suitable available
                                            ambulance
                                        </p>
                                    </div>

                                    <Ambulance className="h-5 w-5 text-(--sj-primary)" />
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                {!selectedAmbulance ? (
                                    <div>
                                        <div className="rounded-2xl border border-dashed border-(--sj-border) bg-(--sj-surface-2) p-6 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                <Ambulance className="h-6 w-6" />
                                            </div>

                                            <p className="mt-4 text-sm font-black text-(--sj-text)">
                                                No ambulance assigned
                                            </p>

                                            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-(--sj-text-soft)">
                                                Select an available ambulance
                                                based on capability, distance
                                                and estimated arrival time.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowAmbulanceSelector(
                                                        true,
                                                    )
                                                }
                                                className="sj-ai-button mt-5 h-11 px-5 text-xs"
                                            >
                                                <Ambulance className="h-4 w-4" />
                                                Select ambulance
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex flex-col gap-4 rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-5 sm:flex-row sm:items-center">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                <Ambulance className="h-6 w-6" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-base font-black text-(--sj-text)">
                                                        {
                                                            selectedAmbulance.id
                                                        }
                                                    </p>

                                                    <span className="rounded-md bg-(--sj-surface) px-2 py-1 text-[9px] font-black text-(--sj-text-muted)">
                                                        {
                                                            selectedAmbulance.type
                                                        }
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                    Paramedic:{' '}
                                                    <strong className="text-(--sj-text)">
                                                        {
                                                            selectedAmbulance.paramedic
                                                        }
                                                    </strong>
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-(--sj-text-muted)">
                                                    <span>
                                                        Distance:{' '}
                                                        {
                                                            selectedAmbulance.distance
                                                        }
                                                    </span>

                                                    <span>
                                                        ETA:{' '}
                                                        {
                                                            selectedAmbulance.eta
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-(--sj-primary)" />
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowAmbulanceSelector(
                                                        true,
                                                    )
                                                }
                                                className="h-11 rounded-xl border border-(--sj-border) px-4 text-xs font-black text-(--sj-text-soft) hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                            >
                                                Change ambulance
                                            </button>

                                            {missionStatus === 'ASSIGNED' && (
                                                <button
                                                    type="button"
                                                    onClick={startMission}
                                                    className="sj-ai-button h-11 flex-1 text-xs"
                                                >
                                                    <Navigation className="h-4 w-4" />
                                                    Start mission
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="sj-card overflow-hidden">
                            <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Navigation className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Mission tracking
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Current emergency response
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="sj-map h-72">
                                    <div className="sj-map-grid" />

                                    <div className="absolute inset-0">
                                        <div className="absolute left-[18%] top-[62%] h-4 w-4 rounded-full bg-red-500 ring-8 ring-red-500/10" />

                                        <div className="absolute right-[18%] top-[24%] h-4 w-4 rounded-full bg-(--sj-primary) ring-8 ring-(--sj-primary)/10" />

                                        {selectedAmbulance && (
                                            <div className="absolute left-[48%] top-[44%] flex h-9 w-9 items-center justify-center rounded-xl bg-(--sj-surface) text-(--sj-primary) shadow-lg ring-1 ring-(--sj-border)">
                                                <Ambulance className="h-5 w-5" />
                                            </div>
                                        )}

                                        <div className="absolute left-[18%] top-[62%] h-px w-[34%] rotate-[-25deg] origin-left bg-red-400/50" />

                                        <div className="absolute left-[50%] top-[45%] h-px w-[27%] rotate-[-28deg] origin-left bg-(--sj-primary)/50" />
                                    </div>

                                    <div className="absolute left-4 top-4 rounded-xl border border-(--sj-border) bg-(--sj-surface)/90 px-3 py-2 backdrop-blur">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                                            Patient
                                        </p>

                                        <p className="mt-1 text-xs font-black text-(--sj-text)">
                                            {emergency.location}
                                        </p>
                                    </div>

                                    <div className="absolute bottom-4 right-4 rounded-xl border border-(--sj-border) bg-(--sj-surface)/90 px-3 py-2 backdrop-blur">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                                            Hospital
                                        </p>

                                        <p className="mt-1 text-xs font-black text-(--sj-text)">
                                            Sanjeevani Emergency Hospital
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                            Mission status
                                        </p>

                                        <div className="mt-2">
                                            <MissionStatus
                                                status={missionStatus}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                            Current ETA
                                        </p>

                                        <p className="mt-2 text-sm font-black text-(--sj-text)">
                                            {missionStatus === 'EN_ROUTE'
                                                ? '6 min'
                                                : missionStatus === 'ARRIVED'
                                                  ? 'Arrived'
                                                  : missionStatus ===
                                                      'TRANSPORTING'
                                                    ? '11 min to hospital'
                                                    : '—'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                            Ambulance
                                        </p>

                                        <p className="mt-2 text-sm font-black text-(--sj-text)">
                                            {selectedAmbulance?.id || 'Not assigned'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="sj-card overflow-hidden">
                            <div className="border-b border-(--sj-border) px-5 py-5">
                                <p className="text-sm font-black text-(--sj-text)">
                                    Mission timeline
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    Emergency coordination progress
                                </p>
                            </div>

                            <div className="p-5">
                                <div className="space-y-0">
                                    <TimelineItem
                                        title="Emergency accepted"
                                        description="Hospital accepted the emergency request."
                                        active
                                        completed
                                    />

                                    <TimelineItem
                                        title="Ambulance assigned"
                                        description="Available ambulance selected for response."
                                        active={
                                            missionStatus !== 'WAITING'
                                        }
                                        completed={
                                            missionStatus !== 'WAITING'
                                        }
                                    />

                                    <TimelineItem
                                        title="Ambulance en route"
                                        description="Paramedic is travelling to the patient."
                                        active={[
                                            'EN_ROUTE',
                                            'ARRIVED',
                                            'TRANSPORTING',
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                        completed={[
                                            'ARRIVED',
                                            'TRANSPORTING',
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                    />

                                    <TimelineItem
                                        title="Patient reached"
                                        description="Paramedic reaches the incident location."
                                        active={[
                                            'ARRIVED',
                                            'TRANSPORTING',
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                        completed={[
                                            'TRANSPORTING',
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                    />

                                    <TimelineItem
                                        title="Patient transporting"
                                        description="Patient is being transported to hospital."
                                        active={[
                                            'TRANSPORTING',
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                        completed={[
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                    />

                                    <TimelineItem
                                        title="Hospital arrival"
                                        description="Patient arrives at the hospital."
                                        active={[
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                        completed={[
                                            'ARRIVED_HOSPITAL',
                                            'COMPLETED',
                                        ].includes(missionStatus)}
                                    />

                                    <TimelineItem
                                        title="Emergency completed"
                                        description="Emergency coordination is closed."
                                        active={missionStatus === 'COMPLETED'}
                                        completed={missionStatus === 'COMPLETED'}
                                        last
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <Stethoscope className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Hospital preparation
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-muted)">
                                        Prepare emergency intake
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <PreparationItem
                                    icon={Bed}
                                    title="Emergency bed"
                                    description="Reserve appropriate emergency bed."
                                />

                                <PreparationItem
                                    icon={Activity}
                                    title="Emergency team"
                                    description="Notify appropriate clinical team."
                                />

                                <PreparationItem
                                    icon={Users}
                                    title="Blood / support"
                                    description="Prepare resources based on patient needs."
                                />
                            </div>
                        </section>

                        <section className="sj-card p-5">
                            <p className="text-sm font-black text-(--sj-text)">
                                Quick actions
                            </p>

                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl border border-(--sj-border) px-3 py-3 text-left text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                >
                                    <Phone className="h-4 w-4" />
                                    Call paramedic
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-xl border border-(--sj-border) px-3 py-3 text-left text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Message paramedic
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/hospital/ambulances',
                                        )
                                    }
                                    className="flex w-full items-center gap-3 rounded-xl border border-(--sj-border) px-3 py-3 text-left text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                >
                                    <Ambulance className="h-4 w-4" />
                                    View ambulance fleet
                                </button>
                            </div>
                        </section>

                        {missionStatus === 'ARRIVED_HOSPITAL' && (
                            <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Patient has arrived
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Confirm emergency intake and
                                            complete the coordination record
                                            when the clinical handoff is done.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={completeEmergency}
                                            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white transition hover:bg-emerald-700"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Complete emergency
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </main>

            {showAmbulanceSelector && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowAmbulanceSelector(false);
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl sm:max-w-2xl sm:rounded-3xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface)/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--sj-primary)">
                                    Ambulance dispatch
                                </p>

                                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                    Select ambulance
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAmbulanceSelector(false)
                                }
                                aria-label="Close ambulance selector"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) hover:text-(--sj-text)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 p-5 sm:p-6">
                            <div className="mb-4 rounded-xl bg-(--sj-primary)/5 p-4">
                                <p className="text-xs font-bold leading-5 text-(--sj-text-soft)">
                                    Recommended selection considers ambulance
                                    capability, current location and estimated
                                    arrival time.
                                </p>
                            </div>

                            {MOCK_AMBULANCES.map((ambulance) => (
                                <button
                                    key={ambulance.id}
                                    type="button"
                                    onClick={() =>
                                        assignAmbulance(ambulance)
                                    }
                                    className="flex w-full items-center gap-4 rounded-2xl border border-(--sj-border) p-4 text-left transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Ambulance className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-black text-(--sj-text)">
                                                {ambulance.id}
                                            </p>

                                            <span className="rounded-md bg-(--sj-surface-2) px-2 py-1 text-[9px] font-black text-(--sj-text-muted)">
                                                {ambulance.type}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            Paramedic: {ambulance.paramedic}
                                        </p>

                                        <div className="mt-2 flex gap-4 text-[11px] text-(--sj-text-muted)">
                                            <span>
                                                {ambulance.distance} away
                                            </span>

                                            <span>
                                                ETA {ambulance.eta}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <footer className="border-t border-(--sj-border) px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs text-(--sj-text-muted) sm:flex-row sm:items-center sm:justify-between">
                    <p>Sanjeevani AI · Active emergency coordination</p>

                    <p>
                        Emergency coordination access is restricted to
                        authorized hospital personnel.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function TimelineItem({
    title,
    description,
    active,
    completed,
    last = false,
}) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        completed
                            ? 'bg-(--sj-primary) text-white'
                            : active
                              ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                              : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                    }`}
                >
                    {completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <Clock3 className="h-4 w-4" />
                    )}
                </div>

                {!last && (
                    <div
                        className={`my-1 h-10 w-px ${
                            completed
                                ? 'bg-(--sj-primary)/40'
                                : 'bg-(--sj-border)'
                        }`}
                    />
                )}
            </div>

            <div className="min-w-0 pb-4">
                <p
                    className={`text-xs font-black ${
                        active
                            ? 'text-(--sj-text)'
                            : 'text-(--sj-text-muted)'
                    }`}
                >
                    {title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-(--sj-text-muted)">
                    {description}
                </p>
            </div>
        </div>
    );
}

function PreparationItem({ icon: Icon, title, description }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-(--sj-surface-2) p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface) text-(--sj-primary)">
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-black text-(--sj-text)">
                    {title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-(--sj-text-muted)">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default ActiveEmergency;