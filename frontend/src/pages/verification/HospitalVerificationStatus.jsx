import React, { useMemo } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';

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

function HospitalVerificationStatus() {
    const navigate = useNavigate();

    const savedApplication = localStorage.getItem(
        'sanjeevani_hospital_verification',
    );

    const application = savedApplication
        ? JSON.parse(savedApplication)
        : MOCK_APPLICATION;

    const statusConfig =
        STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;

    const StatusIcon = statusConfig.icon;

    const steps = [
        {
            key: 'submitted',
            title: 'Application submitted',
            description:
                'Your hospital profile has been successfully submitted.',
            completed: true,
        },
        {
            key: 'review',
            title: 'Verification review',
            description:
                'The Sanjeevani AI team reviews your hospital information.',
            completed:
                application.status === 'UNDER_REVIEW' ||
                application.status === 'VERIFIED',
            active:
                application.status === 'PENDING' ||
                application.status === 'UNDER_REVIEW',
        },
        {
            key: 'decision',
            title:
                application.status === 'REJECTED'
                    ? 'Application decision'
                    : 'Verification decision',
            description:
                application.status === 'REJECTED'
                    ? 'The application requires changes before it can be approved.'
                    : 'Your hospital will be approved once verification is complete.',
            completed: application.status === 'VERIFIED',
            rejected: application.status === 'REJECTED',
        },
    ];

    const statusBadgeClass = useMemo(() => {
        if (application.status === 'VERIFIED') {
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
        }

        if (application.status === 'REJECTED') {
            return 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400';
        }

        if (application.status === 'UNDER_REVIEW') {
            return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400';
        }

        return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
    }, [application.status]);

    const handleRefresh = () => {
        /*
         * Mock behavior for now.
         *
         * Later this button will call the backend:
         *
         * GET /api/hospitals/verification-status
         *
         * and update the application status from the response.
         */
        window.location.reload();
    };

    return (
        <AuthLayout
            eyebrow="Hospital verification"
            title="Track your verification status."
            description="Your hospital application is being reviewed by the Sanjeevani AI verification team. You can return to this page anytime to check its current status."
        >
            <div className="space-y-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Building2 className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-(--sj-text-muted)">
                                Hospital application
                            </p>

                            <h2 className="mt-1 truncate text-base font-black text-(--sj-text)">
                                {application.hospitalName}
                            </h2>

                            <p className="mt-1 text-xs text-(--sj-text-muted)">
                                Application ID: {application.applicationId}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${statusBadgeClass}`}
                            >
                                <StatusIcon className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                    Current status
                                </p>

                                <p className="mt-1 text-lg font-black text-(--sj-text)">
                                    {statusConfig.label}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Check status
                        </button>
                    </div>

                    <div className="mt-5 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <p className="text-sm leading-6 text-(--sj-text-soft)">
                            {statusConfig.description}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <h2 className="text-base font-black text-(--sj-text)">
                            Verification progress
                        </h2>

                        <p className="mt-1 text-sm text-(--sj-text-soft)">
                            Follow the progress of your hospital application.
                        </p>
                    </div>

                    <div className="space-y-0">
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;

                            return (
                                <div
                                    key={step.key}
                                    className="relative flex gap-4"
                                >
                                    {!isLast && (
                                        <div className="absolute left-3.75 top-8 h-[calc(100%-8px)] w-px bg-(--sj-border)" />
                                    )}

                                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--sj-border) bg-(--sj-surface)">
                                        {step.completed ? (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-(--sj-primary) text-white">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        ) : step.rejected ? (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-red-500 text-white">
                                                <XCircle className="h-4 w-4" />
                                            </div>
                                        ) : step.active ? (
                                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-(--sj-border)" />
                                        )}
                                    </div>

                                    <div
                                        className={`pb-7 ${isLast ? 'pb-0' : ''
                                            }`}
                                    >
                                        <p className="text-sm font-black text-(--sj-text)">
                                            {step.title}
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5">
                    <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                        <div>
                            <p className="text-sm font-black text-(--sj-text)">
                                What happens next?
                            </p>

                            <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                The verification team will review your hospital
                                registration details, services, emergency
                                capabilities and submitted information. You will
                                be able to use Sanjeevani AI emergency
                                coordination features after your hospital is
                                verified.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Submitted
                        </p>

                        <p className="mt-1 text-sm font-bold text-(--sj-text)">
                            {application.submittedAt}
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Last updated
                        </p>

                        <p className="mt-1 text-sm font-bold text-(--sj-text)">
                            {application.lastUpdated}
                        </p>
                    </div>
                </div>

                <div className="border-t border-(--sj-border) pt-5">
                    {application.status === 'VERIFIED' ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/hospital')
                            }
                            className="sj-ai-button w-full px-5 py-3.5"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            Continue to Hospital Dashboard
                        </button>
                    ) : application.status === 'REJECTED' ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/register/hospital-admin/profile')
                            }
                            className="sj-ai-button w-full px-5 py-3.5"
                        >
                            <FileCheck2 className="h-4 w-4" />
                            Review & Resubmit Application
                        </button>
                    ) : (
                        <Link
                            to="/login/hospital-admin"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 py-3.5 text-sm font-black text-(--sj-text) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary)"
                        >
                            <LogIn className="h-4 w-4" />
                            Return to Hospital Admin Login
                        </Link>
                    )}
                </div>

                <p className="text-center text-xs leading-5 text-(--sj-text-muted)">
                    Keep your application ID{' '}
                    <span className="font-bold text-(--sj-text-soft)">
                        {application.applicationId}
                    </span>{' '}
                    for future reference.
                </p>
            </div>
        </AuthLayout>
    );
}

export default HospitalVerificationStatus;