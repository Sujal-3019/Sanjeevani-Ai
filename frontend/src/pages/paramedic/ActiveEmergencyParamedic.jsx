import React, { useMemo, useState } from 'react';
import {
    Ambulance,
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Hospital,
    MapPin,
    Navigation,
    Phone,
    ShieldCheck,
    Siren,
    UserRound,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ParamedicNavbar from '../../components/layout/ParamedicNavbar';

/*
 * In the real application, this information must come from
 * the authenticated paramedic account and backend relationship:
 *
 * authenticated user
 *      ↓
 * paramedic
 *      ↓
 * assigned ambulance
 *
 * The paramedic must NOT be able to change the ambulance.
 */
const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',

    // Ambulance assigned by hospital operations.
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
    ambulanceRegistration: 'DL-01-AB-2042',
    ambulanceStatus: 'READY',
};

const MOCK_EMERGENCY = {
    id: 'EM-2026-00131',
    severity: 'CRITICAL',
    status: 'ACCEPTED',

    patient: {
        name: 'Emergency Patient',
        age: 42,
        gender: 'Male',
        bloodGroup: 'B+',
        allergies: 'No known allergies',
        medicalNotes:
            'Patient reported severe chest discomfort and difficulty breathing.',
    },

    pickup: {
        area: 'Connaught Place',
        address: 'Near Rajiv Chowk Metro Station',
        city: 'New Delhi',
        state: 'Delhi',
        distance: '2.4 km',
        eta: '6 min',
    },

    hospital: {
        name: 'Sanjeevani Emergency Hospital',
        address: 'Central Delhi, New Delhi',
        distance: '5.8 km',
        eta: '12 min',
        emergencyDepartment: '24×7 Emergency Department',
    },
};

const STATUS_STEPS = [
    {
        key: 'ACCEPTED',
        label: 'Mission accepted',
        description: 'Emergency request accepted by paramedic.',
    },
    {
        key: 'EN_ROUTE',
        label: 'En route to patient',
        description: 'Assigned ambulance travelling to pickup location.',
    },
    {
        key: 'AT_PATIENT',
        label: 'Reached patient',
        description: 'Paramedic has arrived at the incident location.',
    },
    {
        key: 'PATIENT_ONBOARD',
        label: 'Patient onboard',
        description: 'Patient has been safely placed in the assigned ambulance.',
    },
    {
        key: 'AT_HOSPITAL',
        label: 'Arrived at hospital',
        description: 'Patient has reached the destination hospital.',
    },
    {
        key: 'COMPLETED',
        label: 'Emergency completed',
        description: 'Emergency mission successfully completed.',
    },
];

const STATUS_ORDER = STATUS_STEPS.map((step) => step.key);

function getSeverityClasses(severity) {
    if (severity === 'CRITICAL') {
        return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
    }

    if (severity === 'HIGH') {
        return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400';
    }

    return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
}

function getNextStatus(status) {
    const currentIndex = STATUS_ORDER.indexOf(status);

    if (
        currentIndex === -1 ||
        currentIndex >= STATUS_ORDER.length - 1
    ) {
        return null;
    }

    return STATUS_ORDER[currentIndex + 1];
}

function getNextActionLabel(status) {
    const labels = {
        ACCEPTED: 'Start journey to patient',
        EN_ROUTE: 'Reached patient',
        AT_PATIENT: 'Patient onboard',
        PATIENT_ONBOARD: 'Start journey to hospital',
        AT_HOSPITAL: 'Complete emergency',
        COMPLETED: 'Emergency completed',
    };

    return labels[status] || 'Continue mission';
}

export default function ActiveEmergency() {
    const navigate = useNavigate();
    const { emergencyId } = useParams();

    const [missionStatus, setMissionStatus] = useState(
        MOCK_EMERGENCY.status,
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [showCallMessage, setShowCallMessage] = useState(false);

    const [showPatientMap, setShowPatientMap] = useState(false);

    const handleTrackPatient = () => {
        setShowPatientMap(true);
    };

    const handleHidePatientRoute = () => {
        setShowPatientMap(false);
    };


    const emergency = useMemo(() => {
        if (!emergencyId) {
            return MOCK_EMERGENCY;
        }

        return {
            ...MOCK_EMERGENCY,
            id: emergencyId,
        };
    }, [emergencyId]);

    const currentStepIndex = STATUS_ORDER.indexOf(missionStatus);
    const nextStatus = getNextStatus(missionStatus);
    const isCompleted = missionStatus === 'COMPLETED';

    const handleAdvanceMission = () => {
        if (!nextStatus || isUpdating) {
            return;
        }

        setIsUpdating(true);

        window.setTimeout(() => {
            setMissionStatus(nextStatus);
            setIsUpdating(false);
        }, 700);
    };

    const handleCallHospital = () => {
        setShowCallMessage(true);

        window.setTimeout(() => {
            setShowCallMessage(false);
        }, 2500);
    };

    const handleBack = () => {
        navigate('/dashboard/paramedic');
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-4 flex items-center gap-2 text-sm font-semibold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--sj-primary)">
                                <Siren size={15} />
                                Active emergency
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-(--sj-text) sm:text-3xl">
                                    {emergency.id}
                                </h1>

                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${getSeverityClasses(
                                        emergency.severity,
                                    )}`}
                                >
                                    {emergency.severity}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-(--sj-text-soft)">
                                Follow the mission sequence and keep patient
                                and hospital coordination updated.
                            </p>
                        </div>

                        <div
                            className={`flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${isCompleted
                                ? 'border-(--sj-primary)/30 bg-(--sj-primary-soft) text-(--sj-primary)'
                                : 'border-red-500/30 bg-red-500/10 text-red-500'
                                }`}
                        >
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${isCompleted
                                    ? 'bg-(--sj-primary)'
                                    : 'animate-pulse bg-red-500'
                                    }`}
                            />

                            {STATUS_STEPS[currentStepIndex]?.label ||
                                'Active mission'}
                        </div>
                    </div>
                </div>

                {/* Mission summary */}
                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-(--sj-text-muted)">
                                    Pickup distance
                                </p>

                                <p className="mt-2 text-2xl font-bold text-(--sj-text)">
                                    {emergency.pickup.distance}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    {emergency.pickup.eta} estimated
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <MapPin size={19} />
                            </div>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-(--sj-text-muted)">
                                    Hospital distance
                                </p>

                                <p className="mt-2 text-2xl font-bold text-(--sj-text)">
                                    {emergency.hospital.distance}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    {emergency.hospital.eta} estimated
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Hospital size={19} />
                            </div>
                        </div>
                    </div>

                    {/* Paramedic's assigned ambulance */}
                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-(--sj-text-muted)">
                                        My ambulance
                                    </p>

                                    <span className="rounded-full bg-(--sj-primary-soft) px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-(--sj-primary)">
                                        Assigned
                                    </span>
                                </div>

                                <p className="mt-2 text-2xl font-bold text-(--sj-text)">
                                    {MOCK_PARAMEDIC.ambulanceId}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    {MOCK_PARAMEDIC.ambulanceType}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Ambulance size={19} />
                            </div>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-(--sj-text-muted)">
                                    Mission status
                                </p>

                                <p className="mt-2 text-lg font-bold text-(--sj-primary)">
                                    {STATUS_STEPS[currentStepIndex]?.label}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    Step {currentStepIndex + 1} of{' '}
                                    {STATUS_STEPS.length}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <Clock3 size={19} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                    <div className="space-y-6">
                        {/* Live route */}
                        <div className="sj-card overflow-hidden">
                            <div className="flex items-center justify-between border-b border-(--sj-border) p-5">
                                <div>
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        Live mission route
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Live GPS from your assigned ambulance
                                        will be connected later.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-semibold text-(--sj-primary)">
                                    <span className="sj-live-dot" />
                                    Live
                                </div>
                            </div>

                            <div className="sj-map min-h-97.5">
                                <div className="sj-map-grid relative min-h-97.5 p-6">
                                    {/* Pickup */}
                                    <div className="absolute left-[16%] top-[23%] flex flex-col items-center">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg ring-4 ring-red-500/20">
                                            <MapPin size={20} />
                                        </div>

                                        <div className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-sm">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                                Pickup
                                            </p>

                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                {emergency.pickup.area}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hospital */}
                                    <div className="absolute bottom-[18%] right-[15%] flex flex-col items-center">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--sj-primary) text-white shadow-lg ring-4 ring-(--sj-primary)/20">
                                            <Hospital size={20} />
                                        </div>

                                        <div className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-sm">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                                Destination
                                            </p>

                                            <p className="mt-1 max-w-32 truncate text-xs font-bold text-(--sj-text)">
                                                Sanjeevani Hospital
                                            </p>
                                        </div>
                                    </div>

                                    {/* Paramedic's assigned ambulance */}
                                    <div className="absolute left-[33%] top-[49%] flex flex-col items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-text) text-(--sj-surface) shadow-lg">
                                            <Ambulance size={21} />
                                        </div>

                                        <span className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-2.5 py-1.5 text-[10px] font-bold text-(--sj-text) shadow-sm">
                                            {MOCK_PARAMEDIC.ambulanceId}
                                        </span>
                                    </div>

                                    {/* Mock route */}
                                    <div className="absolute left-[27%] top-[42%] h-1 w-[42%] rotate-25 rounded-full bg-(--sj-primary) opacity-70" />

                                    <div className="absolute left-[45%] top-[58%] h-1 w-[27%] rotate-25 rounded-full bg-(--sj-primary) opacity-50" />

                                    <div className="absolute bottom-5 left-5 rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                                        <div className="flex items-center gap-2">
                                            <Navigation
                                                size={15}
                                                className="text-(--sj-primary)"
                                            />

                                            <span className="text-xs font-bold text-(--sj-text)">
                                                Fastest route
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                            Route optimization will use live
                                            traffic data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Patient information */}
                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <UserRound size={19} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        Patient information
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Emergency information available to the
                                        assigned paramedic.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-xs text-(--sj-text-muted)">
                                        Patient
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.patient.name}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-xs text-(--sj-text-muted)">
                                        Age / Gender
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.patient.age} years ·{' '}
                                        {emergency.patient.gender}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-xs text-(--sj-text-muted)">
                                        Blood group
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.patient.bloodGroup}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-xs text-(--sj-text-muted)">
                                        Allergies
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.patient.allergies}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-(--sj-border) p-4">
                                <p className="text-xs font-semibold text-(--sj-text-muted)">
                                    Emergency notes
                                </p>

                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    {emergency.patient.medicalNotes}
                                </p>
                            </div>

                            <div className="mt-4 flex items-start gap-3 rounded-xl bg-(--sj-primary-soft) p-4">
                                <ShieldCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <p className="text-xs leading-5 text-(--sj-text-soft)">
                                    Patient medical information is shown only
                                    to authorized emergency personnel involved
                                    in this mission.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* My ambulance */}
                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Ambulance size={19} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        My ambulance
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Ambulance assigned to your paramedic
                                        account.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-(--sj-text-muted)">
                                            Ambulance ID
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-(--sj-text)">
                                            {MOCK_PARAMEDIC.ambulanceId}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-(--sj-primary) px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                        {MOCK_PARAMEDIC.ambulanceStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-(--sj-border) p-3">
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        Type
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceType}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-(--sj-border) p-3">
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        Registration
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceRegistration}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                <ShieldCheck
                                    size={17}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <div>
                                    <p className="text-xs font-semibold text-(--sj-text)">
                                        Hospital-assigned ambulance
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        This ambulance is permanently assigned
                                        to your operational account until
                                        hospital operations changes the
                                        assignment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Incident location */}
                        <div className="sj-card overflow-hidden p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <MapPin size={19} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        Incident location
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Patient pickup location
                                    </p>
                                </div>
                            </div>

                            {/* Location details */}
                            <div className="mt-5 rounded-xl bg-(--sj-surface-2) p-4">
                                <p className="text-sm font-bold text-(--sj-text)">
                                    {emergency.pickup.area}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    {emergency.pickup.address}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    {emergency.pickup.city}, {emergency.pickup.state}
                                </p>
                            </div>

                            {/* Distance and ETA */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-(--sj-border) p-3">
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        Distance
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.pickup.distance}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-(--sj-border) p-3">
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        ETA
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-primary)">
                                        {emergency.pickup.eta}
                                    </p>
                                </div>
                            </div>

                            {/* Track patient button */}
                            {!showPatientMap ? (
                                <button
                                    type="button"
                                    onClick={handleTrackPatient}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark) active:scale-[0.99]"
                                >
                                    <Navigation size={17} />
                                    Track Patient
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleHidePatientRoute}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3 text-sm font-semibold text-(--sj-text) transition hover:bg-(--sj-surface-2) active:scale-[0.99]"
                                >
                                    <Navigation size={17} />
                                    Hide Patient Route
                                </button>
                            )}

                            {/* Patient route mini map */}
                            {showPatientMap && (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-map-bg)">
                                    {/* Map header */}
                                    <div className="flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface) px-4 py-3">
                                        <div>
                                            <p className="text-sm font-bold text-(--sj-text)">
                                                Route to patient
                                            </p>

                                            <p className="mt-1 text-[11px] text-(--sj-text-soft)">
                                                {MOCK_PARAMEDIC.ambulanceId} →{' '}
                                                {emergency.pickup.area}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-(--sj-primary)">
                                            <span className="sj-live-dot" />
                                            Live
                                        </div>
                                    </div>

                                    {/* Map */}
                                    <div className="relative h-80 w-full overflow-hidden bg-(--sj-map-bg)">
                                        {/* Map grid */}
                                        <div className="sj-map-grid absolute inset-0" />

                                        {/* Decorative road lines */}
                                        <div className="absolute left-[-10%] top-[72%] h-2 w-[120%] -rotate-12 rounded-full bg-(--sj-map-line)" />

                                        <div className="absolute left-[15%] top-[-10%] h-2 w-[120%] rotate-48 rounded-full bg-(--sj-map-line)" />

                                        <div className="absolute left-[-10%] top-[35%] h-1.5 w-[120%] rotate-18 rounded-full bg-(--sj-map-line)" />

                                        {/* Route: ambulance → patient */}
                                        <div className="absolute left-[24%] top-[61%] h-1.5 w-[48%] origin-left rotate-[-32deg] rounded-full bg-(--sj-primary) shadow-sm" />

                                        <div className="absolute left-[47%] top-[43%] h-1.5 w-[27%] origin-left rotate-[-32deg] rounded-full bg-(--sj-primary) opacity-80 shadow-sm" />

                                        {/* Ambulance current location */}
                                        <div className="absolute left-[13%] top-[65%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 animate-ping rounded-xl bg-(--sj-primary)/30" />

                                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-text) text-(--sj-surface) shadow-xl ring-4 ring-(--sj-text)/10">
                                                    <Ambulance size={21} />
                                                </div>
                                            </div>

                                            <div className="mt-2 whitespace-nowrap rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-lg backdrop-blur">
                                                <p className="text-[9px] font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                                    Current location
                                                </p>

                                                <p className="mt-1 text-[11px] font-bold text-(--sj-text)">
                                                    {MOCK_PARAMEDIC.ambulanceId}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Patient location */}
                                        <div className="absolute right-[14%] top-[20%] flex translate-x-1/2 -translate-y-1/2 flex-col items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />

                                                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-xl ring-4 ring-red-500/20">
                                                    <MapPin size={21} />
                                                </div>
                                            </div>

                                            <div className="mt-2 whitespace-nowrap rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-lg backdrop-blur">
                                                <p className="text-[9px] font-semibold uppercase tracking-wider text-red-500">
                                                    Patient
                                                </p>

                                                <p className="mt-1 text-[11px] font-bold text-(--sj-text)">
                                                    {emergency.pickup.area}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Route information */}
                                        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-xl backdrop-blur">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Navigation
                                                        size={15}
                                                        className="text-(--sj-primary)"
                                                    />

                                                    <div>
                                                        <p className="text-[10px] text-(--sj-text-muted)">
                                                            Route to patient
                                                        </p>

                                                        <p className="mt-0.5 text-xs font-bold text-(--sj-text)">
                                                            Fastest available route
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[10px] text-(--sj-text-muted)">
                                                        ETA
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-(--sj-primary)">
                                                        {emergency.pickup.eta}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between border-t border-(--sj-border) pt-2">
                                                <span className="text-[10px] text-(--sj-text-muted)">
                                                    Ambulance
                                                </span>

                                                <span className="text-[10px] font-bold text-(--sj-text)">
                                                    {MOCK_PARAMEDIC.ambulanceId}
                                                </span>

                                                <span className="text-[10px] text-(--sj-text-muted)">
                                                    Distance
                                                </span>

                                                <span className="text-[10px] font-bold text-(--sj-text)">
                                                    {emergency.pickup.distance}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Destination */}
                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Hospital size={19} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-(--sj-text)">
                                        Destination
                                    </h2>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        Assigned receiving hospital
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl bg-(--sj-surface-2) p-4">
                                <p className="text-sm font-bold text-(--sj-text)">
                                    {emergency.hospital.name}
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                    {emergency.hospital.address}
                                </p>

                                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-(--sj-primary)">
                                    <CheckCircle2 size={15} />
                                    {emergency.hospital.emergencyDepartment}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-xl border border-(--sj-border) px-4 py-3">
                                <div>
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        Distance
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                        {emergency.hospital.distance}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[11px] text-(--sj-text-muted)">
                                        ETA
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-(--sj-primary)">
                                        {emergency.hospital.eta}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCallHospital}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3 text-sm font-semibold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                            >
                                <Phone size={17} />
                                Contact hospital coordination
                            </button>

                            {showCallMessage ? (
                                <p className="mt-2 text-center text-xs font-medium text-(--sj-primary)">
                                    Mock call request initiated.
                                </p>
                            ) : null}
                        </div>

                        {/* Timeline */}
                        <div className="sj-card p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--sj-primary)">
                                        Mission progress
                                    </p>

                                    <h2 className="mt-2 text-lg font-bold text-(--sj-text)">
                                        Emergency timeline
                                    </h2>
                                </div>

                                <Clock3
                                    size={20}
                                    className="text-(--sj-text-muted)"
                                />
                            </div>

                            <div className="mt-6 space-y-0">
                                {STATUS_STEPS.map((step, index) => {
                                    const isComplete =
                                        index <= currentStepIndex;

                                    const isCurrent =
                                        index === currentStepIndex;

                                    return (
                                        <div
                                            key={step.key}
                                            className="relative flex gap-3"
                                        >
                                            {index <
                                                STATUS_STEPS.length - 1 ? (
                                                <div
                                                    className={`absolute left-3.75 top-8 h-full w-px ${index < currentStepIndex
                                                        ? 'bg-(--sj-primary)'
                                                        : 'bg-(--sj-border)'
                                                        }`}
                                                />
                                            ) : null}

                                            <div
                                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isComplete
                                                    ? 'border-(--sj-primary) bg-(--sj-primary) text-white'
                                                    : 'border-(--sj-border) bg-(--sj-surface) text-(--sj-text-muted)'
                                                    }`}
                                            >
                                                {isComplete ? (
                                                    <CheckCircle2 size={15} />
                                                ) : (
                                                    <span className="text-[10px] font-bold">
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`pb-6 ${index ===
                                                    STATUS_STEPS.length - 1
                                                    ? 'pb-0'
                                                    : ''
                                                    }`}
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p
                                                        className={`text-sm font-semibold ${isCurrent
                                                            ? 'text-(--sj-primary)'
                                                            : 'text-(--sj-text)'
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </p>

                                                    {isCurrent ? (
                                                        <span className="rounded-full bg-(--sj-primary-soft) px-2 py-0.5 text-[10px] font-bold text-(--sj-primary)">
                                                            Current
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission action */}
                {!isCompleted ? (
                    <section className="sticky bottom-4 z-30 mt-6">
                        <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface)/95 p-4 shadow-xl backdrop-blur sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <ShieldCheck size={19} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            {
                                                STATUS_STEPS[
                                                    currentStepIndex
                                                ]?.label
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            Update the mission status only
                                            after the corresponding action has
                                            been completed.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAdvanceMission}
                                    disabled={
                                        isUpdating || !nextStatus
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
                                >
                                    {isUpdating ? (
                                        'Updating...'
                                    ) : (
                                        <>
                                            {getNextActionLabel(
                                                missionStatus,
                                            )}
                                            <ChevronRight size={17} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="mt-6 rounded-2xl border border-(--sj-primary)/25 bg-(--sj-primary-soft) p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary) text-white">
                                <CheckCircle2 size={21} />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-sm font-bold text-(--sj-text)">
                                    Emergency mission completed
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    The emergency has been marked as completed.
                                    Mission details will be available in your
                                    mission history.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/dashboard/paramedic/history',
                                    )
                                }
                                className="flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-xs font-semibold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                            >
                                View history
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}