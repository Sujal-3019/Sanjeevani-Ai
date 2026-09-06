import React from 'react';
import {
    Activity,
    AlertTriangle,
    BedDouble,
    CheckCircle2,
    Clock3,
    Hospital,
    Info,
    Minus,
    Plus,
    Save,
    ShieldCheck,
    Siren,
    Stethoscope,
    Wind,
} from 'lucide-react';

import HospitalNavbar from '../../components/layout/HospitalNavbar';

const INITIAL_CAPACITY = {
    totalBeds: 250,
    availableBeds: 58,
    emergencyBeds: 32,
    availableEmergencyBeds: 14,
    icuBeds: 24,
    availableIcuBeds: 8,
    nicuBeds: 12,
    availableNicuBeds: 5,
    ventilators: 18,
    availableVentilators: 9,
    oxygenBeds: 40,
    availableOxygenBeds: 22,
};

const INITIAL_READINESS = {
    emergencyDepartment: 'AVAILABLE',
    traumaCare: 'AVAILABLE',
    emergency24x7: true,
    emergencyPhone: '+91 11 4567 8900',
};

const CAPACITY_LIMITS = {
    totalBeds: 100000,
    availableBeds: 100000,
    emergencyBeds: 100000,
    availableEmergencyBeds: 100000,
    icuBeds: 100000,
    availableIcuBeds: 100000,
    nicuBeds: 100000,
    availableNicuBeds: 100000,
    ventilators: 10000,
    availableVentilators: 10000,
    oxygenBeds: 100000,
    availableOxygenBeds: 100000,
};

const CAPACITY_FIELDS = [
    {
        key: 'totalBeds',
        availableKey: 'availableBeds',
        label: 'Total beds',
        description: 'Total inpatient beds configured for the hospital.',
        icon: BedDouble,
        unit: 'beds',
    },
    {
        key: 'emergencyBeds',
        availableKey: 'availableEmergencyBeds',
        label: 'Emergency beds',
        description: 'Beds reserved or configured for emergency care.',
        icon: Siren,
        unit: 'beds',
    },
    {
        key: 'icuBeds',
        availableKey: 'availableIcuBeds',
        label: 'ICU beds',
        description: 'Critical care beds available for intensive treatment.',
        icon: Activity,
        unit: 'beds',
    },
    {
        key: 'nicuBeds',
        availableKey: 'availableNicuBeds',
        label: 'NICU beds',
        description: 'Neonatal intensive care beds.',
        icon: Hospital,
        unit: 'beds',
    },
    {
        key: 'ventilators',
        availableKey: 'availableVentilators',
        label: 'Ventilators',
        description: 'Ventilators currently configured for emergency use.',
        icon: Wind,
        unit: 'units',
    },
    {
        key: 'oxygenBeds',
        availableKey: 'availableOxygenBeds',
        label: 'Oxygen-supported beds',
        description: 'Beds equipped for oxygen-supported patient care.',
        icon: Stethoscope,
        unit: 'beds',
    },
];

function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-IN');
}

function getUtilization(total, available) {
    const totalValue = Number(total) || 0;
    const availableValue = Number(available) || 0;

    if (totalValue <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, ((totalValue - availableValue) / totalValue) * 100),
    );
}

function getAvailabilityPercentage(total, available) {
    const totalValue = Number(total) || 0;
    const availableValue = Number(available) || 0;

    if (totalValue <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(0, (availableValue / totalValue) * 100),
    );
}

function getCapacityState(percentage) {
    if (percentage >= 90) {
        return {
            label: 'Critical',
            className:
                'bg-red-500/10 text-red-500 ring-red-500/20',
        };
    }

    if (percentage >= 75) {
        return {
            label: 'High occupancy',
            className:
                'bg-orange-500/10 text-orange-500 ring-orange-500/20',
        };
    }

    if (percentage >= 50) {
        return {
            label: 'Moderate',
            className:
                'bg-amber-500/10 text-amber-600 ring-amber-500/20',
        };
    }

    return {
        label: 'Healthy',
        className:
            'bg-(--sj-primary)/10 text-(--sj-primary) ring-(--sj-primary)/20',
    };
}

function ReadinessBadge({ status }) {
    const statusMap = {
        AVAILABLE: {
            label: 'Available',
            className:
                'bg-(--sj-primary)/10 text-(--sj-primary) ring-(--sj-primary)/20',
        },
        LIMITED: {
            label: 'Limited',
            className:
                'bg-amber-500/10 text-amber-600 ring-amber-500/20',
        },
        UNAVAILABLE: {
            label: 'Unavailable',
            className:
                'bg-red-500/10 text-red-500 ring-red-500/20',
        },
    };

    const current = statusMap[status] || statusMap.LIMITED;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${current.className}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {current.label}
        </span>
    );
}

