import React from 'react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Edit3,
    Mail,
    Phone,
    Plus,
    ShieldCheck,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientHeader from './PatientHeader';

const initialContacts = [
    {
        id: 1,
        name: 'Priya Sharma',
        relationship: 'Mother',
        phone: '+91 98765 43210',
        email: 'priya@example.com',
        primary: true,
    },
    {
        id: 2,
        name: 'Arjun Sharma',
        relationship: 'Brother',
        phone: '+91 98765 12345',
        email: 'arjun@example.com',
        primary: false,
    },
];

const emptyForm = {
    name: '',
    relationship: '',
    phone: '',
    email: '',
    primary: false,
};

function EmergencyContacts() {
    const [contacts, setContacts] = React.useState(initialContacts);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState(emptyForm);
    const [saved, setSaved] = React.useState(false);

    function openAddModal() {
        setEditingId(null);
        setFormData(emptyForm);
        setSaved(false);
        setIsModalOpen(true);
    }

    function openEditModal(contact) {
        setEditingId(contact.id);
        setFormData({
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
            email: contact.email,
            primary: contact.primary,
        });
        setSaved(false);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(emptyForm);
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));

        setSaved(false);
    }

    function handleSave(event) {
        event.preventDefault();

        const contact = {
            id: editingId ?? Date.now(),
            ...formData,
        };

        setContacts((current) => {
            let updatedContacts;

            if (editingId) {
                updatedContacts = current.map((item) =>
                    item.id === editingId ? contact : item,
                );
            } else {
                updatedContacts = [...current, contact];
            }

            if (contact.primary) {
                updatedContacts = updatedContacts.map((item) => ({
                    ...item,
                    primary: item.id === contact.id,
                }));
            }

            return updatedContacts;
        });

        closeModal();
        setSaved(true);
    }

    function handleDelete(id) {
        setContacts((current) =>
            current.filter((contact) => contact.id !== id),
        );
        setSaved(true);
    }

    function makePrimary(id) {
        setContacts((current) =>
            current.map((contact) => ({
                ...contact,
                primary: contact.id === id,
            })),
        );

        setSaved(true);
    }

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientHeader />

            <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                            Safety network
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-(--sj-text) sm:text-4xl">
                            Emergency contacts
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-(--sj-text-soft)">
                            Add trusted people who may need to be notified
                            during an active emergency.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white transition hover:bg-(--sj-primary-dark)"
                    >
                        <Plus className="h-4 w-4" />
                        Add contact
                    </button>
                </div>

                {saved && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        Emergency contacts updated successfully.
                    </div>
                )}

                <div className="mb-6 rounded-2xl border border-(--sj-primary)/15 bg-(--sj-primary)/5 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-black text-(--sj-text)">
                                How emergency contacts are used
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                During an active SOS, authorized emergency
                                workflows may use these contacts to share
                                appropriate updates about the patient's
                                emergency status.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {contacts.length === 0 ? (
                        <EmptyContacts onAdd={openAddModal} />
                    ) : (
                        contacts.map((contact) => (
                            <ContactCard
                                key={contact.id}
                                contact={contact}
                                onEdit={() => openEditModal(contact)}
                                onDelete={() => handleDelete(contact.id)}
                                onMakePrimary={() =>
                                    makePrimary(contact.id)
                                }
                            />
                        ))
                    )}
                </div>

                <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                        <div>
                            <h2 className="text-sm font-black text-(--sj-text)">
                                Keep contact information current
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Incorrect phone numbers or email addresses may
                                prevent important emergency updates from
                                reaching your trusted contacts.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <ContactModal
                    formData={formData}
                    editing={Boolean(editingId)}
                    onChange={handleChange}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

function ContactCard({
    contact,
    onEdit,
    onDelete,
    onMakePrimary,
}) {
    return (
        <article className="sj-card p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--sj-primary)/10 text-(--sj-primary)">
                        <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-black text-(--sj-text)">
                                {contact.name}
                            </h2>

                            {contact.primary && (
                                <span className="sj-status sj-status-success">
                                    Primary
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm font-semibold text-(--sj-text-soft)">
                            {contact.relationship}
                        </p>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-(--sj-text-soft)">
                                <Phone className="h-4 w-4 text-(--sj-primary)" />
                                <span>{contact.phone}</span>
                            </div>

                            {contact.email && (
                                <div className="flex items-center gap-2 text-sm text-(--sj-text-soft)">
                                    <Mail className="h-4 w-4 text-(--sj-primary)" />
                                    <span className="break-all">
                                        {contact.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                    {!contact.primary && (
                        <button
                            type="button"
                            onClick={onMakePrimary}
                            className="rounded-lg border border-(--sj-border) px-3 py-2 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary)"
                        >
                            Make primary
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label={`Edit ${contact.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--sj-border) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary)"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label={`Delete ${contact.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/15 text-red-500 transition hover:bg-red-500/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function EmptyContacts({ onAdd }) {
    return (
        <div className="sj-card px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--sj-primary)/10 text-(--sj-primary)">
                <Phone className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-black text-(--sj-text)">
                No emergency contacts yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--sj-text-soft)">
                Add at least one trusted person who can be contacted during an
                emergency.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white"
            >
                <Plus className="h-4 w-4" />
                Add first contact
            </button>
        </div>
    );
}

function ContactModal({
    formData,
    editing,
    onChange,
    onSave,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                <div className="flex items-center justify-between border-b border-(--sj-border) p-5 sm:p-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-(--sj-primary)">
                            Trusted contact
                        </p>

                        <h2 className="mt-1 text-xl font-black text-(--sj-text)">
                            {editing
                                ? 'Edit emergency contact'
                                : 'Add emergency contact'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-5 sm:p-6">
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="contact-name"
                                className="sj-label"
                            >
                                Full name
                            </label>

                            <input
                                id="contact-name"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                required
                                className="sj-input h-12 px-4 text-sm"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-relationship"
                                className="sj-label"
                            >
                                Relationship
                            </label>

                            <input
                                id="contact-relationship"
                                name="relationship"
                                value={formData.relationship}
                                onChange={onChange}
                                required
                                className="sj-input h-12 px-4 text-sm"
                                placeholder="Example: Mother, spouse, brother"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-phone"
                                className="sj-label"
                            >
                                Phone number
                            </label>

                            <input
                                id="contact-phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={onChange}
                                required
                                className="sj-input h-12 px-4 text-sm"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="contact-email"
                                className="sj-label"
                            >
                                Email address
                            </label>

                            <input
                                id="contact-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={onChange}
                                className="sj-input h-12 px-4 text-sm"
                                placeholder="contact@example.com"
                            />
                        </div>

                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <input
                                type="checkbox"
                                name="primary"
                                checked={formData.primary}
                                onChange={onChange}
                                className="mt-0.5 h-4 w-4 accent-(--sj-primary)"
                            />

                            <span>
                                <span className="block text-sm font-black text-(--sj-text)">
                                    Set as primary contact
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-(--sj-text-soft)">
                                    The primary contact can be prioritized for
                                    emergency notifications.
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-(--sj-border) px-5 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white transition hover:bg-(--sj-primary-dark)"
                        >
                            {editing ? 'Save changes' : 'Add contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmergencyContacts;