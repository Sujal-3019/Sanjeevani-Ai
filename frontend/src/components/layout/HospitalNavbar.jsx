import React, { useEffect, useRef, useState } from 'react';
import {
    Ambulance,
    Bell,
    ChevronDown,
    Hospital,
    LogOut,
    Moon,
    ShieldCheck,
    Siren,
    Sun,
    UserRound,
    Users,
    X,
    Menu,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

const MOCK_HOSPITAL = {
    name: 'Sanjeevani Emergency Hospital',
    type: 'Multi-Specialty Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    status: 'PENDING',
    applicationId: 'HSP-2026-00421',
};

const NAVIGATION_ITEMS = [
    {
        label: 'Dashboard',
        path: '/dashboard/hospital',
        icon: Hospital,
    },
    {
        label: 'Emergency Requests',
        path: '/dashboard/hospital/emergencies',
        icon: Siren,
    },
    {
        label: 'Ambulances',
        path: '/dashboard/hospital/ambulances',
        icon: Ambulance,
    },
    {
        label: 'Paramedics',
        path: '/dashboard/hospital/paramedics',
        icon: Users,
    },
    {
        label: 'Capacity',
        path: '/dashboard/hospital/capacity',
        icon: Hospital,
    },
    {
        label: 'Services',
        path: '/dashboard/hospital/services',
        icon: ShieldCheck,
    },
    {
        label: 'Hospital Settings',
        path: '/dashboard/hospital/settings',
        icon: Hospital,
    },
];

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'New emergency request',
        message:
            'A critical emergency request is waiting for hospital response.',
        path: '/dashboard/hospital/emergencies',
        unread: true,
    },
    {
        id: 2,
        title: 'Verification update',
        message:
            'Your hospital application remains under review.',
        path: `/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`,
        unread: true,
    },
    {
        id: 3,
        title: 'Capacity reminder',
        message:
            'Review emergency bed availability.',
        path: '/dashboard/hospital/capacity',
        unread: true,
    },
];

