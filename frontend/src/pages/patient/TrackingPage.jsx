import React from 'react';
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
    UserRound,
} from 'lucide-react';
import {
    Link,
    useSearchParams,
} from 'react-router-dom';
import {
    CircleMarker,
    MapContainer,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import PatientNavbar from '../../components/layout/PatientNavbar';
import authService from '../../services/authService';
import emergencyService from '../../services/emergencyService';


const STATUS_LABELS = {
    CREATED: 'Emergency request created',
    ASSESSING: 'Emergency being assessed',
    COORDINATING: 'Emergency coordination in progress',
    HOSPITAL_SELECTED: 'Hospital selected',
    AMBULANCE_ASSIGNMENT: 'Finding an ambulance',
    AMBULANCE_ASSIGNED: 'Ambulance assigned',
    PARAMEDIC_ASSIGNED: 'Paramedic assigned',
    PATIENT_PICKED_UP: 'Patient picked up',
    TRANSPORTING: 'Transporting to hospital',
    ARRIVED_AT_HOSPITAL: 'Arrived at hospital',
    COMPLETED: 'Emergency completed',
    CANCELLED: 'Emergency cancelled',
};


const EMERGENCY_TYPE_LABELS = {
    CHEST_PAIN: 'Chest pain',
    BREATHING_DIFFICULTY: 'Breathing difficulty',
    STROKE: 'Possible stroke',
    SEVERE_BLEEDING: 'Severe bleeding',
    ROAD_ACCIDENT: 'Road accident',
    BURNS: 'Serious burns',
    UNCONSCIOUS: 'Unconscious person',
    SEIZURE: 'Seizure',
    PREGNANCY_EMERGENCY: 'Pregnancy emergency',
    POISONING: 'Poisoning',
    SEVERE_ALLERGIC_REACTION:
        'Severe allergic reaction',
    OTHER: 'Other emergency',
};


function formatEmergencyId(id) {
    if (!id) {
        return 'Emergency';
    }

    return `SOS ${id.slice(0, 8).toUpperCase()}`;
}


function getStatusLabel(status) {
    return (
        STATUS_LABELS[status] ||
        status ||
        'Emergency status unavailable'
    );
}


function getEmergencyTypeLabel(type) {
    return (
        EMERGENCY_TYPE_LABELS[type] ||
        type ||
        'Emergency'
    );
}


function TrackingPage() {
    const [searchParams] =
        useSearchParams();

    const emergencyId =
        searchParams.get('emergency_id');

    const [emergency, setEmergency] =
        React.useState(null);

    const [isLoading, setIsLoading] =
        React.useState(true);

    const [error, setError] =
        React.useState('');

    const [
        isRefreshing,
        setIsRefreshing,
    ] = React.useState(false);


    const loadEmergency =
        React.useCallback(
            async (showRefreshState = false) => {
                if (!emergencyId) {
                    setError(
                        'No emergency request was selected.',
                    );

                    setIsLoading(false);

                    return;
                }

                if (showRefreshState) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                setError('');

                try {
                    const token =
                        authService.getAccessToken();

                    if (!token) {
                        throw new Error(
                            'Your session has expired. Please log in again.',
                        );
                    }

                    const data =
                        await emergencyService.getSOS(
                            emergencyId,
                            token,
                        );

                    setEmergency(data);
                } catch (requestError) {
                    console.error(
                        'Failed to load emergency:',
                        requestError,
                    );

                    setError(
                        requestError?.message ||
                        'Unable to load your emergency request.',
                    );
                } finally {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            },
            [
                emergencyId,
            ],
        );


    React.useEffect(() => {
        loadEmergency();
    }, [
        loadEmergency,
    ]);


    if (isLoading) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <PatientNavbar />

                <main className="flex min-h-[70vh] items-center justify-center px-5 py-10">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--sj-primary)/20 border-t-(--sj-primary)" />

                        <p className="mt-4 text-sm font-bold text-(--sj-text-soft)">
                            Loading emergency details...
                        </p>
                    </div>
                </main>
            </div>
        );
    }


    if (error || !emergency) {
        return (
            <div className="sanjeevani-page min-h-screen">
                <PatientNavbar />

                <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
                    <Link
                        to="/dashboard/patient"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-(--sj-primary)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>

                    <div className="sj-card p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                            <ShieldCheck className="h-7 w-7" />
                        </div>

                        <h1 className="mt-5 text-2xl font-black text-(--sj-text)">
                            Emergency information unavailable
                        </h1>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-(--sj-text-soft)">
                            {error ||
                                'We could not find this emergency request.'}
                        </p>

                        <Link
                            to="/dashboard/patient"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-bold text-white"
                        >
                            Return to dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }


    const status =
        emergency.status;

    const statusLabel =
        getStatusLabel(status);

    const emergencyType =
        getEmergencyTypeLabel(
            emergency.emergency_type,
        );


    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
                <div className="mb-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                {formatEmergencyId(
                                    emergency.id,
                                )}
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                {statusLabel}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                Your emergency request is being handled through Sanjeevani.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    loadEmergency(
                                        true,
                                    )
                                }
                                disabled={
                                    isRefreshing
                                }
                                className="inline-flex items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-xs font-bold text-(--sj-text) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isRefreshing
                                    ? 'Refreshing...'
                                    : 'Refresh'}
                            </button>

                            <span className="sj-status sj-status-success w-fit">
                                <span className="sj-live-dot" />

                                Live status
                            </span>
                        </div>
                    </div>
                </div>


                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <section className="space-y-6">
                        <TrackingMap
                            emergency={
                                emergency
                            }
                        />

                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoCard
                                icon={Clock3}
                                label="Status"
                                value={
                                    statusLabel
                                }
                                description="Current emergency status"
                            />

                            <InfoCard
                                icon={
                                    Navigation
                                }
                                label="Emergency type"
                                value={
                                    emergencyType
                                }
                                description="Information provided during SOS"
                            />

                            <InfoCard
                                icon={
                                    MapPin
                                }
                                label="Location"
                                value={
                                    emergency.latitude !==
                                        null &&
                                        emergency.longitude !==
                                        null
                                        ? 'GPS captured'
                                        : 'Captured'
                                }
                                description="Current emergency location"
                            />
                        </div>


                        <div className="sj-card p-5 sm:p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Ambulance className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                            Ambulance
                                        </p>

                                        <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                            Not assigned yet
                                        </h2>

                                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                                            Ambulance assignment will appear here when coordination begins.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 py-3 text-sm font-bold text-(--sj-text-muted) opacity-60"
                                >
                                    <Phone className="h-4 w-4" />
                                    Contact paramedic
                                </button>
                            </div>
                        </div>
                    </section>


                    <aside className="space-y-6">
                        <HospitalCard />

                        <Timeline
                            status={status}
                            emergency={
                                emergency
                            }
                        />

                        <EmergencyDetails
                            emergency={
                                emergency
                            }
                        />

                        <SafetyCard />
                    </aside>
                </div>
            </main>
        </div>
    );
}


