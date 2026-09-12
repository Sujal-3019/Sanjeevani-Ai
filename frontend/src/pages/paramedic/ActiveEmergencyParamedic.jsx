import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    Ambulance,
    ArrowRight,
    CheckCircle2,
    Clock3,
    Hospital,
    MapPin,
    Navigation,
    RefreshCw,
    Search,
    ShieldCheck,
    Siren,
    UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
    ambulanceRegistration: 'DL-01-AB-2042',
    status: 'ACTIVE',
};

const MOCK_EMERGENCIES = [
    {
        id: 'EM-2026-00131',
        severity: 'CRITICAL',
        status: 'EN_ROUTE',
        assignmentStatus: 'ACTIVE',
        patientName: 'Emergency Patient',
        patientAge: 42,
        patientGender: 'Male',
        pickupArea: 'Connaught Place',
        pickupAddress: 'Near Rajiv Chowk Metro Station',
        pickupCity: 'New Delhi',
        pickupDistance: '2.4 km',
        pickupEta: '6 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '5.8 km',
        hospitalEta: '12 min',
        assignedAmbulance: 'AMB-042',
        assignedParamedic: 'Rohan Mehta',
        createdAt: '2 min ago',
        medicalSummary:
            'Severe chest discomfort and difficulty breathing.',
    },
    {
        id: 'EM-2026-00129',
        severity: 'HIGH',
        status: 'ASSIGNED',
        assignmentStatus: 'ASSIGNED',
        patientName: 'Emergency Patient',
        patientAge: 58,
        patientGender: 'Female',
        pickupArea: 'Karol Bagh',
        pickupAddress: 'Ajmal Khan Road',
        pickupCity: 'New Delhi',
        pickupDistance: '4.1 km',
        pickupEta: '11 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '6.8 km',
        hospitalEta: '15 min',
        assignedAmbulance: 'AMB-042',
        assignedParamedic: 'Rohan Mehta',
        createdAt: '8 min ago',
        medicalSummary:
            'Reported dizziness, weakness and possible fall injury.',
    },
    {
        id: 'EM-2026-00127',
        severity: 'HIGH',
        status: 'PENDING_ACCEPTANCE',
        assignmentStatus: 'AVAILABLE',
        patientName: 'Emergency Patient',
        patientAge: 35,
        patientGender: 'Male',
        pickupArea: 'Paharganj',
        pickupAddress: 'Main Bazaar Road',
        pickupCity: 'New Delhi',
        pickupDistance: '5.3 km',
        pickupEta: '14 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '8.2 km',
        hospitalEta: '18 min',
        assignedAmbulance: null,
        assignedParamedic: null,
        createdAt: '12 min ago',
        medicalSummary:
            'Possible road traffic injury requiring emergency assessment.',
    },
    {
        id: 'EM-2026-00124',
        severity: 'MODERATE',
        status: 'PENDING_ACCEPTANCE',
        assignmentStatus: 'AVAILABLE',
        patientName: 'Emergency Patient',
        patientAge: 27,
        patientGender: 'Female',
        pickupArea: 'Lajpat Nagar',
        pickupAddress: 'Central Market',
        pickupCity: 'New Delhi',
        pickupDistance: '7.2 km',
        pickupEta: '18 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '10.4 km',
        hospitalEta: '23 min',
        assignedAmbulance: null,
        assignedParamedic: null,
        createdAt: '18 min ago',
        medicalSummary:
            'Patient experiencing acute abdominal pain and weakness.',
    },
];

const FILTER_OPTIONS = [
    {
        value: 'ALL',
        label: 'All',
    },
    {
        value: 'ACTIVE',
        label: 'Active mission',
    },
    {
        value: 'ASSIGNED',
        label: 'Assigned',
    },
    {
        value: 'AVAILABLE',
        label: 'Available',
    },
];

