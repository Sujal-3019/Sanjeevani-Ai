import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';

import emergencyShareService from '../services/emergencyShareService';

function formatEmergencyType(value) {
    if (!value) {
        return 'Emergency';
    }

    return value
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
}

function formatDateTime(value) {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleString(
        'en-IN',
        {
            dateStyle: 'medium',
            timeStyle: 'short',
        },
    );
}

export default function EmergencyShare() {
    const { token } = useParams();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState(null);

    const loadEmergencyShare = useCallback(
        async (showLoader = false) => {
            if (!token) {
                setError(
                    'Invalid emergency share link.',
                );
                setIsLoading(false);
                return;
            }

            if (showLoader) {
                setIsLoading(true);
            }

            try {
                const response =
                    await emergencyShareService.getShare(
                        token,
                    );

                setData(response);
                setError('');
                setLastRefresh(new Date());
            } catch (requestError) {
                console.error(
                    'Emergency share request failed:',
                    requestError,
                );

                setError(
                    requestError?.message ||
                    'Unable to load the emergency information.',
                );
            } finally {
                if (showLoader) {
                    setIsLoading(false);
                }
            }
        },
        [token],
    );

    useEffect(() => {
        loadEmergencyShare(true);
    }, [loadEmergencyShare]);

    useEffect(() => {
        const intervalId = window.setInterval(
            () => {
                loadEmergencyShare(false);
            },
            10000,
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [loadEmergencyShare]);

    const navigationUrl = useMemo(() => {
        const latitude =
            data?.location?.latitude;

        const longitude =
            data?.location?.longitude;

        if (
            latitude === null ||
            latitude === undefined ||
            longitude === null ||
            longitude === undefined
        ) {
            return null;
        }

        return (
            'https://www.google.com/maps/dir/' +
            '?api=1' +
            `&destination=${encodeURIComponent(
                `${latitude},${longitude}`,
            )}` +
            '&travelmode=driving'
        );
    }, [data]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />

                        <h1 className="text-xl font-semibold text-slate-900">
                            Loading emergency information
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Please wait while we securely retrieve
                            the latest available location.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error && !data) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-3xl bg-white p-8 shadow-sm">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                            ⚠️
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Emergency link unavailable
                        </h1>

                        <p className="mt-3 text-slate-600">
                            {error}
                        </p>

                        <p className="mt-4 text-sm text-slate-500">
                            The link may have expired, been revoked,
                            or the emergency may have been closed.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const patientName =
        data?.patient?.name || 'Patient';

    const emergencyType =
        formatEmergencyType(
            data?.emergency?.type,
        );

    const emergencyDetails =
        data?.emergency?.details ||
        'No additional emergency details were provided.';

    const latitude =
        data?.location?.latitude;

    const longitude =
        data?.location?.longitude;

    const recordedAt =
        data?.location?.recorded_at;

    const eventStatus =
        data?.emergency_event?.status;

    const isActive =
        eventStatus !== 'COMPLETED' &&
        eventStatus !== 'CANCELLED';

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-2xl">
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="bg-red-600 px-6 py-6 text-white sm:px-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl">
                                🚨
                            </div>

                            <div>
                                <p className="text-sm font-medium text-red-100">
                                    Sanjeevani AI
                                </p>

                                <h1 className="mt-1 text-2xl font-bold">
                                    Emergency Alert
                                </h1>

                                <p className="mt-2 text-sm text-red-100">
                                    Emergency information and
                                    latest available patient location.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-6 sm:p-8">
                        <section>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Patient
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                {patientName}
                            </h2>
                        </section>

                        <section className="rounded-2xl border border-red-100 bg-red-50 p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                                        Emergency type
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-red-950">
                                        {emergencyType}
                                    </p>
                                </div>

                                <span
                                    className={[
                                        'rounded-full px-3 py-1 text-xs font-semibold',
                                        isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-slate-200 text-slate-700',
                                    ].join(' ')}
                                >
                                    {isActive
                                        ? 'ACTIVE'
                                        : eventStatus || 'UNKNOWN'}
                                </span>
                            </div>

                            <div className="mt-4 border-t border-red-200 pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                                    What happened
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-700">
                                    {emergencyDetails}
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Latest location
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        Patient location
                                    </h2>
                                </div>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    LIVE
                                </span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                {latitude !== null &&
                                latitude !== undefined &&
                                longitude !== null &&
                                longitude !== undefined ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Latitude
                                                </p>

                                                <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                                    {Number(
                                                        latitude,
                                                    ).toFixed(6)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Longitude
                                                </p>

                                                <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                                    {Number(
                                                        longitude,
                                                    ).toFixed(6)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t border-slate-200 pt-4">
                                            <p className="text-xs text-slate-500">
                                                Location last updated
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {formatDateTime(
                                                    recordedAt,
                                                )}
                                            </p>
                                        </div>

                                        {navigationUrl && (
                                            <a
                                                href={navigationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                                            >
                                                🧭 Navigate to Patient
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-600">
                                        Patient location is currently
                                        unavailable.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                            <p className="text-sm font-bold text-amber-900">
                                Important
                            </p>

                            <p className="mt-2 text-sm leading-6 text-amber-800">
                                This emergency information is private
                                and intended only for the emergency
                                contact. If the situation is
                                life-threatening, contact local
                                emergency services immediately.
                            </p>
                        </section>

                        <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Sanjeevani AI Emergency Coordination
                            </span>

                            {lastRefresh && (
                                <span>
                                    Page refreshed{' '}
                                    {lastRefresh.toLocaleTimeString(
                                        'en-IN',
                                    )}
                                </span>
                            )}
                        </div>

                        {error && (
                            <p className="text-center text-xs text-amber-600">
                                Latest location refresh failed.
                                Showing the last successfully retrieved
                                information.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}