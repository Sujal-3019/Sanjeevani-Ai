import React from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Edit3,
    Loader2,
    Mail,
    Phone,
    Plus,
    ShieldCheck,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';

import authService from '../../services/authService';
import PatientNavbar from '../../components/layout/PatientNavbar';
import { useAuth } from '../../context/AuthContext';
import { emergencyContactService } from '../../services/emergencyContactService.js';

const emptyForm = {
    name: '',
    relationship: '',
    phone: '',
    email: '',
    primary: false,
};

function EmergencyContacts() {
    const { isLoading: isAuthLoading } = useAuth();

    const [contacts, setContacts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [pageError, setPageError] = React.useState('');
    const [actionError, setActionError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [formData, setFormData] = React.useState(emptyForm);
    const [isSaving, setIsSaving] = React.useState(false);

    const [deletingId, setDeletingId] = React.useState(null);
    const [primaryId, setPrimaryId] = React.useState(null);

    const loadContacts = React.useCallback(async () => {
        const accessToken = authService.getAccessToken();

        if (!accessToken) {
            setIsLoading(false);
            setPageError(
                'Your session could not be verified. Please sign in again.',
            );
            return;
        }

        setIsLoading(true);
        setPageError('');

        try {
            const response =
                await emergencyContactService.getContacts(
                    accessToken,
                );

            const nextContacts = Array.isArray(response)
                ? response
                : response?.contacts || [];

            setContacts(nextContacts);
        } catch (error) {
            setPageError(
                getApiErrorMessage(
                    error,
                    'Unable to load emergency contacts.',
                ),
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        loadContacts();
    }, [
        isAuthLoading,
        loadContacts,
    ]);

    React.useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage('');
        }, 4000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successMessage]);

    function openAddModal() {
        setEditingId(null);

        setFormData({
            ...emptyForm,
            primary: contacts.length === 0,
        });

        setActionError('');
        setIsModalOpen(true);
    }

    function openEditModal(contact) {
        setEditingId(contact.id);

        setFormData({
            name: contact.name || '',
            relationship: contact.relationship || '',
            phone: contact.mobile_number || '',
            email: contact.email || '',
            primary: Boolean(contact.is_primary),
        });

        setActionError('');
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) {
            return;
        }

        setIsModalOpen(false);
        setEditingId(null);
        setFormData(emptyForm);
        setActionError('');
    }

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox'
                ? checked
                : value,
        }));

        setActionError('');
    }

    async function handleSave(event) {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        const accessToken = authService.getAccessToken();

        if (!accessToken) {
            setActionError(
                'Your session has expired. Please sign in again.',
            );
            return;
        }

        setIsSaving(true);
        setActionError('');
        setSuccessMessage('');

        const payload = {
            name: formData.name.trim(),
            relationship: formData.relationship.trim(),
            mobile_number: normalizePhone(
                formData.phone,
            ),
            email: formData.email.trim()
                ? formData.email.trim()
                : null,
            is_primary: formData.primary,
        };

        try {
            if (editingId) {
                await emergencyContactService.updateContact(
                    editingId,
                    payload,
                    accessToken,
                );

                setSuccessMessage(
                    'Emergency contact updated successfully.',
                );
            } else {
                await emergencyContactService.createContact(
                    payload,
                    accessToken,
                );

                setSuccessMessage(
                    'Emergency contact added successfully.',
                );
            }

            await loadContacts();

            setIsModalOpen(false);
            setEditingId(null);
            setFormData(emptyForm);
        } catch (error) {
            setActionError(
                getApiErrorMessage(
                    error,
                    editingId
                        ? 'Unable to update this emergency contact.'
                        : 'Unable to add this emergency contact.',
                ),
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(contact) {
        if (deletingId) {
            return;
        }

        const accessToken = authService.getAccessToken();

        if (!accessToken) {
            setActionError(
                'Your session has expired. Please sign in again.',
            );
            return;
        }

        const confirmed = window.confirm(
            contact.is_primary
                ? `Delete ${contact.name} as an emergency contact?\n\nIf other contacts remain, the oldest remaining contact will automatically become primary.`
                : `Delete ${contact.name} as an emergency contact?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(contact.id);
        setActionError('');
        setSuccessMessage('');

        try {
            await emergencyContactService.deleteContact(
                contact.id,
                accessToken,
            );

            setContacts((currentContacts) => {
                const remainingContacts = currentContacts.filter(
                    (item) => item.id !== contact.id,
                );

                if (
                    contact.is_primary &&
                    remainingContacts.length > 0
                ) {
                    const oldestContact =
                        remainingContacts.reduce(
                            (oldest, current) => {
                                if (!oldest) {
                                    return current;
                                }

                                if (
                                    current.created_at &&
                                    oldest.created_at
                                ) {
                                    return new Date(
                                        current.created_at,
                                    ) <
                                        new Date(
                                            oldest.created_at,
                                        )
                                        ? current
                                        : oldest;
                                }

                                return oldest;
                            },
                            null,
                        );

                    return remainingContacts.map((item) => ({
                        ...item,
                        is_primary:
                            item.id === oldestContact?.id,
                    }));
                }

                return remainingContacts;
            });

            setSuccessMessage(
                contact.is_primary
                    ? 'Emergency contact deleted. Another contact has been made primary when available.'
                    : 'Emergency contact deleted successfully.',
            );
        } catch (error) {
            setActionError(
                getApiErrorMessage(
                    error,
                    'Unable to delete this emergency contact.',
                ),
            );
        } finally {
            setDeletingId(null);
        }
    }

    async function makePrimary(contact) {
        if (
            primaryId ||
            contact.is_primary
        ) {
            return;
        }

        const accessToken = authService.getAccessToken();

        if (!accessToken) {
            setActionError(
                'Your session has expired. Please sign in again.',
            );
            return;
        }

        setPrimaryId(contact.id);
        setActionError('');
        setSuccessMessage('');

        try {
            await emergencyContactService.makePrimary(
                contact.id,
                accessToken,
            );

            await loadContacts();

            setSuccessMessage(
                `${contact.name} is now your primary emergency contact.`,
            );
        } catch (error) {
            setActionError(
                getApiErrorMessage(
                    error,
                    'Unable to change the primary emergency contact.',
                ),
            );
        } finally {
            setPrimaryId(null);
        }
    }

    return (
        <div className="sanjeevani-page min-h-screen">
            <PatientNavbar />

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
                        disabled={isLoading || isAuthLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Plus className="h-4 w-4" />
                        Add contact
                    </button>
                </div>

                {pageError && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div className="flex-1">
                            <p>{pageError}</p>

                            <button
                                type="button"
                                onClick={loadContacts}
                                className="mt-2 text-xs font-black underline underline-offset-2"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {actionError && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <p>{actionError}</p>

                        <button
                            type="button"
                            onClick={() => setActionError('')}
                            aria-label="Dismiss error"
                            className="ml-auto shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />

                        <span>{successMessage}</span>
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

                {isAuthLoading || isLoading ? (
                    <LoadingContacts />
                ) : (
                    <div className="space-y-4">
                        {contacts.length === 0 ? (
                            <EmptyContacts
                                onAdd={openAddModal}
                            />
                        ) : (
                            contacts.map((contact) => (
                                <ContactCard
                                    key={contact.id}
                                    contact={contact}
                                    deleting={
                                        deletingId === contact.id
                                    }
                                    makingPrimary={
                                        primaryId === contact.id
                                    }
                                    onEdit={() =>
                                        openEditModal(contact)
                                    }
                                    onDelete={() =>
                                        handleDelete(contact)
                                    }
                                    onMakePrimary={() =>
                                        makePrimary(contact)
                                    }
                                />
                            ))
                        )}
                    </div>
                )}

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
                    isSaving={isSaving}
                    onChange={handleChange}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

function LoadingContacts() {
    return (
        <div className="sj-card flex min-h-52 items-center justify-center px-6 py-12">
            <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-(--sj-primary)" />

                <p className="mt-4 text-sm font-bold text-(--sj-text-soft)">
                    Loading emergency contacts...
                </p>
            </div>
        </div>
    );
}

function ContactCard({
    contact,
    onEdit,
    onDelete,
    onMakePrimary,
    deleting,
    makingPrimary,
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

                            {contact.is_primary && (
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

                                <span>
                                    {formatPhoneNumber(
                                        contact.mobile_number,
                                    )}
                                </span>
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
                    {!contact.is_primary && (
                        <button
                            type="button"
                            onClick={onMakePrimary}
                            disabled={
                                makingPrimary ||
                                deleting
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-(--sj-border) px-3 py-2 text-xs font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary) disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {makingPrimary && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}

                            {makingPrimary
                                ? 'Updating...'
                                : 'Make primary'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={
                            deleting ||
                            makingPrimary
                        }
                        aria-label={`Edit ${contact.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--sj-border) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-primary) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={
                            deleting ||
                            makingPrimary
                        }
                        aria-label={`Delete ${contact.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/15 text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
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
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white transition hover:bg-(--sj-primary-dark)"
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
    isSaving,
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
                        disabled={isSaving}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={onSave}
                    className="p-5 sm:p-6"
                >
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
                                minLength={2}
                                maxLength={150}
                                disabled={isSaving}
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
                                minLength={2}
                                maxLength={50}
                                disabled={isSaving}
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
                                minLength={10}
                                maxLength={15}
                                pattern="(?:\+91[\s-]?)?[6-9]\d{9}"
                                disabled={isSaving}
                                className="sj-input h-12 px-4 text-sm"
                                placeholder="+91 98765 43210"
                            />

                            <p className="mt-1.5 text-xs text-(--sj-text-muted)">
                                Enter a valid 10-digit Indian mobile number.
                            </p>
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
                                disabled={isSaving}
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
                                disabled={isSaving}
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
                            disabled={isSaving}
                            className="rounded-xl border border-(--sj-border) px-5 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3 text-sm font-black text-white transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {isSaving
                                ? 'Saving...'
                                : editing
                                    ? 'Save changes'
                                    : 'Add contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function normalizePhone(value) {
    const digits = String(value || '').replace(/\D/g, '');

    if (digits.startsWith('91') && digits.length === 12) {
        return digits.slice(2);
    }

    return digits;
}

function formatPhoneNumber(value) {
    const digits = normalizePhone(value);

    if (digits.length === 10) {
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }

    return value || '';
}

function getApiErrorMessage(
    error,
    fallbackMessage,
) {
    const detail = error?.data?.detail;

    if (Array.isArray(detail)) {
        const message = detail
            .map((item) => {
                if (typeof item === 'string') {
                    return item;
                }

                if (item?.msg) {
                    return item.msg;
                }

                return null;
            })
            .filter(Boolean)
            .join(' ');

        return message || fallbackMessage;
    }

    if (typeof detail === 'string') {
        return detail;
    }

    if (typeof error?.message === 'string') {
        return error.message;
    }

    return fallbackMessage;
}

export default EmergencyContacts;