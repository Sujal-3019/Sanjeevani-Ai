import React from 'react';
import {
    Activity,
    Ambulance,
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Hospital,
    LocateFixed,
    MapPin,
    Phone,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientNavbar from '../../components/layout/PatientNavbar';

const FLOW_STEPS = [
    {
        key: 'locating',
        label: 'Location',
        description: 'Capturing your current location',
        icon: LocateFixed,
    },
    {
        key: 'assessing',
        label: 'AI triage',
        description: 'Assessing emergency priority',
        icon: Sparkles,
    },
    {
        key: 'coordinating',
        label: 'Coordination',
        description: 'Finding the right emergency resources',
        icon: Hospital,
    },
    {
        key: 'assigned',
        label: 'Ambulance',
        description: 'Connecting you with an ambulance',
        icon: Ambulance,
    },
];

const MOCK_LOCATION = {
    area: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    coordinates: '28.6315° N, 77.2167° E',
};

const MOCK_HOSPITAL = {
    name: 'Sanjeevani Emergency Hospital',
    distance: '3.8 km',
    eta: '8 min',
};

const MOCK_AMBULANCE = {
    id: 'AMB-042',
    eta: '6 min',
    paramedic: 'Rohan Mehta',
};

function getStepIndex(step) {
    const index = FLOW_STEPS.findIndex((item) => item.key === step);

    return index === -1 ? -1 : index;
}

function EmergencyPage() {
    const [step, setStep] = React.useState('confirm');
    const [error, setError] = React.useState('');

    const currentStepIndex = getStepIndex(step);

    React.useEffect(() => {
        if (step === 'locating') {
            const timer = window.setTimeout(() => {
                setStep('assessing');
            }, 1800);

            return () => window.clearTimeout(timer);
        }

        if (step === 'assessing') {
            const timer = window.setTimeout(() => {
                setStep('coordinating');
            }, 2200);

            return () => window.clearTimeout(timer);
        }

        if (step === 'coordinating') {
            const timer = window.setTimeout(() => {
                setStep('assigned');
            }, 2200);

            return () => window.clearTimeout(timer);
        }

        return undefined;
    }, [step]);

    function startEmergency() {
        setError('');
        setStep('locating');
    }

    function resetEmergency() {
        setError('');
        setStep('confirm');
    }

    function handleCallEmergency() {
        setError(
            'Calling emergency services will be connected when the backend integration is enabled.',
        );
    }

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
                {step === 'confirm' && (
                    <ConfirmEmergency
                        onConfirm={startEmergency}
                        onCancel={resetEmergency}
                        onCallEmergency={handleCallEmergency}
                        error={error}
                    />
                )}

                {step !== 'confirm' && (
                    <EmergencyProgress
                        step={step}
                        currentStepIndex={currentStepIndex}
                        error={error}
                        onCancel={resetEmergency}
                        onCallEmergency={handleCallEmergency}
                    />
                )}
            </main>
        </div>
    );
}

