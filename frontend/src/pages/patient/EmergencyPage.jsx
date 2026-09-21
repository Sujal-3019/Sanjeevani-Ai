import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    Activity,
    ArrowLeft,
    CheckCircle2,
    Clock3,
    LocateFixed,
    MapPin,
    Phone,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import PatientNavbar from '../../components/layout/PatientNavbar';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import emergencyService from '../../services/emergencyService';


const EMERGENCY_TYPES = [
    {
        value: 'CHEST_PAIN',
        label: 'Chest pain',
        description: 'Chest pain, pressure, or tightness',
    },
    {
        value: 'BREATHING_DIFFICULTY',
        label: 'Breathing difficulty',
        description: 'Severe difficulty breathing or shortness of breath',
    },
    {
        value: 'STROKE',
        label: 'Possible stroke',
        description: 'Sudden weakness, speech difficulty, or facial drooping',
    },
    {
        value: 'SEVERE_BLEEDING',
        label: 'Severe bleeding',
        description: 'Heavy or uncontrolled bleeding',
    },
    {
        value: 'ROAD_ACCIDENT',
        label: 'Road accident',
        description: 'Vehicle accident or serious road injury',
    },
    {
        value: 'BURNS',
        label: 'Serious burns',
        description: 'Major or severe burns',
    },
    {
        value: 'UNCONSCIOUS',
        label: 'Unconscious person',
        description: 'Person is unconscious or unresponsive',
    },
    {
        value: 'SEIZURE',
        label: 'Seizure',
        description: 'Severe or ongoing seizure',
    },
    {
        value: 'PREGNANCY_EMERGENCY',
        label: 'Pregnancy emergency',
        description: 'Serious pregnancy-related emergency',
    },
    {
        value: 'POISONING',
        label: 'Poisoning',
        description: 'Possible poisoning or toxic exposure',
    },
    {
        value: 'SEVERE_ALLERGIC_REACTION',
        label: 'Severe allergic reaction',
        description: 'Serious allergic reaction or anaphylaxis',
    },
    {
        value: 'OTHER',
        label: 'Other emergency',
        description: 'Another serious medical emergency',
    },
];


const FLOW_STEPS = [
    {
        id: 'locating',
        label: 'Locating you',
        description: 'Getting your current GPS location',
        icon: LocateFixed,
    },
    {
        id: 'creating',
        label: 'Creating emergency',
        description: 'Sending your emergency information securely',
        icon: ShieldAlert,
    },
    {
        id: 'created',
        label: 'Emergency created',
        description: 'Your emergency request has been received',
        icon: CheckCircle2,
    },
];


function getLocation() {
    return new Promise(
        (resolve, reject) => {
            if (
                !navigator.geolocation
            ) {
                reject(
                    new Error(
                        'Location services are not supported by this browser.',
                    ),
                );

                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude:
                            position.coords.latitude,
                        longitude:
                            position.coords.longitude,
                        accuracy:
                            position.coords.accuracy,
                    });
                },
                (error) => {
                    let message =
                        'Unable to get your current location.';

                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {
                        message =
                            'Location permission was denied. Please allow location access and try again.';
                    }

                    if (
                        error.code ===
                        error.POSITION_UNAVAILABLE
                    ) {
                        message =
                            'Your current location is unavailable. Please check your device location services and try again.';
                    }

                    if (
                        error.code ===
                        error.TIMEOUT
                    ) {
                        message =
                            'Getting your location took too long. Please try again.';
                    }

                    reject(
                        new Error(message),
                    );
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                },
            );
        },
    );
}