function getSeverityClasses(severity) {
    switch (severity) {
        case 'CRITICAL':
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300';

        case 'HIGH':
            return 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300';

        case 'MODERATE':
            return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-300';

        default:
            return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
}

function getStatusClasses(status) {
    switch (status) {
        case 'EN_ROUTE':
            return 'bg-(--sj-primary-soft) text-(--sj-primary)';

        case 'ASSIGNED':
            return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300';

        case 'PENDING_ACCEPTANCE':
            return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300';

        default:
            return 'bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'EN_ROUTE':
            return 'En route';

        case 'ASSIGNED':
            return 'Assigned';

        case 'PENDING_ACCEPTANCE':
            return 'Awaiting assignment';

        default:
            return status;
    }
}

function getAssignmentLabel(assignmentStatus) {
    switch (assignmentStatus) {
        case 'ACTIVE':
            return 'Current active mission';

        case 'ASSIGNED':
            return 'Assigned mission';

        case 'AVAILABLE':
            return 'Available emergency';

        default:
            return 'Emergency';
    }
}

export default function ActiveEmergency() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const activeMission = useMemo(
        () =>
            MOCK_EMERGENCIES.find(
                (emergency) =>
                    emergency.assignmentStatus === 'ACTIVE' &&
                    emergency.assignedAmbulance ===
                        MOCK_PARAMEDIC.ambulanceId,
            ),
        [],
    );

    const assignedEmergencies = useMemo(
        () =>
            MOCK_EMERGENCIES.filter(
                (emergency) =>
                    emergency.assignmentStatus === 'ASSIGNED',
            ),
        [],
    );

    const availableEmergencies = useMemo(
        () =>
            MOCK_EMERGENCIES.filter(
                (emergency) =>
                    emergency.assignmentStatus === 'AVAILABLE',
            ),
        [],
    );

    const filteredEmergencies = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        return MOCK_EMERGENCIES.filter((emergency) => {
            const matchesSearch =
                !normalizedSearch ||
                emergency.id.toLowerCase().includes(normalizedSearch) ||
                emergency.pickupArea
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                emergency.patientName
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                emergency.hospital
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesFilter =
                activeFilter === 'ALL' ||
                (activeFilter === 'ACTIVE' &&
                    emergency.assignmentStatus === 'ACTIVE') ||
                (activeFilter === 'ASSIGNED' &&
                    emergency.assignmentStatus === 'ASSIGNED') ||
                (activeFilter === 'AVAILABLE' &&
                    emergency.assignmentStatus === 'AVAILABLE');

            return matchesSearch && matchesFilter;
        });
    }, [activeFilter, searchQuery]);

    const handleOpenEmergency = (emergencyId) => {
        navigate(`/dashboard/paramedic/emergency/${emergencyId}`);
    };

    const handleRefresh = () => {
        if (isRefreshing) {
            return;
        }

        setIsRefreshing(true);

        window.setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Page header */}
                <section className="mb-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--sj-primary)">
                                <Siren size={15} />
                                Emergency coordination
                            </div>

                            <h1 className="text-2xl font-bold text-(--sj-text) sm:text-3xl">
                                Active Emergencies
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                View emergencies assigned to your ambulance and
                                open any emergency to manage the mission.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-semibold text-(--sj-text) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    isRefreshing
                                        ? 'animate-spin'
                                        : ''
                                }
                            />
                            Refresh
                        </button>
                    </div>
                </section>

                {/* Ambulance status */}
                <section className="sj-card mb-6 overflow-hidden">
                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Ambulance size={24} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-(--sj-text-muted)">
                                    My assigned ambulance
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceId}
                                    </h2>

                                    <span className="rounded-full bg-(--sj-primary-soft) px-2.5 py-1 text-[11px] font-bold text-(--sj-primary)">
                                        ON DUTY
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-(--sj-text-soft)">
                                    {MOCK_PARAMEDIC.ambulanceType} ·{' '}
                                    {MOCK_PARAMEDIC.ambulanceRegistration}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                <p className="text-xs text-(--sj-text-muted)">
                                    Active
                                </p>
                                <p className="mt-1 text-lg font-bold text-(--sj-text)">
                                    {activeMission ? 1 : 0}
                                </p>
                            </div>

                            <div className="rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                <p className="text-xs text-(--sj-text-muted)">
                                    Assigned
                                </p>
                                <p className="mt-1 text-lg font-bold text-(--sj-text)">
                                    {assignedEmergencies.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-(--sj-surface-2) px-4 py-3">
                                <p className="text-xs text-(--sj-text-muted)">
                                    Available
                                </p>
                                <p className="mt-1 text-lg font-bold text-(--sj-text)">
                                    {availableEmergencies.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Current active mission */}
                {activeMission ? (
                    <section className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-(--sj-text)">
                                    Current active mission
                                </h2>

                                <p className="mt-1 text-sm text-(--sj-text-muted)">
                                    Your ambulance can handle one active
                                    emergency at a time.
                                </p>
                            </div>

                            <span className="sj-status sj-status-success">
                                <span className="sj-live-dot" />
                                Live mission
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                handleOpenEmergency(activeMission.id)
                            }
                            className="group block w-full text-left"
                        >
                            <article className="sj-card overflow-hidden border-(--sj-primary)/30 transition hover:border-(--sj-primary) hover:shadow-lg">
                                <div className="border-b border-(--sj-border) bg-(--sj-primary-soft)/40 p-5 sm:p-6">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                                                <AlertCircle size={24} />
                                            </div>

                                            <div>
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${getSeverityClasses(
                                                            activeMission.severity,
                                                        )}`}
                                                    >
                                                        {
                                                            activeMission.severity
                                                        }
                                                    </span>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
                                                            activeMission.status,
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            activeMission.status,
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-(--sj-text)">
                                                    {activeMission.id}
                                                </h3>

                                                <p className="mt-1 text-sm text-(--sj-text-soft)">
                                                    {activeMission.medicalSummary}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm font-semibold text-(--sj-primary)">
                                            Manage emergency
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
                                    <div>
                                        <p className="sj-label">Patient</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <UserRound
                                                size={16}
                                                className="text-(--sj-text-muted)"
                                            />
                                            <p className="text-sm font-semibold text-(--sj-text)">
                                                {activeMission.patientName}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            {activeMission.patientAge} years ·{' '}
                                            {activeMission.patientGender}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="sj-label">Pickup</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <MapPin
                                                size={16}
                                                className="text-(--sj-text-muted)"
                                            />
                                            <p className="text-sm font-semibold text-(--sj-text)">
                                                {activeMission.pickupArea}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            {
                                                activeMission.pickupDistance
                                            }{' '}
                                            · ETA{' '}
                                            {activeMission.pickupEta}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="sj-label">
                                            Destination
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Hospital
                                                size={16}
                                                className="text-(--sj-text-muted)"
                                            />
                                            <p className="truncate text-sm font-semibold text-(--sj-text)">
                                                {activeMission.hospital}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            {
                                                activeMission.hospitalDistance
                                            }{' '}
                                            · ETA{' '}
                                            {activeMission.hospitalEta}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="sj-label">
                                            Mission started
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Clock3
                                                size={16}
                                                className="text-(--sj-text-muted)"
                                            />
                                            <p className="text-sm font-semibold text-(--sj-text)">
                                                {activeMission.createdAt}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Ambulance{' '}
                                            {activeMission.assignedAmbulance}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </button>
                    </section>
                ) : (
                    <section className="sj-card mb-8 border-dashed">
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-surface-2) text-(--sj-text-muted)">
                                <Ambulance size={26} />
                            </div>

                            <h2 className="mt-4 text-lg font-bold text-(--sj-text)">
                                No active mission
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                                Your ambulance currently has no active
                                emergency. New emergency assignments will
                                appear below.
                            </p>
                        </div>
                    </section>
                )}

                {/* Emergency list */}
                <section>
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-(--sj-text)">
                                Emergency requests
                            </h2>

                            <p className="mt-1 text-sm text-(--sj-text-muted)">
                                Review emergencies and open their details.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-80">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--sj-text-muted)"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search emergency..."
                                className="sj-input pl-10"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                        {FILTER_OPTIONS.map((filter) => {
                            const isActive =
                                activeFilter === filter.value;

                            return (
                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() =>
                                        setActiveFilter(filter.value)
                                    }
                                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                        isActive
                                            ? 'bg-(--sj-primary) text-white'
                                            : 'border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) hover:border-(--sj-primary) hover:text-(--sj-primary)'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>

                    {filteredEmergencies.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {filteredEmergencies.map((emergency) => {
                                const isCurrentMission =
                                    emergency.assignmentStatus ===
                                    'ACTIVE';

                                return (
                                    <button
                                        key={emergency.id}
                                        type="button"
                                        onClick={() =>
                                            handleOpenEmergency(
                                                emergency.id,
                                            )
                                        }
                                        className="group text-left"
                                    >
                                        <article
                                            className={`sj-card sj-card-hover flex h-full min-h-77.5 flex-col overflow-hidden ${
                                                isCurrentMission
                                                    ? 'border-(--sj-primary)/30'
                                                    : ''
                                            }`}
                                        >
                                            <div className="flex-1 p-5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span
                                                                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${getSeverityClasses(
                                                                    emergency.severity,
                                                                )}`}
                                                            >
                                                                {
                                                                    emergency.severity
                                                                }
                                                            </span>

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                                                                    emergency.status,
                                                                )}`}
                                                            >
                                                                {getStatusLabel(
                                                                    emergency.status,
                                                                )}
                                                            </span>
                                                        </div>

                                                        <h3 className="mt-3 text-base font-bold text-(--sj-text)">
                                                            {emergency.id}
                                                        </h3>
                                                    </div>

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--sj-surface-2) text-(--sj-text-muted) transition group-hover:bg-(--sj-primary-soft) group-hover:text-(--sj-primary)">
                                                        <ArrowRight
                                                            size={17}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-5 space-y-4">
                                                    <div className="flex gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface-2) text-(--sj-text-muted)">
                                                            <UserRound
                                                                size={16}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs text-(--sj-text-muted)">
                                                                Patient
                                                            </p>

                                                            <p className="mt-0.5 text-sm font-semibold text-(--sj-text)">
                                                                {
                                                                    emergency.patientName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-(--sj-text-muted)">
                                                                {
                                                                    emergency.patientAge
                                                                }{' '}
                                                                years ·{' '}
                                                                {
                                                                    emergency.patientGender
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface-2) text-(--sj-text-muted)">
                                                            <MapPin
                                                                size={16}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs text-(--sj-text-muted)">
                                                                Pickup
                                                            </p>

                                                            <p className="mt-0.5 text-sm font-semibold text-(--sj-text)">
                                                                {
                                                                    emergency.pickupArea
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-(--sj-text-muted)">
                                                                {
                                                                    emergency.pickupDistance
                                                                }{' '}
                                                                · ETA{' '}
                                                                {
                                                                    emergency.pickupEta
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface-2) text-(--sj-text-muted)">
                                                            <Hospital
                                                                size={16}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs text-(--sj-text-muted)">
                                                                Hospital
                                                            </p>

                                                            <p className="mt-0.5 truncate text-sm font-semibold text-(--sj-text)">
                                                                {
                                                                    emergency.hospital
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-(--sj-border) bg-(--sj-surface-2)/50 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-(--sj-text-muted)">
                                                            {getAssignmentLabel(
                                                                emergency.assignmentStatus,
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                            {emergency.assignedAmbulance
                                                                ? `Ambulance ${emergency.assignedAmbulance}`
                                                                : 'Awaiting ambulance assignment'}
                                                        </p>
                                                    </div>

                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-(--sj-primary)">
                                                        View
                                                        <ArrowRight
                                                            size={14}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="sj-card">
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-surface-2) text-(--sj-text-muted)">
                                    <Search size={25} />
                                </div>

                                <h3 className="mt-4 text-base font-bold text-(--sj-text)">
                                    No emergencies found
                                </h3>

                                <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                                    Try changing the search term or selecting a
                                    different emergency filter.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Operational rule */}
                <section className="mt-6 rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-5">
                    <div className="flex gap-3">
                        <ShieldCheck
                            size={20}
                            className="mt-0.5 shrink-0 text-(--sj-primary)"
                        />

                        <div>
                            <p className="text-sm font-semibold text-(--sj-text)">
                                Ambulance assignment rule
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Ambulance {MOCK_PARAMEDIC.ambulanceId} can have
                                only one active emergency mission at a time.
                                Other emergency requests remain separate until
                                the current mission is completed or cancelled.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}