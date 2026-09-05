import React from 'react';
import {
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Info,
    LogIn,
    RefreshCw,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const MOCK_APPLICATION = {
    applicationId: 'HSP-2026-00421',
    hospitalName: 'Sanjeevani Emergency Hospital',
    submittedAt: '5 September 2026',
    status: 'PENDING',
    lastUpdated: '5 September 2026',
};

const STATUS_CONFIG = {
    PENDING: {
        label: 'Pending Review',
        description:
            'Your application has been submitted successfully and is waiting for review by the Sanjeevani AI verification team.',
        icon: Clock3,
    },

    UNDER_REVIEW: {
        label: 'Under Review',
        description:
            'The Sanjeevani AI verification team is currently reviewing your hospital information.',
        icon: FileCheck2,
    },

    VERIFIED: {
        label: 'Verified',
        description:
            'Your hospital has been successfully verified and can participate in Sanjeevani AI emergency coordination.',
        icon: CheckCircle2,
    },

    REJECTED: {
        label: 'Rejected',
        description:
            'Your hospital application could not be verified. Please review the reason below and resubmit your application.',
        icon: XCircle,
    },
};

const TIMELINE_STEPS = [
    {
        key: 'SUBMITTED',
        label: 'Application submitted',
        description: 'Hospital information was submitted successfully.',
    },
    {
        key: 'UNDER_REVIEW',
        label: 'Verification review',
        description: 'The Sanjeevani AI team checks the submitted information.',
    },
    {
        key: 'VERIFIED',
        label: 'Verification decision',
        description: 'Your hospital is approved or the application is returned for correction.',
    },
];

function getStatusStepIndex(status) {
    if (status === 'PENDING') {
        return 0;
    }

    if (status === 'UNDER_REVIEW') {
        return 1;
    }

    if (status === 'VERIFIED') {
        return 2;
    }

    if (status === 'REJECTED') {
        return 2;
    }

    return 0;
}

function getStoredApplications() {
    try {
        const stored = localStorage.getItem('sanjeevani_hospital_verification');

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
            return parsed;
        }

        if (parsed && typeof parsed === 'object') {
            return [parsed];
        }

        return [];
    } catch {
        return [];
    }
}

