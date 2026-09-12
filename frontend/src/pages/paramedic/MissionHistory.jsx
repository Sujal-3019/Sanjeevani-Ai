import React, { useMemo, useState } from 'react';
import {
    Ambulance,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Hospital,
    MapPin,
    Search,
    Siren,
    UserRound,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
};

const INITIAL_MISSIONS = [
    {
        id: 'EM-2026-00131',
        date: '18 Sep 2026',
        time: '10:42 AM',
        severity: 'CRITICAL',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Connaught Place',
        pickupAddress: 'Near Rajiv Chowk Metro Station',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '8.2 km',
        responseTime: '6 min',
        transportTime: '11 min',
        totalTime: '24 min',
        ambulanceId: 'AMB-042',
        notes: 'Patient transported successfully to emergency department.',
    },
    {
        id: 'EM-2026-00124',
        date: '17 Sep 2026',
        time: '07:18 PM',
        severity: 'HIGH',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Karol Bagh',
        pickupAddress: 'Near Pusa Road',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '9.6 km',
        responseTime: '8 min',
        transportTime: '13 min',
        totalTime: '29 min',
        ambulanceId: 'AMB-042',
        notes: 'Patient handed over to hospital emergency team.',
    },
    {
        id: 'EM-2026-00118',
        date: '16 Sep 2026',
        time: '02:35 PM',
        severity: 'MODERATE',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Patel Nagar',
        pickupAddress: 'Main Market Road',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '6.4 km',
        responseTime: '7 min',
        transportTime: '9 min',
        totalTime: '21 min',
        ambulanceId: 'AMB-042',
        notes: 'Patient transferred to hospital for further assessment.',
    },
    {
        id: 'EM-2026-00109',
        date: '15 Sep 2026',
        time: '11:12 AM',
        severity: 'HIGH',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Rajendra Place',
        pickupAddress: 'Near Metro Station',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '7.8 km',
        responseTime: '9 min',
        transportTime: '10 min',
        totalTime: '25 min',
        ambulanceId: 'AMB-042',
        notes: 'Emergency transport completed without incident.',
    },
    {
        id: 'EM-2026-00098',
        date: '13 Sep 2026',
        time: '08:46 PM',
        severity: 'CRITICAL',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'India Gate',
        pickupAddress: 'Near C-Hexagon',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '10.1 km',
        responseTime: '5 min',
        transportTime: '14 min',
        totalTime: '27 min',
        ambulanceId: 'AMB-042',
        notes: 'Critical patient delivered to emergency department.',
    },
    {
        id: 'EM-2026-00091',
        date: '12 Sep 2026',
        time: '04:22 PM',
        severity: 'MODERATE',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Lajpat Nagar',
        pickupAddress: 'Central Market',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '12.4 km',
        responseTime: '10 min',
        transportTime: '17 min',
        totalTime: '34 min',
        ambulanceId: 'AMB-042',
        notes: 'Patient safely transported and handed over to hospital staff.',
    },
    {
        id: 'EM-2026-00083',
        date: '10 Sep 2026',
        time: '09:05 AM',
        severity: 'HIGH',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'South Extension',
        pickupAddress: 'Near Ring Road',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '11.2 km',
        responseTime: '8 min',
        transportTime: '15 min',
        totalTime: '31 min',
        ambulanceId: 'AMB-042',
        notes: 'Patient transported for urgent medical evaluation.',
    },
    {
        id: 'EM-2026-00076',
        date: '08 Sep 2026',
        time: '06:31 PM',
        severity: 'CRITICAL',
        status: 'COMPLETED',
        patient: 'Emergency patient',
        pickupArea: 'Greater Kailash',
        pickupAddress: 'M Block Market',
        destination: 'Sanjeevani Emergency Hospital',
        totalDistance: '13.7 km',
        responseTime: '6 min',
        transportTime: '18 min',
        totalTime: '36 min',
        ambulanceId: 'AMB-042',
        notes: 'Critical emergency completed successfully.',
    },
];

const SEVERITY_OPTIONS = [
    'ALL',
    'CRITICAL',
    'HIGH',
    'MODERATE',
];

