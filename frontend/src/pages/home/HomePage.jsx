import React from 'react';
import {
    Activity,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Cross,
    Hospital,
    MapPin,
    Menu,
    Moon,
    Navigation,
    PhoneCall,
    Radio,
    ShieldCheck,
    Siren,
    Sun,
    Truck,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo4.png';

function SectionHeading({ eyebrow, title, description, center = false }) {
    return (
        <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-8 bg-(--sj-primary)" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-(--sj-primary)">
                    {eyebrow}
                </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-(--sj-text) sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            <p className="mt-5 text-base leading-7 text-(--sj-text-soft) sm:text-lg">
                {description}
            </p>
        </div>
    );
}

function StatusDot({ type = 'green' }) {
    return (
        <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${type === 'red'
                ? 'bg-red-500'
                : type === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-emerald-500'
                }`}
        />
    );
}

function HomePage() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [statusModalOpen, setStatusModalOpen] = React.useState(false);
    const [applicationId, setApplicationId] = React.useState('');
    const [statusError, setStatusError] = React.useState('');

    const isDark = theme === 'dark';

    const handleStatusCheck = (event) => {
        event.preventDefault();

        const normalizedApplicationId = applicationId.trim().toUpperCase();

        if (!normalizedApplicationId) {
            setStatusError('Please enter your hospital application ID.');
            return;
        }

        if (!/^HSP-\d{4}-\d{5}$/.test(normalizedApplicationId)) {
            setStatusError(
                'Please enter a valid application ID, for example HSP-2026-00421.',
            );
            return;
        }

        setStatusError('');
        setStatusModalOpen(false);

        navigate(
            `/verification/hospital?applicationId=${encodeURIComponent(
                normalizedApplicationId,
            )}`,
        );
    };

    const openStatusModal = () => {
        setApplicationId('');
        setStatusError('');
        setStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setStatusModalOpen(false);
        setStatusError('');
    };

    return (
        <div className="sanjeevani-page min-h-screen overflow-x-hidden">
            {/* =========================================================
                HEADER
            ========================================================= */}
            <header className="sticky top-0 z-50 border-b border-(--sj-border) bg-(--sj-bg)/95 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                            <img
                                src={logo}
                                alt="Sanjeevani AI"
                                className="h-full w-full object-contain p-1"
                            />
                        </div>

                        <div>
                            <div className="text-lg font-black tracking-tight text-(--sj-text)">
                                Sanjeevani
                                <span className="text-(--sj-primary)"> AI</span>
                            </div>

                            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-(--sj-text-muted) sm:block">
                                Emergency coordination
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        <a
                            href="#how-it-works"
                            className="text-sm font-semibold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            How it works
                        </a>

                        <a
                            href="#capabilities"
                            className="text-sm font-semibold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            Capabilities
                        </a>

                        <a
                            href="#roles"
                            className="text-sm font-semibold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            For teams
                        </a>
                        <button
                            type="button"
                            onClick={openStatusModal}
                            className="inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-primary)"
                        >
                            <Clock3 className="h-4 w-4" />
                            Know Status
                        </button>
                    </nav>

                    <div className="hidden items-center gap-3 sm:flex">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        <Link
                            to="/login/patient"
                            className="rounded-xl px-4 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        >
                            Sign in
                        </Link>

                        <Link
                            to="/register/patient"
                            className="rounded-xl bg-(--sj-primary) px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) hover:shadow-md"
                        >
                            Get started
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:hidden">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((value) => !value)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text)"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-(--sj-border) bg-(--sj-bg) px-5 py-5 sm:hidden">
                        <nav className="flex flex-col gap-2">
                            <a
                                href="#how-it-works"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface)"
                            >
                                How it works
                            </a>

                            <a
                                href="#capabilities"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface)"
                            >
                                Capabilities
                            </a>

                            <a
                                href="#roles"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-(--sj-text-soft) hover:bg-(--sj-text)"
                            >
                                For teams
                            </a>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Link
                                    to="/login/patient"
                                    className="rounded-xl border border-(--sj-border) px-4 py-3 text-center text-sm font-bold text-(--sj-text)"
                                >
                                    Sign in
                                </Link>

                                <Button
                                    onClick={openStatusModal}

                                    className="rounded-xl bg-(--sj-primary) px-4 py-3 text-center text-sm font-bold text-white"
                                >
                                    Get started
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <main>
                {/* =========================================================
                    HERO
                ========================================================= */}
                <section className="relative overflow-hidden border-b border-(--sj-border)">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute left-1/2 top-0 h-150 w-150 -translate-x-1/2 rounded-full bg-(--sj-primary)/8 blur-3xl" />
                    </div>

                    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-18 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
                        <div>
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-(--sj-border) bg-(--sj-surface) px-3.5 py-2 shadow-sm">
                                <StatusDot />

                                <span className="text-xs font-bold uppercase tracking-[0.14em] text-(--sj-text-soft)">
                                    Intelligent emergency response
                                </span>
                            </div>

                            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-(--sj-text) sm:text-6xl lg:text-7xl">
                                When every second
                                <span className="block text-(--sj-primary)">
                                    matters.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-2xl text-lg leading-8 text-(--sj-text-soft) sm:text-xl">
                                Sanjeevani AI connects patients, hospitals and paramedics into
                                one coordinated emergency response network — from the first SOS
                                to hospital arrival.
                            </p>

                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/register/patient"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-(--sj-primary)/15 transition hover:-translate-y-0.5 hover:bg-(--sj-primary-dark)"
                                >
                                    Create patient account
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </Link>

                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-6 py-3.5 text-sm font-bold text-(--sj-text) transition hover:border-(--sj-primary)/30 hover:bg-(--sj-surface-2)"
                                >
                                    See how it works
                                </a>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-(--sj-text-soft)">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                    AI-assisted triage
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                    Location intelligence
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                    Live ambulance tracking
                                </div>
                            </div>
                        </div>

                        {/* Emergency command visual */}
                        <div className="relative">
                            <div className="absolute -inset-5 rounded-4xl bg-(--sj-primary)/5 blur-2xl" />

                            <div className="relative overflow-hidden rounded-[1.75rem] border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-5 py-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--sj-text-muted)">
                                            Emergency network
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                            Live response overview
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <StatusDot />
                                        LIVE
                                    </div>
                                </div>

                                <div className="relative h-92 overflow-hidden bg-(--sj-map-bg)">
                                    <div className="absolute inset-0 opacity-60 bg-[linear-gradient(to_right,var(--sj-map-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--sj-map-line)_1px,transparent_1px)]" />

                                    <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full border border-(--sj-primary)/10 bg-(--sj-primary)/5" />

                                    <div className="absolute right-[10%] top-[10%] h-44 w-44 rounded-full border border-blue-500/10 bg-blue-500/5" />

                                    <div className="absolute bottom-[5%] left-[35%] h-48 w-48 rounded-full border border-(--sj-primary)/10 bg-(--sj-primary)/5" />

                                    <div className="absolute left-[18%] top-[29%]">
                                        <div className="relative">
                                            <div className="absolute -inset-3 animate-ping rounded-full bg-red-500/20" />

                                            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-red-500 text-white shadow-lg dark:border-slate-900">
                                                <MapPin className="h-5 w-5 fill-current" />
                                            </div>
                                        </div>

                                        <div className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-lg backdrop-blur">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                                                Emergency
                                            </p>

                                            <p className="text-xs font-bold text-(--sj-text)">
                                                Patient location
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute right-[20%] top-[23%]">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg dark:border-slate-900">
                                            <Hospital className="h-5 w-5" />
                                        </div>

                                        <div className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-lg backdrop-blur">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                                                Matched
                                            </p>

                                            <p className="text-xs font-bold text-(--sj-text)">
                                                Emergency hospital
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-[22%] left-[51%]">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-(--sj-primary) text-white shadow-lg dark:border-slate-900">
                                            <Truck className="h-5 w-5" />
                                        </div>

                                        <div className="mt-2 rounded-lg border border-(--sj-border) bg-(--sj-surface)/95 px-3 py-2 shadow-lg backdrop-blur">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-(--sj-primary)">
                                                En route
                                            </p>

                                            <p className="text-xs font-bold text-(--sj-text)">
                                                Ambulance A-14
                                            </p>
                                        </div>
                                    </div>

                                    <svg
                                        className="absolute inset-0 h-full w-full"
                                        viewBox="0 0 600 370"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M145 130 C245 175, 340 150, 470 105"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="8 8"
                                            strokeWidth="3"
                                            className="text-(--sj-primary)/50"
                                        />

                                        <path
                                            d="M145 130 C225 215, 285 240, 335 270"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="8 8"
                                            strokeWidth="3"
                                            className="text-red-500/50"
                                        />
                                    </svg>
                                </div>

                                <div className="grid grid-cols-3 divide-x divide-(--sj-border) border-t border-(--sj-border)">
                                    <div className="p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-(--sj-text-muted)">
                                            Severity
                                        </p>

                                        <p className="mt-1 text-sm font-black text-red-500">
                                            Critical
                                        </p>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-(--sj-text-muted)">
                                            Ambulance
                                        </p>

                                        <p className="mt-1 text-sm font-black text-(--sj-text)">
                                            A-14
                                        </p>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-(--sj-text-muted)">
                                            ETA
                                        </p>

                                        <p className="mt-1 text-sm font-black text-(--sj-primary)">
                                            07 min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    TRUST STRIP
                ========================================================= */}
                <section className="border-b border-(--sj-border) bg-(--sj-surface)">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-(--sj-border) sm:grid-cols-4">
                        <div className="px-5 py-7 sm:px-8">
                            <p className="text-2xl font-black text-(--sj-text)">01</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                SOS activation
                            </p>
                        </div>

                        <div className="px-5 py-7 sm:px-8">
                            <p className="text-2xl font-black text-(--sj-text)">AI</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                Assisted triage
                            </p>
                        </div>

                        <div className="px-5 py-7 sm:px-8">
                            <p className="text-2xl font-black text-(--sj-text)">GPS</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                Location intelligence
                            </p>
                        </div>

                        <div className="px-5 py-7 sm:px-8">
                            <p className="text-2xl font-black text-(--sj-text)">LIVE</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                                Response tracking
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    HOW IT WORKS
                ========================================================= */}
                <section
                    id="how-it-works"
                    className="border-b border-(--sj-border) px-5 py-20 sm:px-8 lg:py-28"
                >
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading
                            eyebrow="The response"
                            title="From SOS to hospital, one coordinated flow."
                            description="Sanjeevani AI reduces the gap between a patient's emergency request and the people who can respond."
                        />

                        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                            {[
                                {
                                    number: '01',
                                    icon: Siren,
                                    title: 'SOS',
                                    text: 'The patient activates an emergency request and shares their current location.',
                                    tone: 'red',
                                },
                                {
                                    number: '02',
                                    icon: BrainCircuit,
                                    title: 'AI assessment',
                                    text: 'AI analyzes available emergency information and helps determine severity.',
                                    tone: 'blue',
                                },
                                {
                                    number: '03',
                                    icon: Hospital,
                                    title: 'Hospital match',
                                    text: 'Nearby hospitals are evaluated using location, services and capacity.',
                                    tone: 'green',
                                },
                                {
                                    number: '04',
                                    icon: Truck,
                                    title: 'Dispatch',
                                    text: 'An available ambulance and paramedic team are assigned to the mission.',
                                    tone: 'orange',
                                },
                                {
                                    number: '05',
                                    icon: Navigation,
                                    title: 'Live response',
                                    text: 'Routing and real-time location updates keep everyone synchronized.',
                                    tone: 'purple',
                                },
                            ].map((step) => {
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.number}
                                        className="group relative rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-6 transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black tracking-[0.18em] text-(--sj-text-muted)">
                                                {step.number}
                                            </span>

                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.tone === 'red'
                                                    ? 'bg-red-500/10 text-red-500'
                                                    : step.tone === 'blue'
                                                        ? 'bg-blue-500/10 text-blue-500'
                                                        : step.tone === 'orange'
                                                            ? 'bg-orange-500/10 text-orange-500'
                                                            : step.tone === 'purple'
                                                                ? 'bg-purple-500/10 text-purple-500'
                                                                : 'bg-emerald-500/10 text-emerald-500'
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <h3 className="mt-7 text-lg font-black text-(--sj-text)">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                            {step.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    CAPABILITIES
                ========================================================= */}
                <section
                    id="capabilities"
                    className="border-b border-(--sj-border) bg-(--sj-surface) px-5 py-20 sm:px-8 lg:py-28"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                            <SectionHeading
                                eyebrow="Built for emergencies"
                                title="Intelligence where it actually matters."
                                description="Every part of the platform is designed around reducing response friction, improving coordination and giving emergency teams better information."
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        icon: BrainCircuit,
                                        title: 'AI-assisted triage',
                                        text: 'Structured emergency information helps prioritize response severity.',
                                    },
                                    {
                                        icon: MapPin,
                                        title: 'Location intelligence',
                                        text: 'Use precise incident and ambulance locations for better dispatch decisions.',
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Smart dispatch',
                                        text: 'Identify suitable nearby hospitals and available response resources.',
                                    },
                                    {
                                        icon: Clock3,
                                        title: 'ETA-focused routing',
                                        text: 'Prioritize practical response time instead of simple straight-line distance.',
                                    },
                                    {
                                        icon: Radio,
                                        title: 'Live coordination',
                                        text: 'Keep patients, hospitals and paramedics synchronized during an emergency.',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Controlled access',
                                        text: 'Role-based operational access keeps emergency information protected.',
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-(--sj-border) bg-(--sj-bg) p-6"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <h3 className="mt-5 text-base font-black text-(--sj-text)">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    ROLES
                ========================================================= */}
                <section
                    id="roles"
                    className="border-b border-(--sj-border) px-5 py-20 sm:px-8 lg:py-28"
                >
                    <div className="mx-auto max-w-7xl">
                        <SectionHeading
                            center
                            eyebrow="One platform"
                            title="Different teams. One emergency picture."
                            description="Each role gets the tools it needs while remaining connected to the same emergency workflow."
                        />

                        <div className="mt-14 grid gap-5 lg:grid-cols-3">
                            {/* Patient */}
                            <div className="group rounded-3xl border border-(--sj-border) bg-(--sj-surface) p-7 transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                    <Users className="h-6 w-6" />
                                </div>

                                <h3 className="mt-7 text-2xl font-black text-(--sj-text)">
                                    Patient
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                    Request emergency help, share your location, provide relevant
                                    medical information and follow the response.
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {[
                                        'Emergency SOS',
                                        'AI-assisted assessment',
                                        'Ambulance tracking',
                                        'Emergency history',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm font-medium text-(--sj-text-soft)"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/register/patient"
                                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-(--sj-primary)"
                                >
                                    Register as patient
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Hospital */}
                            <div className="group rounded-3xl border border-(--sj-border) bg-(--sj-surface) p-7 transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                                    <Hospital className="h-6 w-6" />
                                </div>

                                <h3 className="mt-7 text-2xl font-black text-(--sj-text)">
                                    Hospital
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                    Manage emergency requests, hospital capabilities, ambulance
                                    resources, capacity and paramedic teams.
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {[
                                        'Emergency request management',
                                        'Hospital capacity',
                                        'Ambulance fleet',
                                        'Paramedic management',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm font-medium text-(--sj-text-soft)"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 flex flex-col items-start gap-4">
                                    <Link
                                        to="/register/hospital-admin"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-(--sj-primary)"
                                    >
                                        Register hospital
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={openStatusModal}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-primary)"
                                    >
                                        <Clock3 className="h-4 w-4" />
                                        Check hospital status
                                    </button>
                                </div>
                            </div>

                            {/* Paramedic */}
                            <div className="group rounded-3xl border border-(--sj-border) bg-(--sj-surface) p-7 transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <Truck className="h-6 w-6" />
                                </div>

                                <h3 className="mt-7 text-2xl font-black text-(--sj-text)">
                                    Paramedic
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                    Receive authorized missions, navigate to patients, update
                                    mission status and coordinate transport.
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {[
                                        'Mission assignment',
                                        'Fastest-route navigation',
                                        'Live location sharing',
                                        'Mission status updates',
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm font-medium text-(--sj-text-soft)"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-(--sj-primary)" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/login/paramedic"
                                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-(--sj-primary)"
                                >
                                    Paramedic login
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <p className="mt-3 text-xs text-(--sj-text-muted)">
                                    Paramedic accounts are created and managed by hospital
                                    administrators.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    CTA
                ========================================================= */}
                <section className="px-5 py-20 sm:px-8 lg:py-28">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-4xl bg-(--sj-navy) px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
                            <div className="absolute -right-20 -top-30 h-80 w-80 rounded-full bg-(--sj-primary)/20 blur-3xl" />
                            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

                            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div>
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                                        <Cross className="h-3.5 w-3.5" />
                                        Emergency coordination platform
                                    </div>

                                    <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                                        Build a faster path from emergency to care.
                                    </h2>

                                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                                        Sanjeevani AI brings emergency information, hospitals,
                                        ambulances and paramedics together in one coordinated
                                        workflow.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                    <Link
                                        to="/register/patient"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-(--sj-navy) transition hover:bg-white/90"
                                    >
                                        Get started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>

                                    <Link
                                        to="/login/patient"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* =========================================================
                FOOTER
            ========================================================= */}
            <footer className="border-t border-(--sj-border) bg-(--sj-surface)">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
                    <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
                                <img
                                    src={logo}
                                    alt="Sanjeevani AI"
                                    className="h-full w-full object-contain p-1"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Sanjeevani AI
                                </p>

                                <p className="text-xs text-(--sj-text-muted)">
                                    Intelligent emergency coordination
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-(--sj-text-muted)">
                            <a href="#how-it-works" className="hover:text-(--sj-text)">
                                How it works
                            </a>

                            <a href="#capabilities" className="hover:text-(--sj-text)">
                                Capabilities
                            </a>

                            <a href="#roles" className="hover:text-(--sj-text)">
                                Teams
                            </a>
                            <button
                                type="button"
                                onClick={openStatusModal}
                                className="inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-primary)"
                            >
                                <Clock3 className="h-4 w-4" />
                                Check hospital status
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-(--sj-border) pt-6 text-xs text-(--sj-text-muted)">
                        © {new Date().getFullYear()} Sanjeevani AI. Emergency coordination
                        platform.
                    </div>
                </div>
            </footer>

            {/* Floating emergency contact indicator */}
            <div className="fixed bottom-5 right-5 z-40 hidden sm:block">
                <div className="flex items-center gap-2 rounded-full border border-(--sj-border) bg-(--sj-surface)/95 px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) shadow-lg backdrop-blur">
                    <PhoneCall className="h-3.5 w-3.5 text-(--sj-primary)" />
                    Emergency-ready platform
                </div>
            </div>

            {/* =========================================================
                CHECK HOSPITAL STATUS MODAL
            ========================================================= */}
            {statusModalOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-5 py-6 backdrop-blur-sm"
                    onMouseDown={closeStatusModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="hospital-status-title"
                        className="w-full max-w-md rounded-3xl border border-(--sj-border) bg-(--sj-surface) p-6 shadow-2xl sm:p-8"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <Hospital className="h-6 w-6" />
                                </div>

                                <h2
                                    id="hospital-status-title"
                                    className="mt-5 text-2xl font-black tracking-tight text-(--sj-text)"
                                >
                                    Check hospital status
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    Enter the application ID you received after submitting your
                                    hospital registration.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeStatusModal}
                                aria-label="Close"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleStatusCheck} className="mt-7">
                            <label
                                htmlFor="hospital-application-id"
                                className="sj-label"
                            >
                                Application ID
                            </label>

                            <input
                                id="hospital-application-id"
                                name="applicationId"
                                type="text"
                                value={applicationId}
                                onChange={(event) => {
                                    setApplicationId(event.target.value.toUpperCase());
                                    setStatusError('');
                                }}
                                placeholder="HSP-2026-00421"
                                maxLength={14}
                                autoComplete="off"
                                className="sj-input h-12 px-4 text-sm font-semibold tracking-wide"
                            />

                            {statusError && (
                                <p className="mt-2 text-sm font-semibold text-red-500">
                                    {statusError}
                                </p>
                            )}

                            <div className="mt-4 rounded-2xl border border-(--sj-border) bg-(--sj-bg) p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                                    <p className="text-xs leading-5 text-(--sj-text-soft)">
                                        Your application ID is provided after hospital profile
                                        submission. Keep it safe so you can check your
                                        verification progress.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeStatusModal}
                                    className="h-11 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="sj-ai-button h-11 px-5"
                                >
                                    Check status
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;