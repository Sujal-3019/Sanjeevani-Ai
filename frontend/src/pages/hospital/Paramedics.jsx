import React from 'react';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Award,
    BadgeCheck,
    Bell,
    BriefcaseMedical,
    Check,
    ChevronDown,
    Clock3,
    Edit3,
    Hospital,
    Mail,
    MapPin,
    Menu,
    Phone,
    Plus,
    Search,
    ShieldCheck,
    Stethoscope,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo4.png';
import { useTheme } from '../../context/ThemeContext';
import HospitalNavbar from '../../components/layout/HospitalNavbar';

const PARAMEDIC_ROLES = [
    'Paramedic',
    'EMT',
    'Emergency Medical Technician',
    'Nurse',
    'Other',
];

const PARAMEDIC_STATUSES = [
    'ACTIVE',
    'ON_MISSION',
    'AVAILABLE',
    'OFF_DUTY',
    'INACTIVE',
];

const MOCK_AMBULANCES = [
    {
        id: 'AMB-038',
        type: 'BLS',
    },
    {
        id: 'AMB-031',
        type: 'ALS',
    },
    {
        id: 'AMB-047',
        type: 'ALS',
    },
    {
        id: 'AMB-024',
        type: 'BLS',
    },
];

const INITIAL_PARAMEDICS = [
    {
        id: 'PM-001',
        name: 'Amit Kumar',
        phone: '+91 98765 40123',
        email: 'amit.kumar@example.com',
        role: 'Paramedic',
        qualification: 'EMT-P',
        experience: '7 years',
        status: 'ON_MISSION',
        ambulance: 'AMB-038',
        joinedAt: '12 March 2025',
        lastActive: 'Just now',
        emergencyCertified: true,
    },
    {
        id: 'PM-002',
        name: 'Neeraj Singh',
        phone: '+91 98765 40561',
        email: 'neeraj.singh@example.com',
        role: 'Paramedic',
        qualification: 'B.Sc Emergency Medical Services',
        experience: '5 years',
        status: 'AVAILABLE',
        ambulance: 'AMB-031',
        joinedAt: '28 April 2025',
        lastActive: '2 min ago',
        emergencyCertified: true,
    },
    {
        id: 'PM-003',
        name: 'Vikram Rao',
        phone: '+91 98765 40987',
        email: 'vikram.rao@example.com',
        role: 'Paramedic',
        qualification: 'EMT-P',
        experience: '8 years',
        status: 'ON_MISSION',
        ambulance: 'AMB-047',
        joinedAt: '05 January 2025',
        lastActive: '1 min ago',
        emergencyCertified: true,
    },
    {
        id: 'PM-004',
        name: 'Rohan Mehta',
        phone: '+91 98765 41234',
        email: 'rohan.mehta@example.com',
        role: 'Paramedic',
        qualification: 'Diploma in Emergency Care',
        experience: '4 years',
        status: 'OFF_DUTY',
        ambulance: 'AMB-024',
        joinedAt: '19 June 2025',
        lastActive: 'Today, 08:45',
        emergencyCertified: true,
    },
    {
        id: 'PM-005',
        name: 'Rahul Verma',
        phone: '+91 98765 42345',
        email: 'rahul.verma@example.com',
        role: 'EMT',
        qualification: 'EMT-B',
        experience: '3 years',
        status: 'AVAILABLE',
        ambulance: 'AMB-031',
        joinedAt: '08 July 2025',
        lastActive: '4 min ago',
        emergencyCertified: true,
    },
    {
        id: 'PM-006',
        name: 'Sanjay Kumar',
        phone: '+91 98765 43456',
        email: 'sanjay.kumar@example.com',
        role: 'EMT',
        qualification: 'Emergency Medical Technician',
        experience: '2 years',
        status: 'ACTIVE',
        ambulance: 'AMB-024',
        joinedAt: '16 August 2025',
        lastActive: '18 min ago',
        emergencyCertified: true,
    },
    {
        id: 'PM-007',
        name: 'Priya Sharma',
        phone: '+91 98765 44567',
        email: 'priya.sharma@example.com',
        role: 'Nurse',
        qualification: 'B.Sc Nursing',
        experience: '6 years',
        status: 'INACTIVE',
        ambulance: '',
        joinedAt: '11 November 2024',
        lastActive: '3 days ago',
        emergencyCertified: false,
    },
];

