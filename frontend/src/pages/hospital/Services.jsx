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
    Edit3,
    HeartPulse,
    Hospital,
    Info,
    Microscope,
    Pill,
    Plus,
    Search,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Trash2,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import HospitalNavbar from '../../components/layout/HospitalNavbar';

const SERVICE_CATALOGUE = [
    {
        id: 'CAT-001',
        name: 'Emergency Department',
        category: 'Emergency',
        defaultDescription:
            'Emergency assessment, stabilization, and acute medical care.',
        icon: 'emergency',
    },
    {
        id: 'CAT-002',
        name: 'Trauma Care',
        category: 'Emergency',
        defaultDescription:
            'Immediate treatment and stabilization for major trauma and injuries.',
        icon: 'trauma',
    },
    {
        id: 'CAT-003',
        name: 'Cardiology',
        category: 'Specialty',
        defaultDescription:
            'Diagnosis and treatment of cardiovascular emergencies and conditions.',
        icon: 'cardiology',
    },
    {
        id: 'CAT-004',
        name: 'Neurology',
        category: 'Specialty',
        defaultDescription:
            'Neurological assessment, treatment, and emergency stroke care.',
        icon: 'neurology',
    },
    {
        id: 'CAT-005',
        name: 'ICU',
        category: 'Critical Care',
        defaultDescription:
            'Intensive monitoring and treatment for critically ill patients.',
        icon: 'icu',
    },
    {
        id: 'CAT-006',
        name: 'NICU',
        category: 'Critical Care',
        defaultDescription:
            'Specialized intensive care for newborn and critically ill infants.',
        icon: 'nicu',
    },
    {
        id: 'CAT-007',
        name: 'General Surgery',
        category: 'Surgery',
        defaultDescription:
            'Surgical evaluation and procedures for emergency and general cases.',
        icon: 'surgery',
    },
    {
        id: 'CAT-008',
        name: 'Orthopedic Surgery',
        category: 'Surgery',
        defaultDescription:
            'Treatment of fractures, musculoskeletal injuries, and trauma.',
        icon: 'orthopedic',
    },
    {
        id: 'CAT-009',
        name: 'Radiology',
        category: 'Diagnostics',
        defaultDescription:
            'Diagnostic imaging including X-ray, CT, and other scans.',
        icon: 'radiology',
    },
    {
        id: 'CAT-010',
        name: 'Laboratory',
        category: 'Diagnostics',
        defaultDescription:
            'Clinical laboratory testing supporting emergency and routine care.',
        icon: 'laboratory',
    },
    {
        id: 'CAT-011',
        name: 'Blood Bank',
        category: 'Support',
        defaultDescription:
            'Blood component storage and emergency transfusion support.',
        icon: 'blood',
    },
    {
        id: 'CAT-012',
        name: 'Pharmacy',
        category: 'Support',
        defaultDescription:
            'Medication dispensing and emergency pharmaceutical support.',
        icon: 'pharmacy',
    },
    {
        id: 'CAT-013',
        name: 'Obstetrics & Gynecology',
        category: 'Specialty',
        defaultDescription:
            'Women’s health, pregnancy, delivery, and obstetric emergency care.',
        icon: 'obgyn',
    },
    {
        id: 'CAT-014',
        name: 'Pediatrics',
        category: 'Specialty',
        defaultDescription:
            'Medical care and emergency treatment for children and adolescents.',
        icon: 'pediatrics',
    },
    {
        id: 'CAT-015',
        name: 'Dialysis',
        category: 'General',
        defaultDescription:
            'Hemodialysis and renal support services for eligible patients.',
        icon: 'dialysis',
    },
    {
        id: 'CAT-016',
        name: 'Physiotherapy',
        category: 'Support',
        defaultDescription:
            'Rehabilitation and physical therapy for recovery and mobility.',
        icon: 'physio',
    },
    {
        id: 'CAT-017',
        name: 'Respiratory Care',
        category: 'Critical Care',
        defaultDescription:
            'Respiratory assessment, treatment, and breathing support.',
        icon: 'respiratory',
    },
    {
        id: 'CAT-018',
        name: 'General Medicine',
        category: 'General',
        defaultDescription:
            'Diagnosis and treatment of common adult medical conditions.',
        icon: 'medicine',
    },
    {
        id: 'CAT-019',
        name: 'Gastroenterology',
        category: 'Specialty',
        defaultDescription:
            'Diagnosis and treatment of digestive system conditions.',
        icon: 'gastro',
    },
    {
        id: 'CAT-020',
        name: 'Nephrology',
        category: 'Specialty',
        defaultDescription:
            'Medical care for kidney and renal system conditions.',
        icon: 'nephrology',
    },
    {
        id: 'CAT-021',
        name: 'Oncology',
        category: 'Specialty',
        defaultDescription:
            'Diagnosis and treatment services for cancer and related conditions.',
        icon: 'oncology',
    },
    {
        id: 'CAT-022',
        name: 'Urology',
        category: 'Specialty',
        defaultDescription:
            'Diagnosis and treatment of urinary and male reproductive conditions.',
        icon: 'urology',
    },
    {
        id: 'CAT-023',
        name: 'ENT',
        category: 'Specialty',
        defaultDescription:
            'Evaluation and treatment of ear, nose, and throat conditions.',
        icon: 'ent',
    },
    {
        id: 'CAT-024',
        name: 'Ophthalmology',
        category: 'Specialty',
        defaultDescription:
            'Eye examination, treatment, and ophthalmic emergency care.',
        icon: 'ophthalmology',
    },
];

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

const SERVICE_STATUSES = [
    'AVAILABLE',
    'LIMITED',
    'UNAVAILABLE',
];

const INITIAL_SERVICES = [
    {
        id: 'SRV-001',
        catalogueId: 'CAT-001',
        name: 'Emergency Department',
        category: 'Emergency',
        description:
            'Round-the-clock emergency assessment, stabilization, and acute care.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Primary emergency receiving unit.',
    },
    {
        id: 'SRV-002',
        catalogueId: 'CAT-002',
        name: 'Trauma Care',
        category: 'Emergency',
        description:
            'Immediate treatment and stabilization for major trauma and injuries.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Supports road traffic accidents and major trauma.',
    },
    {
        id: 'SRV-003',
        catalogueId: 'CAT-003',
        name: 'Cardiology',
        category: 'Specialty',
        description:
            'Diagnosis and treatment of cardiovascular emergencies and conditions.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Cardiac emergency support available.',
    },
    {
        id: 'SRV-004',
        catalogueId: 'CAT-004',
        name: 'Neurology',
        category: 'Specialty',
        description:
            'Specialized neurological assessment and emergency stroke care.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: false,
        notes: 'Specialist availability during scheduled hours.',
    },
    {
        id: 'SRV-005',
        catalogueId: 'CAT-005',
        name: 'ICU',
        category: 'Critical Care',
        description:
            'Intensive monitoring and treatment for critically ill patients.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Critical care beds subject to live capacity.',
    },
    {
        id: 'SRV-006',
        catalogueId: 'CAT-006',
        name: 'NICU',
        category: 'Critical Care',
        description:
            'Specialized intensive care for newborn and critically ill infants.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Neonatal intensive care support.',
    },
    {
        id: 'SRV-007',
        catalogueId: 'CAT-007',
        name: 'General Surgery',
        category: 'Surgery',
        description:
            'Surgical evaluation and procedures for emergency and general cases.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: false,
        notes: 'Emergency surgical support based on on-call availability.',
    },
    {
        id: 'SRV-008',
        catalogueId: 'CAT-008',
        name: 'Orthopedic Surgery',
        category: 'Surgery',
        description:
            'Treatment of fractures, musculoskeletal injuries, and trauma.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: false,
        notes: 'Trauma and orthopedic emergency support.',
    },
    {
        id: 'SRV-009',
        catalogueId: 'CAT-009',
        name: 'Radiology',
        category: 'Diagnostics',
        description:
            'Imaging services including X-ray, CT, and other diagnostic scans.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Emergency imaging available around the clock.',
    },
    {
        id: 'SRV-010',
        catalogueId: 'CAT-010',
        name: 'Laboratory',
        category: 'Diagnostics',
        description:
            'Clinical laboratory testing supporting emergency and routine care.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Emergency diagnostic testing available.',
    },
    {
        id: 'SRV-011',
        catalogueId: 'CAT-011',
        name: 'Blood Bank',
        category: 'Support',
        description:
            'Blood component storage and emergency transfusion support.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Blood availability should be updated operationally.',
    },
    {
        id: 'SRV-012',
        catalogueId: 'CAT-012',
        name: 'Pharmacy',
        category: 'Support',
        description:
            'Medication dispensing and emergency pharmaceutical support.',
        status: 'AVAILABLE',
        emergencyCapable: true,
        available24x7: true,
        notes: 'Emergency medication support available.',
    },
];

