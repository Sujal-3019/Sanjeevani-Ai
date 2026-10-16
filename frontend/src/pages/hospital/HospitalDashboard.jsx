
import React, { useCallback, useEffect, useState } from 'react';
import {
    Activity,
    Ambulance,
    ArrowUpRight,
    Bed,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Hospital as HospitalIcon,
    MapPin,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    Siren,
    Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import HospitalNavbar from '../../components/layout/HospitalNavbar';
import hospitalService from '../../services/hospitalService';

const STATUS_CONFIG = {
    VERIFIED: {
        label: 'Verified',
        tone: 'emerald',
        icon: CheckCircle2,
        description:
            'Your hospital is verified. Emergency eligibility is confirmed by the backend.',
    },
    PENDING: {
        label: 'Pending review',
        tone: 'amber',
        icon: Clock3,
        description:
            'Your hospital application is awaiting verification. Live emergency coordination is unavailable until approval.',
    },
    REJECTED: {
        label: 'Verification rejected',
        tone: 'red',
        icon: ShieldAlert,
        description:
            'Review the rejection reason, update your hospital details, and resubmit for verification.',
    },
};

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: status || 'Unknown',
        tone: 'slate',
        icon: ShieldAlert,
    };

    const Icon = config.icon;

    const tones = {
        emerald:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        amber:
            'bg-amber-500/10 text-amber-700 dark:text-amber-400',
        red: 'bg-red-500/10 text-red-600 dark:text-red-400',
        slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${tones[config.tone]}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}

function StatCard({ label, value, helper, icon: Icon, to }) {
    const content = (
        <div className="sj-card h-full p-5 transition hover:border-(--sj-primary)/30">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--sj-text-muted)">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-(--sj-text)">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                        {helper}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {to && (
                <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-3">
                    <span className="text-xs font-bold text-(--sj-text-muted)">
                        Manage
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-(--sj-primary)" />
                </div>
            )}
        </div>
    );

    return to ? (
        <Link to={to} className="block">
            {content}
        </Link>
    ) : (
        content
    );
}

