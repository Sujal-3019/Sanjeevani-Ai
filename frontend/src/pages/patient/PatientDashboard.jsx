import React from 'react';
import {
    Bell,
    ChevronRight,
    Clock3,
    FileHeart,
    History,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientHeader from './PatientHeader';
import { useTheme } from '../../context/ThemeContext';

const patient = {
    name: 'Aarav Sharma',
    city: 'New Delhi',
    state: 'Delhi',
};

const recentEmergencies = [
    {
        id: 'EM-2026-00124',
        date: '18 Aug 2026',
        type: 'Medical assistance',
        status: 'Completed',
    },
    {
        id: 'EM-2026-00098',
        date: '02 Jul 2026',
        type: 'Emergency consultation',
        status: 'Completed',
    },
];

function PatientDashboard() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="sanjeevani-page min-h-screen">
            {/* =========================================================
                HEADER
            ========================================================= */}
            <PatientHeader />

            <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
                {/* =====================================================
                    WELCOME
                ===================================================== */}
                <section className="mb-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                Patient dashboard
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                Good morning, {patient.name.split(' ')[0]}
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-(--sj-text-soft)">
                                Your emergency profile is ready. If you need
                                urgent assistance, Sanjeevani AI can coordinate
                                the emergency response.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-(--sj-text-muted)">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Emergency network available
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    SOS CARD
                ===================================================== */}
                <section className="relative mb-8 overflow-hidden rounded-3xl border border-red-500/15 bg-red-500/[0.035] p-6 sm:p-8">
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/4 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/6 px-3 py-1.5">
                                <span className="h-2 w-2 rounded-full bg-red-500" />

                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-600 dark:text-red-400">
                                    Emergency assistance
                                </span>
                            </div>

                            <h2 className="text-2xl font-black tracking-tight text-(--sj-text) sm:text-3xl">
                                Need emergency help?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                Press SOS when you need urgent medical
                                assistance. Your location can be shared with
                                the emergency coordination network.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-(--sj-text-muted)">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    Location enabled
                                </span>

                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Secure coordination
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0 lg:pr-4">
                            <Link
                                to="/dashboard/patient/emergency"
                                className="sj-sos-button w-full px-10 text-base sm:w-auto"
                            >
                                SEND SOS
                            </Link>

                            <p className="mt-3 text-center text-[11px] font-medium text-(--sj-text-muted)">
                                For genuine emergencies
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    QUICK ACTIONS
                ===================================================== */}
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-(--sj-text)">
                                Quick actions
                            </h2>

                            <p className="mt-1 text-xs text-(--sj-text-muted)">
                                Manage your emergency-ready information
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Link
                            to="/dashboard/patient/medical-profile"
                            className="sj-card-hover group p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <FileHeart className="h-5 w-5" />
                                </div>

                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-1 group-hover:text-(--sj-primary)" />
                            </div>

                            <h3 className="mt-5 text-sm font-black text-(--sj-text)">
                                Medical profile
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                View and update allergies, conditions,
                                medications and other medical information.
                            </p>
                        </Link>

                        <Link
                            to="/dashboard/patient/emergency-contacts"
                            className="sj-card-hover group p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Phone className="h-5 w-5" />
                                </div>

                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-1 group-hover:text-(--sj-primary)" />
                            </div>

                            <h3 className="mt-5 text-sm font-black text-(--sj-text)">
                                Emergency contacts
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Manage the people who may be contacted during
                                an emergency.
                            </p>
                        </Link>

                        <Link
                            to="/dashboard/patient/history"
                            className="sj-card-hover group p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <History className="h-5 w-5" />
                                </div>

                                <ChevronRight className="h-4 w-4 text-(--sj-text-muted) transition group-hover:translate-x-1 group-hover:text-(--sj-primary)" />
                            </div>

                            <h3 className="mt-5 text-sm font-black text-(--sj-text)">
                                Emergency history
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Review previous emergency requests and their
                                outcomes.
                            </p>
                        </Link>
                    </div>
                </section>

                {/* =====================================================
                    LOCATION + PROFILE STATUS
                ===================================================== */}
                <section className="mb-8 grid gap-5 lg:grid-cols-2">
                    {/* Location */}
                    <div className="sj-card p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <MapPin className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                            Saved location
                                        </p>

                                        <h2 className="mt-0.5 text-sm font-black text-(--sj-text)">
                                            {patient.city}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <span className="sj-status sj-status-success">
                                Available
                            </span>
                        </div>

                        <div className="mt-5 rounded-xl bg-(--sj-surface-2) p-4">
                            <p className="text-sm font-bold text-(--sj-text)">
                                {patient.city}, {patient.state}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                During an SOS, your current GPS location will
                                be used for emergency coordination.
                            </p>
                        </div>
                    </div>

                    {/* Profile status */}
                    <div className="sj-card p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                        Profile status
                                    </p>

                                    <h2 className="mt-0.5 text-sm font-black text-(--sj-text)">
                                        Emergency ready
                                    </h2>
                                </div>
                            </div>

                            <span className="sj-status sj-status-success">
                                Complete
                            </span>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="font-semibold text-(--sj-text-soft)">
                                    Profile completeness
                                </span>

                                <span className="font-black text-(--sj-primary)">
                                    100%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-(--sj-surface-2)">
                                <div className="h-full w-full rounded-full bg-(--sj-primary)" />
                            </div>

                            <Link
                                to="/dashboard/patient/medical-profile"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Review profile
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    RECENT EMERGENCIES
                ===================================================== */}
                <section className="mb-8">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-black text-(--sj-text)">
                                Recent emergencies
                            </h2>

                            <p className="mt-1 text-xs text-(--sj-text-muted)">
                                Your latest emergency coordination activity
                            </p>
                        </div>

                        <Link
                            to="/dashboard/patient/history"
                            className="text-xs font-bold text-(--sj-primary) hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="sj-card overflow-hidden">
                        {recentEmergencies.length > 0 ? (
                            <div className="divide-y divide-(--sj-border)">
                                {recentEmergencies.map((emergency) => (
                                    <div
                                        key={emergency.id}
                                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-surface-2) text-(--sj-text-soft)">
                                                <Clock3 className="h-4.5 w-4.5" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-(--sj-text)">
                                                    {emergency.type}
                                                </p>

                                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                                    {emergency.id} ·{' '}
                                                    {emergency.date}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="sj-status sj-status-success w-fit">
                                            {emergency.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--sj-surface-2) text-(--sj-text-muted)">
                                    <History className="h-5 w-5" />
                                </div>

                                <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                                    No emergency requests yet
                                </h3>

                                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-(--sj-text-muted)">
                                    Your completed emergency requests will
                                    appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* =====================================================
                    SAFETY MESSAGE
                ===================================================== */}
                <section className="sj-card p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-sm font-black text-(--sj-text)">
                                Keep your emergency profile updated
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Accurate medical information and emergency
                                contacts can help response teams coordinate
                                care more effectively.
                            </p>
                        </div>

                        <Link
                            to="/dashboard/patient/medical-profile"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            Manage profile
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>
            </main>

            {/* =========================================================
                MOBILE BOTTOM NAV
            ========================================================= */}
            <nav className="sticky bottom-0 z-30 border-t border-(--sj-border) bg-(--sj-bg)/95 px-4 py-3 backdrop-blur-xl sm:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
                    <Link
                        to="/dashboard/patient"
                        className="flex flex-col items-center gap-1 rounded-xl bg-(--sj-primary)/10 px-2 py-2 text-(--sj-primary)"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold">
                            Home
                        </span>
                    </Link>

                    <Link
                        to="/dashboard/patient/medical-profile"
                        className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                    >
                        <FileHeart className="h-4 w-4" />
                        <span className="text-[10px] font-bold">
                            Medical
                        </span>
                    </Link>

                    <Link
                        to="/dashboard/patient/history"
                        className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                    >
                        <History className="h-4 w-4" />
                        <span className="text-[10px] font-bold">
                            History
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-(--sj-text-muted) transition hover:text-(--sj-text)"
                    >
                        <UserRound className="h-4 w-4" />
                        <span className="text-[10px] font-bold">
                            Account
                        </span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default PatientDashboard;