import React from 'react';
import {
    Ambulance,
    ArrowLeft,
    Bell,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Hospital,
    MapPin,
    Menu,
    Moon,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Siren,
    Stethoscope,
    Sun,
    UserRound,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo4.png';
import HospitalNavbar from '../../components/layout/HospitalNavbar';

const CREW_ROLES = [
    'Paramedic',
    'EMT',
    'Driver',
    'Nurse',
    'Other',
];

const INITIAL_AMBULANCES = [
    {
        id: 'AMB-038',
        registrationNumber: 'DL-01-AB-4038',
        type: 'BLS',
        status: 'AVAILABLE',
        location: 'Hospital Campus',
        lastUpdated: 'Just now',
        equipment: ['Oxygen', 'AED', 'Stretcher'],
        notes: 'Ready for emergency dispatch.',
        crew: [
            {
                id: 1,
                name: 'Amit Kumar',
                phone: '+91 98765 40123',
                role: 'Paramedic',
                qualification: 'EMT-P',
                primary: true,
            },
            {
                id: 2,
                name: 'Suresh Yadav',
                phone: '+91 98765 40382',
                role: 'Driver',
                qualification: 'Emergency Vehicle Driver',
                primary: false,
            },
        ],
    },
    {
        id: 'AMB-031',
        registrationNumber: 'DL-01-AB-4031',
        type: 'ALS',
        status: 'AVAILABLE',
        location: 'Connaught Place',
        lastUpdated: '2 min ago',
        equipment: ['Ventilator', 'Oxygen', 'AED'],
        notes: 'Advanced life support equipped.',
        crew: [
            {
                id: 1,
                name: 'Neeraj Singh',
                phone: '+91 98765 40231',
                role: 'Paramedic',
                qualification: 'EMT-P',
                primary: true,
            },
            {
                id: 2,
                name: 'Rahul Verma',
                phone: '+91 98765 40321',
                role: 'EMT',
                qualification: 'EMT-B',
                primary: false,
            },
            {
                id: 3,
                name: 'Manoj Kumar',
                phone: '+91 98765 40331',
                role: 'Driver',
                qualification: 'Emergency Vehicle Driver',
                primary: false,
            },
        ],
    },
    {
        id: 'AMB-047',
        registrationNumber: 'DL-01-AB-4047',
        type: 'ALS',
        status: 'ON_MISSION',
        location: 'Karol Bagh',
        lastUpdated: '1 min ago',
        equipment: ['Ventilator', 'Oxygen', 'AED'],
        notes: 'Currently responding to EM-2026-00130.',
        crew: [
            {
                id: 1,
                name: 'Vikram Rao',
                phone: '+91 98765 40477',
                role: 'Paramedic',
                qualification: 'EMT-P',
                primary: true,
            },
            {
                id: 2,
                name: 'Rakesh Sharma',
                phone: '+91 98765 40478',
                role: 'EMT',
                qualification: 'EMT-B',
                primary: false,
            },
            {
                id: 3,
                name: 'Deepak Singh',
                phone: '+91 98765 40479',
                role: 'Driver',
                qualification: 'Emergency Vehicle Driver',
                primary: false,
            },
        ],
    },
    {
        id: 'AMB-024',
        registrationNumber: 'DL-01-AB-4024',
        type: 'BLS',
        status: 'ON_MISSION',
        location: 'Lajpat Nagar',
        lastUpdated: '3 min ago',
        equipment: ['Oxygen', 'Stretcher'],
        notes: 'Patient transport in progress.',
        crew: [
            {
                id: 1,
                name: 'Rohan Mehta',
                phone: '+91 98765 40240',
                role: 'Paramedic',
                qualification: 'EMT-P',
                primary: true,
            },
            {
                id: 2,
                name: 'Sanjay Kumar',
                phone: '+91 98765 40241',
                role: 'Driver',
                qualification: 'Emergency Vehicle Driver',
                primary: false,
            },
        ],
    },
    {
        id: 'AMB-019',
        registrationNumber: 'DL-01-AB-4019',
        type: 'BLS',
        status: 'MAINTENANCE',
        location: 'Hospital Workshop',
        lastUpdated: '25 min ago',
        equipment: ['Oxygen', 'Stretcher'],
        notes: 'Routine maintenance inspection.',
        crew: [],
    },
    {
        id: 'AMB-012',
        registrationNumber: 'DL-01-AB-4012',
        type: 'ALS',
        status: 'OFFLINE',
        location: 'Hospital Campus',
        lastUpdated: '1 hr ago',
        equipment: ['Ventilator', 'Oxygen', 'AED'],
        notes: 'Temporarily unavailable.',
        crew: [],
    },
];

const STATUS_OPTIONS = [
    'ALL',
    'AVAILABLE',
    'ON_MISSION',
    'MAINTENANCE',
    'OFFLINE',
];

const TYPE_OPTIONS = ['ALL', 'BLS', 'ALS'];

function formatStatus(status) {
    return status
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }) {
    const styles = {
        AVAILABLE:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        ON_MISSION:
            'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        MAINTENANCE:
            'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        OFFLINE: 'bg-(--sj-surface-2) text-(--sj-text-muted)',
    };

    const dots = {
        AVAILABLE: 'bg-emerald-500',
        ON_MISSION: 'bg-amber-500',
        MAINTENANCE: 'bg-orange-500',
        OFFLINE: 'bg-(--sj-text-muted)',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] ${styles[status] || styles.OFFLINE}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${dots[status] || dots.OFFLINE}`}
            />
            {formatStatus(status)}
        </span>
    );
}

function TypeBadge({ type }) {
    return (
        <span
            className={`rounded-md px-2 py-1 text-[9px] font-black ${
                type === 'ALS'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}
        >
            {type}
        </span>
    );
}

