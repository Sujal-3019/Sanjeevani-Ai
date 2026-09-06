import React from 'react';
import {
    Activity,
    Ambulance,
    Bell,
    Bed,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Hospital,
    LogOut,
    MapPin,
    Menu,
    Moon,
    MoreHorizontal,
    Phone,
    ShieldCheck,
    Siren,
    Sun,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HospitalNavbar from '../../components/layout/HospitalNavbar';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo4.png';

const MOCK_HOSPITAL = {
    name: 'Sanjeevani Emergency Hospital',
    type: 'Multi-Specialty Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    status: 'PENDING',
    applicationId: 'HSP-2026-00421',
};

const MOCK_STATS = [
    {
        label: 'Emergency requests',
        value: '12',
        helper: 'Today',
        icon: Siren,
        tone: 'danger',
        path: '/dashboard/hospital/emergencies',
    },
    {
        label: 'Active emergencies',
        value: '3',
        helper: 'Currently',
        icon: Activity,
        tone: 'warning',
        path: '/dashboard/hospital/emergencies',
    },
    {
        label: 'Available ambulances',
        value: '5',
        helper: 'of 8 total',
        icon: Ambulance,
        tone: 'primary',
        path: '/dashboard/hospital/ambulances',
    },
    {
        label: 'Available paramedics',
        value: '9',
        helper: 'of 14 total',
        icon: Users,
        tone: 'info',
        path: '/dashboard/hospital/paramedics',
    },
];

const MOCK_EMERGENCIES = [
    {
        id: 'EM-2026-00131',
        patient: 'Emergency request',
        location: 'Connaught Place',
        severity: 'CRITICAL',
        time: '2 min ago',
        status: 'Awaiting response',
    },
    {
        id: 'EM-2026-00130',
        patient: 'Emergency request',
        location: 'Karol Bagh',
        severity: 'HIGH',
        time: '8 min ago',
        status: 'Ambulance assigned',
    },
    {
        id: 'EM-2026-00129',
        patient: 'Emergency request',
        location: 'Lajpat Nagar',
        severity: 'MODERATE',
        time: '18 min ago',
        status: 'Patient transported',
    },
];

const MOCK_AMBULANCES = [
    {
        id: 'AMB-042',
        type: 'ALS',
        driver: 'Rohan Mehta',
        status: 'On mission',
        location: 'Connaught Place',
    },
    {
        id: 'AMB-038',
        type: 'BLS',
        driver: 'Amit Kumar',
        status: 'Available',
        location: 'Hospital',
    },
    {
        id: 'AMB-031',
        type: 'ALS',
        driver: 'Neeraj Singh',
        status: 'Available',
        location: 'Hospital',
    },
];

const MOCK_ACTIVITY = [
    {
        icon: Ambulance,
        title: 'Ambulance AMB-042 assigned',
        description: 'Emergency EM-2026-00130',
        time: '8 min ago',
    },
    {
        icon: Users,
        title: 'Paramedic Rohan Mehta accepted mission',
        description: 'Emergency response initiated',
        time: '9 min ago',
    },
    {
        icon: Bell,
        title: 'New emergency request received',
        description: 'Location: Connaught Place',
        time: '12 min ago',
    },
    {
        icon: Bed,
        title: 'Capacity information updated',
        description: 'Emergency beds: 14 available',
        time: '32 min ago',
    },
];

const CAPACITY = [
    {
        label: 'Total beds',
        available: 46,
        total: 120,
    },
    {
        label: 'Emergency beds',
        available: 14,
        total: 24,
    },
    {
        label: 'ICU beds',
        available: 6,
        total: 18,
    },
    {
        label: 'Ventilators',
        available: 5,
        total: 12,
    },
];

const SERVICES = [
    '24×7 Emergency',
    'Trauma Care',
    'ICU',
    'NICU',
    'Cardiology',
    'Neurology',
];


function StatusBadge({ children, tone = 'success' }) {
    const toneClasses = {
        success:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        neutral: 'bg-(--sj-surface-2) text-(--sj-text-soft)',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${toneClasses[tone]}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    tone === 'danger'
                        ? 'bg-red-500'
                        : tone === 'warning'
                          ? 'bg-amber-500'
                          : tone === 'info'
                            ? 'bg-blue-500'
                            : tone === 'success'
                              ? 'bg-emerald-500'
                              : 'bg-(--sj-text-muted)'
                }`}
            />

            {children}
        </span>
    );
}

function HospitalDashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    const isDark = theme === 'dark';

    const handleSignOut = () => {
        window.location.href = '/';
    };

    const getEmergencySeverityTone = (severity) => {
        if (severity === 'CRITICAL') {
            return 'danger';
        }

        if (severity === 'HIGH') {
            return 'warning';
        }

        return 'info';
    };

    const getAmbulanceStatusTone = (status) => {
        if (status === 'Available') {
            return 'success';
        }

        if (status === 'On mission') {
            return 'warning';
        }

        return 'neutral';
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar/>

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                    <div className="min-w-0">
                        <div className="mb-6">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                Hospital command center
                            </p>

                            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <h1 className="text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                        Good afternoon, Admin
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                        Monitor emergency requests, ambulance
                                        operations and hospital capacity from
                                        one place.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="sj-live">
                                        <span className="sj-live-dot" />

                                        <span className="text-xs font-bold text-(--sj-text-soft)">
                                            System operational
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {MOCK_HOSPITAL.status !== 'VERIFIED' && (
                            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            <Clock3 className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-sm font-black text-(--sj-text)">
                                                    Hospital verification pending
                                                </h2>

                                                <StatusBadge tone="warning">
                                                    {MOCK_HOSPITAL.status}
                                                </StatusBadge>
                                            </div>

                                            <p className="mt-1 max-w-2xl text-xs leading-5 text-(--sj-text-soft)">
                                                Your hospital application is
                                                being reviewed by the Sanjeevani
                                                AI verification team. Live
                                                emergency coordination will
                                                become available after
                                                verification.
                                            </p>

                                            <p className="mt-2 text-[11px] font-bold text-(--sj-text-muted)">
                                                Application ID:{' '}
                                                <span className="text-(--sj-text)">
                                                    {
                                                        MOCK_HOSPITAL.applicationId
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-(--sj-surface) px-4 py-2.5 text-xs font-black text-(--sj-text) transition hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400"
                                    >
                                        View status
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Dashboard statistic navigation cards */}
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {MOCK_STATS.map((stat) => {
                                const Icon = stat.icon;

                                const iconTone =
                                    stat.tone === 'danger'
                                        ? 'bg-red-500/10 text-red-500'
                                        : stat.tone === 'warning'
                                          ? 'bg-amber-500/10 text-amber-500'
                                          : stat.tone === 'info'
                                            ? 'bg-blue-500/10 text-blue-500'
                                            : 'bg-(--sj-primary)/10 text-(--sj-primary)';

                                return (
                                    <Link
                                        key={stat.label}
                                        to={stat.path}
                                        className="sj-card group block p-5 transition hover:-translate-y-0.5 hover:border-(--sj-primary)/30 hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                                    {stat.label}
                                                </p>

                                                <p className="mt-3 text-3xl font-black tracking-tight text-(--sj-text)">
                                                    {stat.value}
                                                </p>

                                                <p className="mt-1 text-[11px] font-semibold text-(--sj-text-muted)">
                                                    {stat.helper}
                                                </p>
                                            </div>

                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-3">
                                            <span className="text-[10px] font-bold text-(--sj-text-muted)">
                                                Open module
                                            </span>

                                            <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5 group-hover:text-(--sj-primary)" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </section>

                        <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                            {/* Emergency requests */}
                            <div className="sj-card overflow-hidden">
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Emergency requests
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Latest requests requiring hospital
                                            attention
                                        </p>
                                    </div>

                                    <Link
                                        to="/dashboard/hospital/emergencies"
                                        className="hidden items-center gap-1 text-xs font-black text-(--sj-primary) sm:inline-flex"
                                    >
                                        View all
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="divide-y divide-(--sj-border)">
                                    {MOCK_EMERGENCIES.map((emergency) => (
                                        <button
                                            key={emergency.id}
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/hospital/emergencies/${emergency.id}`,
                                                )
                                            }
                                            className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-(--sj-surface-2)"
                                        >
                                            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 sm:flex">
                                                <Siren className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-black text-(--sj-text)">
                                                        {emergency.id}
                                                    </p>

                                                    <StatusBadge
                                                        tone={getEmergencySeverityTone(
                                                            emergency.severity,
                                                        )}
                                                    >
                                                        {emergency.severity}
                                                    </StatusBadge>
                                                </div>

                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--sj-text-muted)">
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {emergency.location}
                                                    </span>

                                                    <span>
                                                        {emergency.time}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xs font-bold text-(--sj-text-soft)">
                                                    {emergency.status}
                                                </p>
                                            </div>

                                            <ChevronRight className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-(--sj-border) px-5 py-4 sm:hidden">
                                    <Link
                                        to="/dashboard/hospital/emergencies"
                                        className="inline-flex items-center gap-1 text-xs font-black text-(--sj-primary)"
                                    >
                                        View all emergency requests
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Capacity */}
                            <Link
                                to="/dashboard/hospital/capacity"
                                className="sj-card group block p-5 transition hover:border-(--sj-primary)/30 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Hospital capacity
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Current availability
                                        </p>
                                    </div>

                                    <Bed className="h-5 w-5 text-(--sj-primary)" />
                                </div>

                                <div className="mt-6 space-y-5">
                                    {CAPACITY.map((item) => {
                                        const percentage = Math.round(
                                            (item.available / item.total) * 100,
                                        );

                                        return (
                                            <div key={item.label}>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-(--sj-text-soft)">
                                                        {item.label}
                                                    </span>

                                                    <span className="text-xs font-black text-(--sj-text)">
                                                        {item.available}/
                                                        {item.total}
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-(--sj-surface-2)">
                                                    <div
                                                        className="h-full rounded-full bg-(--sj-primary)"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-(--sj-border) pt-4">
                                    <span className="text-xs font-black text-(--sj-text-muted)">
                                        Manage capacity
                                    </span>

                                    <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5 group-hover:text-(--sj-primary)" />
                                </div>
                            </Link>
                        </section>

                        <section className="mt-6 grid gap-6 xl:grid-cols-2">
                            {/* Ambulances */}
                            <Link
                                to="/dashboard/hospital/ambulances"
                                className="sj-card group block overflow-hidden transition hover:border-(--sj-primary)/30 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Ambulance fleet
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Current ambulance operations
                                        </p>
                                    </div>

                                    <span className="text-xs font-black text-(--sj-primary)">
                                        Manage
                                    </span>
                                </div>

                                <div className="divide-y divide-(--sj-border)">
                                    {MOCK_AMBULANCES.map((ambulance) => (
                                        <div
                                            key={ambulance.id}
                                            className="flex items-center gap-4 px-5 py-4"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                <Ambulance className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-(--sj-text)">
                                                        {ambulance.id}
                                                    </p>

                                                    <span className="rounded-md bg-(--sj-surface-2) px-1.5 py-0.5 text-[9px] font-black text-(--sj-text-muted)">
                                                        {ambulance.type}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                                    {ambulance.driver} ·{' '}
                                                    {ambulance.location}
                                                </p>
                                            </div>

                                            <StatusBadge
                                                tone={getAmbulanceStatusTone(
                                                    ambulance.status,
                                                )}
                                            >
                                                {ambulance.status}
                                            </StatusBadge>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between border-t border-(--sj-border) px-5 py-4">
                                    <span className="text-xs font-black text-(--sj-text-muted)">
                                        Open ambulance management
                                    </span>

                                    <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5 group-hover:text-(--sj-primary)" />
                                </div>
                            </Link>

                            {/* Activity */}
                            <div className="sj-card overflow-hidden">
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Recent activity
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Latest operational events
                                        </p>
                                    </div>

                                    <MoreHorizontal className="h-5 w-5 text-(--sj-text-muted)" />
                                </div>

                                <div className="divide-y divide-(--sj-border)">
                                    {MOCK_ACTIVITY.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={`${item.title}-${item.time}`}
                                                className="flex gap-3 px-5 py-4"
                                            >
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface-2) text-(--sj-text-soft)">
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-black text-(--sj-text)">
                                                        {item.title}
                                                    </p>

                                                    <p className="mt-1 text-[11px] leading-5 text-(--sj-text-muted)">
                                                        {item.description}
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-bold text-(--sj-text-muted)">
                                                        {item.time}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        {/* Hospital profile card */}
                        <Link
                            to="/dashboard/hospital/settings"
                            className="sj-card group block overflow-hidden transition hover:border-(--sj-primary)/30 hover:shadow-lg"
                        >
                            <div className="border-b border-(--sj-border) bg-(--sj-primary)/5 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Hospital className="h-5 w-5" />
                                    </div>

                                    <StatusBadge tone="warning">
                                        {MOCK_HOSPITAL.status}
                                    </StatusBadge>
                                </div>

                                <h2 className="mt-4 text-lg font-black tracking-tight text-(--sj-text)">
                                    {MOCK_HOSPITAL.name}
                                </h2>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    {MOCK_HOSPITAL.type}
                                </p>

                                <div className="mt-3 flex items-center gap-1.5 text-xs text-(--sj-text-soft)">
                                    <MapPin className="h-3.5 w-3.5 text-(--sj-primary)" />
                                    {MOCK_HOSPITAL.city},{' '}
                                    {MOCK_HOSPITAL.state}
                                </div>
                            </div>

                            <div className="p-5">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                        Application ID
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-black text-(--sj-text)">
                                        {MOCK_HOSPITAL.applicationId}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-4">
                                    <span className="text-xs font-black text-(--sj-text-muted)">
                                        Open hospital profile
                                    </span>

                                    <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5 group-hover:text-(--sj-primary)" />
                                </div>
                            </div>
                        </Link>

                        {/* Verification */}
                        <Link
                            to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                            className="sj-card group block p-5 transition hover:border-amber-500/30 hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Verification
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Hospital application status
                                        </p>
                                    </div>
                                </div>

                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5" />
                            </div>

                            <div className="mt-4 rounded-xl bg-amber-500/5 p-3">
                                <p className="text-xs font-bold text-(--sj-text)">
                                    Application under review
                                </p>

                                <p className="mt-1 text-[11px] leading-5 text-(--sj-text-soft)">
                                    Live emergency coordination will become
                                    available after hospital verification.
                                </p>
                            </div>
                        </Link>

                        {/* Services */}
                        <Link
                            to="/dashboard/hospital/services"
                            className="sj-card group block p-5 transition hover:border-(--sj-primary)/30 hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Hospital services
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-muted)">
                                        Registered emergency capabilities
                                    </p>
                                </div>

                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-0.5 group-hover:text-(--sj-primary)" />
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {SERVICES.map((service) => (
                                    <span
                                        key={service}
                                        className="rounded-lg border border-(--sj-border) bg-(--sj-surface-2) px-2.5 py-1.5 text-[10px] font-bold text-(--sj-text-soft)"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </Link>

                        {/* Coordination */}
                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                    <Phone className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Emergency coordination
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-muted)">
                                        24×7 operational support
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl bg-(--sj-surface-2) p-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    Hospital emergency line
                                </p>

                                <p className="mt-1 text-sm font-black text-(--sj-text)">
                                    +91 11 4000 1122
                                </p>
                            </div>
                        </div>

                        {/* Capacity reminder */}
                        <Link
                            to="/dashboard/hospital/capacity"
                            className="group block rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-5 transition hover:border-(--sj-primary)/30"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Keep capacity updated
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Accurate bed, ICU and ambulance
                                        availability helps Sanjeevani AI make
                                        better emergency coordination
                                        decisions.
                                    </p>

                                    <div className="mt-3 flex items-center gap-1 text-xs font-black text-(--sj-primary)">
                                        Manage capacity
                                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-(--sj-border) px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs text-(--sj-text-muted) sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Sanjeevani AI · Hospital command center
                    </p>

                    <p>
                        Emergency coordination access is restricted to
                        authorized hospital personnel.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HospitalDashboard;