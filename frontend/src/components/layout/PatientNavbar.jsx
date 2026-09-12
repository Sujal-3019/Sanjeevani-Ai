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
import { useTheme } from '../../context/ThemeContext';

const MOCK_PATIENT = {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
};

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

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Emergency coordination ready',
        message:
            'Your emergency request can be coordinated when SOS is activated.',
        time: 'Just now',
        unread: true,
    },
    {
        id: 2,
        title: 'Medical profile reminder',
        message:
            'Keeping your medical information updated can help emergency teams.',
        time: '2 hours ago',
        unread: true,
    },
    {
        id: 3,
        title: 'Emergency contacts',
        message:
            'Make sure your primary emergency contact information is current.',
        time: 'Yesterday',
        unread: false,
    },
];

function PatientNavbar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] =
        useState(MOCK_NOTIFICATIONS);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

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
            document.removeEventListener('mousedown', handleOutsideClick);
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
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    const handleNotificationClick = (notificationId) => {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === notificationId
                    ? {
                          ...notification,
                          unread: false,
                      }
                    : notification,
            ),
        );
    };

    const handleSignOut = () => {
        localStorage.removeItem('sanjeevani_auth');
        navigate('/');
    };

    const toggleNotifications = () => {
        setIsNotificationOpen((current) => !current);
        setIsProfileOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen((current) => !current);
        setIsNotificationOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-(--sj-border) bg-(--sj-surface)/95 shadow-[0_1px_8px_rgba(16,33,43,0.04)] backdrop-blur-xl">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-18 items-center justify-between gap-3">
                    {/* Brand */}
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

                    {/* Desktop Navigation */}
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

                    {/* Right Actions */}
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

                        {/* Notifications */}
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
                                            <div className="px-4 py-8 text-center">
                                                <Bell className="mx-auto h-7 w-7 text-(--sj-text-muted)" />

                                                <p className="mt-2 text-sm font-semibold text-(--sj-text)">
                                                    No notifications
                                                </p>

                                                <p className="mt-1 text-xs text-(--sj-text-muted)">
                                                    You are all caught up.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Theme */}
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

                        {/* Profile Button */}
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
                                        {MOCK_PATIENT.name}
                                    </p>

                                    <p className="truncate text-[10px] text-(--sj-text-muted)">
                                        Patient
                                    </p>
                                </div>

                                <ChevronDown className="hidden h-4 w-4 text-(--sj-text-muted) lg:block" />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="fixed left-4 right-4 top-19 z-60 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-xl sm:left-auto sm:right-4 sm:w-80 md:absolute md:left-auto md:right-0 md:top-[calc(100%+10px)]">
                                    {/* Patient Identity - FIRST */}
                                    <div className="border-b border-(--sj-border) px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                                <UserRound className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-(--sj-text)">
                                                    {MOCK_PATIENT.name}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-(--sj-text-muted)">
                                                    {MOCK_PATIENT.email}
                                                </p>

                                                <p className="mt-0.5 text-xs text-(--sj-text-muted)">
                                                    {MOCK_PATIENT.phone}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status - Immediately after name */}
                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-(--sj-primary-soft) px-3 py-2">
                                            <ShieldCheck className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                            <span className="text-xs font-semibold text-(--sj-primary)">
                                                Patient account active
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Sections - NOT DUPLICATED */}
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
                                            <span>Medical profile</span>
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
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                                        >
                                            <LogOut className="h-4 w-4 shrink-0" />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile / Tablet Menu */}
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

                {/* Mobile / Tablet Navigation */}
                {isMobileMenuOpen && (
                    <div className="border-t border-(--sj-border) py-3 xl:hidden">
                        <nav className="grid gap-1">
                            {/* Main Navigation Only */}
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
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export default PatientNavbar;