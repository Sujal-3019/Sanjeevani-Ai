import React, { useMemo, useState } from 'react';
import {
    Ambulance,
    ArrowLeft,
    CheckCircle2,
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

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
    ambulanceType: 'ALS Ambulance',
    ambulanceRegistration: 'DL-01-AB-2042',
    ambulanceStatus: 'READY',
};

const MOCK_EMERGENCIES = [
    {
        id: 'EM-2026-00131',
        severity: 'CRITICAL',
        status: 'EN_ROUTE',

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

        assignedAmbulance: 'AMB-042',
        assignedParamedic: 'Rohan Mehta',
        createdAt: '2 min ago',
    },

    {
        id: 'EM-2026-00129',
        severity: 'HIGH',
        status: 'ASSIGNED',

        patient: {
            name: 'Emergency Patient',
            age: 58,
            gender: 'Female',
            bloodGroup: 'O+',
            allergies: 'Penicillin',
            medicalNotes:
                'Patient reported dizziness, weakness and possible fall injury.',
        },

        pickup: {
            area: 'Karol Bagh',
            address: 'Ajmal Khan Road',
            city: 'New Delhi',
            state: 'Delhi',
            distance: '4.1 km',
            eta: '11 min',
        },

        hospital: {
            name: 'Sanjeevani Emergency Hospital',
            address: 'Central Delhi, New Delhi',
            distance: '6.8 km',
            eta: '15 min',
            emergencyDepartment: '24×7 Emergency Department',
        },

        assignedAmbulance: 'AMB-042',
        assignedParamedic: 'Rohan Mehta',
        createdAt: '8 min ago',
    },

    {
        id: 'EM-2026-00127',
        severity: 'HIGH',
        status: 'PENDING_ACCEPTANCE',

        patient: {
            name: 'Emergency Patient',
            age: 35,
            gender: 'Male',
            bloodGroup: 'A+',
            allergies: 'No known allergies',
            medicalNotes:
                'Possible road traffic injury requiring emergency assessment.',
        },

        pickup: {
            area: 'Paharganj',
            address: 'Main Bazaar Road',
            city: 'New Delhi',
            state: 'Delhi',
            distance: '5.3 km',
            eta: '14 min',
        },

        hospital: {
            name: 'Sanjeevani Emergency Hospital',
            address: 'Central Delhi, New Delhi',
            distance: '8.2 km',
            eta: '18 min',
            emergencyDepartment: '24×7 Emergency Department',
        },

        assignedAmbulance: null,
        assignedParamedic: null,
        createdAt: '12 min ago',
    },

    {
        id: 'EM-2026-00124',
        severity: 'MODERATE',
        status: 'PENDING_ACCEPTANCE',

        patient: {
            name: 'Emergency Patient',
            age: 27,
            gender: 'Female',
            bloodGroup: 'AB+',
            allergies: 'No known allergies',
            medicalNotes:
                'Patient experiencing acute abdominal pain and weakness.',
        },

        pickup: {
            area: 'Lajpat Nagar',
            address: 'Central Market',
            city: 'New Delhi',
            state: 'Delhi',
            distance: '7.2 km',
            eta: '18 min',
        },

        hospital: {
            name: 'Sanjeevani Emergency Hospital',
            address: 'Central Delhi, New Delhi',
            distance: '10.4 km',
            eta: '23 min',
            emergencyDepartment: '24×7 Emergency Department',
        },

        assignedAmbulance: null,
        assignedParamedic: null,
        createdAt: '18 min ago',
    },
];

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
        description:
            'Patient has been safely placed in the assigned ambulance.',
    },
    {
        key: 'AT_HOSPITAL',
        label: 'Arrived at hospital',
        description:
            'Patient has reached the destination hospital.',
    },
    {
        key: 'COMPLETED',
        label: 'Emergency completed',
        description:
            'Emergency mission successfully completed.',
    },
];

function getStatusIndex(status) {
    return STATUS_STEPS.findIndex((step) => step.key === status);
}

