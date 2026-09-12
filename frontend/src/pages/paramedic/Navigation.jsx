import React, { useEffect, useMemo, useState } from 'react';
import {
    Ambulance,
    ArrowLeft,
    Battery,
    CheckCircle2,
    Clock3,
    Hospital,
    LocateFixed,
    MapPin,
    Navigation as NavigationIcon,
    Phone,
    Route,
    ShieldCheck,
    Siren,
    UserRound,
    X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
    ambulanceRegistration: 'DL-01-AB-2042',
};

const MOCK_MISSIONS = [
    {
        id: 'EM-2026-00131',
        severity: 'CRITICAL',
        status: 'EN_ROUTE',
        patient: 'Emergency patient',
        pickupArea: 'Connaught Place',
        pickupCity: 'New Delhi',
        pickupAddress: 'Near Rajiv Chowk Metro Station',
        patientDistance: '2.4 km',
        patientEta: '6 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '5.8 km',
        hospitalEta: '12 min',
        routeProgress: 42,
    },
    {
        id: 'EM-2026-00129',
        severity: 'HIGH',
        status: 'ASSIGNED',
        patient: 'Emergency patient',
        pickupArea: 'Karol Bagh',
        pickupCity: 'New Delhi',
        pickupAddress: 'Near Pusa Road',
        patientDistance: '4.1 km',
        patientEta: '9 min',
        hospital: 'Sanjeevani Emergency Hospital',
        hospitalDistance: '7.2 km',
        hospitalEta: '15 min',
        routeProgress: 0,
    },
];

const STATUS_CONFIG = {
    ASSIGNED: {
        label: 'Ready for dispatch',
        description: 'Mission assigned. Start navigation when you are ready.',
    },
    EN_ROUTE: {
        label: 'En route to patient',
        description: 'Follow the fastest available route to the patient.',
    },
    AT_PATIENT: {
        label: 'At patient location',
        description: 'You have reached the patient pickup location.',
    },
    PATIENT_ONBOARD: {
        label: 'Patient onboard',
        description: 'Navigate to the assigned hospital.',
    },
    AT_HOSPITAL: {
        label: 'At hospital',
        description: 'You have reached the destination hospital.',
    },
};

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

const getNavigationDestination = (mission) => {
    if (
        mission.status === 'PATIENT_ONBOARD' ||
        mission.status === 'AT_HOSPITAL'
    ) {
        return {
            type: 'hospital',
            title: mission.hospital,
            subtitle: 'Destination hospital',
            address: 'Emergency Department',
            distance: mission.hospitalDistance,
            eta: mission.hospitalEta,
        };
    }

    return {
        type: 'patient',
        title: 'Patient pickup location',
        subtitle: `${mission.pickupArea}, ${mission.pickupCity}`,
        address: mission.pickupAddress,
        distance: mission.patientDistance,
        eta: mission.patientEta,
    };
};

const getActionLabel = (status) => {
    switch (status) {
        case 'ASSIGNED':
            return 'Start Navigation';

        case 'EN_ROUTE':
            return 'Mark Arrived';

        case 'AT_PATIENT':
            return 'Patient Onboard';

        case 'PATIENT_ONBOARD':
            return 'Start Hospital Route';

        case 'AT_HOSPITAL':
            return 'Complete Mission';

        default:
            return 'Continue';
    }
};

