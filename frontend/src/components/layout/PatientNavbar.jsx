import React, { useEffect, useRef, useState } from 'react';
import {
    Activity,
    Bell,
    ChevronDown,
    FileHeart,
    History,
    LogOut,
    Menu,
    Moon,
    Phone,
    ShieldCheck,
    Siren,
    Sun,
    UserRound,
    X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { patientService } from '../../services/patientService';

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/dashboard/patient',
        icon: Activity,
    },
    {
        label: 'Emergency',
        path: '/dashboard/patient/emergency',
        icon: Siren,
    },
    {
        label: 'Medical Profile',
        path: '/dashboard/patient/medical-profile',
        icon: FileHeart,
    },
    {
        label: 'Emergency Contacts',
        path: '/dashboard/patient/emergency-contacts',
        icon: Phone,
    },
    {
        label: 'Emergency History',
        path: '/dashboard/patient/history',
        icon: History,
    },
];

function PatientNavbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const [patientProfile, setPatientProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    /*
     * Notifications will be connected to the real notifications API
     * once that backend module is implemented.
     *
     * Keeping this empty prevents displaying fake medical/emergency
     * notifications to the patient.
     */
    const [notifications] = useState([]);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

    useEffect(() => {
        let isMounted = true;

        async function loadPatientProfile() {
            setProfileLoading(true);

            try {
                const accessToken = localStorage.getItem(
                    'sanjeevani_access_token',
                );

                if (!accessToken) {
                    if (isMounted) {
                        setPatientProfile(null);
                    }

                    return;
                }

                const response = await patientService.getProfile(
                    accessToken,
                );

                if (isMounted) {
                    setPatientProfile(response);
                }
            } catch (error) {
                /*
                 * A missing profile is valid during onboarding.
                 * Do not show an error banner inside the navbar.
                 */
                if (error?.status === 404) {
                    if (isMounted) {
                        setPatientProfile(null);
                    }

                    return;
                }

                console.warn(
                    'Unable to load patient profile for navbar.',
                    error,
                );
            } finally {
                if (isMounted) {
                    setProfileLoading(false);
                }
            }
        }

        loadPatientProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick,
            );
        };
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    const isActive = (path) => {
        if (path === '/dashboard/patient') {
            return location.pathname === path;
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
    };

    const handleProfileNavigation = (path) => {
        navigate(path);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleReadAll = () => {
        /*
         * Notifications are currently read-only until the real
         * notification API is connected.
         */
    };

    const handleNotificationClick = () => {
        /*
         * Notification navigation will be connected when the
         * notification backend is implemented.
         */
    };

    const handleSignOut = async () => {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        try {
            await logout();
        } catch (error) {
            console.warn(
                'Logout request failed. Clearing local session anyway.',
                error,
            );
        } finally {
            navigate('/', { replace: true });
            setIsSigningOut(false);
        }
    };

    const toggleNotifications = () => {
        setIsNotificationOpen((current) => !current);
        setIsProfileOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen((current) => !current);
        setIsNotificationOpen(false);
    };

    /*
     * AuthContext contains the actual account identity.
     * Patient profile contains the additional patient-specific data.
     */
    const patientName =
        user?.full_name?.trim() ||
        'Patient';

    const patientEmail =
        user?.email?.trim() ||
        'Email not provided';

    const patientPhone =
        user?.mobile_number?.trim() ||
        'Phone not provided';

    const patientStatus =
        user?.status || 'ACTIVE';

    const patientCity =
        patientProfile?.city ||
        'Location not provided';

    const patientState =
        patientProfile?.state ||
        '';

    const displayLocation = patientState
        ? `${patientCity}, ${patientState}`
        : patientCity;

    const accountIsActive =
        patientStatus === 'ACTIVE' &&
        user?.is_active !== false;

    return (
        <header className="sticky top-0 z-50 border-b border-(--sj-border) bg-(--sj-surface)/95 shadow-[0_1px_8px_rgba(16,33,43,0.04)] backdrop-blur-xl">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-18 items-center justify-between gap-3">
                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation('/dashboard/patient')
                        }
                        className="flex min-w-0 shrink-0 items-center gap-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--sj-border) bg-(--sj-surface-2)">
                            <img
                                src={logo}
                                alt="Sanjeevani AI"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="min-w-0 text-left">
                            <p className="truncate text-sm font-bold tracking-tight text-(--sj-text)">
                                Sanjeevani AI
                            </p>

                            <p className="truncate text-[11px] font-medium text-(--sj-text-muted)">
                                Patient portal
                            </p>
                        </div>
                    </button>

                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav className="hidden items-center gap-1 xl:flex">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={item.path}
                                    type="button"
                                    onClick={() =>
                                        handleNavigation(item.path)
                                    }
                                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                        active
                                            ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                            : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* =================================================
                        RIGHT ACTIONS
                    ================================================= */}

                    <div className="flex min-w-0 items-center gap-1">
                        {/* SOS */}

                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation(
                                    '/dashboard/patient/emergency',
                                )
                            }
                            className="hidden items-center gap-2 rounded-xl bg-(--sj-primary) px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) lg:flex"
                        >
                            <Siren className="h-4 w-4" />
                            <span>SOS</span>
                        </button>

                        {/* =================================================
                            NOTIFICATIONS
                        ================================================= */}

                        <div
                            className="relative"
                            ref={notificationRef}
                        >
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" />

                                {unreadCount > 0 && (
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--sj-surface)" />
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="fixed left-4 right-4 top-19 z-60 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-95">
                                    <div className="flex items-center justify-between border-b border-(--sj-border) px-4 py-3">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-(--sj-text)">
                                                Notifications
                                            </h3>

                                            <p className="mt-0.5 text-xs text-(--sj-text-muted)">
                                                Patient safety updates
                                            </p>
                                        </div>

                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleReadAll}
                                                className="shrink-0 text-xs font-semibold text-(--sj-primary) hover:underline"
                                            >
                                                Read all
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[70vh] overflow-y-auto sm:max-h-90">
                                        {notifications.length > 0 ? (
                                            notifications.map(
                                                (notification) => (
                                                    <button
                                                        key={notification.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification.id,
                                                            )
                                                        }
                                                        className="flex w-full gap-3 border-b border-(--sj-border) px-4 py-3 text-left transition last:border-b-0 hover:bg-(--sj-surface-2)"
                                                    >
                                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary-soft) text-(--sj-primary)">
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <p className="min-w-0 text-sm font-semibold text-(--sj-text)">
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </p>

                                                                {notification.unread && (
                                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                                                )}
                                                            </div>

                                                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <p className="mt-1.5 text-[11px] text-(--sj-text-muted)">
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                        </div>
                                                    </button>
                                                ),
                                            )
                                        ) : (
                                            <div className="px-4 py-9 text-center">
                                                <Bell className="mx-auto h-7 w-7 text-(--sj-text-muted)" />

                                                <p className="mt-3 text-sm font-semibold text-(--sj-text)">
                                                    No notifications
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-(--sj-text-muted)">
                                                    You are all caught up.
                                                    New safety and emergency
                                                    updates will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            THEME
                        ================================================= */}

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            aria-label={
                                theme === 'dark'
                                    ? 'Switch to light theme'
                                    : 'Switch to dark theme'
                            }
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        {/* =================================================
                            PROFILE BUTTON
                        ================================================= */}

                        <div
                            className="relative hidden md:block"
                            ref={profileRef}
                        >
                            <button
                                type="button"
                                onClick={toggleProfile}
                                className="flex h-10 items-center gap-2 rounded-xl px-2 transition hover:bg-(--sj-surface-2)"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <UserRound className="h-4 w-4" />
                                </div>

                                <div className="hidden max-w-32.5 text-left lg:block">
                                    <p className="truncate text-xs font-bold text-(--sj-text)">
                                        {patientName}
                                    </p>

                                    <p className="truncate text-[10px] text-(--sj-text-muted)">
                                        Patient
                                    </p>
                                </div>

                                <ChevronDown className="hidden h-4 w-4 text-(--sj-text-muted) lg:block" />
                            </button>

                            {/* =================================================
                                PROFILE DROPDOWN
                            ================================================= */}

                            {isProfileOpen && (
                                <div className="fixed left-4 right-4 top-19 z-60 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-xl sm:left-auto sm:right-4 sm:w-80 md:absolute md:left-auto md:right-0 md:top-[calc(100%+10px)]">
                                    {/* Patient Identity */}

                                    <div className="border-b border-(--sj-border) px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                                <UserRound className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-(--sj-text)">
                                                    {patientName}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-(--sj-text-muted)">
                                                    {patientEmail}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-(--sj-text-muted)">
                                                    {patientPhone}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-(--sj-primary-soft) px-3 py-2">
                                            <ShieldCheck className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                            <span className="text-xs font-semibold text-(--sj-primary)">
                                                {accountIsActive
                                                    ? 'Patient account active'
                                                    : 'Patient account inactive'}
                                            </span>
                                        </div>

                                        {/* Saved Location */}

                                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-(--sj-surface-2) px-3 py-2">
                                            <MapPinIcon
                                                className="h-4 w-4 shrink-0 text-(--sj-text-muted)"
                                            />

                                            <span className="truncate text-xs font-medium text-(--sj-text-soft)">
                                                {profileLoading
                                                    ? 'Loading location...'
                                                    : displayLocation}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Sections */}

                                    <div className="p-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleProfileNavigation(
                                                    '/dashboard/patient/medical-profile',
                                                )
                                            }
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <FileHeart className="h-4 w-4 shrink-0" />
                                            <span>
                                                Medical profile
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleProfileNavigation(
                                                    '/dashboard/patient/emergency-contacts',
                                                )
                                            }
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>
                                                Emergency contacts
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleProfileNavigation(
                                                    '/dashboard/patient/history',
                                                )
                                            }
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <History className="h-4 w-4 shrink-0" />
                                            <span>
                                                Emergency history
                                            </span>
                                        </button>

                                        <div className="my-2 border-t border-(--sj-border)" />

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            disabled={isSigningOut}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <LogOut className="h-4 w-4 shrink-0" />

                                            <span>
                                                {isSigningOut
                                                    ? 'Signing out...'
                                                    : 'Sign out'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            MOBILE / TABLET MENU
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileMenuOpen(
                                    (current) => !current,
                                )
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text) xl:hidden"
                            aria-label={
                                isMobileMenuOpen
                                    ? 'Close navigation menu'
                                    : 'Open navigation menu'
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* =========================================================
                    MOBILE / TABLET NAVIGATION
                ========================================================= */}

                {isMobileMenuOpen && (
                    <div className="border-t border-(--sj-border) py-3 xl:hidden">
                        <nav className="grid gap-1">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <button
                                        key={item.path}
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(item.path)
                                        }
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                            active
                                                ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                                : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />

                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}

                            {/* SOS */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleNavigation(
                                        '/dashboard/patient/emergency',
                                    )
                                }
                                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-4 py-3 text-sm font-bold text-white transition hover:bg-(--sj-primary-dark)"
                            >
                                <Siren className="h-5 w-5" />
                                Emergency / SOS
                            </button>

                            {/* Mobile Controls */}

                            <div className="mt-2 border-t border-(--sj-border) pt-2">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <Moon className="h-4 w-4 shrink-0" />
                                    )}

                                    {theme === 'dark'
                                        ? 'Light theme'
                                        : 'Dark theme'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />

                                    <span>
                                        {isSigningOut
                                            ? 'Signing out...'
                                            : 'Sign out'}
                                    </span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

/*
 * Small local icon wrapper so the existing navbar doesn't need
 * another lucide import just for the profile location row.
 */
function MapPinIcon({ className }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export default PatientNavbar;