const EMPTY_FORM = {
    id: '',
    name: '',
    phone: '',
    email: '',
    role: 'Paramedic',
    qualification: '',
    experience: '',
    status: 'ACTIVE',
    ambulance: '',
    emergencyCertified: true,
};

function formatStatus(status) {
    return status.replaceAll('_', ' ');
}

function getStatusClasses(status) {
    switch (status) {
        case 'AVAILABLE':
            return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300';

        case 'ON_MISSION':
            return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300';

        case 'OFF_DUTY':
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300';

        case 'INACTIVE':
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';

        default:
            return 'border-(--sj-border) bg-(--sj-surface-2) text-(--sj-text-soft)';
    }
}

function getStatusDot(status) {
    switch (status) {
        case 'AVAILABLE':
            return 'bg-green-500';

        case 'ON_MISSION':
            return 'bg-blue-500';

        case 'OFF_DUTY':
            return 'bg-amber-500';

        case 'INACTIVE':
            return 'bg-red-500';

        default:
            return 'bg-(--sj-text-muted)';
    }
}

function getRoleIcon(role) {
    if (role === 'Nurse') {
        return <Stethoscope className="h-4 w-4" />;
    }

    if (role === 'EMT' || role === 'Emergency Medical Technician') {
        return <Activity className="h-4 w-4" />;
    }

    return <BriefcaseMedical className="h-4 w-4" />;
}

function FieldLabel({ children, required = false }) {
    return (
        <label className="sj-label">
            {children}
            {required && <span className="text-red-500"> *</span>}
        </label>
    );
}

function EmptyState({ onAdd }) {
    return (
        <div className="sj-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary)">
                <Users className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-(--sj-text)">
                No paramedics found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                Try changing your search or filters, or create a new paramedic
                account for your hospital team.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
            >
                <UserPlus className="h-4 w-4" />
                Add paramedic
            </button>
        </div>
    );
}