function StatCard({ icon: Icon, label, value, description }) {
    return (
        <div className="sj-card p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-tight text-(--sj-text)">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-(--sj-text-soft)">
                        {description}
                    </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function AmbulanceCard({ ambulance, onEdit }) {
    const primaryParamedic = ambulance.crew.find(
        (member) =>
            member.role === 'Paramedic' && member.primary,
    );

    return (
        <div className="sj-card sj-card-hover overflow-hidden">
            <div className="border-b border-(--sj-border) px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Ambulance className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-black text-(--sj-text)">
                                    {ambulance.id}
                                </h3>

                                <TypeBadge type={ambulance.type} />
                            </div>

                            <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                {ambulance.registrationNumber}
                            </p>
                        </div>
                    </div>

                    <StatusBadge status={ambulance.status} />
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoItem
                        icon={UserRound}
                        label="Primary paramedic"
                        value={
                            primaryParamedic?.name ||
                            'Not assigned'
                        }
                    />

                    <InfoItem
                        icon={Users}
                        label="Crew members"
                        value={`${ambulance.crew.length} ${
                            ambulance.crew.length === 1
                                ? 'member'
                                : 'members'
                        }`}
                    />

                    <InfoItem
                        icon={MapPin}
                        label="Current location"
                        value={ambulance.location}
                    />

                    <InfoItem
                        icon={Clock3}
                        label="Last update"
                        value={ambulance.lastUpdated}
                    />
                </div>

                {ambulance.crew.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                                Current crew
                            </p>

                            <span className="text-[10px] font-bold text-(--sj-text-muted)">
                                {ambulance.crew.length} members
                            </span>
                        </div>

                        <div className="mt-2 space-y-2">
                            {ambulance.crew.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 rounded-xl bg-(--sj-surface-2) p-3"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--sj-surface) text-(--sj-primary)">
                                        <UserRound className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-xs font-black text-(--sj-text)">
                                                {member.name}
                                            </p>

                                            {member.primary && (
                                                <span className="rounded-md bg-(--sj-primary)/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-(--sj-primary)">
                                                    Primary
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-0.5 text-[10px] text-(--sj-text-muted)">
                                            {member.role} ·{' '}
                                            {member.qualification}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                        Equipment
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {ambulance.equipment.map((item) => (
                            <span
                                key={item}
                                className="rounded-lg bg-(--sj-surface-2) px-2.5 py-1.5 text-[10px] font-bold text-(--sj-text-soft)"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl bg-(--sj-surface-2) p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--sj-text-muted)">
                        Operational note
                    </p>

                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                        {ambulance.notes}
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => onEdit(ambulance)}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-(--sj-border) px-3 text-xs font-black text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit ambulance
                    </button>

                    {ambulance.status === 'ON_MISSION' && (
                        <Link
                            to="/dashboard/hospital/emergencies/EM-2026-00130"
                            className="sj-ai-button flex h-10 flex-1 items-center justify-center gap-2 text-xs"
                        >
                            <NavigationIcon />
                            View mission
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl bg-(--sj-surface-2) p-3">
            <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-(--sj-primary)" />

                <p className="text-[9px] font-black uppercase tracking-[0.08em] text-(--sj-text-muted)">
                    {label}
                </p>
            </div>

            <p className="mt-2 truncate text-xs font-black text-(--sj-text)">
                {value}
            </p>
        </div>
    );
}

function NavigationIcon() {
    return (
        <span className="inline-flex h-4 w-4 items-center justify-center">
            <span className="h-2.5 w-2.5 rotate-45 rounded-xs border-2 border-current" />
        </span>
    );
}

function Ambulances() {
    const { theme, toggleTheme } = useTheme();

    const [ambulances, setAmbulances] =
        React.useState(INITIAL_AMBULANCES);

    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('ALL');
    const [typeFilter, setTypeFilter] = React.useState('ALL');

    const [modalOpen, setModalOpen] = React.useState(false);
    const [editingAmbulance, setEditingAmbulance] =
        React.useState(null);

    const [notificationOpen, setNotificationOpen] =
        React.useState(false);
    const [profileOpen, setProfileOpen] =
        React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] =
        React.useState(false);

    const [actionMessage, setActionMessage] =
        React.useState('');

    const [formData, setFormData] = React.useState({
        id: '',
        registrationNumber: '',
        type: 'BLS',
        status: 'AVAILABLE',
        location: '',
        equipment: 'Oxygen, Stretcher',
        notes: '',
        crewCount: '2',
        crew: [
            {
                id: 1,
                name: '',
                phone: '',
                role: 'Paramedic',
                qualification: '',
                primary: true,
            },
            {
                id: 2,
                name: '',
                phone: '',
                role: 'Driver',
                qualification: '',
                primary: false,
            },
        ],
    });

    const isDark = theme === 'dark';

    const stats = {
        total: ambulances.length,
        available: ambulances.filter(
            (item) => item.status === 'AVAILABLE',
        ).length,
        onMission: ambulances.filter(
            (item) => item.status === 'ON_MISSION',
        ).length,
        maintenance: ambulances.filter(
            (item) => item.status === 'MAINTENANCE',
        ).length,
    };

    const filteredAmbulances = ambulances.filter((ambulance) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
            !query ||
            ambulance.id.toLowerCase().includes(query) ||
            ambulance.registrationNumber
                .toLowerCase()
                .includes(query) ||
            ambulance.location.toLowerCase().includes(query) ||
            ambulance.crew.some((member) =>
                member.name.toLowerCase().includes(query),
            );

        const matchesStatus =
            statusFilter === 'ALL' ||
            ambulance.status === statusFilter;

        const matchesType =
            typeFilter === 'ALL' ||
            ambulance.type === typeFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesType
        );
    });

    const createEmptyCrewMember = (id, index) => ({
        id,
        name: '',
        phone: '',
        role: index === 0 ? 'Paramedic' : 'Driver',
        qualification: '',
        primary: index === 0,
    });

    const openAddModal = () => {
        setEditingAmbulance(null);

        setFormData({
            id: '',
            registrationNumber: '',
            type: 'BLS',
            status: 'AVAILABLE',
            location: 'Hospital Campus',
            equipment: 'Oxygen, Stretcher',
            notes: '',
            crewCount: '2',
            crew: [
                createEmptyCrewMember(1, 0),
                createEmptyCrewMember(2, 1),
            ],
        });

        setModalOpen(true);
    };

    const openEditModal = (ambulance) => {
        setEditingAmbulance(ambulance);

        setFormData({
            id: ambulance.id,
            registrationNumber:
                ambulance.registrationNumber,
            type: ambulance.type,
            status: ambulance.status,
            location: ambulance.location,
            equipment: ambulance.equipment.join(', '),
            notes: ambulance.notes,
            crewCount: String(ambulance.crew.length),
            crew:
                ambulance.crew.length > 0
                    ? ambulance.crew.map((member) => ({
                          ...member,
                      }))
                    : [createEmptyCrewMember(1, 0)],
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingAmbulance(null);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleCrewCountChange = (event) => {
        const rawValue = event.target.value;

        if (rawValue === '') {
            setFormData((current) => ({
                ...current,
                crewCount: '',
                crew: [],
            }));

            return;
        }

        const numericValue = Number(rawValue);

        if (
            !Number.isInteger(numericValue) ||
            numericValue < 1 ||
            numericValue > 10
        ) {
            return;
        }

        setFormData((current) => {
            const currentCrew = current.crew || [];

            const updatedCrew = Array.from(
                { length: numericValue },
                (_, index) =>
                    currentCrew[index] ||
                    createEmptyCrewMember(index + 1, index),
            ).map((member, index) => ({
                ...member,
                id: index + 1,
                primary: index === 0,
            }));

            return {
                ...current,
                crewCount: String(numericValue),
                crew: updatedCrew,
            };
        });
    };

    const handleCrewChange = (
        memberId,
        field,
        value,
    ) => {
        setFormData((current) => ({
            ...current,
            crew: current.crew.map((member) =>
                member.id === memberId
                    ? {
                          ...member,
                          [field]: value,
                      }
                    : member,
            ),
        }));
    };

    const handlePrimaryCrewChange = (memberId) => {
        setFormData((current) => ({
            ...current,
            crew: current.crew.map((member) => ({
                ...member,
                primary: member.id === memberId,
            })),
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();

        if (
            !formData.id.trim() ||
            !formData.registrationNumber.trim()
        ) {
            setActionMessage(
                'Ambulance ID and registration number are required.',
            );
            return;
        }

        const crewCount = Number(formData.crewCount);

        if (
            !Number.isInteger(crewCount) ||
            crewCount < 1 ||
            crewCount > 10
        ) {
            setActionMessage(
                'Crew members must be between 1 and 10.',
            );
            return;
        }

        if (formData.crew.length !== crewCount) {
            setActionMessage(
                'Please provide details for every crew member.',
            );
            return;
        }

        const incompleteCrewMember =
            formData.crew.find(
                (member) =>
                    !member.name.trim() ||
                    !member.phone.trim() ||
                    !member.role ||
                    !member.qualification.trim(),
            );

        if (incompleteCrewMember) {
            setActionMessage(
                `Please complete all details for crew member ${incompleteCrewMember.id}.`,
            );
            return;
        }

        const primaryParamedic = formData.crew.find(
            (member) =>
                member.primary &&
                member.role === 'Paramedic',
        );

        if (!primaryParamedic) {
            setActionMessage(
                'Please select one crew member as the primary paramedic.',
            );
            return;
        }

        const equipment = formData.equipment
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        const normalizedCrew = formData.crew.map(
            (member) => ({
                ...member,
                name: member.name.trim(),
                phone: member.phone.trim(),
                qualification:
                    member.qualification.trim(),
            }),
        );

        if (editingAmbulance) {
            setAmbulances((current) =>
                current.map((ambulance) =>
                    ambulance.id ===
                    editingAmbulance.id
                        ? {
                              ...ambulance,
                              id: formData.id.trim(),
                              registrationNumber:
                                  formData.registrationNumber.trim(),
                              type: formData.type,
                              status: formData.status,
                              location:
                                  formData.location.trim() ||
                                  'Hospital Campus',
                              equipment,
                              notes:
                                  formData.notes.trim() ||
                                  'No operational notes added.',
                              crew: normalizedCrew,
                              lastUpdated: 'Just now',
                          }
                        : ambulance,
                ),
            );

            setActionMessage(
                `${formData.id.trim()} details have been updated.`,
            );
        } else {
            const newAmbulance = {
                id: formData.id.trim(),
                registrationNumber:
                    formData.registrationNumber.trim(),
                type: formData.type,
                status: formData.status,
                location:
                    formData.location.trim() ||
                    'Hospital Campus',
                lastUpdated: 'Just now',
                equipment,
                notes:
                    formData.notes.trim() ||
                    'No operational notes added.',
                crew: normalizedCrew,
            };

            setAmbulances((current) => [
                newAmbulance,
                ...current,
            ]);

            setActionMessage(
                `${newAmbulance.id} has been added to the ambulance fleet.`,
            );
        }

        closeModal();
    };

    const handleDelete = () => {
        if (!editingAmbulance) return;

        const confirmed = window.confirm(
            `Remove ${editingAmbulance.id} from the hospital fleet?`,
        );

        if (!confirmed) return;

        setAmbulances((current) =>
            current.filter(
                (ambulance) =>
                    ambulance.id !==
                    editingAmbulance.id,
            ),
        );

        setActionMessage(
            `${editingAmbulance.id} has been removed from the fleet.`,
        );

        closeModal();
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('ALL');
        setTypeFilter('ALL');
    };

    const handleSignOut = () => {
        window.location.href = '/';
    };

    return (
        <div className="sanjeevani-page min-h-screen">
            <HospitalNavbar/>

            <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="mb-7">
                    <Link
                        to="/dashboard/hospital"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Hospital dashboard
                    </Link>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                    Fleet management
                                </p>

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Operational
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                                Ambulances
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                                Manage your emergency fleet, ambulance
                                capability, crew composition, availability and
                                assigned personnel.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="sj-ai-button h-11 px-5 text-xs"
                        >
                            <Plus className="h-4 w-4" />
                            Add ambulance
                        </button>
                    </div>
                </div>

                {actionMessage && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs font-bold leading-5 text-(--sj-text)">
                            {actionMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setActionMessage('')
                            }
                            className="ml-auto text-(--sj-text-muted) hover:text-(--sj-text)"
                            aria-label="Dismiss message"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Ambulance}
                        label="Total ambulances"
                        value={stats.total}
                        description="Registered in fleet"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Available"
                        value={stats.available}
                        description="Ready for dispatch"
                    />

                    <StatCard
                        icon={Siren}
                        label="On mission"
                        value={stats.onMission}
                        description="Currently responding"
                    />

                    <StatCard
                        icon={Wrench}
                        label="Maintenance"
                        value={stats.maintenance}
                        description="Temporarily unavailable"
                    />
                </div>

                <section className="mt-6 sj-card overflow-hidden">
                    <div className="border-b border-(--sj-border) p-5 sm:p-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Ambulance fleet
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    {filteredAmbulances.length}{' '}
                                    ambulance
                                    {filteredAmbulances.length ===
                                    1
                                        ? ''
                                        : 's'}{' '}
                                    shown
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 lg:flex-row">
                                <div className="relative min-w-0 lg:w-72">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Search ambulance, crew..."
                                        className="sj-input h-11 w-full pl-10 text-xs"
                                    />
                                </div>

                                <SelectFilter
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    options={TYPE_OPTIONS}
                                    labels={{
                                        ALL: 'All types',
                                        BLS: 'BLS',
                                        ALS: 'ALS',
                                    }}
                                />

                                <SelectFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={STATUS_OPTIONS}
                                    labels={{
                                        ALL: 'All statuses',
                                        AVAILABLE: 'Available',
                                        ON_MISSION:
                                            'On mission',
                                        MAINTENANCE:
                                            'Maintenance',
                                        OFFLINE: 'Offline',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {(search ||
                        statusFilter !== 'ALL' ||
                        typeFilter !== 'ALL') && (
                        <div className="flex items-center justify-between gap-3 border-b border-(--sj-border) bg-(--sj-surface-2) px-5 py-3 sm:px-6">
                            <p className="text-xs font-bold text-(--sj-text-soft)">
                                Filters are active
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-black text-(--sj-primary) hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2 2xl:grid-cols-3">
                        {filteredAmbulances.map(
                            (ambulance) => (
                                <AmbulanceCard
                                    key={ambulance.id}
                                    ambulance={ambulance}
                                    onEdit={openEditModal}
                                />
                            ),
                        )}
                    </div>

                    {filteredAmbulances.length ===
                        0 && (
                        <div className="px-5 py-16 text-center sm:px-6">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-surface-2) text-(--sj-text-muted)">
                                <Ambulance className="h-6 w-6" />
                            </div>

                            <p className="mt-4 text-sm font-black text-(--sj-text)">
                                No ambulances found
                            </p>

                            <p className="mt-1 text-xs text-(--sj-text-soft)">
                                Try changing your search or
                                filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-4 text-xs font-black text-(--sj-primary)"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="sj-card p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Stethoscope className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Capability overview
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    Fleet readiness by ambulance type
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            <CapabilityRow
                                label="BLS ambulances"
                                value={
                                    ambulances.filter(
                                        (item) =>
                                            item.type ===
                                            'BLS',
                                    ).length
                                }
                                available={
                                    ambulances.filter(
                                        (item) =>
                                            item.type ===
                                                'BLS' &&
                                            item.status ===
                                                'AVAILABLE',
                                    ).length
                                }
                            />

                            <CapabilityRow
                                label="ALS ambulances"
                                value={
                                    ambulances.filter(
                                        (item) =>
                                            item.type ===
                                            'ALS',
                                    ).length
                                }
                                available={
                                    ambulances.filter(
                                        (item) =>
                                            item.type ===
                                                'ALS' &&
                                            item.status ===
                                                'AVAILABLE',
                                    ).length
                                }
                            />
                        </div>
                    </div>

                    <div className="sj-card p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <Users className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-black text-(--sj-text)">
                                    Crew overview
                                </p>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    Personnel currently registered with the fleet
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <CrewOverviewItem
                                label="Total crew members"
                                value={ambulances.reduce(
                                    (total, ambulance) =>
                                        total +
                                        ambulance.crew
                                            .length,
                                    0,
                                )}
                            />

                            <CrewOverviewItem
                                label="Primary paramedics"
                                value={ambulances.reduce(
                                    (total, ambulance) =>
                                        total +
                                        ambulance.crew.filter(
                                            (member) =>
                                                member.role ===
                                                    'Paramedic' &&
                                                member.primary,
                                        ).length,
                                    0,
                                )}
                            />

                            <CrewOverviewItem
                                label="Crews on mission"
                                value={ambulances.filter(
                                    (ambulance) =>
                                        ambulance.status ===
                                        'ON_MISSION',
                                ).length}
                            />

                            <CrewOverviewItem
                                label="Unassigned crews"
                                value={ambulances.filter(
                                    (ambulance) =>
                                        ambulance.crew
                                            .length ===
                                        0,
                                ).length}
                            />
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                        <div>
                            <p className="text-sm font-black text-(--sj-text)">
                                Fleet and crew data security
                            </p>

                            <p className="mt-1 max-w-4xl text-xs leading-5 text-(--sj-text-soft)">
                                Ambulance availability, crew identity,
                                qualification and location data should only be
                                accessed by authorized hospital personnel. In
                                the production system, crew assignments and
                                operational status will be synchronized with
                                the Sanjeevani AI backend.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-(--sj-border) px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-xs text-(--sj-text-muted) sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Sanjeevani AI · Hospital ambulance fleet
                        management
                    </p>

                    <p>
                        Operational access restricted to authorized hospital
                        personnel.
                    </p>
                </div>
            </footer>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >
                    <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl sm:max-w-3xl sm:rounded-3xl">
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-(--sj-border) bg-(--sj-surface)/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-(--sj-primary)">
                                    Fleet management
                                </p>

                                <h2 className="mt-1 text-lg font-black text-(--sj-text)">
                                    {editingAmbulance
                                        ? 'Edit ambulance'
                                        : 'Add ambulance'}
                                </h2>

                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                    Configure ambulance details and its
                                    complete operational crew.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close modal"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--sj-border) text-(--sj-text-soft) hover:text-(--sj-text)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSave}
                            className="space-y-6 p-5 sm:p-6"
                        >
                            <section>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                        <Ambulance className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-(--sj-text)">
                                            Ambulance details
                                        </p>

                                        <p className="text-[10px] text-(--sj-text-muted)">
                                            Basic fleet information
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        label="Ambulance ID"
                                        name="id"
                                        value={
                                            formData.id
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="AMB-052"
                                        required
                                    />

                                    <FormField
                                        label="Registration number"
                                        name="registrationNumber"
                                        value={
                                            formData.registrationNumber
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="DL-01-AB-4052"
                                        required
                                    />

                                    <FormSelect
                                        label="Capability"
                                        name="type"
                                        value={
                                            formData.type
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        options={[
                                            {
                                                value: 'BLS',
                                                label: 'BLS — Basic Life Support',
                                            },
                                            {
                                                value: 'ALS',
                                                label: 'ALS — Advanced Life Support',
                                            },
                                        ]}
                                    />

                                    <FormSelect
                                        label="Status"
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        options={[
                                            {
                                                value: 'AVAILABLE',
                                                label: 'Available',
                                            },
                                            {
                                                value: 'ON_MISSION',
                                                label: 'On mission',
                                            },
                                            {
                                                value: 'MAINTENANCE',
                                                label: 'Maintenance',
                                            },
                                            {
                                                value: 'OFFLINE',
                                                label: 'Offline',
                                            },
                                        ]}
                                    />

                                    <FormField
                                        label="Current location"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Hospital Campus"
                                    />

                                    <FormField
                                        label="Equipment"
                                        name="equipment"
                                        value={
                                            formData.equipment
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Oxygen, AED, Stretcher"
                                    />
                                </div>
                            </section>

                            <section className="border-t border-(--sj-border) pt-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                            <Users className="h-4 w-4" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-black text-(--sj-text)">
                                                Ambulance crew
                                            </p>

                                            <p className="text-[10px] text-(--sj-text-muted)">
                                                Add details for every crew member
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-44">
                                        <label
                                            htmlFor="crewCount"
                                            className="sj-label"
                                        >
                                            Number of crew members *
                                        </label>

                                        <input
                                            id="crewCount"
                                            name="crewCount"
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={
                                                formData.crewCount
                                            }
                                            onChange={
                                                handleCrewCountChange
                                            }
                                            className="sj-input h-11 w-full text-sm"
                                        />

                                        <p className="mt-1.5 text-[10px] text-(--sj-text-muted)">
                                            Maximum 10 members per ambulance.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {formData.crew.map(
                                        (member, index) => (
                                            <div
                                                key={
                                                    member.id
                                                }
                                                className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-4 sm:p-5"
                                            >
                                                <div className="mb-4 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--sj-surface) text-xs font-black text-(--sj-primary)">
                                                            {index +
                                                                1}
                                                        </div>

                                                        <div>
                                                            <p className="text-xs font-black text-(--sj-text)">
                                                                Crew Member{' '}
                                                                {index +
                                                                    1}
                                                            </p>

                                                            <p className="mt-0.5 text-[10px] text-(--sj-text-muted)">
                                                                Operational personnel details
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {member.primary && (
                                                        <span className="rounded-full bg-(--sj-primary)/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-(--sj-primary)">
                                                            Primary paramedic
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <FormField
                                                        label="Full name"
                                                        value={
                                                            member.name
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleCrewChange(
                                                                member.id,
                                                                'name',
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="e.g. Amit Kumar"
                                                        required
                                                    />

                                                    <FormField
                                                        label="Mobile number"
                                                        value={
                                                            member.phone
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleCrewChange(
                                                                member.id,
                                                                'phone',
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="+91 98765 43210"
                                                        required
                                                    />

                                                    <FormSelect
                                                        label="Role"
                                                        value={
                                                            member.role
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleCrewChange(
                                                                member.id,
                                                                'role',
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        options={CREW_ROLES.map(
                                                            (
                                                                role,
                                                            ) => ({
                                                                value: role,
                                                                label: role,
                                                            }),
                                                        )}
                                                    />

                                                    <FormField
                                                        label="Qualification / certification"
                                                        value={
                                                            member.qualification
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleCrewChange(
                                                                member.id,
                                                                'qualification',
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="e.g. EMT-P"
                                                        required
                                                    />
                                                </div>

                                                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) p-3">
                                                    <input
                                                        type="radio"
                                                        name="primaryCrew"
                                                        checked={
                                                            member.primary
                                                        }
                                                        onChange={() =>
                                                            handlePrimaryCrewChange(
                                                                member.id,
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-(--sj-primary)"
                                                    />

                                                    <span>
                                                        <span className="block text-xs font-black text-(--sj-text)">
                                                            Primary paramedic
                                                        </span>

                                                        <span className="mt-0.5 block text-[10px] leading-4 text-(--sj-text-muted)">
                                                            This member will be the
                                                            primary clinical contact
                                                            for the ambulance.
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className="border-t border-(--sj-border) pt-6">
                                <label
                                    htmlFor="notes"
                                    className="sj-label"
                                >
                                    Operational notes
                                </label>

                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={
                                        formData.notes
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    rows={3}
                                    placeholder="Add any relevant operational notes..."
                                    className="sj-input min-h-24 w-full resize-none py-3 text-sm"
                                />
                            </section>

                            <div className="flex flex-col-reverse gap-3 border-t border-(--sj-border) pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    {editingAmbulance && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleDelete
                                            }
                                            className="h-11 rounded-xl px-4 text-xs font-black text-red-500 hover:bg-red-500/5"
                                        >
                                            Remove ambulance
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="h-11 rounded-xl border border-(--sj-border) px-5 text-xs font-black text-(--sj-text-soft) hover:text-(--sj-text)"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="sj-ai-button h-11 px-5 text-xs"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {editingAmbulance
                                            ? 'Save changes'
                                            : 'Add ambulance'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SelectFilter({
    value,
    onChange,
    options,
    labels,
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="h-11 min-w-36 appearance-none rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 pr-9 text-xs font-bold text-(--sj-text) outline-none transition focus:border-(--sj-primary)"
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {labels[option]}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
        </div>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="sj-label"
            >
                {label}
                {required ? ' *' : ''}
            </label>

            <input
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="sj-input h-11 w-full text-sm"
            />
        </div>
    );
}

function FormSelect({
    label,
    name,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="sj-label"
            >
                {label}
            </label>

            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="sj-input h-11 w-full appearance-none pr-10 text-sm"
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
            </div>
        </div>
    );
}

function CapabilityRow({
    label,
    value,
    available,
}) {
    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black text-(--sj-text)">
                    {label}
                </p>

                <p className="text-xs font-bold text-(--sj-text-soft)">
                    {available} available / {value} total
                </p>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--sj-surface-2)">
                <div
                    className="h-full rounded-full bg-(--sj-primary)"
                    style={{
                        width: `${
                            value
                                ? (available / value) *
                                  100
                                : 0
                        }%`,
                    }}
                />
            </div>
        </div>
    );
}

function CrewOverviewItem({ label, value }) {
    return (
        <div className="rounded-xl bg-(--sj-surface-2) p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-(--sj-text-muted)">
                {label}
            </p>

            <p className="mt-2 text-xl font-black text-(--sj-text)">
                {value}
            </p>
        </div>
    );
}

export default Ambulances;