function ConfirmEmergency({
    onConfirm,
    onCancel,
    onCallEmergency,
    error,
}) {
    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                    <ShieldAlert className="h-8 w-8" />
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-red-500">
                    Emergency assistance
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-(--sj-text) sm:text-5xl">
                    Do you need emergency help?
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-(--sj-text-soft) sm:text-base">
                    Confirming SOS will share your current location with the
                    Sanjeevani emergency coordination system and begin finding
                    appropriate emergency assistance.
                </p>
            </div>

            <div className="sj-card overflow-hidden">
                <div className="border-b border-(--sj-border) bg-red-500/4 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-black text-(--sj-text)">
                                Your location will be shared
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                This allows the system to identify nearby
                                hospitals and coordinate an ambulance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-center gap-2 text-(--sj-text-muted)">
                            <LocateFixed className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-[0.12em]">
                                Location
                            </span>
                        </div>

                        <p className="mt-2 text-sm font-black text-(--sj-text)">
                            Current location
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            GPS will be captured when you confirm.
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-center gap-2 text-(--sj-text-muted)">
                            <Activity className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-[0.12em]">
                                Coordination
                            </span>
                        </div>

                        <p className="mt-2 text-sm font-black text-(--sj-text)">
                            AI-assisted triage
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Emergency priority will be assessed.
                        </p>
                    </div>
                </div>

                <div className="border-t border-(--sj-border) p-5 sm:p-6">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="sj-sos-button w-full text-base"
                    >
                        <ShieldAlert className="mr-2 h-5 w-5" />
                        CONFIRM SOS
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="mt-3 w-full rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 py-3.5 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/30 hover:text-(--sj-text)"
                    >
                        Cancel
                    </button>

                    <p className="mt-4 text-center text-xs leading-5 text-(--sj-text-muted)">
                        If you are in immediate danger, contact your local
                        emergency services directly.
                    </p>

                    <button
                        type="button"
                        onClick={onCallEmergency}
                        className="mx-auto mt-2 flex items-center gap-2 text-xs font-bold text-(--sj-primary) hover:underline"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        Emergency services
                    </button>

                    {error && (
                        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-xs font-semibold leading-5 text-amber-600 dark:text-amber-400">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-(--sj-text-muted)">
                <ShieldAlert className="h-3.5 w-3.5" />
                Emergency information is handled according to your
                authorization and consent settings.
            </div>
        </div>
    );
}

function EmergencyProgress({
    step,
    currentStepIndex,
    error,
    onCancel,
    onCallEmergency,
}) {
    const isAssigned = step === 'assigned';

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
                <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                        isAssigned
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-(--sj-primary)/10 text-(--sj-primary)'
                    }`}
                >
                    {isAssigned ? (
                        <CheckCircle2 className="h-8 w-8" />
                    ) : (
                        <Activity className="h-8 w-8 animate-pulse" />
                    )}
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                    Emergency coordination
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-(--sj-text) sm:text-5xl">
                    {getMainHeading(step)}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-(--sj-text-soft) sm:text-base">
                    {getMainDescription(step)}
                </p>
            </div>

            <div className="mb-8 sj-card p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-4">
                    {FLOW_STEPS.map((item, index) => {
                        const Icon = item.icon;
                        const isComplete = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div
                                key={item.key}
                                className="relative flex items-start gap-3 sm:block"
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                                        isComplete
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : isCurrent
                                              ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                              : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                                    }`}
                                >
                                    {isComplete ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <Icon
                                            className={`h-5 w-5 ${
                                                isCurrent ? 'animate-pulse' : ''
                                            }`}
                                        />
                                    )}
                                </div>

                                <div className="sm:mt-3">
                                    <p
                                        className={`text-sm font-black ${
                                            isCurrent || isComplete
                                                ? 'text-(--sj-text)'
                                                : 'text-(--sj-text-muted)'
                                        }`}
                                    >
                                        {item.label}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-muted)">
                                        {item.description}
                                    </p>
                                </div>

                                {index < FLOW_STEPS.length - 1 && (
                                    <div
                                        className={`absolute left-5 top-10 hidden h-px w-[calc(100%-1.25rem)] sm:block ${
                                            index < currentStepIndex
                                                ? 'bg-emerald-500/40'
                                                : 'bg-(--sj-border)'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="sj-card overflow-hidden">
                    <div className="border-b border-(--sj-border) p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-(--sj-primary)">
                                    Live emergency
                                </p>

                                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                    Coordination status
                                </h2>
                            </div>

                            <span className="sj-status sj-status-success">
                                <span className="sj-live-dot" />
                                Active
                            </span>
                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        <StatusRow
                            icon={LocateFixed}
                            title="Location captured"
                            description={`${MOCK_LOCATION.area}, ${MOCK_LOCATION.city}`}
                            complete
                        />

                        <StatusRow
                            icon={Sparkles}
                            title="AI-assisted triage"
                            description={
                                step === 'assessing'
                                    ? 'Assessing emergency priority...'
                                    : 'Priority assessment completed'
                            }
                            complete={currentStepIndex > 0}
                            active={step === 'assessing'}
                        />

                        <StatusRow
                            icon={Hospital}
                            title="Hospital coordination"
                            description={
                                currentStepIndex >= 2
                                    ? `${MOCK_HOSPITAL.name} · ${MOCK_HOSPITAL.distance}`
                                    : 'Finding an appropriate nearby hospital...'
                            }
                            complete={currentStepIndex > 2}
                            active={step === 'coordinating'}
                        />

                        <StatusRow
                            icon={Ambulance}
                            title="Ambulance assignment"
                            description={
                                isAssigned
                                    ? `${MOCK_AMBULANCE.id} · ETA ${MOCK_AMBULANCE.eta}`
                                    : 'Waiting for ambulance assignment...'
                            }
                            complete={isAssigned}
                            active={step === 'assigned'}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="sj-map min-h-64">
                        <div className="sj-map-grid" />

                        <div className="relative flex min-h-64 items-center justify-center">
                            <div className="absolute h-32 w-32 rounded-full border border-(--sj-primary)/20 bg-(--sj-primary)/5" />
                            <div className="absolute h-20 w-20 rounded-full border border-(--sj-primary)/30 bg-(--sj-primary)/10" />

                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-(--sj-primary) text-white shadow-lg">
                                <MapPin className="h-6 w-6" />
                            </div>

                            <div className="absolute bottom-4 left-4 rounded-xl border border-(--sj-border) bg-(--sj-surface)/90 px-3 py-2 backdrop-blur">
                                <p className="text-xs font-black text-(--sj-text)">
                                    {MOCK_LOCATION.area}
                                </p>
                                <p className="mt-0.5 text-[10px] text-(--sj-text-muted)">
                                    {MOCK_LOCATION.coordinates}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isAssigned ? (
                        <AmbulanceCard />
                    ) : (
                        <div className="sj-card p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <Clock3 className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-black text-(--sj-text)">
                                        Please stay where you are
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                        Keep your phone available. The emergency
                                        coordination process is currently
                                        running.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-semibold leading-5 text-amber-600 dark:text-amber-400">
                            {error}
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={onCallEmergency}
                            className="inline-flex items-center gap-2 text-xs font-bold text-(--sj-primary) hover:underline"
                        >
                            <Phone className="h-3.5 w-3.5" />
                            Need emergency services instead?
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="mx-auto mt-3 block text-xs font-bold text-(--sj-text-muted) hover:text-(--sj-text)"
                        >
                            Cancel this demo emergency
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5 text-center">
                <p className="text-xs font-semibold leading-5 text-(--sj-text-muted)">
                    AI-assisted triage supports emergency coordination and does
                    not replace assessment or decisions by qualified medical
                    professionals.
                </p>
            </div>
        </div>
    );
}

function StatusRow({
    icon: Icon,
    title,
    description,
    complete,
    active,
}) {
    return (
        <div className="flex items-start gap-4">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    complete
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : active
                          ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                          : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                }`}
            >
                {complete ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <Icon
                        className={`h-5 w-5 ${active ? 'animate-pulse' : ''}`}
                    />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-black text-(--sj-text)">
                        {title}
                    </h3>

                    {active && (
                        <span className="sj-status sj-status-info">
                            In progress
                        </span>
                    )}

                    {complete && (
                        <span className="sj-status sj-status-success">
                            Complete
                        </span>
                    )}
                </div>

                <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                    {description}
                </p>
            </div>
        </div>
    );
}

function AmbulanceCard() {
    return (
        <div className="sj-card overflow-hidden">
            <div className="border-b border-(--sj-border) bg-emerald-500/4 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Ambulance className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                            Ambulance assigned
                        </p>

                        <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                            Help is on the way
                        </h2>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Ambulance
                    </p>
                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                        {MOCK_AMBULANCE.id}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Estimated arrival
                    </p>
                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                        {MOCK_AMBULANCE.eta}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Paramedic
                    </p>
                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                        {MOCK_AMBULANCE.paramedic}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        Hospital
                    </p>
                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                        {MOCK_HOSPITAL.name}
                    </p>
                </div>
            </div>

            <div className="border-t border-(--sj-border) p-5 sm:p-6">
                <Link
                    to="/dashboard/patient/tracking"
                    className="sj-ai-button w-full px-5 py-3.5 text-sm"
                >
                    <MapPin className="h-4 w-4" />
                    OPEN LIVE TRACKING
                </Link>
            </div>
        </div>
    );
}

function getMainHeading(step) {
    if (step === 'locating') {
        return 'Locating you...';
    }

    if (step === 'assessing') {
        return 'Assessing emergency priority...';
    }

    if (step === 'coordinating') {
        return 'Coordinating emergency care...';
    }

    return 'Your ambulance is on the way';
}

function getMainDescription(step) {
    if (step === 'locating') {
        return 'We are capturing your current location so nearby emergency resources can be identified.';
    }

    if (step === 'assessing') {
        return 'Sanjeevani AI is performing an initial emergency priority assessment to support coordination.';
    }

    if (step === 'coordinating') {
        return 'The system is matching your emergency with an appropriate hospital and available ambulance resources.';
    }

    return 'Your emergency request has been coordinated. You can continue to the live tracking screen.';
}

export default EmergencyPage;