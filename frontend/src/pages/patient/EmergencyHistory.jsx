import React from 'react';
import {
    Ambulance,
    CalendarDays,
    Clock3,
    FileText,
    Hospital,
    MapPin,
    RefreshCw,
    ShieldCheck,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import PatientNavbar from '../../components/layout/PatientNavbar';
import authService from '../../services/authService';
import emergencyService from '../../services/emergencyService';

function formatEmergencyType(type) {
    if (!type) {
        return 'Emergency assistance';
    }

    return type
        .toString()
        .toLowerCase()
        .split('_')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(' ');
}

function formatStatus(status) {
    if (!status) {
        return 'Unknown';
    }

    return status
        .toString()
        .toLowerCase()
        .split('_')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(' ');
}

function formatDate(dateValue) {
    if (!dateValue) {
        return 'Unknown date';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    return new Intl.DateTimeFormat(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    ).format(date);
}

function formatTime(dateValue) {
    if (!dateValue) {
        return 'Unknown time';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown time';
    }

    return new Intl.DateTimeFormat(
        'en-IN',
        {
            hour: '2-digit',
            minute: '2-digit',
        },
    ).format(date);
}

function getStatusClass(status) {
    if (
        status === 'COMPLETED' ||
        status === 'ARRIVED_AT_HOSPITAL'
    ) {
        return 'sj-status-success';
    }

    if (
        status === 'CANCELLED'
    ) {
        return 'sj-status-danger';
    }

    if (
        status === 'CREATED' ||
        status === 'ASSESSING'
    ) {
        return 'sj-status-info';
    }

    return 'sj-status-warning';
}

function getStatusDot(status) {
    if (
        status === 'COMPLETED' ||
        status === 'ARRIVED_AT_HOSPITAL'
    ) {
        return 'bg-emerald-500';
    }

    if (
        status === 'CANCELLED'
    ) {
        return 'bg-red-500';
    }

    if (
        status === 'CREATED' ||
        status === 'ASSESSING'
    ) {
        return 'bg-blue-500';
    }

    return 'bg-amber-500';
}

function formatLocation(emergency) {
    if (
        emergency.latitude === null ||
        emergency.latitude === undefined ||
        emergency.longitude === null ||
        emergency.longitude === undefined
    ) {
        return 'Location unavailable';
    }

    return `${Number(emergency.latitude).toFixed(
        5,
    )}, ${Number(emergency.longitude).toFixed(
        5,
    )}`;
}

function getDisplayStatus(emergency) {
    return (
        emergency.event_status ||
        emergency.sos_status ||
        'UNKNOWN'
    );
}

function EmergencyDetailsModal({
    emergency,
    onClose,
}) {
    if (!emergency) {
        return null;
    }

    const status = getDisplayStatus(
        emergency,
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface) px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-(--sj-primary)">
                            Emergency details
                        </p>

                        <h2 className="mt-1 truncate text-lg font-black text-(--sj-text)">
                            {emergency.id}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close details"
                        className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`sj-status ${getStatusClass(
                                status,
                            )}`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                    status,
                                )}`}
                            />

                            {formatStatus(status)}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                <CalendarDays className="h-4 w-4" />

                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Date
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                {formatDate(
                                    emergency.created_at,
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                <Clock3 className="h-4 w-4" />

                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Time
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                {formatTime(
                                    emergency.created_at,
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                <FileText className="h-4 w-4" />

                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Emergency type
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                {formatEmergencyType(
                                    emergency.emergency_type,
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                <MapPin className="h-4 w-4" />

                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Location
                                </span>
                            </div>

                            <p className="mt-2 break-all text-sm font-bold text-(--sj-text)">
                                {formatLocation(
                                    emergency,
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <Hospital className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Coordination
                                </p>

                                <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                    {formatStatus(
                                        status,
                                    )}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Hospital and ambulance
                                    assignment details will
                                    appear here when those
                                    coordination records are
                                    connected.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <Ambulance className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                    Emergency event
                                </p>

                                <p className="mt-1 break-all text-sm font-black text-(--sj-text)">
                                    {emergency.emergency_event_id ||
                                        'Not created'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {emergency.emergency_details && (
                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Emergency details
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-(--sj-text)">
                                {
                                    emergency.emergency_details
                                }
                            </p>
                        </div>
                    )}

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                            <p className="text-xs leading-5 text-(--sj-text-soft)">
                                This emergency record belongs
                                to your authenticated patient
                                account. The backend restricts
                                history access using your
                                authenticated user identity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmergencyHistory() {
    const [
        emergencies,
        setEmergencies,
    ] = React.useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = React.useState(true);

    const [
        error,
        setError,
    ] = React.useState('');

    const [
        selectedEmergency,
        setSelectedEmergency,
    ] = React.useState(null);

    const loadHistory = React.useCallback(
        async () => {
            setIsLoading(true);
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
                    await emergencyService.getHistory(
                        token,
                    );

                setEmergencies(
                    Array.isArray(data)
                        ? data
                        : [],
                );
            } catch (requestError) {
                console.error(
                    'Failed to load emergency history:',
                    requestError,
                );

                setEmergencies([]);

                setError(
                    requestError?.data?.detail ||
                        requestError?.message ||
                        'Unable to load your emergency history.',
                );
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    React.useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const totalEmergencies =
        emergencies.length;

    const completedEmergencies =
        emergencies.filter(
            (emergency) =>
                emergency.event_status ===
                'COMPLETED',
        ).length;

    const lastEmergency =
        emergencies[0]?.created_at
            ? formatDate(
                  emergencies[0].created_at,
              )
            : 'No records';

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <section className="mb-8">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                        Patient records
                    </p>

                    <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                Emergency history
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-(--sj-text-soft) sm:text-base">
                                Review your previous emergency
                                coordination requests and
                                emergency event status.
                            </p>
                        </div>

                        <Link
                            to="/dashboard/patient/emergency"
                            className="sj-sos-button w-full px-6 text-sm sm:w-auto"
                        >
                            SEND SOS
                        </Link>
                    </div>
                </section>

                {error && (
                    <section className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Unable to load emergency
                                    history
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadHistory}
                                disabled={isLoading}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-4 py-2.5 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw className="h-4 w-4" />

                                Try again
                            </button>
                        </div>
                    </section>
                )}

                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="sj-card p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Total emergencies
                        </p>

                        <p className="mt-2 text-3xl font-black tracking-tight text-(--sj-text)">
                            {isLoading
                                ? '—'
                                : totalEmergencies}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Recorded in your account
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Completed
                        </p>

                        <p className="mt-2 text-3xl font-black tracking-tight text-(--sj-text)">
                            {isLoading
                                ? '—'
                                : completedEmergencies}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Emergency events completed
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Last emergency
                        </p>

                        <p className="mt-2 text-xl font-black tracking-tight text-(--sj-text)">
                            {isLoading
                                ? '—'
                                : lastEmergency}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Most recent recorded event
                        </p>
                    </div>
                </section>

                <section className="sj-card overflow-hidden">
                    <div className="border-b border-(--sj-border) px-5 py-5 sm:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black text-(--sj-text)">
                                    Previous emergencies
                                </h2>

                                <p className="mt-1 text-sm text-(--sj-text-soft)">
                                    Your emergency coordination
                                    timeline.
                                </p>
                            </div>

                            {!isLoading && (
                                <div className="hidden rounded-xl bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft) sm:block">
                                    {totalEmergencies}{' '}
                                    {totalEmergencies === 1
                                        ? 'record'
                                        : 'records'}
                                </div>
                            )}
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex min-h-60 items-center justify-center p-8">
                            <div className="text-center">
                                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--sj-primary)/20 border-t-(--sj-primary)" />

                                <p className="mt-4 text-sm font-semibold text-(--sj-text-soft)">
                                    Loading your emergency
                                    history...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        emergencies.length === 0 && (
                            <div className="flex min-h-60 items-center justify-center p-8">
                                <div className="max-w-md text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>

                                    <h3 className="mt-4 text-lg font-black text-(--sj-text)">
                                        No emergency records yet
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                        Your previous SOS requests
                                        will appear here after an
                                        emergency is created.
                                    </p>
                                </div>
                            </div>
                        )}

                    {!isLoading &&
                        emergencies.length > 0 && (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-212.5">
                                        <thead>
                                            <tr className="border-b border-(--sj-border) bg-(--sj-surface-2)">
                                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Emergency
                                                </th>

                                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Date & time
                                                </th>

                                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Type
                                                </th>

                                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Status
                                                </th>

                                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Location
                                                </th>

                                                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {emergencies.map(
                                                (
                                                    emergency,
                                                ) => {
                                                    const status =
                                                        getDisplayStatus(
                                                            emergency,
                                                        );

                                                    return (
                                                        <tr
                                                            key={String(
                                                                emergency.id,
                                                            )}
                                                            className="border-b border-(--sj-border) last:border-b-0"
                                                        >
                                                            <td className="px-6 py-5">
                                                                <div>
                                                                    <p className="break-all text-sm font-black text-(--sj-text)">
                                                                        {String(
                                                                            emergency.id,
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                                        {formatEmergencyType(
                                                                            emergency.emergency_type,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <p className="text-sm font-bold text-(--sj-text)">
                                                                    {formatDate(
                                                                        emergency.created_at,
                                                                    )}
                                                                </p>

                                                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                                    {formatTime(
                                                                        emergency.created_at,
                                                                    )}
                                                                </p>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span className="sj-status sj-status-info">
                                                                    {formatEmergencyType(
                                                                        emergency.emergency_type,
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span
                                                                    className={`sj-status ${getStatusClass(
                                                                        status,
                                                                    )}`}
                                                                >
                                                                    <span
                                                                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                                            status,
                                                                        )}`}
                                                                    />

                                                                    {formatStatus(
                                                                        status,
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="max-w-55 px-6 py-5">
                                                                <p className="truncate text-sm font-bold text-(--sj-text)">
                                                                    {formatLocation(
                                                                        emergency,
                                                                    )}
                                                                </p>

                                                                {emergency.emergency_details && (
                                                                    <p className="mt-1 truncate text-xs text-(--sj-text-soft)">
                                                                        {
                                                                            emergency.emergency_details
                                                                        }
                                                                    </p>
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-5 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedEmergency(
                                                                            emergency,
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-(--sj-border) px-3 py-2 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                                                >
                                                                    View details
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="divide-y divide-(--sj-border) md:hidden">
                                    {emergencies.map(
                                        (
                                            emergency,
                                        ) => {
                                            const status =
                                                getDisplayStatus(
                                                    emergency,
                                                );

                                            return (
                                                <article
                                                    key={String(
                                                        emergency.id,
                                                    )}
                                                    className="p-5"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="break-all text-sm font-black text-(--sj-text)">
                                                                {String(
                                                                    emergency.id,
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                                {formatEmergencyType(
                                                                    emergency.emergency_type,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`sj-status shrink-0 ${getStatusClass(
                                                                status,
                                                            )}`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                                    status,
                                                                )}`}
                                                            />

                                                            {formatStatus(
                                                                status,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <span className="sj-status sj-status-info">
                                                            {formatEmergencyType(
                                                                emergency.emergency_type,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                                            <div>
                                                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                                                    Date
                                                                    &
                                                                    time
                                                                </p>

                                                                <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                                    {formatDate(
                                                                        emergency.created_at,
                                                                    )}{' '}
                                                                    ·{' '}
                                                                    {formatTime(
                                                                        emergency.created_at,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                                            <div>
                                                                <p className="text-xs font-bold text-(--sj-text-muted)">
                                                                    Location
                                                                </p>

                                                                <p className="mt-1 break-all text-sm font-semibold text-(--sj-text)">
                                                                    {formatLocation(
                                                                        emergency,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {emergency.emergency_details && (
                                                            <div className="flex items-start gap-3">
                                                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                                                <div>
                                                                    <p className="text-xs font-bold text-(--sj-text-muted)">
                                                                        Details
                                                                    </p>

                                                                    <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                                        {
                                                                            emergency.emergency_details
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedEmergency(
                                                                emergency,
                                                            )
                                                        }
                                                        className="mt-5 w-full rounded-xl border border-(--sj-border) px-4 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                                    >
                                                        View details
                                                    </button>
                                                </article>
                                            );
                                        },
                                    )}
                                </div>
                            </>
                        )}
                </section>

                <section className="mt-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-black text-(--sj-text)">
                                Your emergency records are private
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                History is retrieved from the
                                authenticated patient's account.
                                The backend uses the logged-in
                                user's identity rather than accepting
                                a patient ID from the frontend.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {selectedEmergency && (
                <EmergencyDetailsModal
                    emergency={
                        selectedEmergency
                    }
                    onClose={() =>
                        setSelectedEmergency(
                            null,
                        )
                    }
                />
            )}
        </div>
    );
}

export default EmergencyHistory;