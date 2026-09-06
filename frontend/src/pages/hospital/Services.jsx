import React from 'react';
import {
    Activity,
    Ambulance,
    Baby,
    BadgeCheck,
    BedDouble,
    Brain,
    Check,
    ChevronDown,
    Clock3,
    HeartPulse,
    Hospital,
    Microscope,
    Pill,
    Plus,
    Search,
    ShieldCheck,
    Stethoscope,
    Syringe,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import HospitalNavbar from '../../components/layout/HospitalNavbar';

const SERVICE_CATEGORIES = [
    'ALL',
    'Emergency',
    'Critical Care',
    'Surgery',
    'Diagnostics',
    'Specialty',
    'General',
    'Support',
];

const INITIAL_SERVICES = [
    {
        id: 'SRV-001',
        name: 'Emergency Department',
        category: 'Emergency',
        description:
            'Round-the-clock emergency assessment, stabilization, and acute care.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'emergency',
    },
    {
        id: 'SRV-002',
        name: 'Trauma Care',
        category: 'Emergency',
        description:
            'Immediate treatment and stabilization for major trauma and injuries.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'trauma',
    },
    {
        id: 'SRV-003',
        name: 'Cardiology',
        category: 'Specialty',
        description:
            'Diagnosis and treatment of cardiovascular emergencies and conditions.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'cardiology',
    },
    {
        id: 'SRV-004',
        name: 'Neurology',
        category: 'Specialty',
        description:
            'Specialized neurological assessment and emergency stroke care.',
        available: true,
        emergencyCapable: true,
        available24x7: false,
        icon: 'neurology',
    },
    {
        id: 'SRV-005',
        name: 'ICU',
        category: 'Critical Care',
        description:
            'Intensive monitoring and treatment for critically ill patients.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'icu',
    },
    {
        id: 'SRV-006',
        name: 'NICU',
        category: 'Critical Care',
        description:
            'Specialized intensive care for newborn and critically ill infants.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'nicu',
    },
    {
        id: 'SRV-007',
        name: 'General Surgery',
        category: 'Surgery',
        description:
            'Surgical evaluation and procedures for emergency and general cases.',
        available: true,
        emergencyCapable: true,
        available24x7: false,
        icon: 'surgery',
    },
    {
        id: 'SRV-008',
        name: 'Orthopedic Surgery',
        category: 'Surgery',
        description:
            'Treatment of fractures, musculoskeletal injuries, and trauma.',
        available: true,
        emergencyCapable: true,
        available24x7: false,
        icon: 'orthopedic',
    },
    {
        id: 'SRV-009',
        name: 'Radiology',
        category: 'Diagnostics',
        description:
            'Imaging services including X-ray, CT, and other diagnostic scans.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'radiology',
    },
    {
        id: 'SRV-010',
        name: 'Laboratory',
        category: 'Diagnostics',
        description:
            'Clinical laboratory testing supporting emergency and routine care.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'laboratory',
    },
    {
        id: 'SRV-011',
        name: 'Blood Bank',
        category: 'Support',
        description:
            'Blood component storage and emergency transfusion support.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'blood',
    },
    {
        id: 'SRV-012',
        name: 'Pharmacy',
        category: 'Support',
        description:
            'Medication dispensing and emergency pharmaceutical support.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'pharmacy',
    },
    {
        id: 'SRV-013',
        name: 'Obstetrics & Gynecology',
        category: 'Specialty',
        description:
            'Women’s health, pregnancy, delivery, and obstetric emergency care.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'obgyn',
    },
    {
        id: 'SRV-014',
        name: 'Pediatrics',
        category: 'Specialty',
        description:
            'Medical care and emergency treatment for children and adolescents.',
        available: true,
        emergencyCapable: true,
        available24x7: true,
        icon: 'pediatrics',
    },
    {
        id: 'SRV-015',
        name: 'Dialysis',
        category: 'General',
        description:
            'Hemodialysis and renal support services for eligible patients.',
        available: false,
        emergencyCapable: false,
        available24x7: false,
        icon: 'dialysis',
    },
    {
        id: 'SRV-016',
        name: 'Physiotherapy',
        category: 'Support',
        description:
            'Rehabilitation and physical therapy for recovery and mobility.',
        available: true,
        emergencyCapable: false,
        available24x7: false,
        icon: 'physio',
    },
];

const ICONS = {
    emergency: HeartPulse,
    trauma: Ambulance,
    cardiology: HeartPulse,
    neurology: Brain,
    icu: Activity,
    nicu: Baby,
    surgery: Syringe,
    orthopedic: BedDouble,
    radiology: Microscope,
    laboratory: Microscope,
    blood: Syringe,
    pharmacy: Pill,
    obgyn: UserRound,
    pediatrics: Baby,
    dialysis: Activity,
    physio: Users,
};

function getServiceIcon(iconName) {
    return ICONS[iconName] || Hospital;
}

function getCategoryClasses(category) {
    switch (category) {
        case 'Emergency':
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';

        case 'Critical Care':
            return 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-300';

        case 'Surgery':
            return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300';

        case 'Diagnostics':
            return 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300';

        case 'Specialty':
            return 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-300';

        case 'Support':
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300';

        default:
            return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
}

function FieldLabel({ children }) {
    return (
        <label className="sj-label">
            {children}
        </label>
    );
}

function EmptyState({ onClear }) {
    return (
        <div className="sj-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                <Hospital className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-(--sj-text)">
                No services found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                Try changing your search or category filter to find the
                hospital service you are looking for.
            </p>

            <button
                type="button"
                onClick={onClear}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
            >
                <X className="h-4 w-4" />
                Clear filters
            </button>
        </div>
    );
}

export default function Services() {
    const [services, setServices] = React.useState(INITIAL_SERVICES);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('ALL');
    const [isSaving, setIsSaving] = React.useState(false);
    const [savedMessage, setSavedMessage] = React.useState('');

    const filteredServices = React.useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return services.filter((service) => {
            const matchesSearch =
                !normalizedSearch ||
                service.name.toLowerCase().includes(normalizedSearch) ||
                service.description
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                service.category.toLowerCase().includes(normalizedSearch);

            const matchesCategory =
                categoryFilter === 'ALL' ||
                service.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [services, searchTerm, categoryFilter]);

    const totalServices = services.length;

    const availableServices = services.filter(
        (service) => service.available,
    ).length;

    const emergencyServices = services.filter(
        (service) => service.available && service.emergencyCapable,
    ).length;

    const roundTheClockServices = services.filter(
        (service) => service.available && service.available24x7,
    ).length;

    const disabledServices = services.filter(
        (service) => !service.available,
    ).length;

    const toggleService = (serviceId) => {
        setServices((current) =>
            current.map((service) =>
                service.id === serviceId
                    ? {
                        ...service,
                        available: !service.available,
                    }
                    : service,
            ),
        );

        setSavedMessage('');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('ALL');
    };

    const handleSave = () => {
        setIsSaving(true);
        setSavedMessage('');

        window.setTimeout(() => {
            setIsSaving(false);
            setSavedMessage('Service configuration saved successfully.');

            window.setTimeout(() => {
                setSavedMessage('');
            }, 3000);
        }, 800);
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar />

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Page header */}
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-(--sj-text-muted)">
                            <Link
                                to="/dashboard/hospital"
                                className="transition hover:text-(--sj-primary)"
                            >
                                Hospital dashboard
                            </Link>

                            <span>/</span>

                            <span className="text-(--sj-text-soft)">
                                Services
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary) sm:flex">
                                <Hospital className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-(--sj-text) sm:text-3xl">
                                    Hospital services
                                </h1>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-(--sj-text-soft)">
                                    Manage the clinical services your hospital
                                    provides and identify which capabilities
                                    are available for emergency coordination.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                Save changes
                            </>
                        )}
                    </button>
                </div>

                {/* Save confirmation */}
                {savedMessage && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-950/20 dark:text-green-300">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/40">
                            <Check className="h-4 w-4" />
                        </div>

                        {savedMessage}
                    </div>
                )}

                {/* Operational notice */}
                <section className="mb-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-(--sj-text)">
                                    Emergency coordination capabilities
                                </p>

                                <p className="mt-1 max-w-3xl text-xs leading-5 text-(--sj-text-soft)">
                                    Keep service availability accurate. These
                                    capabilities will help Sanjeevani AI match
                                    emergency patients with hospitals that can
                                    provide the required care.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft)">
                            <BadgeCheck className="h-4 w-4 text-(--sj-primary)" />
                            {emergencyServices} emergency-capable
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Total services
                            </p>

                            <Hospital className="h-5 w-5 text-(--sj-primary)" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {totalServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Configured hospital services
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Available
                            </p>

                            <BadgeCheck className="h-5 w-5 text-green-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {availableServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Currently offered
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Emergency capable
                            </p>

                            <HeartPulse className="h-5 w-5 text-red-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {emergencyServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Supports emergency matching
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                24×7 services
                            </p>

                            <Clock3 className="h-5 w-5 text-blue-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {roundTheClockServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Available around the clock
                        </p>
                    </div>

                    <div className="sj-card p-5 sm:col-span-2 xl:col-span-1">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Disabled
                            </p>

                            <X className="h-5 w-5 text-red-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {disabledServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Currently unavailable
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="mb-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search services or capabilities..."
                                className="sj-input h-11 pl-10"
                            />
                        </div>

                        <div className="relative sm:w-64">
                            <select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(event.target.value)
                                }
                                className="sj-input h-11 appearance-none pr-10 text-center"
                            >
                                {SERVICE_CATEGORIES.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category === 'ALL'
                                            ? 'All categories'
                                            : category}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                        </div>
                    </div>

                    {(searchTerm || categoryFilter !== 'ALL') && (
                        <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-4">
                            <p className="text-xs font-semibold text-(--sj-text-muted)">
                                Showing {filteredServices.length} of{' '}
                                {services.length} services
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>

                {/* Service list header */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-(--sj-text)">
                            Available hospital services
                        </h2>

                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                            {filteredServices.length} service
                            {filteredServices.length === 1 ? '' : 's'} shown
                        </p>
                    </div>
                </div>

                {/* Service cards */}
                {filteredServices.length === 0 ? (
                    <EmptyState onClear={clearFilters} />
                ) : (
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredServices.map((service) => {
                            const ServiceIcon = getServiceIcon(service.icon);

                            return (
                                <article
                                    key={service.id}
                                    className={`sj-card sj-card-hover flex min-h-85 flex-col overflow-hidden transition-opacity ${
                                        !service.available
                                            ? 'opacity-75'
                                            : ''
                                    }`}
                                >
                                    <div className="flex-1 p-4">
                                        {/* Card header */}
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                    service.available
                                                        ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                                        : 'bg-(--sj-surface-2) text-(--sj-text-muted)'
                                                }`}
                                            >
                                                <ServiceIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="line-clamp-2 text-sm font-black leading-5 text-(--sj-text)">
                                                        {service.name}
                                                    </h3>

                                                    <span
                                                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                                            service.available
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    />
                                                </div>

                                                <p className="mt-1 text-[10px] font-semibold text-(--sj-text-muted)">
                                                    {service.id}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="mt-4">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${getCategoryClasses(
                                                    service.category,
                                                )}`}
                                            >
                                                {service.category}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="mt-4 line-clamp-3 min-h-13.5 text-xs leading-5 text-(--sj-text-soft)">
                                            {service.description}
                                        </p>

                                        {/* Capabilities */}
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between rounded-lg bg-(--sj-surface-2) px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-3.5 w-3.5 text-(--sj-text-muted)" />

                                                    <span className="text-[10px] font-semibold text-(--sj-text-soft)">
                                                        Emergency capable
                                                    </span>
                                                </div>

                                                {service.emergencyCapable ? (
                                                    <Check className="h-3.5 w-3.5 text-(--sj-primary)" />
                                                ) : (
                                                    <X className="h-3.5 w-3.5 text-(--sj-text-muted)" />
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg bg-(--sj-surface-2) px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock3 className="h-3.5 w-3.5 text-(--sj-text-muted)" />

                                                    <span className="text-[10px] font-semibold text-(--sj-text-soft)">
                                                        Available 24×7
                                                    </span>
                                                </div>

                                                {service.available24x7 ? (
                                                    <Check className="h-3.5 w-3.5 text-(--sj-primary)" />
                                                ) : (
                                                    <X className="h-3.5 w-3.5 text-(--sj-text-muted)" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-(--sj-border) bg-(--sj-surface-2)/50 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[9px] font-semibold text-(--sj-text-muted)">
                                                Service status
                                            </span>

                                            <span
                                                className={`text-[9px] font-extrabold ${
                                                    service.available
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {service.available
                                                    ? 'AVAILABLE'
                                                    : 'UNAVAILABLE'}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleService(service.id)
                                            }
                                            className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-[10px] font-bold transition ${
                                                service.available
                                                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50'
                                                    : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300 dark:hover:bg-green-950/50'
                                            }`}
                                        >
                                            {service.available ? (
                                                <>
                                                    <X className="h-3.5 w-3.5" />
                                                    Mark unavailable
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-3.5 w-3.5" />
                                                    Mark available
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                {/* Service management information */}
                <section className="mt-8 grid gap-4 lg:grid-cols-3">
                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <HeartPulse className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Emergency matching
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Emergency-capable services help the coordination
                            engine identify hospitals that can handle specific
                            patient needs.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Keep availability current
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Update service availability whenever staffing,
                            equipment, or operational conditions change.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Stethoscope className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Clinical capability
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Accurate service information improves hospital
                            selection and helps emergency teams prepare before
                            the patient arrives.
                        </p>
                    </div>
                </section>

                {/* Security notice */}
                <div className="mt-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-(--sj-text)">
                                Operational data accuracy
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Service availability will eventually be stored
                                against your hospital record and used by the
                                Sanjeevani AI emergency coordination engine.
                                Hospital administrators should keep this
                                information accurate and up to date.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}