function HospitalNavbar() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const isDark = theme === 'dark';

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
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
        setNotificationOpen(false);
        setProfileOpen(false);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const isNavigationActive = (path) => {
        if (path === '/dashboard/hospital') {
            return location.pathname === path;
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const closeAllMenus = () => {
        setNotificationOpen(false);
        setProfileOpen(false);
        setMobileMenuOpen(false);
    };

    const handleSignOut = () => {
        closeAllMenus();

        localStorage.removeItem('sanjeevani_auth');

        navigate('/');
    };

    const handleNavigation = (path) => {
        closeAllMenus();
        navigate(path);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((current) => !current);
        setNotificationOpen(false);
        setProfileOpen(false);
    };

    const toggleNotifications = () => {
        setNotificationOpen((current) => !current);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen((current) => !current);
        setNotificationOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-(--sj-border) bg-(--sj-bg)/95 shadow-[0_1px_8px_rgba(16,33,43,0.04)] backdrop-blur-xl">
            <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-8">
                <div className="flex min-h-18 items-center justify-between gap-2 sm:gap-3">
                    {/* ===================================================== */}
                    {/* BRAND */}
                    {/* ===================================================== */}

                    <Link
                        to="/dashboard/hospital"
                        onClick={closeAllMenus}
                        className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 sm:h-10 sm:w-10">
                            <img
                                src={logo}
                                alt="Sanjeevani AI"
                                className="h-full w-full object-contain p-1"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-base font-black tracking-tight text-(--sj-text) sm:text-lg">
                                Sanjeevani
                                <span className="text-(--sj-primary)">
                                    {' '}
                                    AI
                                </span>
                            </div>

                            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-(--sj-text-muted) sm:block">
                                Hospital command center
                            </div>
                        </div>
                    </Link>

                    {/* ===================================================== */}
                    {/* DESKTOP NAVIGATION - XL AND ABOVE */}
                    {/* ===================================================== */}

                    <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex 2xl:gap-1">
                        {NAVIGATION_ITEMS.slice(0, 6).map((item) => {
                            const Icon = item.icon;
                            const active = isNavigationActive(
                                item.path,
                            );

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={closeAllMenus}
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-bold transition 2xl:gap-2 2xl:px-3 2xl:text-xs ${
                                        active
                                            ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                            : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0 2xl:h-4 2xl:w-4" />

                                    <span className="whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ===================================================== */}
                    {/* RIGHT ACTIONS */}
                    {/* ===================================================== */}

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        {/* Hospital Admin Badge */}
                        <span className="hidden rounded-full bg-(--sj-primary)/10 px-3 py-1.5 text-xs font-bold text-(--sj-primary) 2xl:inline-flex">
                            Hospital Admin
                        </span>

                        {/* ================================================= */}
                        {/* DESKTOP THEME */}
                        {/* ================================================= */}

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isDark
                                    ? 'Switch to light theme'
                                    : 'Switch to dark theme'
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) sm:h-10 sm:w-10"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        {/* ================================================= */}
                        {/* NOTIFICATIONS */}
                        {/* ================================================= */}

                        <div
                            className="relative"
                            ref={notificationRef}
                        >
                            <button
                                type="button"
                                onClick={toggleNotifications}
                                aria-label="Notifications"
                                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) sm:h-10 sm:w-10"
                            >
                                <Bell className="h-4 w-4" />

                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--sj-surface) sm:right-2 sm:top-2" />
                            </button>

                            {notificationOpen && (
                                <div className="fixed left-3 right-3 top-19 z-70 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-85">
                                    <div className="flex items-center justify-between border-b border-(--sj-border) px-4 py-3">
                                        <div>
                                            <p className="text-sm font-black text-(--sj-text)">
                                                Notifications
                                            </p>

                                            <p className="mt-0.5 text-[11px] text-(--sj-text-muted)">
                                                Hospital coordination updates
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-(--sj-primary)/10 px-2 py-1 text-[10px] font-bold text-(--sj-primary)">
                                            3 unread
                                        </span>
                                    </div>

                                    <div className="max-h-[70vh] overflow-y-auto p-2 sm:max-h-96">
                                        {NOTIFICATIONS.map(
                                            (notification) => (
                                                <Link
                                                    key={notification.id}
                                                    to={notification.path}
                                                    onClick={closeAllMenus}
                                                    className={`block rounded-xl p-3 transition ${
                                                        notification.unread
                                                            ? 'bg-(--sj-primary)/5 hover:bg-(--sj-primary)/10'
                                                            : 'hover:bg-(--sj-surface-2)'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                                            {notification.id ===
                                                            1 ? (
                                                                <Siren className="h-4 w-4" />
                                                            ) : notification.id ===
                                                              2 ? (
                                                                <ShieldCheck className="h-4 w-4" />
                                                            ) : (
                                                                <Hospital className="h-4 w-4" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-black text-(--sj-text)">
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                        </div>

                                                        {notification.unread && (
                                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                                        )}
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ================================================= */}
                        {/* PROFILE - XL+ */}
                        {/* ================================================= */}

                        <div
                            className="relative hidden xl:block"
                            ref={profileRef}
                        >
                            <button
                                type="button"
                                onClick={toggleProfile}
                                className="flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-2.5 py-2 text-left transition hover:border-(--sj-primary)/40 2xl:gap-3 2xl:px-3"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <UserRound className="h-4 w-4" />
                                </div>

                                <div className="hidden 2xl:block">
                                    <p className="text-xs font-black text-(--sj-text)">
                                        Admin
                                    </p>

                                    <p className="text-[10px] text-(--sj-text-muted)">
                                        Hospital Admin
                                    </p>
                                </div>

                                <ChevronDown className="hidden h-3.5 w-3.5 text-(--sj-text-muted) 2xl:block" />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-[calc(100%+10px)] z-70 w-64 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-2xl">
                                    {/* Admin Identity */}
                                    <div className="border-b border-(--sj-border) px-3 pb-3 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                <UserRound className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-black text-(--sj-text)">
                                                    Hospital Admin
                                                </p>

                                                <p className="truncate text-xs text-(--sj-text-muted)">
                                                    {MOCK_HOSPITAL.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-(--sj-primary)/10 px-3 py-2">
                                            <ShieldCheck className="h-4 w-4 shrink-0 text-(--sj-primary)" />

                                            <span className="text-xs font-bold text-(--sj-primary)">
                                                {MOCK_HOSPITAL.status ===
                                                'PENDING'
                                                    ? 'Verification pending'
                                                    : 'Hospital account active'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            to="/dashboard/hospital/settings"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Hospital className="h-4 w-4" />
                                            Hospital settings
                                        </Link>

                                        <Link
                                            to="/dashboard/hospital/emergencies"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Siren className="h-4 w-4" />
                                            Emergency requests
                                        </Link>

                                        <Link
                                            to="/dashboard/hospital/paramedics"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Users className="h-4 w-4" />
                                            Paramedics
                                        </Link>

                                        <Link
                                            to="/dashboard/hospital/ambulances"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Ambulance className="h-4 w-4" />
                                            Ambulances
                                        </Link>

                                        <Link
                                            to="/dashboard/hospital/capacity"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <Hospital className="h-4 w-4" />
                                            Capacity
                                        </Link>

                                        <Link
                                            to="/dashboard/hospital/services"
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                            Hospital services
                                        </Link>

                                        <Link
                                            to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                            Verification status
                                        </Link>

                                        <div className="my-2 border-t border-(--sj-border)" />

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500/5"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ================================================= */}
                        {/* TABLET / MOBILE MENU BUTTON */}
                        {/* ================================================= */}

                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            aria-label={
                                mobileMenuOpen
                                    ? 'Close navigation menu'
                                    : 'Open navigation menu'
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) xl:hidden sm:h-10 sm:w-10"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================================================= */}
            {/* TABLET / MOBILE MENU */}
            {/* ============================================================= */}

            {mobileMenuOpen && (
                <div className="border-t border-(--sj-border) bg-(--sj-surface) xl:hidden">
                    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 lg:px-8">
                        {/* Hospital identity */}
                        <div className="mb-4 rounded-2xl border border-(--sj-border) bg-(--sj-surface-2)/50 p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                    <Hospital className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black text-(--sj-text)">
                                        {MOCK_HOSPITAL.name}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-(--sj-text-muted)">
                                        {MOCK_HOSPITAL.type}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    {MOCK_HOSPITAL.status}
                                </span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                            {NAVIGATION_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    isNavigationActive(item.path);

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={closeAllMenus}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                                            active
                                                ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                                : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />

                                        <span className="truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Secondary controls */}
                        <div className="mt-4 border-t border-(--sj-border) pt-3">
                            <div className="grid gap-1 sm:grid-cols-2">
                                <Link
                                    to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                    onClick={closeAllMenus}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <ShieldCheck className="h-4 w-4 shrink-0" />
                                    <span>
                                        Verification status
                                    </span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    {isDark ? (
                                        <Sun className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <Moon className="h-4 w-4 shrink-0" />
                                    )}

                                    <span>
                                        {isDark
                                            ? 'Light theme'
                                            : 'Dark theme'}
                                    </span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-500/5"
                            >
                                <LogOut className="h-4 w-4 shrink-0" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default HospitalNavbar;