function HospitalVerificationStatus() {
    const [searchParams] = useSearchParams();

    const applicationIdFromUrl = (
        searchParams.get('applicationId') || ''
    ).trim().toUpperCase();

    const [refreshKey, setRefreshKey] = React.useState(0);

    const application = React.useMemo(() => {
        const applications = getStoredApplications();

        if (!applicationIdFromUrl) {
            return applications[0] || MOCK_APPLICATION;
        }

        const matchingApplication = applications.find(
            (item) =>
                String(item.applicationId || '').toUpperCase() ===
                applicationIdFromUrl,
        );

        return matchingApplication || null;
    }, [applicationIdFromUrl, refreshKey]);

    const status = application?.status || 'PENDING';
    const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const StatusIcon = statusConfig.icon;
    const activeStepIndex = getStatusStepIndex(status);

    const handleRefresh = () => {
        setRefreshKey((value) => value + 1);
    };

    const handleResubmit = () => {
        window.location.href = '/register/hospital-admin/profile';
    };

    if (!application) {
        return (
            <AuthLayout
                eyebrow="Hospital verification"
                title="Application not found"
                description="We could not find a hospital verification application matching the application ID you entered."
            >
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                        <Info className="h-7 w-7" />
                    </div>

                    <h2 className="mt-6 text-xl font-black text-(--sj-text)">
                        No matching application
                    </h2>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-(--sj-text-soft)">
                        Please check your application ID and try again. The application ID
                        usually looks like HSP-2026-00421.
                    </p>

                    {applicationIdFromUrl && (
                        <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-bg) px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                                Application ID searched
                            </p>

                            <p className="mt-1 text-sm font-black tracking-wide text-(--sj-text)">
                                {applicationIdFromUrl}
                            </p>
                        </div>
                    )}

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            to="/"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to home
                        </Link>

                        <Link
                            to="/register/hospital-admin"
                            className="sj-ai-button h-11 px-5"
                        >
                            Register hospital
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="Hospital verification"
            title="Track your hospital application"
            description="Use your application ID to follow the verification progress of your hospital registration."
        >
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Building2 className="h-6 w-6" />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-(--sj-text)">
                            {application.hospitalName}
                        </h2>

                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                            Hospital verification application
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        aria-label="Refresh application status"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary)"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>

                {/* Status */}
                <div className="mt-7 rounded-2xl border border-(--sj-border) bg-(--sj-bg) p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <StatusIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-black text-(--sj-text)">
                                    {statusConfig.label}
                                </h3>

                                <span
                                    className={`sj-status ${
                                        status === 'VERIFIED'
                                            ? 'sj-status-success'
                                            : status === 'REJECTED'
                                                ? 'sj-status-danger'
                                                : status === 'UNDER_REVIEW'
                                                    ? 'sj-status-info'
                                                    : 'sj-status-warning'
                                    }`}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                {statusConfig.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Application information */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                            Application ID
                        </p>

                        <p className="mt-2 text-sm font-black tracking-wide text-(--sj-text)">
                            {application.applicationId}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                            Submitted
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {application.submittedAt}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 sm:col-span-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                            Last updated
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {application.lastUpdated}
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mt-7">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-(--sj-text)">
                            Verification progress
                        </h3>

                        <span className="text-xs font-semibold text-(--sj-text-muted)">
                            {statusConfig.label}
                        </span>
                    </div>

                    <div className="mt-5 space-y-0">
                        {TIMELINE_STEPS.map((step, index) => {
                            const isComplete = index < activeStepIndex;
                            const isCurrent =
                                index === activeStepIndex &&
                                status !== 'VERIFIED' &&
                                status !== 'REJECTED';

                            const isFinal =
                                index === 2 &&
                                (status === 'VERIFIED' || status === 'REJECTED');

                            return (
                                <div
                                    key={step.key}
                                    className="relative flex gap-4 pb-6 last:pb-0"
                                >
                                    {index !== TIMELINE_STEPS.length - 1 && (
                                        <div
                                            className={`absolute left-4 top-9 h-[calc(100%-1rem)] w-px ${
                                                isComplete || isFinal
                                                    ? 'bg-(--sj-primary)'
                                                    : 'bg-(--sj-border)'
                                            }`}
                                        />
                                    )}

                                    <div
                                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                            isComplete || isFinal
                                                ? 'border-(--sj-primary) bg-(--sj-primary) text-white'
                                                : isCurrent
                                                    ? 'border-(--sj-primary) bg-(--sj-primary)/10 text-(--sj-primary)'
                                                    : 'border-(--sj-border) bg-(--sj-surface) text-(--sj-text-muted)'
                                        }`}
                                    >
                                        {isComplete || isFinal ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <span className="text-[11px] font-black">
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-0.5">
                                        <p
                                            className={`text-sm font-black ${
                                                isCurrent
                                                    ? 'text-(--sj-primary)'
                                                    : 'text-(--sj-text)'
                                            }`}
                                        >
                                            {step.label}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next steps */}
                <div className="mt-7 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                        <div>
                            <h3 className="text-sm font-black text-(--sj-text)">
                                What happens next?
                            </h3>

                            {status === 'PENDING' && (
                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    Your application is in the verification queue. The
                                    Sanjeevani AI team will review the hospital information and
                                    update the application status.
                                </p>
                            )}

                            {status === 'UNDER_REVIEW' && (
                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    The verification team is reviewing your hospital
                                    registration details. Please check this page again for
                                    updates.
                                </p>
                            )}

                            {status === 'VERIFIED' && (
                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    Your hospital is verified. You can now access the Hospital
                                    Admin dashboard and configure your emergency resources.
                                </p>
                            )}

                            {status === 'REJECTED' && (
                                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                    Review the rejection information provided by the
                                    verification team, correct the required details and
                                    resubmit your hospital profile.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    {status === 'VERIFIED' ? (
                        <Link
                            to="/dashboard/hospital"
                            className="sj-ai-button h-11 flex-1 px-5"
                        >
                            Continue to dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    ) : status === 'REJECTED' ? (
                        <button
                            type="button"
                            onClick={handleResubmit}
                            className="sj-ai-button h-11 flex-1 px-5"
                        >
                            Review & resubmit
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="sj-ai-button h-11 flex-1 px-5"
                        >
                            Check latest status
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    )}

                    <Link
                        to="/login/hospital-admin"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                    >
                        <LogIn className="h-4 w-4" />
                        Hospital admin login
                    </Link>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-(--sj-text-muted) transition hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to home
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export default HospitalVerificationStatus;