function CapacityCard({
    item,
    capacity,
    onDecrease,
    onIncrease,
    onAvailableChange,
}) {
    const Icon = item.icon;
    const total = Number(capacity[item.key]) || 0;
    const available = Number(capacity[item.availableKey]) || 0;

    const occupancy = getUtilization(total, available);
    const availability = getAvailabilityPercentage(total, available);
    const state = getCapacityState(occupancy);

    return (
        <div className="sj-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-(--sj-text)">
                            {item.label}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-(--sj-text-muted)">
                            {item.description}
                        </p>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${state.className}`}
                >
                    {state.label}
                </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={`total-${item.key}`}
                        className="sj-label"
                    >
                        Total capacity
                    </label>

                    <div className="mt-2 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onDecrease(item.key)}
                            disabled={total <= 0}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease ${item.label}`}
                        >
                            <Minus className="h-4 w-4" />
                        </button>

                        <input
                            id={`total-${item.key}`}
                            type="number"
                            min="0"
                            max={CAPACITY_LIMITS[item.key]}
                            value={capacity[item.key]}
                            onChange={(event) => {
                                const value = event.target.value;

                                if (value === '') {
                                    onAvailableChange(item.key, '');
                                    return;
                                }

                                const numericValue = Number(value);

                                if (
                                    !Number.isNaN(numericValue) &&
                                    numericValue >= 0
                                ) {
                                    onAvailableChange(
                                        item.key,
                                        Math.min(
                                            numericValue,
                                            CAPACITY_LIMITS[item.key],
                                        ),
                                    );
                                }
                            }}
                            className="sj-input h-10 text-center font-black"
                        />

                        <button
                            type="button"
                            onClick={() => onIncrease(item.key)}
                            disabled={
                                total >= CAPACITY_LIMITS[item.key]
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase ${item.label}`}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor={`available-${item.availableKey}`}
                        className="sj-label"
                    >
                        Currently available
                    </label>

                    <input
                        id={`available-${item.availableKey}`}
                        type="number"
                        min="0"
                        max={total}
                        value={capacity[item.availableKey]}
                        onChange={(event) =>
                            onAvailableChange(
                                item.availableKey,
                                event.target.value,
                            )
                        }
                        className="sj-input mt-2 h-10 font-black text-center"
                    />
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-(--sj-text-muted)">
                        Occupancy
                    </span>

                    <span className="font-black text-(--sj-text)">
                        {Math.round(occupancy)}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-(--sj-surface-2)">
                    <div
                        className="h-full rounded-full bg-(--sj-primary) transition-all duration-300"
                        style={{ width: `${occupancy}%` }}
                    />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-(--sj-text-muted)">
                    <span>
                        {formatNumber(available)} available
                    </span>
                    <span>
                        {Math.round(availability)}% available
                    </span>
                </div>
            </div>
        </div>
    );
}

function Capacity() {
    const [capacity, setCapacity] = React.useState(INITIAL_CAPACITY);
    const [readiness, setReadiness] =
        React.useState(INITIAL_READINESS);

    const [error, setError] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    const totalBeds = Number(capacity.totalBeds) || 0;
    const availableBeds = Number(capacity.availableBeds) || 0;
    const occupiedBeds = Math.max(
        0,
        totalBeds - availableBeds,
    );

    const occupancy = getUtilization(
        totalBeds,
        availableBeds,
    );

    const availableEmergencyBeds =
        Number(capacity.availableEmergencyBeds) || 0;

    const availableIcuBeds =
        Number(capacity.availableIcuBeds) || 0;

    const availableNicuBeds =
        Number(capacity.availableNicuBeds) || 0;

    const availableVentilators =
        Number(capacity.availableVentilators) || 0;

    const emergencyCapacityCritical =
        totalBeds > 0 && availableEmergencyBeds <= 5;

    const icuCapacityCritical =
        Number(capacity.icuBeds) > 0 &&
        availableIcuBeds <= 2;

    const ventilatorCapacityCritical =
        Number(capacity.ventilators) > 0 &&
        availableVentilators <= 2;

    const criticalWarnings = [
        emergencyCapacityCritical,
        icuCapacityCritical,
        ventilatorCapacityCritical,
    ].filter(Boolean).length;

    const updateCapacityValue = (key, value) => {
        setSaved(false);
        setError('');

        if (value === '') {
            setCapacity((current) => ({
                ...current,
                [key]: '',
            }));

            return;
        }

        if (!/^\d+$/.test(String(value))) {
            return;
        }

        const numericValue = Number(value);
        const limit = CAPACITY_LIMITS[key] || 100000;

        setCapacity((current) => ({
            ...current,
            [key]: Math.min(numericValue, limit),
        }));
    };

    const handleIncrease = (key) => {
        const currentValue = Number(capacity[key]) || 0;
        const limit = CAPACITY_LIMITS[key] || 100000;

        updateCapacityValue(
            key,
            Math.min(currentValue + 1, limit),
        );
    };

    const handleDecrease = (key) => {
        const currentValue = Number(capacity[key]) || 0;

        updateCapacityValue(
            key,
            Math.max(currentValue - 1, 0),
        );
    };

    const validateCapacity = () => {
        const numericFields = Object.keys(INITIAL_CAPACITY);

        for (const field of numericFields) {
            const value = capacity[field];

            if (value === '' || value === null) {
                return 'Please complete all capacity values before saving.';
            }

            if (
                !Number.isInteger(Number(value)) ||
                Number(value) < 0
            ) {
                return 'Capacity values must be whole numbers greater than or equal to zero.';
            }
        }

        if (availableBeds > totalBeds) {
            return 'Available beds cannot be greater than total beds.';
        }

        if (
            Number(capacity.emergencyBeds) >
            totalBeds
        ) {
            return 'Emergency beds cannot exceed total beds.';
        }

        if (
            availableEmergencyBeds >
            Number(capacity.emergencyBeds)
        ) {
            return 'Available emergency beds cannot exceed emergency beds.';
        }

        if (
            Number(capacity.icuBeds) >
            totalBeds
        ) {
            return 'ICU beds cannot exceed total beds.';
        }

        if (
            availableIcuBeds >
            Number(capacity.icuBeds)
        ) {
            return 'Available ICU beds cannot exceed ICU beds.';
        }

        if (
            Number(capacity.nicuBeds) >
            totalBeds
        ) {
            return 'NICU beds cannot exceed total beds.';
        }

        if (
            availableNicuBeds >
            Number(capacity.nicuBeds)
        ) {
            return 'Available NICU beds cannot exceed NICU beds.';
        }

        if (
            availableVentilators >
            Number(capacity.ventilators)
        ) {
            return 'Available ventilators cannot exceed total ventilators.';
        }

        if (
            Number(capacity.oxygenBeds) >
            totalBeds
        ) {
            return 'Oxygen-supported beds cannot exceed total beds.';
        }

        if (
            Number(capacity.availableOxygenBeds) >
            Number(capacity.oxygenBeds)
        ) {
            return 'Available oxygen-supported beds cannot exceed oxygen-supported beds.';
        }

        if (!readiness.emergencyPhone.trim()) {
            return 'Please provide the emergency department phone number.';
        }

        return '';
    };

    const handleSave = () => {
        const validationError = validateCapacity();

        if (validationError) {
            setError(validationError);
            setSaved(false);
            return;
        }

        setError('');
        setSaved(false);
        setIsSaving(true);

        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
        }, 1000);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Page header */}
                <section className="mb-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-(--sj-primary)/10 px-3 py-1.5 text-xs font-black text-(--sj-primary)">
                                <Hospital className="h-3.5 w-3.5" />
                                Hospital capacity
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-(--sj-text) sm:text-3xl">
                                Capacity &amp; emergency readiness
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-(--sj-text-soft)">
                                Keep bed, ICU, NICU, ventilator and
                                emergency capacity information current so
                                Sanjeevani AI can make better hospital
                                coordination decisions.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2 text-xs font-bold text-(--sj-text-soft)">
                                <Clock3 className="h-4 w-4" />
                                Last updated: Just now
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="sj-ai-button inline-flex h-11 items-center gap-2 px-5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving
                                    ? 'Saving...'
                                    : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Error / saved message */}
                {(error || saved) && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
                            error
                                ? 'border-red-500/20 bg-red-500/5'
                                : 'border-(--sj-primary)/20 bg-(--sj-primary)/5'
                        }`}
                    >
                        {error ? (
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        ) : (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />
                        )}

                        <div>
                            <p
                                className={`text-sm font-black ${
                                    error
                                        ? 'text-red-500'
                                        : 'text-(--sj-primary)'
                                }`}
                            >
                                {error
                                    ? 'Unable to save capacity'
                                    : 'Capacity updated successfully'}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                {error ||
                                    'The latest hospital capacity information is ready for emergency coordination.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Overview cards */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <BedDouble className="h-5 w-5" />
                            </div>

                            <span className="text-[11px] font-bold text-(--sj-text-muted)">
                                Overall
                            </span>
                        </div>

                        <p className="mt-5 text-2xl font-black text-(--sj-text)">
                            {formatNumber(totalBeds)}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-(--sj-text-soft)">
                            Total beds
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs">
                            <span className="text-(--sj-text-muted)">
                                {formatNumber(occupiedBeds)} occupied
                            </span>
                            <span className="font-black text-(--sj-primary)">
                                {formatNumber(availableBeds)} available
                            </span>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                <Siren className="h-5 w-5" />
                            </div>

                            <span className="text-[11px] font-bold text-(--sj-text-muted)">
                                Emergency
                            </span>
                        </div>

                        <p className="mt-5 text-2xl font-black text-(--sj-text)">
                            {formatNumber(availableEmergencyBeds)}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-(--sj-text-soft)">
                            Emergency beds available
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    emergencyCapacityCritical
                                        ? 'bg-red-500'
                                        : 'bg-(--sj-primary)'
                                }`}
                            />

                            <span className="font-bold text-(--sj-text-soft)">
                                {emergencyCapacityCritical
                                    ? 'Low availability'
                                    : 'Ready for emergencies'}
                            </span>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                                <Activity className="h-5 w-5" />
                            </div>

                            <span className="text-[11px] font-bold text-(--sj-text-muted)">
                                Critical care
                            </span>
                        </div>

                        <p className="mt-5 text-2xl font-black text-(--sj-text)">
                            {formatNumber(availableIcuBeds)}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-(--sj-text-soft)">
                            ICU beds available
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    icuCapacityCritical
                                        ? 'bg-red-500'
                                        : 'bg-(--sj-primary)'
                                }`}
                            />

                            <span className="font-bold text-(--sj-text-soft)">
                                {icuCapacityCritical
                                    ? 'Low ICU availability'
                                    : 'ICU capacity available'}
                            </span>
                        </div>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <Wind className="h-5 w-5" />
                            </div>

                            <span className="text-[11px] font-bold text-(--sj-text-muted)">
                                Respiratory
                            </span>
                        </div>

                        <p className="mt-5 text-2xl font-black text-(--sj-text)">
                            {formatNumber(availableVentilators)}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-(--sj-text-soft)">
                            Ventilators available
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    ventilatorCapacityCritical
                                        ? 'bg-red-500'
                                        : 'bg-(--sj-primary)'
                                }`}
                            />

                            <span className="font-bold text-(--sj-text-soft)">
                                {ventilatorCapacityCritical
                                    ? 'Low ventilator availability'
                                    : 'Respiratory support ready'}
                            </span>
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* Capacity controls */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-black text-(--sj-text)">
                                Resource capacity
                            </h2>

                            <p className="mt-1 text-sm text-(--sj-text-soft)">
                                Update current resource availability as
                                hospital conditions change.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {CAPACITY_FIELDS.map((item) => (
                                <CapacityCard
                                    key={item.key}
                                    item={item}
                                    capacity={capacity}
                                    onDecrease={handleDecrease}
                                    onIncrease={handleIncrease}
                                    onAvailableChange={
                                        updateCapacityValue
                                    }
                                />
                            ))}
                        </div>

                        {/* Important note */}
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                            <div>
                                <p className="text-xs font-black text-(--sj-text)">
                                    Capacity data affects emergency
                                    coordination
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Sanjeevani AI can use current hospital
                                    capacity together with emergency
                                    services, location, ambulance
                                    availability and AI severity to
                                    determine suitable destinations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Right sidebar */}
                    <aside className="space-y-5">
                        {/* Occupancy */}
                        <div className="sj-card p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                        Overall occupancy
                                    </p>

                                    <h2 className="mt-2 text-3xl font-black text-(--sj-text)">
                                        {Math.round(occupancy)}%
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <Activity className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-(--sj-surface-2)">
                                <div
                                    className="h-full rounded-full bg-(--sj-primary) transition-all duration-300"
                                    style={{
                                        width: `${occupancy}%`,
                                    }}
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs">
                                <span className="text-(--sj-text-muted)">
                                    {formatNumber(occupiedBeds)} occupied
                                </span>

                                <span className="font-black text-(--sj-primary)">
                                    {formatNumber(availableBeds)} available
                                </span>
                            </div>
                        </div>

                        {/* Emergency readiness */}
                        <div className="sj-card p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-black text-(--sj-text)">
                                        Emergency readiness
                                    </h2>

                                    <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                        Current operational status
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-(--sj-text-soft)">
                                        Emergency department
                                    </span>

                                    <ReadinessBadge
                                        status={
                                            readiness.emergencyDepartment
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-(--sj-text-soft)">
                                        Trauma care
                                    </span>

                                    <ReadinessBadge
                                        status={
                                            readiness.traumaCare
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-(--sj-text-soft)">
                                        24×7 emergency
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
                                            readiness.emergency24x7
                                                ? 'bg-(--sj-primary)/10 text-(--sj-primary) ring-(--sj-primary)/20'
                                                : 'bg-red-500/10 text-red-500 ring-red-500/20'
                                        }`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        {readiness.emergency24x7
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Readiness controls */}
                        <div className="sj-card p-5">
                            <h2 className="text-sm font-black text-(--sj-text)">
                                Operational controls
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-muted)">
                                Update these values when your emergency
                                department status changes.
                            </p>

                            <div className="mt-5 space-y-4">
                                <div>
                                    <label
                                        htmlFor="emergency-department-status"
                                        className="sj-label"
                                    >
                                        Emergency department
                                    </label>

                                    <select
                                        id="emergency-department-status"
                                        value={
                                            readiness.emergencyDepartment
                                        }
                                        onChange={(event) => {
                                            setReadiness(
                                                (current) => ({
                                                    ...current,
                                                    emergencyDepartment:
                                                        event.target.value,
                                                }),
                                            );
                                            setSaved(false);
                                            setError('');
                                        }}
                                        className="sj-input mt-2 h-11"
                                    >
                                        <option value="AVAILABLE">
                                            Available
                                        </option>
                                        <option value="LIMITED">
                                            Limited
                                        </option>
                                        <option value="UNAVAILABLE">
                                            Unavailable
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="trauma-care-status"
                                        className="sj-label"
                                    >
                                        Trauma care
                                    </label>

                                    <select
                                        id="trauma-care-status"
                                        value={readiness.traumaCare}
                                        onChange={(event) => {
                                            setReadiness(
                                                (current) => ({
                                                    ...current,
                                                    traumaCare:
                                                        event.target.value,
                                                }),
                                            );
                                            setSaved(false);
                                            setError('');
                                        }}
                                        className="sj-input mt-2 h-11"
                                    >
                                        <option value="AVAILABLE">
                                            Available
                                        </option>
                                        <option value="LIMITED">
                                            Limited
                                        </option>
                                        <option value="UNAVAILABLE">
                                            Unavailable
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="emergency-phone"
                                        className="sj-label"
                                    >
                                        Emergency phone
                                    </label>

                                    <input
                                        id="emergency-phone"
                                        type="tel"
                                        value={
                                            readiness.emergencyPhone
                                        }
                                        onChange={(event) => {
                                            setReadiness(
                                                (current) => ({
                                                    ...current,
                                                    emergencyPhone:
                                                        event.target.value,
                                                }),
                                            );
                                            setSaved(false);
                                            setError('');
                                        }}
                                        className="sj-input mt-2 h-11"
                                    />
                                </div>

                                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-3">
                                    <div>
                                        <p className="text-xs font-black text-(--sj-text)">
                                            24×7 emergency service
                                        </p>

                                        <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                            Accept emergency coordination
                                            around the clock.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            readiness.emergency24x7
                                        }
                                        onChange={(event) => {
                                            setReadiness(
                                                (current) => ({
                                                    ...current,
                                                    emergency24x7:
                                                        event.target.checked,
                                                }),
                                            );
                                            setSaved(false);
                                            setError('');
                                        }}
                                        className="h-4 w-4 accent-(--sj-primary)"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Warning */}
                        {criticalWarnings > 0 && (
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                                    <div>
                                        <h3 className="text-sm font-black text-red-500">
                                            Capacity attention required
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            One or more critical resources
                                            are approaching low
                                            availability. Review capacity
                                            before accepting additional
                                            emergencies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Coordination note */}
                        <div className="rounded-2xl border border-(--sj-primary)/20 bg-(--sj-primary)/5 p-5">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                                <div>
                                    <h3 className="text-sm font-black text-(--sj-text)">
                                        Keep capacity current
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Accurate capacity helps reduce
                                        inappropriate emergency
                                        assignments and improves
                                        hospital readiness.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-(--sj-border) bg-(--sj-surface)">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-5 text-xs text-(--sj-text-muted) sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p>
                        Sanjeevani AI · Hospital command center
                    </p>

                    <p>
                        Capacity information should be reviewed regularly
                        by authorized hospital staff.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Capacity;