const EMPTY_FORM = {
    catalogueId: '',
    status: 'AVAILABLE',
    emergencyCapable: false,
    available24x7: false,
    description: '',
    notes: '',
};

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
    respiratory: Activity,
    medicine: Stethoscope,
    gastro: Activity,
    nephrology: Activity,
    oncology: Activity,
    urology: Activity,
    ent: Activity,
    ophthalmology: Activity,
};

function getServiceIcon(service) {
    const catalogueService = SERVICE_CATALOGUE.find(
        (item) => item.id === service.catalogueId,
    );

    return (
        ICONS[catalogueService?.icon] ||
        Hospital
    );
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

function getStatusClasses(status) {
    switch (status) {
        case 'AVAILABLE':
            return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300';

        case 'LIMITED':
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300';

        case 'UNAVAILABLE':
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';

        default:
            return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
}

function getStatusDot(status) {
    switch (status) {
        case 'AVAILABLE':
            return 'bg-green-500';

        case 'LIMITED':
            return 'bg-amber-500';

        case 'UNAVAILABLE':
            return 'bg-red-500';

        default:
            return 'bg-(--sj-text-muted)';
    }
}

function FieldLabel({ children, required = false }) {
    return (
        <label className="sj-label">
            {children}

            {required && (
                <span className="ml-1 text-red-500">*</span>
            )}
        </label>
    );
}

function ServiceModal({
    mode,
    formData,
    setFormData,
    onClose,
    onSubmit,
    error,
}) {
    const isEdit = mode === 'edit';

    const selectedCatalogueService =
        SERVICE_CATALOGUE.find(
            (service) =>
                service.id === formData.catalogueId,
        );

    const handleCatalogueChange = (event) => {
        const catalogueId = event.target.value;

        const selectedService =
            SERVICE_CATALOGUE.find(
                (service) => service.id === catalogueId,
            );

        if (!selectedService) {
            setFormData((current) => ({
                ...current,
                catalogueId: '',
            }));

            return;
        }

        setFormData((current) => ({
            ...current,
            catalogueId,
            description:
                current.description ||
                selectedService.defaultDescription,
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: checked,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                {/* Modal header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface) px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-black text-(--sj-text)">
                            {isEdit
                                ? 'Update service'
                                : 'Add hospital service'}
                        </h2>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            {isEdit
                                ? 'Update the operational details of this hospital service.'
                                : 'Select a service from the Sanjeevani AI service catalogue.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="space-y-5 p-5 sm:p-6"
                >
                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />

                            <span>{error}</span>
                        </div>
                    )}

                    {/* Service selection */}
                    <div>
                        <FieldLabel required>
                            Hospital service
                        </FieldLabel>

                        <div className="relative">
                            <select
                                name="catalogueId"
                                value={formData.catalogueId}
                                onChange={handleCatalogueChange}
                                disabled={isEdit}
                                className="sj-input h-11 appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <option value="">
                                    Select a hospital service
                                </option>

                                {SERVICE_CATALOGUE.map(
                                    (service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ),
                                )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                        </div>

                        {isEdit && (
                            <p className="mt-2 text-[11px] text-(--sj-text-muted)">
                                Service selection cannot be changed while
                                editing. Remove this service and add another
                                catalogue service if required.
                            </p>
                        )}
                    </div>

                    {/* Auto category */}
                    {selectedCatalogueService && (
                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Service category
                                    </p>

                                    <p className="mt-1 text-sm font-black text-(--sj-text)">
                                        {selectedCatalogueService.category}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${getCategoryClasses(
                                        selectedCatalogueService.category,
                                    )}`}
                                >
                                    {selectedCatalogueService.category}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <FieldLabel required>
                            Service description
                        </FieldLabel>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe what this service provides..."
                            className="sj-input min-h-27.5 resize-y py-3"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <FieldLabel required>
                            Service status
                        </FieldLabel>

                        <div className="relative">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="sj-input h-11 appearance-none pr-10"
                            >
                                {SERVICE_STATUSES.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status ===
                                            'AVAILABLE'
                                                ? 'Available'
                                                : status ===
                                                    'LIMITED'
                                                    ? 'Limited'
                                                    : 'Unavailable'}
                                        </option>
                                    ),
                                )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                        </div>
                    </div>

                    {/* Capabilities */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4 transition hover:border-(--sj-primary)">
                            <input
                                type="checkbox"
                                name="emergencyCapable"
                                checked={
                                    formData.emergencyCapable
                                }
                                onChange={handleCheckboxChange}
                                className="mt-0.5 h-4 w-4 accent-(--sj-primary)"
                            />

                            <div>
                                <p className="text-sm font-bold text-(--sj-text)">
                                    Emergency capable
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Include this service in emergency
                                    hospital matching.
                                </p>
                            </div>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4 transition hover:border-(--sj-primary)">
                            <input
                                type="checkbox"
                                name="available24x7"
                                checked={
                                    formData.available24x7
                                }
                                onChange={handleCheckboxChange}
                                className="mt-0.5 h-4 w-4 accent-(--sj-primary)"
                            />

                            <div>
                                <p className="text-sm font-bold text-(--sj-text)">
                                    Available 24×7
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Service operates around the clock.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Notes */}
                    <div>
                        <FieldLabel>
                            Operational notes
                        </FieldLabel>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add staffing, timing, equipment, or operational notes..."
                            className="sj-input min-h-22.5 resize-y py-3"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-(--sj-border) pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
                        >
                            <Check className="h-4 w-4" />

                            {isEdit
                                ? 'Update service'
                                : 'Add service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteModal({
    service,
    onClose,
    onConfirm,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-6 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <Trash2 className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-lg font-black text-(--sj-text)">
                    Remove service?
                </h2>

                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                    Are you sure you want to remove{' '}
                    <span className="font-bold text-(--sj-text)">
                        {service.name}
                    </span>{' '}
                    from this hospital?
                </p>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                    This service will no longer be considered by Sanjeevani AI
                    when matching emergency patients with your hospital.
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 rounded-xl border border-(--sj-border) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2)"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove service
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Services() {
    const [services, setServices] =
        React.useState(INITIAL_SERVICES);

    const [searchTerm, setSearchTerm] =
        React.useState('');

    const [categoryFilter, setCategoryFilter] =
        React.useState('ALL');

    const [showServiceModal, setShowServiceModal] =
        React.useState(false);

    const [modalMode, setModalMode] =
        React.useState('add');

    const [editingServiceId, setEditingServiceId] =
        React.useState(null);

    const [formData, setFormData] =
        React.useState(EMPTY_FORM);

    const [formError, setFormError] =
        React.useState('');

    const [serviceToDelete, setServiceToDelete] =
        React.useState(null);

    const [isSaving, setIsSaving] =
        React.useState(false);

    const [savedMessage, setSavedMessage] =
        React.useState('');

    const filteredServices =
        React.useMemo(() => {
            const normalizedSearch =
                searchTerm.trim().toLowerCase();

            return services.filter((service) => {
                const matchesSearch =
                    !normalizedSearch ||
                    service.name
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    service.description
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    service.category
                        .toLowerCase()
                        .includes(normalizedSearch);

                const matchesCategory =
                    categoryFilter === 'ALL' ||
                    service.category === categoryFilter;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            });
        }, [
            services,
            searchTerm,
            categoryFilter,
        ]);

    const availableServices =
        services.filter(
            (service) =>
                service.status === 'AVAILABLE',
        ).length;

    const limitedServices =
        services.filter(
            (service) =>
                service.status === 'LIMITED',
        ).length;

    const emergencyServices =
        services.filter(
            (service) =>
                service.emergencyCapable &&
                service.status !== 'UNAVAILABLE',
        ).length;

    const roundTheClockServices =
        services.filter(
            (service) =>
                service.available24x7 &&
                service.status !== 'UNAVAILABLE',
        ).length;

    const openAddModal = () => {
        setModalMode('add');
        setEditingServiceId(null);
        setFormData(EMPTY_FORM);
        setFormError('');
        setShowServiceModal(true);
    };

    const openEditModal = (service) => {
        setModalMode('edit');
        setEditingServiceId(service.id);

        setFormData({
            catalogueId: service.catalogueId,
            status: service.status,
            emergencyCapable:
                service.emergencyCapable,
            available24x7:
                service.available24x7,
            description: service.description,
            notes: service.notes || '',
        });

        setFormError('');
        setShowServiceModal(true);
    };

    const closeServiceModal = () => {
        setShowServiceModal(false);
        setEditingServiceId(null);
        setFormData(EMPTY_FORM);
        setFormError('');
    };

    const handleServiceSubmit = (event) => {
        event.preventDefault();

        if (!formData.catalogueId) {
            setFormError(
                'Please select a hospital service.',
            );
            return;
        }

        if (!formData.description.trim()) {
            setFormError(
                'Service description is required.',
            );
            return;
        }

        const selectedCatalogueService =
            SERVICE_CATALOGUE.find(
                (service) =>
                    service.id ===
                    formData.catalogueId,
            );

        if (!selectedCatalogueService) {
            setFormError(
                'The selected service could not be found.',
            );
            return;
        }

        if (modalMode === 'add') {
            const alreadyExists = services.some(
                (service) =>
                    service.catalogueId ===
                    formData.catalogueId,
            );

            if (alreadyExists) {
                setFormError(
                    'This service is already added to your hospital.',
                );
                return;
            }

            const nextNumber =
                services.reduce(
                    (maximum, service) => {
                        const numericPart = Number(
                            service.id.replace(
                                'SRV-',
                                '',
                            ),
                        );

                        return Number.isNaN(
                            numericPart,
                        )
                            ? maximum
                            : Math.max(
                                maximum,
                                numericPart,
                            );
                    },
                    0,
                ) + 1;

            const newService = {
                id: `SRV-${String(
                    nextNumber,
                ).padStart(3, '0')}`,
                catalogueId:
                    selectedCatalogueService.id,
                name:
                    selectedCatalogueService.name,
                category:
                    selectedCatalogueService.category,
                description:
                    formData.description.trim(),
                status: formData.status,
                emergencyCapable:
                    formData.emergencyCapable,
                available24x7:
                    formData.available24x7,
                notes: formData.notes.trim(),
            };

            setServices((current) => [
                ...current,
                newService,
            ]);

            closeServiceModal();

            setSavedMessage(
                'New service added successfully.',
            );
        } else {
            setServices((current) =>
                current.map((service) =>
                    service.id ===
                    editingServiceId
                        ? {
                            ...service,
                            category:
                                selectedCatalogueService.category,
                            description:
                                formData.description.trim(),
                            status:
                                formData.status,
                            emergencyCapable:
                                formData.emergencyCapable,
                            available24x7:
                                formData.available24x7,
                            notes:
                                formData.notes.trim(),
                        }
                        : service,
                ),
            );

            closeServiceModal();

            setSavedMessage(
                'Service details updated successfully.',
            );
        }

        window.setTimeout(() => {
            setSavedMessage('');
        }, 3000);
    };

    const handleDelete = () => {
        if (!serviceToDelete) {
            return;
        }

        setServices((current) =>
            current.filter(
                (service) =>
                    service.id !==
                    serviceToDelete.id,
            ),
        );

        setServiceToDelete(null);

        setSavedMessage(
            'Service removed successfully.',
        );

        window.setTimeout(() => {
            setSavedMessage('');
        }, 3000);
    };

    const toggleAvailability = (serviceId) => {
        setServices((current) =>
            current.map((service) => {
                if (service.id !== serviceId) {
                    return service;
                }

                return {
                    ...service,
                    status:
                        service.status ===
                        'AVAILABLE'
                            ? 'UNAVAILABLE'
                            : 'AVAILABLE',
                };
            }),
        );

        setSavedMessage('');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('ALL');
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        setSavedMessage('');

        window.setTimeout(() => {
            setIsSaving(false);

            setSavedMessage(
                'All service changes saved successfully.',
            );

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
                                    Manage the clinical services provided by
                                    your hospital and configure their
                                    emergency capabilities.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                        >
                            <Plus className="h-4 w-4" />
                            Add service
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveChanges}
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
                </div>

                {/* Success message */}
                {savedMessage && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-950/20 dark:text-green-300">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/40">
                            <Check className="h-4 w-4" />
                        </div>

                        {savedMessage}
                    </div>
                )}

                {/* Information banner */}
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
                                    Sanjeevani AI uses hospital service
                                    capabilities to identify suitable hospitals
                                    during emergency coordination.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft)">
                            <BadgeCheck className="h-4 w-4 text-(--sj-primary)" />
                            {emergencyServices} emergency-capable
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Total services
                            </p>

                            <Hospital className="h-5 w-5 text-(--sj-primary)" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {services.length}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Configured services
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
                            Fully operational
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
                            Ready for emergencies
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
                            Around-the-clock
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Limited
                            </p>

                            <Info className="h-5 w-5 text-amber-500" />
                        </div>

                        <p className="mt-3 text-3xl font-black text-(--sj-text)">
                            {limitedServices}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Require attention
                        </p>
                    </div>
                </section>

                {/* Search and filter */}
                <section className="mb-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value,
                                    )
                                }
                                placeholder="Search services, categories, or capabilities..."
                                className="sj-input h-11 pl-10"
                            />
                        </div>

                        <div className="relative sm:w-64">
                            <select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(
                                        event.target.value,
                                    )
                                }
                                className="sj-input h-11 appearance-none pr-10"
                            >
                                {SERVICE_CATEGORIES.map(
                                    (category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category ===
                                            'ALL'
                                                ? 'All categories'
                                                : category}
                                        </option>
                                    ),
                                )}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                        </div>
                    </div>

                    {(searchTerm ||
                        categoryFilter !==
                            'ALL') && (
                        <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-4">
                            <p className="text-xs font-semibold text-(--sj-text-muted)">
                                Showing{' '}
                                {
                                    filteredServices.length
                                }{' '}
                                of {services.length}{' '}
                                services
                            </p>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="text-xs font-bold text-(--sj-primary) hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>

                {/* Services heading */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-black text-(--sj-text)">
                            Service catalogue
                        </h2>

                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                            Services currently configured for this hospital.
                        </p>
                    </div>

                    <p className="text-xs font-semibold text-(--sj-text-muted)">
                        {filteredServices.length}{' '}
                        shown
                    </p>
                </div>

                {/* Service cards */}
                {filteredServices.length ===
                0 ? (
                    <div className="sj-card flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Hospital className="h-8 w-8" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-(--sj-text)">
                            No services found
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                            Try changing your search or category filter.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
                        >
                            <X className="h-4 w-4" />
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredServices.map(
                            (service) => {
                                const ServiceIcon =
                                    getServiceIcon(
                                        service,
                                    );

                                return (
                                    <article
                                        key={
                                            service.id
                                        }
                                        className={`sj-card sj-card-hover flex min-h-97.5 flex-col overflow-hidden ${
                                            service.status ===
                                            'UNAVAILABLE'
                                                ? 'opacity-80'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex-1 p-4">
                                            {/* Card header */}
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                        service.status ===
                                                        'AVAILABLE'
                                                            ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                                            : service.status ===
                                                                'LIMITED'
                                                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300'
                                                                : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300'
                                                    }`}
                                                >
                                                    <ServiceIcon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="line-clamp-2 text-sm font-black leading-5 text-(--sj-text)">
                                                            {
                                                                service.name
                                                            }
                                                        </h3>

                                                        <span
                                                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${getStatusDot(
                                                                service.status,
                                                            )}`}
                                                        />
                                                    </div>

                                                    <p className="mt-1 text-[10px] font-semibold text-(--sj-text-muted)">
                                                        {
                                                            service.id
                                                        }
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
                                                    {
                                                        service.category
                                                    }
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="mt-4 line-clamp-3 min-h-13.5 text-xs leading-5 text-(--sj-text-soft)">
                                                {
                                                    service.description
                                                }
                                            </p>

                                            {/* Status */}
                                            <div className="mt-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${getStatusClasses(
                                                        service.status,
                                                    )}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                            service.status,
                                                        )}`}
                                                    />

                                                    {service.status ===
                                                    'AVAILABLE'
                                                        ? 'Available'
                                                        : service.status ===
                                                            'LIMITED'
                                                            ? 'Limited'
                                                            : 'Unavailable'}
                                                </span>
                                            </div>

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

                                            {/* Notes */}
                                            {service.notes && (
                                                <p className="mt-3 line-clamp-2 text-[10px] leading-4 text-(--sj-text-muted)">
                                                    <span className="font-bold">
                                                        Note:
                                                    </span>{' '}
                                                    {
                                                        service.notes
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Card footer */}
                                        <div className="border-t border-(--sj-border) bg-(--sj-surface-2)/50 p-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            service,
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-(--sj-border) bg-(--sj-surface) text-[10px] font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setServiceToDelete(
                                                            service,
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-[10px] font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/40"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleAvailability(
                                                        service.id,
                                                    )
                                                }
                                                className={`mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[10px] font-bold transition ${
                                                    service.status ===
                                                    'AVAILABLE'
                                                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'
                                                        : 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300'
                                                }`}
                                            >
                                                {service.status ===
                                                'AVAILABLE' ? (
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
                            },
                        )}
                    </section>
                )}

                {/* Guidance */}
                <section className="mt-8 grid gap-4 lg:grid-cols-3">
                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <HeartPulse className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Emergency matching
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Emergency-capable services help Sanjeevani AI
                            identify hospitals suitable for specific patient
                            requirements.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Stethoscope className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Controlled service catalogue
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Hospitals select services from the Sanjeevani AI
                            catalogue so service data remains standardized
                            across the platform.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-black text-(--sj-text)">
                            Live availability
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Keep service status updated when staffing,
                            equipment, or operational conditions change.
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
                                Only services from the Sanjeevani AI service
                                catalogue can be added. Hospital-specific
                                information such as availability, emergency
                                capability, operating hours, and notes can be
                                managed by the Hospital Admin.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add / Edit modal */}
            {showServiceModal && (
                <ServiceModal
                    mode={modalMode}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={closeServiceModal}
                    onSubmit={handleServiceSubmit}
                    error={formError}
                />
            )}

            {/* Delete confirmation */}
            {serviceToDelete && (
                <DeleteModal
                    service={serviceToDelete}
                    onClose={() =>
                        setServiceToDelete(null)
                    }
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}