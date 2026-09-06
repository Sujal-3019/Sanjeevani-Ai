import React from 'react';
import {
    Activity,
    AlertTriangle,
    Ambulance,
    ArrowLeft,
    Bell,
    CheckCircle2,
    Clock3,
    Hospital,
    MapPin,
    Menu,
    Moon,
    Navigation,
    Phone,
    Search,
    ShieldCheck,
    Siren,
    Sun,
    UserRound,
    X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo4.png';
import HospitalNavbar from '../../components/layout/HospitalNavbar';

const MOCK_HOSPITAL = {
    name: 'Sanjeevani Emergency Hospital',
    applicationId: 'HSP-2026-00421',
    status: 'VERIFIED',
};

const INITIAL_REQUESTS = [
    {
        id: 'EM-2026-00131',
        receivedAt: '2 min ago',
        severity: 'CRITICAL',
        patient: 'Patient #P-10428',
        age: 46,
        gender: 'Male',
        location: 'Connaught Place, New Delhi',
        distance: '3.8 km',
        estimatedArrival: '8 min',
        aiConfidence: '94%',
        symptoms: [
            'Severe chest pain',
            'Difficulty breathing',
            'Dizziness',
        ],
        aiSummary:
            'AI assessment indicates a potentially life-threatening cardiac emergency requiring immediate medical attention.',
        ambulanceRequired: true,
        status: 'PENDING',
    },
    {
        id: 'EM-2026-00130',
        receivedAt: '8 min ago',
        severity: 'HIGH',
        patient: 'Patient #P-10411',
        age: 31,
        gender: 'Female',
        location: 'Karol Bagh, New Delhi',
        distance: '5.2 km',
        estimatedArrival: '12 min',
        aiConfidence: '89%',
        symptoms: [
            'Road accident',
            'Leg injury',
            'Heavy bleeding',
        ],
        aiSummary:
            'AI assessment indicates significant trauma with possible blood loss. Urgent transport is recommended.',
        ambulanceRequired: true,
        status: 'ACCEPTED',
    },
    {
        id: 'EM-2026-00129',
        receivedAt: '18 min ago',
        severity: 'MODERATE',
        patient: 'Patient #P-10397',
        age: 62,
        gender: 'Male',
        location: 'Lajpat Nagar, New Delhi',
        distance: '7.1 km',
        estimatedArrival: '16 min',
        aiConfidence: '86%',
        symptoms: [
            'Weakness',
            'Shortness of breath',
        ],
        aiSummary:
            'AI assessment indicates a condition requiring medical evaluation but without immediate critical indicators.',
        ambulanceRequired: true,
        status: 'TRANSPORTING',
    },
    {
        id: 'EM-2026-00127',
        receivedAt: '34 min ago',
        severity: 'HIGH',
        patient: 'Patient #P-10382',
        age: 55,
        gender: 'Female',
        location: 'Rajouri Garden, New Delhi',
        distance: '9.4 km',
        estimatedArrival: '21 min',
        aiConfidence: '91%',
        symptoms: [
            'Sudden weakness',
            'Speech difficulty',
            'Confusion',
        ],
        aiSummary:
            'AI assessment indicates possible acute neurological symptoms requiring urgent evaluation.',
        ambulanceRequired: true,
        status: 'COMPLETED',
    },
    {
        id: 'EM-2026-00124',
        receivedAt: '1 hr ago',
        severity: 'MODERATE',
        patient: 'Patient #P-10365',
        age: 28,
        gender: 'Female',
        location: 'Saket, New Delhi',
        distance: '11.2 km',
        estimatedArrival: '24 min',
        aiConfidence: '82%',
        symptoms: [
            'Abdominal pain',
            'Vomiting',
        ],
        aiSummary:
            'AI assessment indicates a non-critical condition requiring clinical assessment.',
        ambulanceRequired: true,
        status: 'DECLINED',
    },
];

function SeverityBadge({ severity }) {
    const config = {
        CRITICAL: {
            className: 'bg-red-500/10 text-red-600 dark:text-red-400',
            dot: 'bg-red-500',
        },
        HIGH: {
            className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
            dot: 'bg-orange-500',
        },
        MODERATE: {
            className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            dot: 'bg-amber-500',
        },
    };

    const current = config[severity] || config.MODERATE;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${current.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {severity}
        </span>
    );
}

function RequestStatusBadge({ status }) {
    const config = {
        PENDING: {
            label: 'Awaiting response',
            className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            dot: 'bg-blue-500',
        },
        ACCEPTED: {
            label: 'Accepted',
            className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            dot: 'bg-emerald-500',
        },
        TRANSPORTING: {
            label: 'Patient transporting',
            className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            dot: 'bg-amber-500',
        },
        COMPLETED: {
            label: 'Completed',
            className: 'bg-(--sj-surface-2) text-(--sj-text-soft)',
            dot: 'bg-(--sj-text-muted)',
        },
        DECLINED: {
            label: 'Declined',
            className: 'bg-red-500/10 text-red-600 dark:text-red-400',
            dot: 'bg-red-500',
        },
    };

    const current = config[status] || config.PENDING;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${current.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {current.label}
        </span>
    );
}

function EmergencyRequests() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [requests, setRequests] = React.useState(INITIAL_REQUESTS);
    const [selectedRequest, setSelectedRequest] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [severityFilter, setSeverityFilter] = React.useState('ALL');
    const [statusFilter, setStatusFilter] = React.useState('ALL');
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    const isDark = theme === 'dark';

    const filteredRequests = requests.filter((request) => {
        const query = searchQuery.trim().toLowerCase();

        const matchesSearch =
            !query ||
            request.id.toLowerCase().includes(query) ||
            request.patient.toLowerCase().includes(query) ||
            request.location.toLowerCase().includes(query);

        const matchesSeverity =
            severityFilter === 'ALL' ||
            request.severity === severityFilter;

        const matchesStatus =
            statusFilter === 'ALL' ||
            request.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const pendingCount = requests.filter(
        (request) => request.status === 'PENDING',
    ).length;

    const activeCount = requests.filter(
        (request) =>
            request.status === 'ACCEPTED' ||
            request.status === 'TRANSPORTING',
    ).length;

    const criticalCount = requests.filter(
        (request) => request.severity === 'CRITICAL',
    ).length;

    const handleAcceptRequest = (requestId) => {
        setRequests((current) =>
            current.map((request) =>
                request.id === requestId
                    ? {
                          ...request,
                          status: 'ACCEPTED',
                      }
                    : request,
            ),
        );

        setSelectedRequest((current) =>
            current?.id === requestId
                ? {
                      ...current,
                      status: 'ACCEPTED',
                  }
                : current,
        );
    };

    const handleDeclineRequest = (requestId) => {
        setRequests((current) =>
            current.map((request) =>
                request.id === requestId
                    ? {
                          ...request,
                          status: 'DECLINED',
                      }
                    : request,
            ),
        );

        setSelectedRequest((current) =>
            current?.id === requestId
                ? {
                      ...current,
                      status: 'DECLINED',
                  }
                : current,
        );
    };

    const handleSignOut = () => {
        window.location.href = '/';
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar/>

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-6">
                    <Link
                        to="/dashboard/hospital"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Hospital dashboard
                    </Link>

                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                    Emergency operations
                                </p>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Verified hospital
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                Emergency requests
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                Review incoming emergency requests, assess AI
                                triage information and coordinate hospital
                                response.
                            </p>
                        </div>

                        <div className="sj-live">
                            <span className="sj-live-dot" />
                            <span className="text-xs font-bold text-(--sj-text-soft)">
                                Live request monitoring
                            </span>
                        </div>
                    </div>
                </div>

                <section className="grid gap-4 sm:grid-cols-3">
                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                    Awaiting response
                                </p>
                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {pendingCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <Clock3 className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                    Active emergencies
                                </p>
                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {activeCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                    Critical requests
                                </p>
                                <p className="mt-2 text-3xl font-black text-(--sj-text)">
                                    {criticalCount}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sj-card mt-6 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search emergency ID, patient or location..."
                                className="sj-input h-11 pl-10 pr-4 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:flex">
                            <select
                                value={severityFilter}
                                onChange={(event) =>
                                    setSeverityFilter(event.target.value)
                                }
                                className="sj-input h-11 px-3 text-sm sm:min-w-36"
                            >
                                <option value="ALL">All severity</option>
                                <option value="CRITICAL">Critical</option>
                                <option value="HIGH">High</option>
                                <option value="MODERATE">Moderate</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className="sj-input h-11 px-3 text-sm sm:min-w-40"
                            >
                                <option value="ALL">All status</option>
                                <option value="PENDING">Awaiting response</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="TRANSPORTING">
                                    Transporting
                                </option>
                                <option value="COMPLETED">Completed</option>
                                <option value="DECLINED">Declined</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSeverityFilter('ALL');
                                    setStatusFilter('ALL');
                                }}
                                className="col-span-2 h-11 rounded-xl border border-(--sj-border) px-4 text-xs font-black text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) sm:col-span-1"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-black text-(--sj-text)">
                                Incoming and active requests
                            </p>

                            <p className="mt-1 text-xs text-(--sj-text-muted)">
                                {filteredRequests.length} request
                                {filteredRequests.length === 1 ? '' : 's'} shown
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredRequests.length === 0 ? (
                            <div className="sj-card flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-surface-2) text-(--sj-text-muted)">
                                    <Search className="h-6 w-6" />
                                </div>

                                <h2 className="mt-4 text-lg font-black text-(--sj-text)">
                                    No emergency requests found
                                </h2>

                                <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                                    Try changing the search term or filters to
                                    find other emergency requests.
                                </p>
                            </div>
                        ) : (
                            filteredRequests.map((request) => (
                                <article
                                    key={request.id}
                                    className="sj-card overflow-hidden"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                                            <div className="flex min-w-0 flex-1 gap-4">
                                                <div
                                                    className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:flex ${
                                                        request.severity ===
                                                        'CRITICAL'
                                                            ? 'bg-red-500/10 text-red-500'
                                                            : request.severity ===
                                                                'HIGH'
                                                              ? 'bg-orange-500/10 text-orange-500'
                                                              : 'bg-amber-500/10 text-amber-500'
                                                    }`}
                                                >
                                                    <Siren className="h-6 w-6" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="text-base font-black text-(--sj-text)">
                                                            {request.id}
                                                        </h2>

                                                        <SeverityBadge
                                                            severity={
                                                                request.severity
                                                            }
                                                        />

                                                        <RequestStatusBadge
                                                            status={
                                                                request.status
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--sj-text-muted)">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <UserRound className="h-3.5 w-3.5" />
                                                            {request.patient}
                                                        </span>

                                                        <span>
                                                            {request.age} years
                                                        </span>

                                                        <span>
                                                            {request.gender}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Clock3 className="h-3.5 w-3.5" />
                                                            {request.receivedAt}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                                                Patient location
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                                {
                                                                    request.location
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                                                Distance
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                                {request.distance}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-(--sj-text-muted)">
                                                                Estimated arrival
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-(--sj-text)">
                                                                {
                                                                    request.estimatedArrival
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                            Reported symptoms
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {request.symptoms.map(
                                                                (
                                                                    symptom,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            symptom
                                                                        }
                                                                        className="rounded-lg border border-(--sj-border) bg-(--sj-surface) px-2.5 py-1.5 text-xs font-bold text-(--sj-text-soft)"
                                                                    >
                                                                        {
                                                                            symptom
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedRequest(
                                                            request,
                                                        )
                                                    }
                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 text-xs font-black text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                                >
                                                    <Activity className="h-4 w-4" />
                                                    View details
                                                </button>

                                                {request.status ===
                                                    'PENDING' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAcceptRequest(
                                                                request.id,
                                                            )
                                                        }
                                                        className="sj-ai-button h-10 px-4 text-xs"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Accept request
                                                    </button>
                                                )}

                                                {request.status ===
                                                    'ACCEPTED' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/hospital/emergencies/${request.id}`,
                                                            )
                                                        }
                                                        className="sj-ai-button h-10 px-4 text-xs"
                                                    >
                                                        <Ambulance className="h-4 w-4" />
                                                        Manage emergency
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {request.status === 'PENDING' && (
                                        <div className="flex flex-col gap-3 border-t border-(--sj-border) bg-red-500/2.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                                                <p className="text-xs leading-5 text-(--sj-text-soft)">
                                                    This request is waiting for a
                                                    hospital response. Review
                                                    the AI assessment before
                                                    accepting or declining.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeclineRequest(
                                                        request.id,
                                                    )
                                                }
                                                className="text-xs font-black text-red-500 transition hover:text-red-600"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedRequest(null);
                        }
                    }}
                >
                    <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl sm:max-w-2xl sm:rounded-3xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface)/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--sj-primary)">
                                    Emergency details
                                </p>

                                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                    {selectedRequest.id}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedRequest(null)}
                                aria-label="Close details"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) hover:text-(--sj-text)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <SeverityBadge
                                    severity={selectedRequest.severity}
                                />

                                <RequestStatusBadge
                                    status={selectedRequest.status}
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Patient
                                    </p>

                                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                                        {selectedRequest.patient}
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        {selectedRequest.age} years ·{' '}
                                        {selectedRequest.gender}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Request received
                                    </p>

                                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                                        {selectedRequest.receivedAt}
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                        AI confidence{' '}
                                        {selectedRequest.aiConfidence}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-(--sj-primary)" />
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Incident location
                                    </p>
                                </div>

                                <div className="mt-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                    <p className="text-sm font-bold text-(--sj-text)">
                                        {selectedRequest.location}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-(--sj-text-muted)">
                                        <span>
                                            Distance:{' '}
                                            <strong className="text-(--sj-text)">
                                                {
                                                    selectedRequest.distance
                                                }
                                            </strong>
                                        </span>

                                        <span>
                                            Estimated arrival:{' '}
                                            <strong className="text-(--sj-text)">
                                                {
                                                    selectedRequest.estimatedArrival
                                                }
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    AI triage assessment
                                </p>

                                <div className="mt-3 rounded-xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                            <Activity className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold leading-5 text-(--sj-text)">
                                                {selectedRequest.aiSummary}
                                            </p>

                                            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-(--sj-primary)">
                                                AI confidence:{' '}
                                                {
                                                    selectedRequest.aiConfidence
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Reported symptoms
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedRequest.symptoms.map(
                                        (symptom) => (
                                            <span
                                                key={symptom}
                                                className="rounded-lg border border-(--sj-border) px-3 py-2 text-xs font-bold text-(--sj-text-soft)"
                                            >
                                                {symptom}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl bg-(--sj-surface-2) p-4">
                                <div className="flex items-center gap-3">
                                    <Navigation className="h-5 w-5 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-xs font-black text-(--sj-text)">
                                            Ambulance coordination
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            {selectedRequest.ambulanceRequired
                                                ? 'Ambulance required for this emergency.'
                                                : 'Ambulance not currently required.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.status === 'PENDING' && (
                                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeclineRequest(
                                                selectedRequest.id,
                                            )
                                        }
                                        className="h-12 rounded-xl border border-red-500/20 px-5 text-sm font-black text-red-500 transition hover:bg-red-500/5 sm:flex-1"
                                    >
                                        Decline request
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAcceptRequest(
                                                selectedRequest.id,
                                            )
                                        }
                                        className="sj-ai-button h-12 px-5 text-sm sm:flex-1"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Accept & coordinate
                                    </button>
                                </div>
                            )}

                            {selectedRequest.status === 'ACCEPTED' && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/hospital/emergencies/${selectedRequest.id}`,
                                        )
                                    }
                                    className="sj-ai-button h-12 w-full text-sm"
                                >
                                    <Ambulance className="h-4 w-4" />
                                    Continue emergency coordination
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <footer className="border-t border-(--sj-border) px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs text-(--sj-text-muted) sm:flex-row sm:items-center sm:justify-between">
                    <p>Sanjeevani AI · Emergency operations</p>

                    <p>
                        Emergency coordination access is restricted to
                        authorized hospital personnel.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default EmergencyRequests;