const Navigation = () => {
    const navigate = useNavigate();
    const { emergencyId } = useParams();

    const [selectedMissionId, setSelectedMissionId] = useState(
        emergencyId || 'EM-2026-00131',
    );

    const [missionStatuses, setMissionStatuses] = useState({
        'EM-2026-00131': 'EN_ROUTE',
        'EM-2026-00129': 'ASSIGNED',
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [showMissionList, setShowMissionList] = useState(false);
    const [showCallMessage, setShowCallMessage] = useState(false);
    const [locationSharing, setLocationSharing] = useState(true);

    const selectedMission = useMemo(() => {
        return MOCK_MISSIONS.find(
            (mission) => mission.id === selectedMissionId,
        );
    }, [selectedMissionId]);

    const currentStatus = selectedMission
        ? missionStatuses[selectedMission.id] || selectedMission.status
        : '';

    const destination = selectedMission
        ? getNavigationDestination({
              ...selectedMission,
              status: currentStatus,
          })
        : null;

    useEffect(() => {
        if (emergencyId) {
            setSelectedMissionId(emergencyId);
        }
    }, [emergencyId]);

    useEffect(() => {
        if (!showCallMessage) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setShowCallMessage(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [showCallMessage]);

    const handleSelectMission = (missionId) => {
        setSelectedMissionId(missionId);
        setShowMissionList(false);

        navigate(`/dashboard/paramedic/navigation/${missionId}`);
    };

    const handleNavigationAction = () => {
        if (!selectedMission) {
            return;
        }

        setIsUpdating(true);

        setTimeout(() => {
            const nextStatusMap = {
                ASSIGNED: 'EN_ROUTE',
                EN_ROUTE: 'AT_PATIENT',
                AT_PATIENT: 'PATIENT_ONBOARD',
                PATIENT_ONBOARD: 'AT_HOSPITAL',
                AT_HOSPITAL: 'COMPLETED',
            };

            const nextStatus = nextStatusMap[currentStatus];

            if (nextStatus) {
                setMissionStatuses((previous) => ({
                    ...previous,
                    [selectedMission.id]: nextStatus,
                }));
            }

            setIsUpdating(false);
        }, 800);
    };

    const handleRecenter = () => {
        window.alert('Navigation map recentered on your current location.');
    };

    if (!selectedMission || !destination) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <ParamedicNavbar />

                <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/paramedic')}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-(--sj-text-soft) transition hover:text-(--sj-primary)"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>

                    <section className="sj-card p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <NavigationIcon size={26} />
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-(--sj-text)">
                            Navigation mission not found
                        </h1>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                            The requested emergency navigation session is no
                            longer available or the emergency ID is invalid.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/paramedic/emergency')
                            }
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
                        >
                            View Active Emergencies
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    const statusConfig =
        STATUS_CONFIG[currentStatus] || STATUS_CONFIG.ASSIGNED;

    const isCompleted = currentStatus === 'COMPLETED';

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
                {/* Header */}
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/dashboard/paramedic/emergency/${selectedMission.id}`,
                                )
                            }
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                            aria-label="Back to emergency details"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-(--sj-text) sm:text-2xl">
                                    Navigation
                                </h1>

                                <span
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${getSeverityClasses(
                                        selectedMission.severity,
                                    )}`}
                                >
                                    {selectedMission.severity}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-(--sj-text-soft)">
                                Emergency {selectedMission.id}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowMissionList(true)}
                            className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-semibold text-(--sj-text) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                        >
                            <Route size={17} />
                            Switch emergency
                        </button>

                        <div className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2.5 text-xs font-semibold text-(--sj-text-soft)">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            GPS sharing active
                        </div>
                    </div>
                </div>

                {/* Status banner */}
                <section className="mb-5 rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary) text-white">
                                {currentStatus === 'EN_ROUTE' ? (
                                    <NavigationIcon size={19} />
                                ) : (
                                    <CheckCircle2 size={19} />
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-bold text-(--sj-text)">
                                    {statusConfig.label}
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-(--sj-text-soft)">
                                    {statusConfig.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-(--sj-text-soft)">
                            <ShieldCheck
                                size={16}
                                className="text-(--sj-primary)"
                            />
                            Emergency coordination secured
                        </div>
                    </div>
                </section>

                {/* Navigation workspace */}
                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Map */}
                    <div className="sj-card overflow-hidden">
                        <div className="border-b border-(--sj-border) bg-(--sj-surface) px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Active route
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        {destination.type === 'patient' ? (
                                            <MapPin
                                                size={18}
                                                className="text-(--sj-primary)"
                                            />
                                        ) : (
                                            <Hospital
                                                size={18}
                                                className="text-(--sj-primary)"
                                            />
                                        )}

                                        <h2 className="text-base font-bold text-(--sj-text)">
                                            {destination.title}
                                        </h2>
                                    </div>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        {destination.address}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleRecenter}
                                        className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                    >
                                        <LocateFixed size={15} />
                                        Recenter
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLocationSharing(
                                                (previous) => !previous,
                                            )
                                        }
                                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                                            locationSharing
                                                ? 'bg-(--sj-primary) text-white'
                                                : 'border border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)'
                                        }`}
                                    >
                                        <Battery size={15} />
                                        GPS
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-130 overflow-hidden bg-(--sj-map-bg) sm:h-145">
                            {/* Map grid */}
                            <div className="absolute inset-0 opacity-70 `bg-[linear-gradient(to_right,var(--sj-map-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--sj-map-line)_1px,transparent_1px)]`" />

                            {/* Decorative roads */}
                            <div className="absolute left-[-10%] top-[28%] h-8 w-[120%] rotate-13 rounded-full bg-(--sj-surface) shadow-sm" />
                            <div className="absolute left-[-5%] top-[62%] h-10 w-[115%] rotate-[-18deg] rounded-full bg-(--sj-surface) shadow-sm" />
                            <div className="absolute left-[46%] top-[-10%] h-[120%] w-8 rotate-18 rounded-full bg-(--sj-surface) shadow-sm" />
                            <div className="absolute left-[18%] top-[-10%] h-[120%] w-6 rotate-[-32deg] rounded-full bg-(--sj-surface) shadow-sm" />

                            {/* Secondary roads */}
                            <div className="absolute left-[5%] top-[43%] h-3 w-[90%] rotate-[4deg] rounded-full bg-(--sj-surface-2)" />
                            <div className="absolute left-[5%] top-[76%] h-3 w-[90%] rotate-[8deg] rounded-full bg-(--sj-surface-2)" />
                            <div className="absolute left-[66%] top-[0%] h-full w-3 rotate-[7deg] rounded-full bg-(--sj-surface-2)" />

                            {/* Route line */}
                            <div className="absolute left-[25%] top-[70%] h-1 w-[52%] origin-left rotate-[-34deg] rounded-full bg-(--sj-primary) shadow-[0_0_0_2px_rgba(255,255,255,0.8)]" />

                            {/* Route progress */}
                            <div className="absolute left-[25%] top-[70%] h-1 w-[22%] origin-left rotate-[-34deg] rounded-full bg-(--sj-navy)" />

                            {/* Current ambulance location */}
                            <div className="absolute bottom-[27%] left-[22%]">
                                <div className="absolute -inset-3 animate-ping rounded-full bg-(--sj-primary)/20" />

                                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-(--sj-primary) text-white shadow-xl dark:border-(--sj-surface)">
                                    <Ambulance size={22} />
                                </div>

                                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-(--sj-navy) px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">
                                    AMB-042 • You
                                </div>
                            </div>

                            {/* Destination marker */}
                            <div className="absolute right-[20%] top-[23%]">
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-red-500 text-white shadow-xl dark:border-(--sj-surface)">
                                    {destination.type === 'patient' ? (
                                        <MapPin size={22} />
                                    ) : (
                                        <Hospital size={22} />
                                    )}
                                </div>

                                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-(--sj-navy) px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">
                                    {destination.type === 'patient'
                                        ? 'Patient'
                                        : 'Hospital'}
                                </div>
                            </div>

                            {/* Map labels */}
                            <div className="absolute left-5 top-5 rounded-xl border border-(--sj-border) bg-(--sj-surface)/90 px-3 py-2 text-xs font-semibold text-(--sj-text-soft) shadow-sm backdrop-blur">
                                Live navigation
                            </div>

                            <div className="absolute bottom-5 right-5 rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-lg backdrop-blur">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-(--sj-primary)" />
                                    <span className="text-xs font-semibold text-(--sj-text-soft)">
                                        Current route
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-semibold text-(--sj-text-soft)">
                                        Destination
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route panel */}
                    <aside className="space-y-5">
                        {/* ETA card */}
                        <section className="sj-card p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Estimated arrival
                                    </p>

                                    <p className="mt-2 text-4xl font-black tracking-tight text-(--sj-text)">
                                        {destination.eta}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Clock3 size={23} />
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Distance
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {destination.distance}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Route
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        Fastest
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Destination */}
                        <section className="sj-card p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    {destination.type === 'patient' ? (
                                        <MapPin size={19} />
                                    ) : (
                                        <Hospital size={19} />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Destination
                                    </p>

                                    <h3 className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {destination.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        {destination.address}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCallMessage(true)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                            >
                                <Phone size={15} />
                                Contact coordination
                            </button>
                        </section>

                        {/* Ambulance */}
                        <section className="sj-card p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <Ambulance size={19} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            {MOCK_PARAMEDIC.ambulanceId}
                                        </p>

                                        <p className="text-xs text-(--sj-text-soft)">
                                            {MOCK_PARAMEDIC.ambulanceType}
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    LIVE
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Paramedic
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Registration
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceRegistration}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Action */}
                        {!isCompleted ? (
                            <button
                                type="button"
                                onClick={handleNavigationAction}
                                disabled={isUpdating}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--sj-primary) px-5 py-4 text-sm font-bold text-white shadow-lg shadow-(--sj-primary)/15 transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Updating mission...
                                    </>
                                ) : (
                                    <>
                                        <NavigationIcon size={18} />
                                        {getActionLabel(currentStatus)}
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
                                <CheckCircle2
                                    size={24}
                                    className="mx-auto text-emerald-600 dark:text-emerald-400"
                                />

                                <p className="mt-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                                    Mission completed
                                </p>

                                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/70">
                                    Emergency coordination has been completed.
                                </p>
                            </div>
                        )}
                    </aside>
                </section>

                {/* Bottom information */}
                <section className="mt-5 grid gap-5 lg:grid-cols-3">
                    {/* Emergency */}
                    <article className="sj-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                <Siren size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    Emergency
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    {selectedMission.id}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Severity
                                </p>

                                <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                    {selectedMission.severity}
                                </p>
                            </div>

                            <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Status
                                </p>

                                <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                    {statusConfig.label}
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Patient / destination */}
                    <article className="sj-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                {destination.type === 'patient' ? (
                                    <UserRound size={19} />
                                ) : (
                                    <Hospital size={19} />
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    {destination.type === 'patient'
                                        ? 'Pickup'
                                        : 'Hospital'}
                                </p>

                                <p className="mt-1 truncate text-sm font-bold text-(--sj-text)">
                                    {destination.title}
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-(--sj-text-soft)">
                            {destination.address}
                        </p>
                    </article>

                    {/* Safety */}
                    <article className="sj-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <ShieldCheck size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    Operational safety
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    Drive safely
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-(--sj-text-soft)">
                            Navigation assistance is provided for emergency
                            coordination. Follow traffic rules and use
                            appropriate emergency response procedures.
                        </p>
                    </article>
                </section>
            </main>

            {/* Switch emergency modal */}
            {showMissionList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                        <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                            <div>
                                <h2 className="text-base font-bold text-(--sj-text)">
                                    Select emergency
                                </h2>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    Choose an emergency to open its navigation
                                    session.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowMissionList(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5">
                            {MOCK_MISSIONS.map((mission) => {
                                const status =
                                    missionStatuses[mission.id] ||
                                    mission.status;

                                const isSelected =
                                    mission.id === selectedMission.id;

                                return (
                                    <button
                                        key={mission.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectMission(mission.id)
                                        }
                                        className={`w-full rounded-2xl border p-4 text-left transition ${
                                            isSelected
                                                ? 'border-(--sj-primary) bg-(--sj-primary-soft)'
                                                : 'border-(--sj-border) bg-(--sj-surface) hover:border-(--sj-primary)/50 hover:bg-(--sj-surface-2)'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-(--sj-text)">
                                                        {mission.id}
                                                    </span>

                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getSeverityClasses(
                                                            mission.severity,
                                                        )}`}
                                                    >
                                                        {mission.severity}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                    {mission.pickupArea},{' '}
                                                    {mission.pickupCity}
                                                </p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-xs font-bold text-(--sj-text)">
                                                    {status === 'ASSIGNED'
                                                        ? 'Ready'
                                                        : status ===
                                                            'EN_ROUTE'
                                                          ? 'In progress'
                                                          : status}
                                                </p>

                                                <p className="mt-1 text-[11px] text-(--sj-text-soft)">
                                                    {mission.patientDistance}{' '}
                                                    away
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact message */}
            {showCallMessage && (
                <div className="fixed bottom-5 right-5 z-60 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-2xl">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Phone size={17} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-(--sj-text)">
                                Coordination contact
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Hospital emergency coordination: +91 11
                                4000 2042
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCallMessage(false)}
                            className="ml-auto text-(--sj-text-muted) hover:text-(--sj-text)"
                            aria-label="Close notification"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;