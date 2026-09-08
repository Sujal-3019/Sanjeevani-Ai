import React, { useState } from 'react';
import {
    Ambulance,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Hospital,
    MapPin,
    Navigation,
    Phone,
    ShieldCheck,
    Siren,
    Stethoscope,
    UserRound,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
};

const MOCK_MISSION = {
    id: 'EM-2026-00131',
    severity: 'CRITICAL',
    patient: 'Emergency patient',
    incidentArea: 'Connaught Place',
    incidentCity: 'New Delhi',
    distanceToPatient: '2.4 km',
    etaToPatient: '6 min',
    destination: 'Sanjeevani Emergency Hospital',
    hospitalDistance: '5.8 km',
    hospitalEta: '12 min',
    status: 'READY_FOR_PICKUP',
};

const MOCK_STATS = {
    completedToday: 3,
    completedMonth: 47,
    responseTime: '8.4 min',
};

function getSeverityClasses(severity) {
    if (severity === 'CRITICAL') {
        return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
    }

    if (severity === 'HIGH') {
        return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400';
    }

    return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
}

export default function ParamedicDashboard() {
    const navigate = useNavigate();

    const [isOnline, setIsOnline] = useState(true);
    const [showContactMessage, setShowContactMessage] =
        useState(false);

    const handleContactHospital = () => {
        setShowContactMessage(true);

        window.setTimeout(() => {
            setShowContactMessage(false);
        }, 2500);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--sj-primary)">
                            <Stethoscope size={15} />
                            Paramedic command center
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-(--sj-text) sm:text-3xl">
                            Good morning, {MOCK_PARAMEDIC.name.split(' ')[0]}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                            Monitor your ambulance, stay ready for emergency
                            missions, and respond quickly when a patient needs
                            assistance.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div
                            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                                isOnline
                                    ? 'border-(--sj-primary)/30 bg-(--sj-primary-soft) text-(--sj-primary)'
                                    : 'border-red-500/30 bg-red-500/10 text-red-500'
                            }`}
                        >
                            {isOnline ? (
                                <Wifi size={17} />
                            ) : (
                                <WifiOff size={17} />
                            )}

                            {isOnline
                                ? 'Available for missions'
                                : 'Offline'}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsOnline((current) => !current)
                            }
                            className="rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-semibold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        >
                            {isOnline ? 'Go offline' : 'Go online'}
                        </button>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-(--sj-text-muted)">
                                    Ambulance
                                </p>

                                <p className="mt-2 text-xl font-bold text-(--sj-text)">
                                    {MOCK_PARAMEDIC.ambulanceId}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Ambulance size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            {MOCK_PARAMEDIC.ambulanceType}
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-(--sj-text-muted)">
                                    Missions today
                                </p>

                                <p className="mt-2 text-xl font-bold text-(--sj-text)">
                                    {MOCK_STATS.completedToday}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <CheckCircle2 size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Successfully completed
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-(--sj-text-muted)">
                                    Monthly missions
                                </p>

                                <p className="mt-2 text-xl font-bold text-(--sj-text)">
                                    {MOCK_STATS.completedMonth}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Siren size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Current month
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-(--sj-text-muted)">
                                    Avg. response time
                                </p>

                                <p className="mt-2 text-xl font-bold text-(--sj-text)">
                                    {MOCK_STATS.responseTime}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Clock3 size={19} />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                            Recent completed missions
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <div className="sj-card overflow-hidden">
                        <div className="flex flex-col gap-4 border-b border-(--sj-border) p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="sj-live-dot" />

                                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-primary)">
                                        Active mission
                                    </span>
                                </div>

                                <h2 className="mt-2 text-lg font-bold text-(--sj-text)">
                                    Emergency pickup assigned
                                </h2>
                            </div>

                            <span
                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold ${getSeverityClasses(
                                    MOCK_MISSION.severity,
                                )}`}
                            >
                                {MOCK_MISSION.severity}
                            </span>
                        </div>

                        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                        <Siren size={21} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-(--sj-text-muted)">
                                            Emergency ID
                                        </p>

                                        <p className="text-sm font-bold text-(--sj-text)">
                                            {MOCK_MISSION.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary-soft) text-(--sj-primary)">
                                            <MapPin size={17} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-(--sj-text-muted)">
                                                Patient pickup
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {MOCK_MISSION.incidentArea}
                                            </p>

                                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                {MOCK_MISSION.incidentCity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary-soft) text-(--sj-primary)">
                                            <Hospital size={17} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-(--sj-text-muted)">
                                                Destination hospital
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {MOCK_MISSION.destination}
                                            </p>

                                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                {MOCK_MISSION.hospitalDistance}{' '}
                                                ·{' '}
                                                {MOCK_MISSION.hospitalEta}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                        <p className="text-xs text-(--sj-text-muted)">
                                            Distance to patient
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-(--sj-text)">
                                            {MOCK_MISSION.distanceToPatient}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                        <p className="text-xs text-(--sj-text-muted)">
                                            Estimated arrival
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-(--sj-primary)">
                                            {MOCK_MISSION.etaToPatient}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/paramedic/emergency/${MOCK_MISSION.id}`,
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark)"
                                    >
                                        Open emergency
                                        <ArrowUpRight size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/paramedic/navigation/${MOCK_MISSION.id}`,
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3 text-sm font-semibold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                                    >
                                        <Navigation size={17} />
                                        Start navigation
                                    </button>
                                </div>
                            </div>

                            <div className="sj-map min-h-65 overflow-hidden rounded-2xl">
                                <div className="sj-map-grid h-full min-h-65 p-5">
                                    <div className="relative flex h-full items-center justify-center">
                                        <div className="absolute h-40 w-40 rounded-full border border-(--sj-primary)/20" />

                                        <div className="absolute h-24 w-24 rounded-full border border-(--sj-primary)/30" />

                                        <div className="absolute left-[22%] top-[26%] flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                                            <MapPin size={19} />
                                        </div>

                                        <div className="absolute right-[18%] bottom-[24%] flex h-10 w-10 items-center justify-center rounded-full bg-(--sj-primary) text-white shadow-lg">
                                            <Ambulance size={19} />
                                        </div>

                                        <div className="absolute left-[28%] top-[36%] h-0.5 w-[48%] rotate-18 bg-(--sj-primary) opacity-60" />

                                        <div className="absolute bottom-4 left-4 rounded-lg border border-(--sj-border) bg-(--sj-surface)/90 px-3 py-2 backdrop-blur">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                                Live route
                                            </p>

                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                Fastest route
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="sj-card p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-(--sj-primary)">
                                        Your ambulance
                                    </p>

                                    <h2 className="mt-2 text-lg font-bold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceId}
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Ambulance size={21} />
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center justify-between rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                    <span className="text-xs text-(--sj-text-soft)">
                                        Type
                                    </span>

                                    <span className="text-xs font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceType}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                    <span className="text-xs text-(--sj-text-soft)">
                                        Status
                                    </span>

                                    <span className="flex items-center gap-2 text-xs font-semibold text-(--sj-primary)">
                                        <span className="h-2 w-2 rounded-full bg-(--sj-primary)" />
                                        Operational
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                    <span className="text-xs text-(--sj-text-soft)">
                                        Hospital
                                    </span>

                                    <span className="max-w-40 truncate text-xs font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.hospital}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <ShieldCheck size={19} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-(--sj-text)">
                                        Mission readiness
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Keep these enabled while on duty.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <span className="text-xs text-(--sj-text-soft)">
                                        Location sharing enabled
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CheckCircle2
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <span className="text-xs text-(--sj-text-soft)">
                                        Ambulance status operational
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CheckCircle2
                                        size={17}
                                        className="text-(--sj-primary)"
                                    />

                                    <span className="text-xs text-(--sj-text-soft)">
                                        Emergency notifications active
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="sj-card p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Phone size={18} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm font-bold text-(--sj-text)">
                                        Hospital coordination
                                    </h2>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Contact your hospital coordination
                                        team if you need assistance during a
                                        mission.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleContactHospital}
                                        className="mt-3 text-xs font-semibold text-(--sj-primary) hover:text-(--sj-primary-dark)"
                                    >
                                        Contact coordination team
                                    </button>

                                    {showContactMessage ? (
                                        <p className="mt-2 text-xs font-medium text-(--sj-primary)">
                                            Mock call request initiated.
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary) text-white">
                            <ShieldCheck size={20} />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-sm font-bold text-(--sj-text)">
                                Emergency response reminder
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Keep your location services enabled and follow
                                the assigned route. Patient and hospital
                                coordination updates will appear here during
                                an active mission.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/dashboard/paramedic/history',
                                )
                            }
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-xs font-semibold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                        >
                            View mission history
                            <ArrowUpRight size={15} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}