function TrackingMap({
    emergency,
}) {
    const latitude =
        Number(emergency.latitude);

    const longitude =
        Number(emergency.longitude);

    const hasCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180;


    if (!hasCoordinates) {
        return (
            <div className="sj-card flex min-h-107.5 items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                        <MapPin className="h-7 w-7" />
                    </div>

                    <h2 className="mt-4 text-lg font-black text-(--sj-text)">
                        Location unavailable
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                        The emergency was created, but valid GPS coordinates are not available for this request.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="relative overflow-hidden rounded-3xl border border-(--sj-border) bg-(--sj-surface) shadow-sm">
            <MapContainer
                center={[
                    latitude,
                    longitude,
                ]}
                zoom={16}
                scrollWheelZoom={true}
                className="h-107.5 w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CircleMarker
                    center={[
                        latitude,
                        longitude,
                    ]}
                    radius={11}
                    pathOptions={{
                        color: '#dc2626',
                        fillColor: '#dc2626',
                        fillOpacity: 0.95,
                        weight: 3,
                    }}
                >
                    <Popup>
                        <div className="min-w-45">
                            <p className="text-sm font-bold">
                                Your emergency location
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                                {getEmergencyTypeLabel(
                                    emergency.emergency_type,
                                )}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                {latitude.toFixed(
                                    6,
                                )}
                                ,{' '}
                                {longitude.toFixed(
                                    6,
                                )}
                            </p>
                        </div>
                    </Popup>
                </CircleMarker>

                <MapRecenterButton
                    latitude={
                        latitude
                    }
                    longitude={
                        longitude
                    }
                />
            </MapContainer>


            <div className="pointer-events-none absolute left-4 top-4 z-400">
                <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-2">
                        <span className="sj-live-dot" />

                        <span className="text-xs font-black text-(--sj-text)">
                            Your emergency location
                        </span>
                    </div>

                    <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                        GPS coordinates from your SOS request
                    </p>
                </div>
            </div>


            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-400 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Patient location
                    </p>

                    <p className="mt-1 text-xs font-black text-(--sj-text)">
                        {latitude.toFixed(
                            6,
                        )}
                        ,{' '}
                        {longitude.toFixed(
                            6,
                        )}
                    </p>
                </div>


                <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Ambulance
                    </p>

                    <p className="mt-1 text-sm font-black text-(--sj-text-muted)">
                        Not assigned
                    </p>
                </div>
            </div>
        </div>
    );
}


function MapRecenterButton({
    latitude,
    longitude,
}) {
    const map =
        useMap();


    function handleRecenter() {
        map.flyTo(
            [
                latitude,
                longitude,
            ],
            16,
            {
                duration: 0.8,
            },
        );
    }


    return (
        <button
            type="button"
            onClick={
                handleRecenter
            }
            className="absolute bottom-5 right-5 z-500 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-primary) shadow-lg transition hover:scale-105 hover:bg-(--sj-background)"
            title="Center on your emergency location"
            aria-label="Center on your emergency location"
        >
            <Navigation className="h-5 w-5" />
        </button>
    );
}


function InfoCard({
    icon: Icon,
    label,
    value,
    description,
}) {
    return (
        <div className="sj-card p-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        {label}
                    </p>

                    <p className="mt-1 truncate text-lg font-black text-(--sj-text)">
                        {value}
                    </p>
                </div>
            </div>

            <p className="mt-3 text-xs text-(--sj-text-muted)">
                {description}
            </p>
        </div>
    );
}


function HospitalCard() {
    return (
        <div className="sj-card overflow-hidden">
            <div className="border-b border-(--sj-border) p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                        <Hospital className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Destination
                        </p>

                        <h2 className="mt-1 text-base font-black text-(--sj-text)">
                            Hospital coordination
                        </h2>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-base font-black text-(--sj-text)">
                    Hospital not selected yet
                </h3>

                <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                    <p className="text-sm leading-6 text-(--sj-text-soft)">
                        A suitable emergency hospital will appear here once hospital coordination is completed.
                    </p>
                </div>

                <div className="mt-5 rounded-xl bg-(--sj-surface-2) p-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-(--sj-text-soft)">
                            Destination status
                        </span>

                        <span className="text-sm font-black text-(--sj-text-muted)">
                            Pending
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}


function Timeline({
    status,
    emergency,
}) {
    const steps = [
        {
            title: 'Emergency request created',
            description:
                'SOS request received by Sanjeevani',
            active:
                status === 'CREATED',
            complete:
                true,
        },
        {
            title: 'Emergency assessment',
            description:
                'Emergency severity assessment',
            active:
                status === 'ASSESSING',
            complete:
                [
                    'COORDINATING',
                    'HOSPITAL_SELECTED',
                    'AMBULANCE_ASSIGNMENT',
                    'AMBULANCE_ASSIGNED',
                    'PARAMEDIC_ASSIGNED',
                    'PATIENT_PICKED_UP',
                    'TRANSPORTING',
                    'ARRIVED_AT_HOSPITAL',
                    'COMPLETED',
                ].includes(status),
        },
        {
            title: 'Hospital coordination',
            description:
                'Suitable emergency hospital selection',
            active:
                status === 'COORDINATING',
            complete:
                [
                    'HOSPITAL_SELECTED',
                    'AMBULANCE_ASSIGNMENT',
                    'AMBULANCE_ASSIGNED',
                    'PARAMEDIC_ASSIGNED',
                    'PATIENT_PICKED_UP',
                    'TRANSPORTING',
                    'ARRIVED_AT_HOSPITAL',
                    'COMPLETED',
                ].includes(status),
        },
        {
            title: 'Ambulance coordination',
            description:
                'Finding and assigning an available ambulance',
            active:
                status === 'AMBULANCE_ASSIGNMENT',
            complete:
                [
                    'AMBULANCE_ASSIGNED',
                    'PARAMEDIC_ASSIGNED',
                    'PATIENT_PICKED_UP',
                    'TRANSPORTING',
                    'ARRIVED_AT_HOSPITAL',
                    'COMPLETED',
                ].includes(status),
        },
        {
            title: 'Ambulance assigned',
            description:
                'An ambulance and paramedic are assigned',
            active:
                status === 'AMBULANCE_ASSIGNED' ||
                status === 'PARAMEDIC_ASSIGNED',
            complete:
                [
                    'PATIENT_PICKED_UP',
                    'TRANSPORTING',
                    'ARRIVED_AT_HOSPITAL',
                    'COMPLETED',
                ].includes(status),
        },
        {
            title: 'Patient pickup',
            description:
                'Paramedic reaches the patient',
            active:
                status === 'PATIENT_PICKED_UP',
            complete:
                [
                    'TRANSPORTING',
                    'ARRIVED_AT_HOSPITAL',
                    'COMPLETED',
                ].includes(status),
        },
        {
            title: 'Hospital arrival',
            description:
                'Patient reaches the selected hospital',
            active:
                status === 'ARRIVED_AT_HOSPITAL',
            complete:
                status === 'COMPLETED',
        },
    ];


    return (
        <div className="sj-card p-5 sm:p-6">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                    Emergency timeline
                </p>

                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                    Coordination progress
                </h2>

                <p className="mt-2 text-xs text-(--sj-text-soft)">
                    {emergency.emergency_type
                        ? getEmergencyTypeLabel(
                            emergency.emergency_type,
                        )
                        : 'Emergency'}
                </p>
            </div>

            <div className="space-y-0">
                {steps.map(
                    (
                        item,
                        index,
                    ) => (
                        <div
                            key={
                                item.title
                            }
                            className="relative flex gap-4 pb-6 last:pb-0"
                        >
                            {index <
                                steps.length -
                                1 && (
                                    <div
                                        className={`absolute left-3.75 top-8 h-[calc(100%-1rem)] w-px ${item.complete
                                                ? 'bg-emerald-500/30'
                                                : 'bg-(--sj-border)'
                                            }`}
                                    />
                                )}

                            <div
                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.active
                                        ? 'bg-(--sj-primary) text-white'
                                        : item.complete
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                                    }`}
                            >
                                {item.complete ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <Clock3 className="h-4 w-4" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-sm font-black ${item.complete
                                            ? 'text-(--sj-text)'
                                            : 'text-(--sj-text-muted)'
                                        }`}
                                >
                                    {
                                        item.title
                                    }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    {
                                        item.description
                                    }
                                </p>

                                {item.active && (
                                    <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-(--sj-primary)">
                                        <span className="sj-live-dot" />
                                        Current
                                    </span>
                                )}
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}


function EmergencyDetails({
    emergency,
}) {
    return (
        <div className="sj-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                    <UserRound className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Emergency information
                    </p>

                    <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                        What you reported
                    </h2>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Emergency type
                    </p>

                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                        {getEmergencyTypeLabel(
                            emergency.emergency_type,
                        )}
                    </p>
                </div>

                {emergency.emergency_details && (
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Additional details
                        </p>

                        <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                            {
                                emergency.emergency_details
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}


function SafetyCard() {
    return (
        <div className="rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-5">
            <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                <div>
                    <h2 className="text-sm font-black text-(--sj-text)">
                        Stay available
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                        Keep your phone nearby and remain at the shared location if it is safe to do so. Emergency coordination updates will appear here as the backend workflow progresses.
                    </p>
                </div>
            </div>
        </div>
    );
}


export default TrackingPage;