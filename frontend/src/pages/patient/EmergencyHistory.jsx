import React from 'react';
import {
    ArrowLeft,
    Ambulance,
    CalendarDays,
    Clock3,
    FileText,
    Hospital,
    MapPin,
    ShieldCheck,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientNavbar from '../../components/layout/PatientNavbar';

const emergencyHistory = [
    {
        id: 'EM-2026-00124',
        date: '18 Aug 2026',
        time: '10:18 AM',
        type: 'Medical assistance',
        severity: 'High priority',
        hospital: 'Sanjeevani Emergency Hospital',
        location: 'New Delhi, Delhi',
        status: 'Completed',
        ambulance: 'AMB-031',
    },
    {
        id: 'EM-2026-00098',
        date: '02 Jul 2026',
        time: '04:42 PM',
        type: 'Emergency consultation',
        severity: 'Medium priority',
        hospital: 'City Care Hospital',
        location: 'New Delhi, Delhi',
        status: 'Completed',
        ambulance: 'AMB-018',
    },
    {
        id: 'EM-2026-00051',
        date: '11 May 2026',
        time: '08:05 AM',
        type: 'Medical assistance',
        severity: 'Low priority',
        hospital: 'Metro Health Centre',
        location: 'New Delhi, Delhi',
        status: 'Completed',
        ambulance: 'Not dispatched',
    },
];

function getSeverityClass(severity) {
    if (severity === 'High priority') {
        return 'sj-status-danger';
    }

    if (severity === 'Medium priority') {
        return 'sj-status-warning';
    }

    return 'sj-status-info';
}

function getSeverityDot(severity) {
    if (severity === 'High priority') {
        return 'bg-red-500';
    }

    if (severity === 'Medium priority') {
        return 'bg-amber-500';
    }

    return 'bg-blue-500';
}

function EmergencyDetailsModal({ emergency, onClose }) {
    if (!emergency) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface) px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-(--sj-primary)">
                            Emergency details
                        </p>

                        <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                            {emergency.id}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close details"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="sj-status sj-status-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {emergency.status}
                        </span>

                        <span
                            className={`sj-status ${getSeverityClass(
                                emergency.severity,
                            )}`}
                        >
                            {emergency.severity}
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
                                {emergency.date}
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
                                {emergency.time}
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
                                {emergency.type}
                            </p>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2 text-(--sj-text-muted)">
                                <MapPin className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    Location
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                {emergency.location}
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
                                    Hospital
                                </p>

                                <p className="mt-1 text-sm font-black text-(--sj-text)">
                                    {emergency.hospital}
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
                                    Ambulance
                                </p>

                                <p className="mt-1 text-sm font-black text-(--sj-text)">
                                    {emergency.ambulance}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                            <p className="text-xs leading-5 text-(--sj-text-soft)">
                                This is a demonstration history record. Detailed
                                medical records will be connected to the backend
                                after the frontend workflow is finalized.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmergencyHistory() {
    const [selectedEmergency, setSelectedEmergency] = React.useState(null);

    const totalEmergencies = emergencyHistory.length;

    const completedEmergencies = emergencyHistory.filter(
        (emergency) => emergency.status === 'Completed',
    ).length;

    const lastEmergency = emergencyHistory[0]?.date || 'No records';

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
                                Review your previous emergency coordination
                                requests, ambulance assignments, and receiving
                                hospitals.
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

                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="sj-card p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Total emergencies
                        </p>

                        <p className="mt-2 text-3xl font-black tracking-tight text-(--sj-text)">
                            {totalEmergencies}
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
                            {completedEmergencies}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Successfully coordinated
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Last emergency
                        </p>

                        <p className="mt-2 text-xl font-black tracking-tight text-(--sj-text)">
                            {lastEmergency}
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
                                    Your emergency coordination timeline.
                                </p>
                            </div>

                            <div className="hidden rounded-xl bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft) sm:block">
                                {totalEmergencies} records
                            </div>
                        </div>
                    </div>

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
                                        Priority
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Hospital
                                    </th>

                                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {emergencyHistory.map((emergency) => (
                                    <tr
                                        key={emergency.id}
                                        className="border-b border-(--sj-border) last:border-b-0"
                                    >
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="text-sm font-black text-(--sj-text)">
                                                    {emergency.id}
                                                </p>

                                                <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                    {emergency.type}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-(--sj-text)">
                                                {emergency.date}
                                            </p>

                                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                                {emergency.time}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`sj-status ${getSeverityClass(
                                                    emergency.severity,
                                                )}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${getSeverityDot(
                                                        emergency.severity,
                                                    )}`}
                                                />
                                                {emergency.severity}
                                            </span>
                                        </td>

                                        <td className="max-w-55 px-6 py-5">
                                            <p className="truncate text-sm font-bold text-(--sj-text)">
                                                {emergency.hospital}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-(--sj-text-soft)">
                                                {emergency.location}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="sj-status sj-status-success">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                {emergency.status}
                                            </span>
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-(--sj-border) md:hidden">
                        {emergencyHistory.map((emergency) => (
                            <article
                                key={emergency.id}
                                className="p-5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-(--sj-text)">
                                            {emergency.id}
                                        </p>

                                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                                            {emergency.type}
                                        </p>
                                    </div>

                                    <span className="sj-status sj-status-success shrink-0">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Completed
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span
                                        className={`sj-status ${getSeverityClass(
                                            emergency.severity,
                                        )}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${getSeverityDot(
                                                emergency.severity,
                                            )}`}
                                        />
                                        {emergency.severity}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-3">
                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                        <div>
                                            <p className="text-xs font-bold text-(--sj-text-muted)">
                                                Date & time
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {emergency.date} · {emergency.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Hospital className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                        <div>
                                            <p className="text-xs font-bold text-(--sj-text-muted)">
                                                Hospital
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {emergency.hospital}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                        <div>
                                            <p className="text-xs font-bold text-(--sj-text-muted)">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {emergency.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Ambulance className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                        <div>
                                            <p className="text-xs font-bold text-(--sj-text-muted)">
                                                Ambulance
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                                {emergency.ambulance}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedEmergency(emergency)
                                    }
                                    className="mt-5 w-full rounded-xl border border-(--sj-border) px-4 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                                >
                                    View details
                                </button>
                            </article>
                        ))}
                    </div>
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
                                Emergency history is intended for authorized
                                patient and emergency-care workflows. Backend
                                access controls will be applied during
                                integration.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {selectedEmergency && (
                <EmergencyDetailsModal
                    emergency={selectedEmergency}
                    onClose={() => setSelectedEmergency(null)}
                />
            )}
        </div>
    );
}

export default EmergencyHistory;