export default function Paramedics() {
    const { toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [paramedics, setParamedics] = React.useState(INITIAL_PARAMEDICS);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('ALL');
    const [roleFilter, setRoleFilter] = React.useState('ALL');

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formError, setFormError] = React.useState('');
    const [formData, setFormData] = React.useState(EMPTY_FORM);

    const [selectedParamedic, setSelectedParamedic] = React.useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showProfile, setShowProfile] = React.useState(false);

    const [notificationCount, setNotificationCount] = React.useState(2);

    const notificationRef = React.useRef(null);
    const profileRef = React.useRef(null);

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const filteredParamedics = React.useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return paramedics.filter((paramedic) => {
            const matchesSearch =
                !normalizedSearch ||
                paramedic.name.toLowerCase().includes(normalizedSearch) ||
                paramedic.id.toLowerCase().includes(normalizedSearch) ||
                paramedic.phone.toLowerCase().includes(normalizedSearch) ||
                paramedic.email.toLowerCase().includes(normalizedSearch) ||
                paramedic.qualification.toLowerCase().includes(normalizedSearch) ||
                paramedic.ambulance.toLowerCase().includes(normalizedSearch);

            const matchesStatus =
                statusFilter === 'ALL' ||
                paramedic.status === statusFilter;

            const matchesRole =
                roleFilter === 'ALL' ||
                paramedic.role === roleFilter;

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [paramedics, searchTerm, statusFilter, roleFilter]);

    const totalParamedics = paramedics.length;

    const availableParamedics = paramedics.filter(
        (paramedic) =>
            paramedic.status === 'AVAILABLE' ||
            paramedic.status === 'ACTIVE',
    ).length;

    const onMissionParamedics = paramedics.filter(
        (paramedic) => paramedic.status === 'ON_MISSION',
    ).length;

    const inactiveParamedics = paramedics.filter(
        (paramedic) => paramedic.status === 'INACTIVE',
    ).length;

    const certifiedParamedics = paramedics.filter(
        (paramedic) => paramedic.emergencyCertified,
    ).length;

    const assignedParamedics = paramedics.filter(
        (paramedic) => paramedic.ambulance,
    ).length;

    const openAddModal = () => {
        setFormData({
            ...EMPTY_FORM,
            id: '',
            status: 'ACTIVE',
            role: 'Paramedic',
            emergencyCertified: true,
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const openEditModal = (paramedic) => {
        setFormData({
            id: paramedic.id,
            name: paramedic.name,
            phone: paramedic.phone,
            email: paramedic.email,
            role: paramedic.role,
            qualification: paramedic.qualification,
            experience: paramedic.experience,
            status: paramedic.status,
            ambulance: paramedic.ambulance,
            emergencyCertified: paramedic.emergencyCertified,
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) {
            return;
        }

        setIsModalOpen(false);
        setFormError('');
        setFormData(EMPTY_FORM);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setFormError('');
    };

    const handleCertificationChange = (event) => {
        setFormData((current) => ({
            ...current,
            emergencyCertified: event.target.checked,
        }));

        setFormError('');
    };

    const handleSave = (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            setFormError('Please enter the paramedic full name.');
            return;
        }

        if (!formData.phone.trim()) {
            setFormError('Please enter the paramedic mobile number.');
            return;
        }

        if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
            setFormError('Please enter a valid mobile number.');
            return;
        }

        if (!formData.email.trim()) {
            setFormError('Please enter the paramedic email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setFormError('Please enter a valid email address.');
            return;
        }

        if (!formData.qualification.trim()) {
            setFormError('Please enter the qualification or certification.');
            return;
        }

        if (!formData.experience.trim()) {
            setFormError('Please enter the experience.');
            return;
        }

        if (
            formData.status === 'ON_MISSION' &&
            !formData.ambulance
        ) {
            setFormError(
                'A paramedic marked as on mission must have an ambulance assigned.',
            );
            return;
        }

        setIsSubmitting(true);

        window.setTimeout(() => {
            const existingParamedic = paramedics.find(
                (paramedic) => paramedic.id === formData.id,
            );

            if (existingParamedic) {
                setParamedics((current) =>
                    current.map((paramedic) =>
                        paramedic.id === formData.id
                            ? {
                                  ...paramedic,
                                  name: formData.name.trim(),
                                  phone: formData.phone.trim(),
                                  email: formData.email.trim(),
                                  role: formData.role,
                                  qualification:
                                      formData.qualification.trim(),
                                  experience: formData.experience.trim(),
                                  status: formData.status,
                                  ambulance: formData.ambulance,
                                  emergencyCertified:
                                      formData.emergencyCertified,
                                  lastActive: 'Just now',
                              }
                            : paramedic,
                    ),
                );
            } else {
                const newParamedic = {
                    id: `PM-${String(paramedics.length + 1).padStart(3, '0')}`,
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    role: formData.role,
                    qualification: formData.qualification.trim(),
                    experience: formData.experience.trim(),
                    status: formData.status,
                    ambulance: formData.ambulance,
                    joinedAt: 'Today',
                    lastActive: 'Just now',
                    emergencyCertified: formData.emergencyCertified,
                };

                setParamedics((current) => [
                    newParamedic,
                    ...current,
                ]);
            }

            setIsSubmitting(false);
            setIsModalOpen(false);
            setFormError('');
            setFormData(EMPTY_FORM);
        }, 800);
    };

    const handleDelete = (paramedic) => {
        const confirmed = window.confirm(
            `Remove ${paramedic.name} from the hospital paramedic roster?`,
        );

        if (!confirmed) {
            return;
        }

        setParamedics((current) =>
            current.filter((item) => item.id !== paramedic.id),
        );

        setIsDetailsOpen(false);
        setSelectedParamedic(null);
    };

    const handleToggleStatus = (paramedic) => {
        const nextStatus =
            paramedic.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';

        setParamedics((current) =>
            current.map((item) =>
                item.id === paramedic.id
                    ? {
                          ...item,
                          status: nextStatus,
                          ambulance:
                              nextStatus === 'INACTIVE'
                                  ? ''
                                  : item.ambulance,
                          lastActive: 'Just now',
                      }
                    : item,
            ),
        );

        setSelectedParamedic((current) =>
            current?.id === paramedic.id
                ? {
                      ...current,
                      status: nextStatus,
                      ambulance:
                          nextStatus === 'INACTIVE'
                              ? ''
                              : current.ambulance,
                      lastActive: 'Just now',
                  }
                : current,
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setRoleFilter('ALL');
    };

    const handleSignOut = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-(--sj-bg) text-(--sj-text)">
            <HospitalNavbar/>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
                                Paramedics
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-(--sj-primary) sm:flex">
                                <Users className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-(--sj-text) sm:text-3xl">
                                    Paramedic roster
                                </h1>

                                <p className="mt-1 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                    Manage authorized emergency medical staff,
                                    their availability, qualifications, and
                                    ambulance assignments.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark)"
                    >
                        <Plus className="h-4 w-4" />
                        Add paramedic
                    </button>
                </div>

                <div className="mb-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <ShieldCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-(--sj-text)">
                                    Authorized staff accounts
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Paramedic accounts are created and managed
                                    by your hospital administrator. Public
                                    paramedic registration is not available.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-3 py-2 text-xs font-bold text-(--sj-text-soft)">
                            <BadgeCheck className="h-4 w-4 text-(--sj-primary)" />
                            {certifiedParamedics} emergency-certified
                        </div>
                    </div>
                </div>

                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Total staff
                            </p>

                            <Users className="h-5 w-5 text-(--sj-primary)" />
                        </div>

                        <p className="mt-3 text-3xl font-extrabold text-(--sj-text)">
                            {totalParamedics}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Registered operational staff
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Available
                            </p>

                            <UserCheck className="h-5 w-5 text-green-500" />
                        </div>

                        <p className="mt-3 text-3xl font-extrabold text-(--sj-text)">
                            {availableParamedics}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Ready for assignment
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                On mission
                            </p>

                            <Activity className="h-5 w-5 text-blue-500" />
                        </div>

                        <p className="mt-3 text-3xl font-extrabold text-(--sj-text)">
                            {onMissionParamedics}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Currently responding
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Ambulance assigned
                            </p>

                            <Hospital className="h-5 w-5 text-(--sj-primary)" />
                        </div>

                        <p className="mt-3 text-3xl font-extrabold text-(--sj-text)">
                            {assignedParamedics}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Staff linked to a vehicle
                        </p>
                    </div>

                    <div className="sj-card p-5 sm:col-span-2 xl:col-span-1">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                Inactive
                            </p>

                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>

                        <p className="mt-3 text-3xl font-extrabold text-(--sj-text)">
                            {inactiveParamedics}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            Account access disabled
                        </p>
                    </div>
                </section>

                <section className="mb-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search by name, ID, phone, qualification, or ambulance..."
                                className="sj-input h-11 pl-10"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:w-110">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className="sj-input h-11 appearance-none pr-10"
                                >
                                    <option value="ALL">
                                        All statuses
                                    </option>

                                    {PARAMEDIC_STATUSES.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {formatStatus(status)}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                            </div>

                            <div className="relative">
                                <select
                                    value={roleFilter}
                                    onChange={(event) =>
                                        setRoleFilter(event.target.value)
                                    }
                                    className="sj-input h-11 appearance-none pr-10"
                                >
                                    <option value="ALL">All roles</option>

                                    {PARAMEDIC_ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                            </div>
                        </div>
                    </div>

                    {(searchTerm ||
                        statusFilter !== 'ALL' ||
                        roleFilter !== 'ALL') && (
                        <div className="mt-4 flex items-center justify-between border-t border-(--sj-border) pt-4">
                            <p className="text-xs font-semibold text-(--sj-text-muted)">
                                Showing {filteredParamedics.length} of{' '}
                                {paramedics.length} staff members
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

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-(--sj-text)">
                            Hospital paramedics
                        </h2>

                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                            {filteredParamedics.length} staff member
                            {filteredParamedics.length === 1 ? '' : 's'} shown
                        </p>
                    </div>
                </div>

                {filteredParamedics.length === 0 ? (
                    <EmptyState onAdd={openAddModal} />
                ) : (
                    <section className="grid gap-4 lg:grid-cols-2">
                        {filteredParamedics.map((paramedic) => (
                            <article
                                key={paramedic.id}
                                className="sj-card sj-card-hover overflow-hidden"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-sm font-extrabold text-(--sj-primary)">
                                                {paramedic.name
                                                    .split(' ')
                                                    .map((part) =>
                                                        part.charAt(0),
                                                    )
                                                    .slice(0, 2)
                                                    .join('')}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="truncate text-base font-extrabold text-(--sj-text)">
                                                        {paramedic.name}
                                                    </h3>

                                                    {paramedic.emergencyCertified && (
                                                        <BadgeCheck className="h-4 w-4 shrink-0 text-(--sj-primary)" />
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs font-semibold text-(--sj-text-muted)">
                                                    {paramedic.id}
                                                </p>

                                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-(--sj-text-soft)">
                                                    {getRoleIcon(paramedic.role)}
                                                    {paramedic.role}
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${getStatusClasses(
                                                paramedic.status,
                                            )}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                    paramedic.status,
                                                )}`}
                                            />
                                            {formatStatus(paramedic.status)}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-(--sj-text-muted)">
                                                <Award className="h-4 w-4" />
                                                Qualification
                                            </div>

                                            <p className="mt-1.5 text-sm font-bold text-(--sj-text)">
                                                {paramedic.qualification}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-(--sj-surface-2) p-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-(--sj-text-muted)">
                                                <Clock3 className="h-4 w-4" />
                                                Experience
                                            </div>

                                            <p className="mt-1.5 text-sm font-bold text-(--sj-text)">
                                                {paramedic.experience}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2.5">
                                        <div className="flex items-center gap-2 text-sm text-(--sj-text-soft)">
                                            <Phone className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                            <span>{paramedic.phone}</span>
                                        </div>

                                        <div className="flex min-w-0 items-center gap-2 text-sm text-(--sj-text-soft)">
                                            <Mail className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />
                                            <span className="truncate">
                                                {paramedic.email}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-(--sj-text-soft)">
                                            <Hospital className="h-4 w-4 shrink-0 text-(--sj-text-muted)" />

                                            {paramedic.ambulance ? (
                                                <span>
                                                    Assigned to{' '}
                                                    <strong className="text-(--sj-text)">
                                                        {paramedic.ambulance}
                                                    </strong>
                                                </span>
                                            ) : (
                                                <span className="text-(--sj-text-muted)">
                                                    No ambulance assigned
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-(--sj-border) pt-4">
                                        {paramedic.emergencyCertified && (
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--sj-border) bg-(--sj-surface-2) px-2.5 py-1.5 text-[11px] font-bold text-(--sj-text-soft)">
                                                <ShieldCheck className="h-3.5 w-3.5 text-(--sj-primary)" />
                                                Emergency certified
                                            </span>
                                        )}

                                        {paramedic.ambulance && (
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--sj-border) bg-(--sj-surface-2) px-2.5 py-1.5 text-[11px] font-bold text-(--sj-text-soft)">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {paramedic.ambulance}
                                            </span>
                                        )}

                                        <span className="ml-auto text-[11px] text-(--sj-text-muted)">
                                            Active {paramedic.lastActive}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 border-t border-(--sj-border) bg-(--sj-surface-2)/50 p-4 sm:flex-row sm:items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedParamedic(paramedic);
                                            setIsDetailsOpen(true);
                                        }}
                                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-4 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary) hover:text-(--sj-primary)"
                                    >
                                        <Users className="h-4 w-4" />
                                        View details
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openEditModal(paramedic)}
                                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 text-xs font-bold text-white transition hover:bg-(--sj-primary-dark)"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                <section className="mt-8 grid gap-4 lg:grid-cols-3">
                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <UserPlus className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-extrabold text-(--sj-text)">
                            Create authorized accounts
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Hospital administrators can create operational
                            accounts for verified emergency staff.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-extrabold text-(--sj-text)">
                            Keep certifications current
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Qualification and emergency certification details
                            should remain accurate for safe dispatch decisions.
                        </p>
                    </div>

                    <div className="sj-card p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <Hospital className="h-5 w-5" />
                        </div>

                        <h3 className="mt-4 text-sm font-extrabold text-(--sj-text)">
                            Coordinate with ambulances
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                            Ambulance assignments connect paramedics with
                            emergency missions and live operational status.
                        </p>
                    </div>
                </section>

                <div className="mt-8 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-(--sj-text)">
                                Operational security
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Staff access should be restricted to authorized
                                hospital personnel. The backend will enforce
                                hospital ownership, role permissions, account
                                status, and audit logging when connected.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="paramedic-modal-title"
                        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                        {formData.id ? (
                                            <Edit3 className="h-5 w-5" />
                                        ) : (
                                            <UserPlus className="h-5 w-5" />
                                        )}
                                    </div>

                                    <div>
                                        <h2
                                            id="paramedic-modal-title"
                                            className="text-lg font-extrabold text-(--sj-text)"
                                        >
                                            {formData.id
                                                ? 'Edit paramedic'
                                                : 'Add paramedic'}
                                        </h2>

                                        <p className="mt-1 text-xs text-(--sj-text-muted)">
                                            Create an authorized hospital
                                            staff account.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                                        <div>
                                            <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                                                Hospital-managed account
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-blue-800/80 dark:text-blue-200/70">
                                                This account is created by the
                                                hospital administrator. The
                                                paramedic does not register
                                                publicly or use Google login.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {formError && (
                                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h3 className="text-sm font-extrabold text-(--sj-text)">
                                        Personal information
                                    </h3>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <FieldLabel required>
                                                Full name
                                            </FieldLabel>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                placeholder="Enter full name"
                                                className="sj-input"
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel required>
                                                Mobile number
                                            </FieldLabel>

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                placeholder="+91 98765 43210"
                                                className="sj-input"
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel required>
                                                Email address
                                            </FieldLabel>

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                placeholder="name@example.com"
                                                className="sj-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-7 border-t border-(--sj-border) pt-6">
                                    <h3 className="text-sm font-extrabold text-(--sj-text)">
                                        Professional information
                                    </h3>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <FieldLabel required>
                                                Role
                                            </FieldLabel>

                                            <div className="relative">
                                                <select
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleFormChange}
                                                    className="sj-input appearance-none pr-10"
                                                >
                                                    {PARAMEDIC_ROLES.map(
                                                        (role) => (
                                                            <option
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {role}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel required>
                                                Experience
                                            </FieldLabel>

                                            <input
                                                type="text"
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleFormChange}
                                                placeholder="e.g. 5 years"
                                                className="sj-input"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <FieldLabel required>
                                                Qualification / certification
                                            </FieldLabel>

                                            <input
                                                type="text"
                                                name="qualification"
                                                value={formData.qualification}
                                                onChange={handleFormChange}
                                                placeholder="e.g. EMT-P, B.Sc Nursing"
                                                className="sj-input"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formData.emergencyCertified
                                                    }
                                                    onChange={
                                                        handleCertificationChange
                                                    }
                                                    className="mt-0.5 h-4 w-4 rounded border-(--sj-border) accent-(--sj-primary)"
                                                />

                                                <span>
                                                    <span className="block text-sm font-bold text-(--sj-text)">
                                                        Emergency-certified
                                                        staff member
                                                    </span>

                                                    <span className="mt-1 block text-xs leading-5 text-(--sj-text-soft)">
                                                        Mark this only when the
                                                        staff member has the
                                                        required emergency-care
                                                        certification verified
                                                        by the hospital.
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-7 border-t border-(--sj-border) pt-6">
                                    <h3 className="text-sm font-extrabold text-(--sj-text)">
                                        Operational assignment
                                    </h3>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <FieldLabel required>
                                                Account status
                                            </FieldLabel>

                                            <div className="relative">
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleFormChange}
                                                    className="sj-input appearance-none pr-10"
                                                >
                                                    {PARAMEDIC_STATUSES.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {formatStatus(
                                                                    status,
                                                                )}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel>
                                                Assigned ambulance
                                            </FieldLabel>

                                            <div className="relative">
                                                <select
                                                    name="ambulance"
                                                    value={formData.ambulance}
                                                    onChange={handleFormChange}
                                                    className="sj-input appearance-none pr-10"
                                                >
                                                    <option value="">
                                                        No ambulance assigned
                                                    </option>

                                                    {MOCK_AMBULANCES.map(
                                                        (ambulance) => (
                                                            <option
                                                                key={
                                                                    ambulance.id
                                                                }
                                                                value={
                                                                    ambulance.id
                                                                }
                                                            >
                                                                {
                                                                    ambulance.id
                                                                }{' '}
                                                                —{' '}
                                                                {
                                                                    ambulance.type
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-(--sj-border) bg-(--sj-surface-2)/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            {formData.id
                                                ? 'Save changes'
                                                : 'Create account'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDetailsOpen && selectedParamedic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="paramedic-details-title"
                        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-(--sj-border) px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--sj-primary-soft) text-sm font-extrabold text-(--sj-primary)">
                                    {selectedParamedic.name
                                        .split(' ')
                                        .map((part) => part.charAt(0))
                                        .slice(0, 2)
                                        .join('')}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2
                                            id="paramedic-details-title"
                                            className="text-lg font-extrabold text-(--sj-text)"
                                        >
                                            {selectedParamedic.name}
                                        </h2>

                                        {selectedParamedic.emergencyCertified && (
                                            <BadgeCheck className="h-4 w-4 text-(--sj-primary)" />
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-(--sj-text-muted)">
                                        {selectedParamedic.id} ·{' '}
                                        {selectedParamedic.role}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsDetailsOpen(false);
                                    setSelectedParamedic(null);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                aria-label="Close details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${getStatusClasses(
                                            selectedParamedic.status,
                                        )}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                selectedParamedic.status,
                                            )}`}
                                        />
                                        {formatStatus(
                                            selectedParamedic.status,
                                        )}
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Ambulance
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.ambulance ||
                                            'Not assigned'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Mobile
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.phone}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Email
                                    </p>

                                    <p className="mt-2 break-all text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.email}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Qualification
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.qualification}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Experience
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.experience}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Certification status
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            {selectedParamedic.emergencyCertified
                                                ? 'Emergency certification is marked as verified by the hospital.'
                                                : 'Emergency certification has not been marked as verified.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Joined
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.joinedAt}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-(--sj-border) p-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-(--sj-text-muted)">
                                        Last active
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-(--sj-text)">
                                        {selectedParamedic.lastActive}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-(--sj-border) bg-(--sj-surface-2)/50 px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
                            <button
                                type="button"
                                onClick={() =>
                                    handleToggleStatus(selectedParamedic)
                                }
                                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition ${
                                    selectedParamedic.status === 'INACTIVE'
                                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300 dark:hover:bg-green-950/50'
                                        : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50'
                                }`}
                            >
                                {selectedParamedic.status === 'INACTIVE' ? (
                                    <>
                                        <UserCheck className="h-4 w-4" />
                                        Activate account
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4" />
                                        Deactivate account
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openEditModal(selectedParamedic);
                                        setIsDetailsOpen(false);
                                    }}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 text-xs font-bold text-white transition hover:bg-(--sj-primary-dark)"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Edit paramedic
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(selectedParamedic)
                                    }
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}