function getSeverityClasses(severity) {
    if (severity === 'CRITICAL') {
        return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300';
    }

    if (severity === 'HIGH') {
        return 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300';
    }

    if (severity === 'MODERATE') {
        return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-300';
    }

    return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
}

function getStatusLabel(status) {
    switch (status) {
        case 'ACCEPTED':
            return 'Accepted';

        case 'EN_ROUTE':
            return 'En route';

        case 'AT_PATIENT':
            return 'At patient';

        case 'PATIENT_ONBOARD':
            return 'Patient onboard';

        case 'AT_HOSPITAL':
            return 'At hospital';

        case 'COMPLETED':
            return 'Completed';

        case 'ASSIGNED':
            return 'Assigned';

        case 'PENDING_ACCEPTANCE':
            return 'Awaiting assignment';

        default:
            return status;
    }
}

function getActionForStatus(status) {
    switch (status) {
        case 'ACCEPTED':
            return {
                label: 'Start Route to Patient',
                nextStatus: 'EN_ROUTE',
                icon: Navigation,
            };

        case 'EN_ROUTE':
            return {
                label: 'I Have Reached the Patient',
                nextStatus: 'AT_PATIENT',
                icon: MapPin,
            };

        case 'AT_PATIENT':
            return {
                label: 'Patient Onboard',
                nextStatus: 'PATIENT_ONBOARD',
                icon: Ambulance,
            };

        case 'PATIENT_ONBOARD':
            return {
                label: 'Start Route to Hospital',
                nextStatus: 'AT_HOSPITAL',
                icon: Navigation,
            };

        case 'AT_HOSPITAL':
            return {
                label: 'Complete Emergency',
                nextStatus: 'COMPLETED',
                icon: CheckCircle2,
            };

        default:
            return null;
    }
}

