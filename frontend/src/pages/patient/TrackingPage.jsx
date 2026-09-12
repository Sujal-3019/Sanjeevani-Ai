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
import { Link } from 'react-router-dom';
import PatientNavbar from '../../components/layout/PatientNavbar';

const emergency = {
    id: 'SOS-2026-00481',
    status: 'Ambulance on the way',
    eta: '6 min',
    distance: '2.4 km',
    hospital: 'Sanjeevani Emergency Hospital',
    hospitalDistance: '3.8 km',
    ambulanceId: 'AMB-042',
    paramedic: 'Rohan Mehta',
    location: 'Connaught Place, New Delhi',
};

const timeline = [
    {
        title: 'Emergency request created',
        description: 'SOS request received',
        time: '10:42 AM',
        complete: true,
    },
    {
        title: 'Location captured',
        description: 'Patient location confirmed',
        time: '10:42 AM',
        complete: true,
    },
    {
        title: 'Emergency priority assessed',
        description: 'AI-assisted triage completed',
        time: '10:43 AM',
        complete: true,
    },
    {
        title: 'Hospital coordination completed',
        description: 'Emergency hospital identified',
        time: '10:43 AM',
        complete: true,
    },
    {
        title: 'Ambulance dispatched',
        description: 'AMB-042 is travelling to your location',
        time: '10:44 AM',
        complete: true,
        active: true,
    },
    {
        title: 'Patient pickup',
        description: 'Waiting for paramedic arrival',
        time: 'Pending',
        complete: false,
    },
];

function TrackingPage() {
    const [error, setError] = React.useState('');

    function handleCallParamedic() {
        setError(
            'Calling the assigned paramedic will be enabled when the backend communication service is connected.',
        );
    }

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
                <div className="mb-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                Emergency {emergency.id}
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                {emergency.status}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                Your assigned ambulance is travelling to your
                                location.
                            </p>
                        </div>

                        <span className="sj-status sj-status-success w-fit">
                            <span className="sj-live-dot" />
                            Coordination active
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <section className="space-y-6">
                        <TrackingMap />

                        <div className="grid gap-4 sm:grid-cols-3">
                            <InfoCard
                                icon={Clock3}
                                label="Estimated arrival"
                                value={emergency.eta}
                                description="Based on current route"
                            />

                            <InfoCard
                                icon={Navigation}
                                label="Distance"
                                value={emergency.distance}
                                description="Ambulance to you"
                            />

                            <InfoCard
                                icon={Hospital}
                                label="Hospital"
                                value={emergency.hospitalDistance}
                                description="Destination"
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
                                            Assigned ambulance
                                        </p>

                                        <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                            {emergency.ambulanceId}
                                        </h2>

                                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                                            {emergency.paramedic}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCallParamedic}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 py-3 text-sm font-bold text-(--sj-text) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary)"
                                >
                                    <Phone className="h-4 w-4" />
                                    Contact paramedic
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-semibold leading-5 text-amber-600 dark:text-amber-400">
                                    {error}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <HospitalCard />

                        <Timeline />

                        <SafetyCard />
                    </aside>
                </div>
            </main>
        </div>
    );
}

function TrackingMap() {
    return (
        <div className="sj-map min-h-107.5">
            <div className="sj-map-grid" />

            <div className="relative min-h-107.5 overflow-hidden">
                <div className="absolute left-[18%] top-[23%] h-1 w-[48%] rotate-18 rounded-full bg-(--sj-primary)/25" />

                <div className="absolute left-[18%] top-[23%] h-1 w-[48%] rotate-18 rounded-full border-t-2 border-dashed border-(--sj-primary)" />

                <div className="absolute left-[18%] top-[23%] flex h-11 w-11 items-center justify-center rounded-full bg-(--sj-surface) text-red-500 shadow-lg ring-4 ring-red-500/10">
                    <MapPin className="h-5 w-5" />
                </div>

                <div className="absolute left-[57%] top-[42%] flex h-14 w-14 items-center justify-center rounded-full bg-(--sj-primary) text-white shadow-xl ring-8 ring-(--sj-primary)/10">
                    <Ambulance className="h-6 w-6" />
                </div>

                <div className="absolute right-[15%] bottom-[18%] flex h-12 w-12 items-center justify-center rounded-full bg-(--sj-surface) text-(--sj-primary) shadow-lg ring-4 ring-(--sj-primary)/10">
                    <Hospital className="h-5 w-5" />
                </div>

                <div className="absolute left-4 top-4 rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-2">
                        <span className="sj-live-dot" />

                        <span className="text-xs font-black text-(--sj-text)">
                            Live ambulance location
                        </span>
                    </div>

                    <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                        Demo tracking view
                    </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Your location
                        </p>

                        <p className="mt-1 text-xs font-black text-(--sj-text)">
                            {emergency.location}
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-3 shadow-sm backdrop-blur">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Ambulance ETA
                        </p>

                        <p className="mt-1 text-sm font-black text-(--sj-primary)">
                            {emergency.eta}
                        </p>
                    </div>
                </div>
            </div>
        </div>
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

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        {label}
                    </p>

                    <p className="mt-1 text-lg font-black text-(--sj-text)">
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
                            Emergency hospital
                        </h2>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-base font-black text-(--sj-text)">
                    {emergency.hospital}
                </h3>

                <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                    <p className="text-sm leading-6 text-(--sj-text-soft)">
                        Emergency destination · {emergency.hospitalDistance}
                        away
                    </p>
                </div>

                <div className="mt-5 rounded-xl bg-(--sj-surface-2) p-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-(--sj-text-soft)">
                            Estimated arrival
                        </span>

                        <span className="text-sm font-black text-(--sj-primary)">
                            {emergency.eta}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Timeline() {
    return (
        <div className="sj-card p-5 sm:p-6">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                    Emergency timeline
                </p>

                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                    Coordination progress
                </h2>
            </div>

            <div className="space-y-0">
                {timeline.map((item, index) => (
                    <div
                        key={item.title}
                        className="relative flex gap-4 pb-6 last:pb-0"
                    >
                        {index < timeline.length - 1 && (
                            <div
                                className={`absolute left-3.75 top-8 h-[calc(100%-1rem)] w-px ${
                                    item.complete
                                        ? 'bg-emerald-500/30'
                                        : 'bg-(--sj-border)'
                                }`}
                            />
                        )}

                        <div
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                item.active
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
                            <div className="flex items-start justify-between gap-3">
                                <p
                                    className={`text-sm font-black ${
                                        item.complete
                                            ? 'text-(--sj-text)'
                                            : 'text-(--sj-text-muted)'
                                    }`}
                                >
                                    {item.title}
                                </p>

                                <span className="shrink-0 text-[10px] font-bold text-(--sj-text-muted)">
                                    {item.time}
                                </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                {item.description}
                            </p>

                            {item.active && (
                                <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-(--sj-primary)">
                                    <span className="sj-live-dot" />
                                    Active
                                </span>
                            )}
                        </div>
                    </div>
                ))}
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
                        Keep your phone nearby and remain at the shared
                        location if it is safe to do so. The paramedic will
                        receive the emergency details through Sanjeevani.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TrackingPage;