function CapacityBar({ label, available, total }) {
    const percentage =
        total > 0
            ? Math.min(100, Math.round((available / total) * 100))
            : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-(--sj-text-soft)">
                    {label}
                </span>
                <span className="text-sm font-black text-(--sj-text)">
                    {available} / {total}
                </span>
            </div>

            <div
                className="h-2.5 overflow-hidden rounded-full bg-(--sj-surface-2)"
                role="progressbar"
                aria-label={`${label} available`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={available}
            >
                <div
                    className="h-full rounded-full bg-(--sj-primary) transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="mt-1 text-right text-xs text-(--sj-text-muted)">
                {percentage}% available
            </p>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar />
            <main className="mx-auto max-w-375 px-4 py-10 sm:px-6 lg:px-8">
                <div className="sj-card flex min-h-64 flex-col items-center justify-center p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-(--sj-primary)" />
                    <h1 className="mt-4 text-lg font-black text-(--sj-text)">
                        Loading hospital dashboard
                    </h1>
                    <p className="mt-2 text-sm text-(--sj-text-muted)">
                        Fetching your hospital information securely.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default function HospitalDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const [dashboardData, profileData] = await Promise.all([
                hospitalService.getDashboard(),
                hospitalService.getProfile(),
            ]);

            setDashboard(dashboardData);
            setProfile(profileData);
        } catch (err) {
            setDashboard(null);
            setProfile(null);
            setError(
                err.message ||
                    'Unable to load your hospital information. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        const profileMissing =
            error.toLowerCase().includes('no hospital is registered');

        return (
            <div className="sanjeevani-page min-h-screen">
                <HospitalNavbar />

                <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                    <div className="sj-card p-6 sm:p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                            <ShieldAlert className="h-6 w-6" />
                        </div>

                        <h1 className="mt-5 text-2xl font-black text-(--sj-text)">
                            {profileMissing
                                ? 'Complete your hospital profile'
                                : 'Unable to load dashboard'}
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            {profileMissing
                                ? 'Your Hospital Admin account is signed in, but no hospital profile is linked to it yet.'
                                : error}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {profileMissing ? (
                                <Link
                                    to="/register/hospital/profile"
                                    className="inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-bold text-white"
                                >
                                    Set up hospital profile
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={loadDashboard}
                                    className="inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-bold text-white"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const status = dashboard?.verification_status || 'PENDING';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

    const canReceiveEmergencies =
        dashboard?.can_receive_emergencies === true;

    const capacityItems = [
        {
            label: 'Total beds',
            available: Number(dashboard?.available_beds ?? 0),
            total: Number(dashboard?.total_beds ?? 0),
        },
        {
            label: 'ICU beds',
            available: Number(dashboard?.icu_beds ?? 0),
            total: Number(dashboard?.icu_beds ?? 0),
        },
    ];

    const firstName =
        profile?.name?.trim() || dashboard?.hospital_name || 'Hospital Admin';

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar />

            <main className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                            Hospital command center
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-tight text-(--sj-text) sm:text-4xl">
                            Welcome to your dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                            Manage hospital details, monitor capacity, and
                            prepare for emergency coordination.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-bold text-(--sj-text) transition hover:border-(--sj-primary)/40 sm:self-auto"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh data
                    </button>
                </div>

                <section className="sj-card mb-6 overflow-hidden">
                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <Building2 className="h-7 w-7" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-(--sj-text-muted)">
                                    Registered hospital
                                </p>

                                <h2 className="mt-1 wrap-break-words text-xl font-black text-(--sj-text) sm:text-2xl">
                                    {dashboard?.hospital_name || profile?.name || 'Your hospital'}
                                </h2>

                                <p className="mt-2 flex items-center gap-1.5 text-sm text-(--sj-text-soft)">
                                    <MapPin className="h-4 w-4 shrink-0 text-(--sj-primary)" />
                                    {[profile?.city, profile?.state]
                                        .filter(Boolean)
                                        .join(', ') || 'Location not available'}
                                </p>
                            </div>
                        </div>

                        <StatusBadge status={status} />
                    </div>

                    <div className="border-t border-(--sj-border) bg-(--sj-surface-2)/50 px-5 py-4 sm:px-6">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-(--sj-text)">
                                    {statusConfig.label}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                    {statusConfig.description}
                                </p>

                                {status === 'REJECTED' &&
                                    dashboard?.rejection_reason && (
                                        <p className="mt-3 rounded-lg bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
                                            <strong>Reason:</strong>{' '}
                                            {dashboard.rejection_reason}
                                        </p>
                                    )}
                            </div>

                            <Link
                                to="/verification/hospital"
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-(--sj-primary)"
                            >
                                Details
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total beds"
                        value={dashboard?.total_beds ?? '—'}
                        helper="Registered capacity"
                        icon={Bed}
                        to="/dashboard/hospital/capacity"
                    />

                    <StatCard
                        label="Available beds"
                        value={dashboard?.available_beds ?? '—'}
                        helper="Current reported availability"
                        icon={Activity}
                        to="/dashboard/hospital/capacity"
                    />

                    <StatCard
                        label="ICU beds"
                        value={dashboard?.icu_beds ?? '—'}
                        helper="Reported ICU capacity"
                        icon={HospitalIcon}
                        to="/dashboard/hospital/capacity"
                    />

                    <StatCard
                        label="Emergency access"
                        value={canReceiveEmergencies ? 'Enabled' : 'Restricted'}
                        helper={
                            canReceiveEmergencies
                                ? 'Hospital verification confirmed'
                                : 'Requires hospital verification'
                        }
                        icon={canReceiveEmergencies ? CheckCircle2 : ShieldAlert}
                    />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="sj-card p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-black text-(--sj-text)">
                                    Hospital capacity
                                </h2>
                                <p className="mt-1 text-sm text-(--sj-text-muted)">
                                    Data reported by your hospital profile
                                </p>
                            </div>
                            <Bed className="h-5 w-5 text-(--sj-primary)" />
                        </div>

                        <div className="mt-6 space-y-6">
                            {capacityItems.map((item) => (
                                <CapacityBar
                                    key={item.label}
                                    label={item.label}
                                    available={item.available}
                                    total={item.total}
                                />
                            ))}
                        </div>

                        <Link
                            to="/dashboard/hospital/capacity"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-(--sj-primary)"
                        >
                            Manage capacity
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="sj-card p-5 sm:p-6">
                        <h2 className="text-lg font-black text-(--sj-text)">
                            Quick actions
                        </h2>
                        <p className="mt-1 text-sm text-(--sj-text-muted)">
                            Manage your hospital setup and operations.
                        </p>

                        <div className="mt-5 space-y-3">
                            <Link
                                to="/dashboard/hospital/settings"
                                className="flex items-center gap-3 rounded-xl border border-(--sj-border) p-4 transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)"
                            >
                                <Building2 className="h-5 w-5 text-(--sj-primary)" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-(--sj-text)">
                                        Hospital profile
                                    </span>
                                    <span className="mt-1 block text-xs text-(--sj-text-muted)">
                                        Review and update registered details
                                    </span>
                                </span>
                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted)" />
                            </Link>

                            <Link
                                to="/dashboard/hospital/ambulances"
                                className="flex items-center gap-3 rounded-xl border border-(--sj-border) p-4 transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)"
                            >
                                <Ambulance className="h-5 w-5 text-(--sj-primary)" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-(--sj-text)">
                                        Ambulance fleet
                                    </span>
                                    <span className="mt-1 block text-xs text-(--sj-text-muted)">
                                        Open ambulance management
                                    </span>
                                </span>
                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted)" />
                            </Link>

                            <Link
                                to="/dashboard/hospital/paramedics"
                                className="flex items-center gap-3 rounded-xl border border-(--sj-border) p-4 transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)"
                            >
                                <Users className="h-5 w-5 text-(--sj-primary)" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-(--sj-text)">
                                        Paramedics
                                    </span>
                                    <span className="mt-1 block text-xs text-(--sj-text-muted)">
                                        Open paramedic management
                                    </span>
                                </span>
                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted)" />
                            </Link>

                            <Link
                                to="/dashboard/hospital/emergencies"
                                onClick={(event) => {
                                    if (!canReceiveEmergencies) {
                                        event.preventDefault();
                                    }
                                }}
                                aria-disabled={!canReceiveEmergencies}
                                className={`flex items-center gap-3 rounded-xl border border-(--sj-border) p-4 ${
                                    canReceiveEmergencies
                                        ? 'transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)'
                                        : 'cursor-not-allowed opacity-50'
                                }`}
                            >
                                <Siren className="h-5 w-5 text-(--sj-primary)" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-bold text-(--sj-text)">
                                        Emergency requests
                                    </span>
                                    <span className="mt-1 block text-xs text-(--sj-text-muted)">
                                        {canReceiveEmergencies
                                            ? 'Open emergency coordination'
                                            : 'Available after hospital verification'}
                                    </span>
                                </span>
                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted)" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface-2)/50 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />
                        <div>
                            <h2 className="text-sm font-black text-(--sj-text)">
                                Accurate information matters
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                Keep your bed capacity and hospital profile
                                current. Ambulance availability, paramedic
                                counts, and live emergency statistics will be
                                displayed here once their backend endpoints are
                                connected.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="mt-8 border-t border-(--sj-border) py-5 text-xs text-(--sj-text-muted)">
                    Sanjeevani AI · Hospital command center
                </footer>
            </main>
        </div>
    );
}