function EmergencyPage() {
    const {
        isLoading: authLoading,
        isAuthenticated,
    } = useAuth();

    const [step, setStep] = useState('confirm');

    const [
        showEmergencyModal,
        setShowEmergencyModal,
    ] = useState(false);

    const [
        selectedEmergencyType,
        setSelectedEmergencyType,
    ] = useState('');

    const [
        emergencyDetails,
        setEmergencyDetails,
    ] = useState('');

    const [
        currentLocation,
        setCurrentLocation,
    ] = useState(null);

    const [
        emergencyResult,
        setEmergencyResult,
    ] = useState(null);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        locationAccuracy,
        setLocationAccuracy,
    ] = useState(null);


    useEffect(() => {
        if (
            authLoading ||
            !isAuthenticated
        ) {
            return;
        }
    }, [
        authLoading,
        isAuthenticated,
    ]);


    const startEmergency = useCallback(
        () => {
            setErrorMessage('');
            setShowEmergencyModal(true);
        },
        [],
    );


    const handleEmergencyTypeSelect =
        useCallback(
            (value) => {
                setSelectedEmergencyType(
                    value,
                );
                setErrorMessage('');
            },
            [],
        );


    const handleCallEmergency =
        useCallback(
            () => {
                window.location.href =
                    'tel:112';
            },
            [],
        );


    const handleConfirmSOS =
        useCallback(
            async () => {
                if (
                    !selectedEmergencyType
                ) {
                    setErrorMessage(
                        'Please select what happened before confirming the SOS.',
                    );

                    return;
                }

                setErrorMessage('');
                setIsSubmitting(true);
                setShowEmergencyModal(false);

                try {
                    setStep('locating');

                    const location =
                        await getLocation();

                    setCurrentLocation(
                        location,
                    );

                    setLocationAccuracy(
                        location.accuracy,
                    );

                    setStep('creating');

                    const token =
                        authService.getAccessToken();

                    if (!token) {
                        throw new Error(
                            'Your session has expired. Please log in again.',
                        );
                    }

                    const response =
                        await emergencyService.createSOS(
                            {
                                emergency_type:
                                    selectedEmergencyType,

                                emergency_details:
                                    emergencyDetails.trim() ||
                                    null,

                                latitude:
                                    location.latitude,

                                longitude:
                                    location.longitude,
                            },
                            token,
                        );

                    setEmergencyResult(
                        response,
                    );

                    setStep('created');
                } catch (error) {
                    console.error(
                        'SOS creation failed:',
                        error,
                    );

                    setErrorMessage(
                        error?.message ||
                        'We could not create your emergency request. Please try again.',
                    );

                    setStep('confirm');
                    setShowEmergencyModal(
                        true,
                    );
                } finally {
                    setIsSubmitting(false);
                }
            },
            [
                selectedEmergencyType,
                emergencyDetails,
            ],
        );


    const resetEmergency =
        useCallback(
            () => {
                setStep('confirm');

                setShowEmergencyModal(false);

                setSelectedEmergencyType('');

                setEmergencyDetails('');

                setCurrentLocation(null);

                setLocationAccuracy(null);

                setEmergencyResult(null);

                setErrorMessage('');
            },
            [],
        );


    if (authLoading) {
        return (
            <div className="sanjeevani-page flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--sj-primary)/20 border-t-(--sj-primary)" />

                    <p className="mt-4 text-sm font-semibold text-(--sj-text-soft)">
                        Loading emergency services...
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        to="/dashboard/patient"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/30 hover:text-(--sj-primary)"
                        aria-label="Back to patient dashboard"
                    >
                        <ArrowLeft
                            className="h-5 w-5"
                        />
                    </Link>

                    <div>
                        <p className="text-sm font-semibold text-(--sj-primary)">
                            Emergency Assistance
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight text-(--sj-text)">
                            Emergency SOS
                        </h1>
                    </div>
                </div>


                {errorMessage && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                )}


                {step === 'confirm' && (
                    <section className="overflow-hidden rounded-3xl border border-(--sj-border) bg-(--sj-surface) shadow-sm">
                        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="p-6 sm:p-8 lg:p-10">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                                    <Activity className="h-4 w-4" />

                                    Emergency assistance
                                </div>

                                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-(--sj-text) sm:text-4xl">
                                    Need immediate medical help?
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-6 text-(--sj-text-soft) sm:text-base">
                                    Press SOS and tell us what happened. We'll use your current location and emergency information to create your emergency request.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={
                                            startEmergency
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-base font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <ShieldAlert className="h-5 w-5" />

                                        {isSubmitting
                                            ? 'Processing...'
                                            : 'SOS — I Need Help'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCallEmergency
                                        }
                                        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-(--sj-border) bg-(--sj-surface) px-7 text-base font-bold text-(--sj-text) transition hover:border-(--sj-primary)/30 hover:text-(--sj-primary)"
                                    >
                                        <Phone className="h-5 w-5" />

                                        Call 112
                                    </button>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-(--sj-background) p-4">
                                        <LocateFixed className="h-5 w-5 text-(--sj-primary)" />

                                        <p className="mt-3 text-sm font-bold text-(--sj-text)">
                                            GPS location
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Your current location will be requested when you confirm SOS.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-(--sj-background) p-4">
                                        <Sparkles className="h-5 w-5 text-(--sj-primary)" />

                                        <p className="mt-3 text-sm font-bold text-(--sj-text)">
                                            Emergency details
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Tell us what happened so the emergency can be assessed.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-(--sj-background) p-4">
                                        <ShieldAlert className="h-5 w-5 text-(--sj-primary)" />

                                        <p className="mt-3 text-sm font-bold text-(--sj-text)">
                                            Secure request
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Your request is linked to your authenticated account.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-(--sj-border) bg-(--sj-background) p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <ShieldAlert className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            When to use SOS
                                        </p>

                                        <p className="text-xs text-(--sj-text-soft)">
                                            For serious or potentially life-threatening emergencies.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {[
                                        'Severe chest pain',
                                        'Difficulty breathing',
                                        'Unconsciousness',
                                        'Severe bleeding',
                                        'Serious accident',
                                        'Suspected stroke',
                                    ].map(
                                        (item) => (
                                            <div
                                                key={
                                                    item
                                                }
                                                className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-3"
                                            >
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                                <span className="text-sm font-medium text-(--sj-text)">
                                                    {item}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}


                {step !== 'confirm' && (
                    <section className="rounded-3xl border border-(--sj-border) bg-(--sj-surface) p-6 shadow-sm sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                {step === 'created'
                                    ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                    )
                                    : (
                                        <LocateFixed className="h-6 w-6 animate-pulse" />
                                    )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-(--sj-primary)">
                                    Emergency assistance
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-(--sj-text)">
                                    {step === 'locating'
                                        ? 'Getting your location...'
                                        : step === 'creating'
                                            ? 'Creating your emergency request...'
                                            : 'Emergency request created'}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    {step === 'locating'
                                        ? 'Please allow location access when your browser asks for permission.'
                                        : step === 'creating'
                                            ? 'Your emergency information and current location are being securely sent to Sanjeevani.'
                                            : 'Your SOS has been successfully registered.'}
                                </p>
                            </div>
                        </div>


                        <div className="mt-8 space-y-3">
                            {FLOW_STEPS.map(
                                (
                                    flowStep,
                                ) => {
                                    const Icon =
                                        flowStep.icon;

                                    const isActive =
                                        flowStep.id ===
                                        step;

                                    const isCompleted =
                                        (
                                            step ===
                                            'creating' &&
                                            flowStep.id ===
                                            'locating'
                                        ) ||
                                        (
                                            step ===
                                            'created' &&
                                            (
                                                flowStep.id ===
                                                'locating' ||
                                                flowStep.id ===
                                                'creating' ||
                                                flowStep.id ===
                                                'created'
                                            )
                                        );

                                    return (
                                        <div
                                            key={
                                                flowStep.id
                                            }
                                            className={`flex items-center gap-4 rounded-2xl border p-4 ${isActive
                                                    ? 'border-(--sj-primary)/30 bg-(--sj-primary)/5'
                                                    : 'border-(--sj-border) bg-(--sj-background)'
                                                }`}
                                        >
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCompleted
                                                    ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                                    : 'bg-(--sj-surface) text-(--sj-text-soft)'
                                                }`}>
                                                {isActive &&
                                                    step !==
                                                    'created' ? (
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--sj-primary)/20 border-t-(--sj-primary)" />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-(--sj-text)">
                                                    {flowStep.label}
                                                </p>

                                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                    {flowStep.description}
                                                </p>
                                            </div>

                                            {isCompleted &&
                                                !isActive && (
                                                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-(--sj-primary)" />
                                                )}
                                        </div>
                                    );
                                },
                            )}
                        </div>


                        {currentLocation && (
                            <div className="mt-6 rounded-2xl border border-(--sj-border) bg-(--sj-background) p-5">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Current location captured
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            GPS coordinates received successfully.
                                        </p>
                                    </div>
                                </div>

                                {locationAccuracy !==
                                    null && (
                                        <p className="mt-3 text-xs text-(--sj-text-soft)">
                                            Approximate GPS accuracy:{' '}
                                            {Math.round(
                                                locationAccuracy,
                                            )}{' '}
                                            metres
                                        </p>
                                    )}
                            </div>
                        )}


                        {emergencyResult && (
                            <div className="mt-6 rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary)/5 p-5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Emergency ID
                                        </p>

                                        <p className="mt-1 break-all font-mono text-xs text-(--sj-text-soft)">
                                            {emergencyResult.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-(--sj-surface) p-3">
                                        <p className="text-xs text-(--sj-text-soft)">
                                            Status
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                            {emergencyResult.status}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-(--sj-surface) p-3">
                                        <p className="text-xs text-(--sj-text-soft)">
                                            Emergency type
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                            {emergencyResult.emergency_type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}


                        {step === 'created' && (
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={
                                        resetEmergency
                                    }
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text) transition hover:border-(--sj-primary)/30 hover:text-(--sj-primary)"
                                >
                                    Return to emergency screen
                                </button>

                                <Link
                                    to={`/dashboard/patient/tracking?emergency_id=${emergencyResult.id}`}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:opacity-90"
                                >
                                    <MapPin className="h-4 w-4" />

                                    Open tracking
                                </Link>
                            </div>
                        )}
                    </section>
                )}
            </main>


            {showEmergencyModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6">
                    <div
                        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-(--sj-surface) shadow-2xl sm:max-w-2xl sm:rounded-3xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="emergency-modal-title"
                    >
                        <div className="sticky top-0 z-10 border-b border-(--sj-border) bg-(--sj-surface) px-5 py-4 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                                        Emergency SOS
                                    </p>

                                    <h2
                                        id="emergency-modal-title"
                                        className="mt-1 text-xl font-bold text-(--sj-text)"
                                    >
                                        What happened?
                                    </h2>

                                    <p className="mt-1 text-sm text-(--sj-text-soft)">
                                        Select the emergency that best describes the situation.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEmergencyModal(
                                            false,
                                        )
                                    }
                                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-background) hover:text-(--sj-text)"
                                    aria-label="Close emergency dialog"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </div>
                        </div>


                        <div className="p-5 sm:p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {EMERGENCY_TYPES.map(
                                    (type) => {
                                        const isSelected =
                                            selectedEmergencyType ===
                                            type.value;

                                        return (
                                            <button
                                                key={
                                                    type.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleEmergencyTypeSelect(
                                                        type.value,
                                                    )
                                                }
                                                className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                        ? 'border-(--sj-primary) bg-(--sj-primary)/5 ring-2 ring-(--sj-primary)/10'
                                                        : 'border-(--sj-border) bg-(--sj-background) hover:border-(--sj-primary)/30'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${isSelected
                                                            ? 'border-(--sj-primary) bg-(--sj-primary)'
                                                            : 'border-(--sj-text-soft)'
                                                        }`} />

                                                    <div>
                                                        <p className="text-sm font-bold text-(--sj-text)">
                                                            {type.label}
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                            {type.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    },
                                )}
                            </div>


                            <div className="mt-5">
                                <label
                                    htmlFor="emergency-details"
                                    className="text-sm font-bold text-(--sj-text)"
                                >
                                    Anything else we should know?
                                    <span className="ml-1 font-normal text-(--sj-text-soft)">
                                        Optional
                                    </span>
                                </label>

                                <textarea
                                    id="emergency-details"
                                    value={
                                        emergencyDetails
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setEmergencyDetails(
                                            event.target.value.slice(
                                                0,
                                                500,
                                            ),
                                        )
                                    }
                                    rows={4}
                                    placeholder="For example: severe leg injury after a bike accident..."
                                    className="mt-2 w-full resize-none rounded-2xl border border-(--sj-border) bg-(--sj-background) px-4 py-3 text-sm text-(--sj-text) outline-none transition placeholder:text-(--sj-text-soft)/60 focus:border-(--sj-primary) focus:ring-2 focus:ring-(--sj-primary)/10"
                                />

                                <p className="mt-1 text-right text-xs text-(--sj-text-soft)">
                                    {emergencyDetails.length}
                                    /500
                                </p>
                            </div>


                            {errorMessage && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                    {errorMessage}
                                </div>
                            )}


                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEmergencyModal(
                                            false,
                                        )
                                    }
                                    className="min-h-12 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text) transition hover:bg-(--sj-background)"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmSOS
                                    }
                                    disabled={
                                        !selectedEmergencyType ||
                                        isSubmitting
                                    }
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShieldAlert className="h-4 w-4" />

                                    {isSubmitting
                                        ? 'Getting location...'
                                        : 'Confirm SOS'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default EmergencyPage;