export default function ActiveEmergencyDetails() {
    const navigate = useNavigate();
    const { emergencyId } = useParams();

    const [missionStatus, setMissionStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPatientMap, setShowPatientMap] = useState(false);
    const [showHospitalMap, setShowHospitalMap] = useState(false);
    const [showCallMessage, setShowCallMessage] = useState(false);

    const emergency = useMemo(() => {
        return (
            MOCK_EMERGENCIES.find(
                (item) => item.id === emergencyId,
            ) || null
        );
    }, [emergencyId]);

    React.useEffect(() => {
        if (emergency) {
            setMissionStatus(emergency.status);
        }
    }, [emergency]);

    if (!emergency) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <ParamedicNavbar />

                <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <section className="sj-card w-full max-w-lg p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                            <Siren size={26} />
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-(--sj-text)">
                            Emergency not found
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            The emergency ID you requested does not exist or
                            is no longer available.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/dashboard/paramedic/emergency',
                                )
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark)"
                        >
                            <ArrowLeft size={17} />
                            Back to emergencies
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    const currentStatusIndex = getStatusIndex(missionStatus);
    const action = getActionForStatus(missionStatus);

    const isAssignedToCurrentAmbulance =
        emergency.assignedAmbulance ===
        MOCK_PARAMEDIC.ambulanceId;

    const isAvailableEmergency =
        emergency.status === 'PENDING_ACCEPTANCE';

    const isCompleted = missionStatus === 'COMPLETED';

    const handleMissionAction = () => {
        if (!action || isUpdating) {
            return;
        }

        setIsUpdating(true);

        window.setTimeout(() => {
            setMissionStatus(action.nextStatus);
            setIsUpdating(false);
        }, 700);
    };

    const handleAcceptEmergency = () => {
        if (isUpdating) {
            return;
        }

        setIsUpdating(true);

        window.setTimeout(() => {
            setMissionStatus('ACCEPTED');
            setIsUpdating(false);
        }, 700);
    };

    const handleTrackPatient = () => {
        setShowPatientMap(true);
    };

    const handleHidePatientRoute = () => {
        setShowPatientMap(false);
    };

    const handleTrackHospital = () => {
        setShowHospitalMap(true);
    };

    const handleHideHospitalRoute = () => {
        setShowHospitalMap(false);
    };

    const handleCallHospital = () => {
        setShowCallMessage(true);

        window.setTimeout(() => {
            setShowCallMessage(false);
        }, 3000);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <ParamedicNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Back navigation */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            '/dashboard/paramedic/emergency',
                        )
                    }
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-(--sj-text-soft) transition hover:text-(--sj-primary)"
                >
                    <ArrowLeft size={17} />
                    Back to emergencies
                </button>

                {/* Header */}
                <section className="sj-card mb-6 overflow-hidden">
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Siren size={24} />
                                </div>

                                <div>
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                            Emergency mission
                                        </span>

                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${getSeverityClasses(
                                                emergency.severity,
                                            )}`}
                                        >
                                            {emergency.severity}
                                        </span>
                                    </div>

                                    <h1 className="text-xl font-bold text-(--sj-text) sm:text-2xl">
                                        {emergency.id}
                                    </h1>

                                    <p className="mt-1 text-sm text-(--sj-text-soft)">
                                        {getStatusLabel(missionStatus)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {isCompleted ? (
                                    <span className="sj-status sj-status-success">
                                        <CheckCircle2 size={15} />
                                        Emergency completed
                                    </span>
                                ) : isAssignedToCurrentAmbulance ? (
                                    <span className="sj-status sj-status-info">
                                        <span className="sj-live-dot" />
                                        Assigned to you
                                    </span>
                                ) : isAvailableEmergency ? (
                                    <span className="sj-status sj-status-warning">
                                        <Clock3 size={15} />
                                        Awaiting assignment
                                    </span>
                                ) : (
                                    <span className="sj-status sj-status-info">
                                        Assigned
                                    </span>
                                )}

                                <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-2.5 text-sm text-(--sj-text-soft)">
                                    Ambulance{' '}
                                    <span className="font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Available emergency */}
                {isAvailableEmergency ? (
                    <section className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900/50 dark:bg-yellow-950/20 sm:p-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex gap-3">
                                <AlertCircle
                                    size={21}
                                    className="mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-300"
                                />

                                <div>
                                    <p className="font-semibold text-(--sj-text)">
                                        This emergency is awaiting assignment
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                        Accepting this emergency will assign
                                        it to your current ambulance. Your
                                        ambulance can have only one active
                                        emergency at a time.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAcceptEmergency}
                                disabled={isUpdating}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Accept Emergency
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                ) : null}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.75fr)]">
                    {/* Main content */}
                    <div className="space-y-6">
                        {/* Patient */}
                        <section className="sj-card">
                            <div className="border-b border-(--sj-border) p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <UserRound size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-(--sj-text)">
                                            Patient information
                                        </h2>

                                        <p className="text-sm text-(--sj-text-muted)">
                                            Emergency information available
                                            to the paramedic
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
                                <div>
                                    <p className="sj-label">
                                        Patient
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {emergency.patient.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="sj-label">
                                        Age / Gender
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {emergency.patient.age} years /{' '}
                                        {emergency.patient.gender}
                                    </p>
                                </div>

                                <div>
                                    <p className="sj-label">
                                        Blood group
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {emergency.patient.bloodGroup}
                                    </p>
                                </div>

                                <div>
                                    <p className="sj-label">
                                        Allergies
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {emergency.patient.allergies}
                                    </p>
                                </div>

                                <div className="sm:col-span-2 lg:col-span-4">
                                    <p className="sj-label">
                                        Medical notes
                                    </p>

                                    <div className="mt-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4 text-sm leading-6 text-(--sj-text-soft)">
                                        {emergency.patient.medicalNotes}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Pickup location */}
                        <section className="sj-card">
                            <div className="border-b border-(--sj-border) p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                            <MapPin size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-(--sj-text)">
                                                Patient pickup location
                                            </h2>

                                            <p className="text-sm text-(--sj-text-muted)">
                                                Ambulance to patient route
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="rounded-lg bg-(--sj-surface-2) px-3 py-2 text-xs font-semibold text-(--sj-text-soft)">
                                            {emergency.pickup.distance}
                                        </span>

                                        <span className="rounded-lg bg-(--sj-primary-soft) px-3 py-2 text-xs font-semibold text-(--sj-primary)">
                                            ETA {emergency.pickup.eta}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300">
                                        <MapPin size={18} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-(--sj-text)">
                                            {emergency.pickup.area}
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                            {emergency.pickup.address}
                                            <br />
                                            {emergency.pickup.city},{' '}
                                            {emergency.pickup.state}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        showPatientMap
                                            ? handleHidePatientRoute
                                            : handleTrackPatient
                                    }
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark)"
                                >
                                    <Navigation size={17} />

                                    {showPatientMap
                                        ? 'Hide patient route'
                                        : 'Track Patient'}
                                </button>

                                {showPatientMap ? (
                                    <div className="mt-4 overflow-hidden rounded-2xl border border-(--sj-border)">
                                        <div className="relative h-80 w-full overflow-hidden bg-(--sj-map-bg)">
                                            <div className="sj-map-grid absolute inset-0" />

                                            <div className="absolute left-[-8%] top-[48%] h-8 w-[116%] rotate-[-8deg] rounded-full border-y border-(--sj-map-line) bg-(--sj-surface)" />

                                            <div className="absolute left-[46%] top-[-15%] h-[130%] w-8 rotate-14 rounded-full border-x border-(--sj-map-line) bg-(--sj-surface)" />

                                            <div className="absolute left-[5%] top-[22%] h-5 w-[90%] rotate-22 rounded-full border-y border-(--sj-map-line) bg-(--sj-surface)" />

                                            {/* Route */}
                                            <div className="absolute left-[25%] top-[66%] h-1 w-[52%] origin-left rotate-[-25deg] rounded-full bg-(--sj-primary)" />

                                            {/* Ambulance */}
                                            <div className="absolute left-[25%] top-[66%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--sj-navy) text-white shadow-lg">
                                                <Ambulance size={18} />
                                            </div>

                                            <div className="absolute left-[25%] top-[66%] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg bg-(--sj-navy) px-3 py-2 text-xs font-semibold text-white shadow-lg">
                                                {MOCK_PARAMEDIC.ambulanceId}
                                            </div>

                                            {/* Patient */}
                                            <div className="absolute left-[77%] top-[37%] -translate-x-1/2 -translate-y-1/2">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-red-600 text-white shadow-lg">
                                                    <MapPin size={19} />
                                                </div>

                                                <div className="mt-2 whitespace-nowrap rounded-lg bg-(--sj-surface) px-3 py-1.5 text-xs font-semibold text-(--sj-text) shadow-md">
                                                    Patient
                                                </div>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-2 text-xs text-(--sj-text-soft)">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-(--sj-primary)" />
                                                    Ambulance current location
                                                </div>

                                                <div className="flex items-center gap-2 text-xs font-semibold text-(--sj-text)">
                                                    <Navigation size={14} />
                                                    {emergency.pickup.distance}{' '}
                                                    · ETA{' '}
                                                    {emergency.pickup.eta}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        {/* Ambulance */}
                        <section className="sj-card">
                            <div className="border-b border-(--sj-border) p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <Ambulance size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-(--sj-text)">
                                            Assigned ambulance
                                        </h2>

                                        <p className="text-sm text-(--sj-text-muted)">
                                            Controlled by hospital
                                            administration
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                                <div>
                                    <p className="sj-label">
                                        Ambulance ID
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceId}
                                    </p>
                                </div>

                                <div>
                                    <p className="sj-label">
                                        Type
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.ambulanceType}
                                    </p>
                                </div>

                                <div>
                                    <p className="sj-label">
                                        Registration
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {
                                            MOCK_PARAMEDIC.ambulanceRegistration
                                        }
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Hospital */}
                        <section className="sj-card">
                            <div className="border-b border-(--sj-border) p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                            <Hospital size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-semibold text-(--sj-text)">
                                                Destination hospital
                                            </h2>

                                            <p className="text-sm text-(--sj-text-muted)">
                                                Assigned emergency
                                                destination
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-lg bg-(--sj-primary-soft) px-3 py-2 text-xs font-semibold text-(--sj-primary)">
                                        ETA {emergency.hospital.eta}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <Hospital size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-(--sj-text)">
                                            {emergency.hospital.name}
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                            {emergency.hospital.address}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-lg bg-(--sj-surface-2) px-3 py-1.5 text-xs font-medium text-(--sj-text-soft)">
                                                {emergency.hospital.distance}
                                            </span>

                                            <span className="rounded-lg bg-(--sj-primary-soft) px-3 py-1.5 text-xs font-medium text-(--sj-primary)">
                                                {
                                                    emergency.hospital
                                                        .emergencyDepartment
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={
                                            showHospitalMap
                                                ? handleHideHospitalRoute
                                                : handleTrackHospital
                                        }
                                        className="flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3 text-sm font-semibold text-(--sj-text) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                    >
                                        <Navigation size={17} />

                                        {showHospitalMap
                                            ? 'Hide hospital route'
                                            : 'View hospital route'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCallHospital}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3 text-sm font-semibold text-(--sj-text) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                    >
                                        <Phone size={17} />
                                        Contact hospital
                                    </button>
                                </div>

                                {showCallMessage ? (
                                    <div className="mt-4 rounded-xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-3 text-sm text-(--sj-primary)">
                                        Hospital coordination contact opened
                                        for this emergency.
                                    </div>
                                ) : null}

                                {showHospitalMap ? (
                                    <div className="mt-4 overflow-hidden rounded-2xl border border-(--sj-border)">
                                        <div className="relative h-70 w-full overflow-hidden bg-(--sj-map-bg)">
                                            <div className="sj-map-grid absolute inset-0" />

                                            <div className="absolute left-[-10%] top-[54%] h-8 w-[120%] rotate-[7deg] rounded-full border-y border-(--sj-map-line) bg-(--sj-surface)" />

                                            <div className="absolute left-[62%] top-[-20%] h-[140%] w-8 rotate-[-17deg] rounded-full border-x border-(--sj-map-line) bg-(--sj-surface)" />

                                            <div className="absolute left-[31%] top-[63%] h-1 w-[45%] origin-left rotate-[-20deg] rounded-full bg-(--sj-primary)" />

                                            <div className="absolute left-[31%] top-[63%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--sj-navy) text-white shadow-lg">
                                                <Ambulance size={18} />
                                            </div>

                                            <div className="absolute left-[76%] top-[45%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--sj-primary) text-white shadow-lg">
                                                <Hospital size={18} />
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 p-3 shadow-lg backdrop-blur">
                                                <span className="text-xs text-(--sj-text-soft)">
                                                    Patient → Hospital
                                                </span>

                                                <span className="text-xs font-semibold text-(--sj-text)">
                                                    {emergency.hospital.distance}{' '}
                                                    · ETA{' '}
                                                    {emergency.hospital.eta}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </section>
                    </div>

                    {/* Right sidebar */}
                    <aside className="space-y-6">
                        {/* Mission action */}
                        <section className="sj-card">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        {isCompleted ? (
                                            <CheckCircle2 size={20} />
                                        ) : (
                                            <Navigation size={20} />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-(--sj-text)">
                                            Mission action
                                        </h2>

                                        <p className="text-sm text-(--sj-text-muted)">
                                            Update emergency progress
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-(--sj-text-muted)">
                                        Current status
                                    </p>

                                    <p className="mt-1 font-semibold text-(--sj-text)">
                                        {getStatusLabel(
                                            missionStatus,
                                        )}
                                    </p>
                                </div>

                                {action ? (
                                    <button
                                        type="button"
                                        onClick={handleMissionAction}
                                        disabled={
                                            isUpdating ||
                                            !isAssignedToCurrentAmbulance
                                        }
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Updating mission...
                                            </>
                                        ) : (
                                            <>
                                                <action.icon size={18} />
                                                {action.label}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="mt-4 rounded-xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-4 text-sm text-(--sj-primary)">
                                        Emergency mission completed
                                        successfully.
                                    </div>
                                )}

                                {!isAssignedToCurrentAmbulance &&
                                !isAvailableEmergency ? (
                                    <p className="mt-3 text-xs leading-5 text-(--sj-text-muted)">
                                        This emergency is not assigned to
                                        ambulance{' '}
                                        {MOCK_PARAMEDIC.ambulanceId}.
                                    </p>
                                ) : null}
                            </div>
                        </section>

                        {/* Timeline */}
                        <section className="sj-card">
                            <div className="border-b border-(--sj-border) p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <Clock3 size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-(--sj-text)">
                                            Mission timeline
                                        </h2>

                                        <p className="text-sm text-(--sj-text-muted)">
                                            Emergency progress
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                {STATUS_STEPS.map(
                                    (step, index) => {
                                        const stepIndex =
                                            getStatusIndex(step.key);

                                        const isComplete =
                                            stepIndex <=
                                            currentStatusIndex;

                                        const isCurrent =
                                            step.key === missionStatus;

                                        const isLast =
                                            index ===
                                            STATUS_STEPS.length - 1;

                                        return (
                                            <div
                                                key={step.key}
                                                className="relative flex gap-4"
                                            >
                                                {!isLast ? (
                                                    <div
                                                        className={`absolute left-3.75 top-8 h-[calc(100%-8px)] w-px ${
                                                            stepIndex <
                                                            currentStatusIndex
                                                                ? 'bg-(--sj-primary)'
                                                                : 'bg-(--sj-border)'
                                                        }`}
                                                    />
                                                ) : null}

                                                <div
                                                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                                        isComplete
                                                            ? 'border-(--sj-primary) bg-(--sj-primary) text-white'
                                                            : 'border-(--sj-border) bg-(--sj-surface) text-(--sj-text-muted)'
                                                    }`}
                                                >
                                                    {isComplete ? (
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <span className="h-2 w-2 rounded-full bg-current" />
                                                    )}
                                                </div>

                                                <div
                                                    className={`min-w-0 ${
                                                        isLast
                                                            ? ''
                                                            : 'pb-6'
                                                    }`}
                                                >
                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            isCurrent
                                                                ? 'text-(--sj-primary)'
                                                                : 'text-(--sj-text)'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-muted)">
                                                        {
                                                            step.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </section>

                        {/* Paramedic / ambulance */}
                        <section className="sj-card">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        <UserRound size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-(--sj-text)">
                                            Assigned paramedic
                                        </h2>

                                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                                            {MOCK_PARAMEDIC.name}
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            {
                                                MOCK_PARAMEDIC.qualification
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-(--sj-text-muted)">
                                            Ambulance
                                        </span>

                                        <span className="text-sm font-semibold text-(--sj-text)">
                                            {
                                                MOCK_PARAMEDIC.ambulanceId
                                            }
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-(--sj-text-muted)">
                                            Status
                                        </span>

                                        <span className="text-xs font-semibold text-(--sj-primary)">
                                            {
                                                MOCK_PARAMEDIC.ambulanceStatus
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Coordination */}
                        <section className="rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary-soft) p-5">
                            <div className="flex gap-3">
                                <ShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-(--sj-text)">
                                        Emergency coordination
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Follow emergency protocols and keep
                                        the mission status updated after each
                                        operational stage.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Bottom mission status */}
                <section className="mt-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--sj-primary-soft) text-(--sj-primary)">
                                {isCompleted ? (
                                    <CheckCircle2 size={18} />
                                ) : (
                                    <Navigation size={18} />
                                )}
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-(--sj-text)">
                                    {getStatusLabel(
                                        missionStatus,
                                    )}
                                </p>

                                <p className="text-xs text-(--sj-text-muted)">
                                    {emergency.id} · Ambulance{' '}
                                    {MOCK_PARAMEDIC.ambulanceId}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-(--sj-text-muted)">
                            <span className="sj-live-dot" />
                            Emergency coordination active
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}