const getSeverityClasses = (severity) => {
    switch (severity) {
        case 'CRITICAL':
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';

        case 'HIGH':
            return 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300';

        case 'MODERATE':
            return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-300';

        default:
            return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
};

const MissionHistory = () => {
    const navigate = useNavigate();

    const [missions] = useState(INITIAL_MISSIONS);
    const [search, setSearch] = useState('');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [selectedMission, setSelectedMission] = useState(null);

    const filteredMissions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return missions.filter((mission) => {
            const matchesSearch =
                !normalizedSearch ||
                mission.id.toLowerCase().includes(normalizedSearch) ||
                mission.pickupArea.toLowerCase().includes(normalizedSearch) ||
                mission.destination.toLowerCase().includes(normalizedSearch) ||
                mission.severity.toLowerCase().includes(normalizedSearch);

            const matchesSeverity =
                severityFilter === 'ALL' ||
                mission.severity === severityFilter;

            return matchesSearch && matchesSeverity;
        });
    }, [missions, search, severityFilter]);

    const stats = useMemo(() => {
        const completed = missions.filter(
            (mission) => mission.status === 'COMPLETED',
        );

        const totalDistance = completed.reduce((sum, mission) => {
            return sum + Number.parseFloat(mission.totalDistance);
        }, 0);

        const totalMinutes = completed.reduce((sum, mission) => {
            return sum + Number.parseFloat(mission.totalTime);
        }, 0);

        const critical = completed.filter(
            (mission) => mission.severity === 'CRITICAL',
        ).length;

        return {
            completed: completed.length,
            critical,
            distance: totalDistance.toFixed(1),
            averageTime: completed.length
                ? Math.round(totalMinutes / completed.length)
                : 0,
        };
    }, [missions]);

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/paramedic')
                            }
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--sj-primary)">
                                Operations
                            </p>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-(--sj-text) sm:text-3xl">
                                Mission History
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                Review completed emergency missions,
                                response performance, and transport details.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2.5">
                        <Ambulance
                            size={17}
                            className="text-(--sj-primary)"
                        />

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Assigned ambulance
                            </p>

                            <p className="text-xs font-bold text-(--sj-text)">
                                {MOCK_PARAMEDIC.ambulanceId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Completed missions
                                </p>

                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {stats.completed}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <CheckCircle2 size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Successfully completed emergency transports
                        </p>
                    </article>

                    <article className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Critical missions
                                </p>

                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {stats.critical}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                <Siren size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Critical severity emergencies handled
                        </p>
                    </article>

                    <article className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Distance covered
                                </p>

                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {stats.distance}
                                    <span className="ml-1 text-base font-bold text-(--sj-text-soft)">
                                        km
                                    </span>
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <MapPin size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Total recorded mission distance
                        </p>
                    </article>

                    <article className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Average mission time
                                </p>

                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {stats.averageTime}
                                    <span className="ml-1 text-base font-bold text-(--sj-text-soft)">
                                        min
                                    </span>
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Clock3 size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Average end-to-end emergency duration
                        </p>
                    </article>
                </section>

                {/* Filters */}
                <section className="sj-card mb-6 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-md">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--sj-text-muted)"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search mission ID, area, hospital..."
                                className="sj-input pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 text-xs font-bold text-(--sj-text-muted)">
                                Severity:
                            </span>

                            {SEVERITY_OPTIONS.map((severity) => (
                                <button
                                    key={severity}
                                    type="button"
                                    onClick={() =>
                                        setSeverityFilter(severity)
                                    }
                                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                                        severityFilter === severity
                                            ? 'bg-(--sj-primary) text-white'
                                            : 'border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) hover:border-(--sj-primary) hover:text-(--sj-primary)'
                                    }`}
                                >
                                    {severity === 'ALL'
                                        ? 'All'
                                        : severity}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Desktop table */}
                <section className="sj-card hidden overflow-hidden lg:block">
                    <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-(--sj-text)">
                                Completed missions
                            </h2>

                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                {filteredMissions.length} mission
                                {filteredMissions.length === 1 ? '' : 's'}{' '}
                                found
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-(--sj-text-soft)">
                            <CalendarDays size={15} />
                            Recent activity
                        </div>
                    </div>

                    {filteredMissions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-250">
                                <thead>
                                    <tr className="border-b border-(--sj-border) bg-(--sj-surface-2)/60">
                                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Mission
                                        </th>

                                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Pickup
                                        </th>

                                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Severity
                                        </th>

                                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Distance
                                        </th>

                                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Duration
                                        </th>

                                        <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredMissions.map((mission) => (
                                        <tr
                                            key={mission.id}
                                            className="border-b border-(--sj-border) last:border-b-0 hover:bg-(--sj-surface-2)/40"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                                        <Siren size={16} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-(--sj-text)">
                                                            {mission.id}
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-(--sj-text-soft)">
                                                            {mission.date} •{' '}
                                                            {mission.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-xs font-bold text-(--sj-text)">
                                                        {mission.pickupArea}
                                                    </p>

                                                    <p className="mt-0.5 max-w-55 truncate text-[11px] text-(--sj-text-soft)">
                                                        {mission.pickupAddress}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${getSeverityClasses(
                                                        mission.severity,
                                                    )}`}
                                                >
                                                    {mission.severity}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-xs font-bold text-(--sj-text)">
                                                    {mission.totalDistance}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-(--sj-text-soft)">
                                                    total route
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-xs font-bold text-(--sj-text)">
                                                    {mission.totalTime}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-(--sj-text-soft)">
                                                    response{' '}
                                                    {mission.responseTime}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedMission(
                                                            mission,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                                >
                                                    <Eye size={15} />
                                                    View details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </section>

                {/* Mobile cards */}
                <section className="space-y-4 lg:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-(--sj-text)">
                                Completed missions
                            </h2>

                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                {filteredMissions.length} result
                                {filteredMissions.length === 1 ? '' : 's'}
                            </p>
                        </div>
                    </div>

                    {filteredMissions.length > 0 ? (
                        filteredMissions.map((mission) => (
                            <article
                                key={mission.id}
                                className="sj-card overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                                <Siren size={18} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-(--sj-text)">
                                                    {mission.id}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-(--sj-text-soft)">
                                                    {mission.date} •{' '}
                                                    {mission.time}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getSeverityClasses(
                                                mission.severity,
                                            )}`}
                                        >
                                            {mission.severity}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                                <MapPin size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                                    Pickup
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                {mission.pickupArea}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                                <Clock3 size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                                    Duration
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                {mission.totalTime}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 rounded-xl border border-(--sj-border) p-3">
                                        <div className="flex items-start gap-2">
                                            <Hospital
                                                size={15}
                                                className="mt-0.5 shrink-0 text-(--sj-primary)"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                                    Destination
                                                </p>

                                                <p className="mt-1 truncate text-xs font-bold text-(--sj-text)">
                                                    {mission.destination}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-(--sj-border) bg-(--sj-surface-2)/40 p-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedMission(mission)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                    >
                                        <Eye size={15} />
                                        View mission details
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </section>
            </main>

            {/* Mission details modal */}
            {selectedMission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                        <div className="flex items-start justify-between border-b border-(--sj-border) px-5 py-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        {selectedMission.id}
                                    </h2>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        COMPLETED
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    {selectedMission.date} •{' '}
                                    {selectedMission.time}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedMission(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">
                            {/* Emergency summary */}
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <Siren
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <h3 className="text-sm font-bold text-(--sj-text)">
                                        Emergency summary
                                    </h3>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoItem
                                        label="Severity"
                                        value={
                                            selectedMission.severity
                                        }
                                    />

                                    <InfoItem
                                        label="Patient"
                                        value={selectedMission.patient}
                                    />

                                    <InfoItem
                                        label="Pickup area"
                                        value={selectedMission.pickupArea}
                                    />

                                    <InfoItem
                                        label="Pickup address"
                                        value={
                                            selectedMission.pickupAddress
                                        }
                                    />
                                </div>
                            </section>

                            {/* Route */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <RouteIcon />

                                    <h3 className="text-sm font-bold text-(--sj-text)">
                                        Transport route
                                    </h3>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <div className="relative">
                                        <div className="absolute bottom-4 left-1.75 top-5 w-px bg-(--sj-border)" />

                                        <div className="relative flex gap-3">
                                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-(--sj-primary) bg-(--sj-surface)">
                                                <span className="h-1.5 w-1.5 rounded-full bg-(--sj-primary)" />
                                            </div>

                                            <div className="pb-5">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                                    Pickup
                                                </p>

                                                <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                    {selectedMission.pickupArea}
                                                </p>

                                                <p className="mt-1 text-[11px] text-(--sj-text-soft)">
                                                    {selectedMission.pickupAddress}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative flex gap-3">
                                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-(--sj-primary) text-white">
                                                <Hospital size={9} />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                                    Destination
                                                </p>

                                                <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                    {selectedMission.destination}
                                                </p>

                                                <p className="mt-1 text-[11px] text-(--sj-text-soft)">
                                                    Emergency Department
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Performance */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <Clock3
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <h3 className="text-sm font-bold text-(--sj-text)">
                                        Mission performance
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <Metric
                                        label="Response"
                                        value={
                                            selectedMission.responseTime
                                        }
                                    />

                                    <Metric
                                        label="Transport"
                                        value={
                                            selectedMission.transportTime
                                        }
                                    />

                                    <Metric
                                        label="Total time"
                                        value={
                                            selectedMission.totalTime
                                        }
                                    />

                                    <Metric
                                        label="Distance"
                                        value={
                                            selectedMission.totalDistance
                                        }
                                    />
                                </div>
                            </section>

                            {/* Assignment */}
                            <section className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <Ambulance
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <h3 className="text-sm font-bold text-(--sj-text)">
                                        Mission assignment
                                    </h3>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoItem
                                        label="Paramedic"
                                        value={MOCK_PARAMEDIC.name}
                                    />

                                    <InfoItem
                                        label="Ambulance"
                                        value={
                                            selectedMission.ambulanceId
                                        }
                                    />
                                </div>
                            </section>

                            {/* Notes */}
                            <section className="mt-6 rounded-2xl bg-(--sj-surface-2) p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Mission notes
                                </p>

                                <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                                    {selectedMission.notes}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ label, value }) => {
    return (
        <div className="rounded-xl bg-(--sj-surface-2) p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                {label}
            </p>

            <p className="mt-1 text-xs font-bold leading-5 text-(--sj-text)">
                {value}
            </p>
        </div>
    );
};

const Metric = ({ label, value }) => {
    return (
        <div className="rounded-xl border border-(--sj-border) p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-(--sj-text)">
                {value}
            </p>
        </div>
    );
};

const RouteIcon = () => {
    return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-(--sj-primary-soft) text-(--sj-primary)">
            <MapPin size={13} />
        </div>
    );
};

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-surface-2) text-(--sj-text-muted)">
                <Search size={24} />
            </div>

            <h3 className="mt-4 text-base font-bold text-(--sj-text)">
                No missions found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-(--sj-text-soft)">
                Try changing your search term or severity filter to find
                completed missions.
            </p>
        </div>
    );
};

export default MissionHistory;