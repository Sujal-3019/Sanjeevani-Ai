import React, { useEffect, useRef, useState } from 'react';
import {
    Ambulance,
    Bell,
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
            document.removeEventListener('mousedown', handleOutsideClick);
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

    const handleSignOut = () => {
        setProfileOpen(false);
        setMobileMenuOpen(false);

        localStorage.removeItem('sanjeevani_auth');

        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 border-b border-(--sj-border) bg-(--sj-bg)/95 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo / Brand */}
                <Link
                    to="/dashboard/hospital"
                    className="flex shrink-0 items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                        <img
                            src={logo}
                            alt="Sanjeevani AI"
                            className="h-full w-full object-contain p-1"
                        />
                    </div>

                    <div>
                        <div className="text-lg font-black tracking-tight text-(--sj-text)">
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

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-1 xl:flex">
                    {NAVIGATION_ITEMS.slice(0, 6).map((item) => {
                        const Icon = item.icon;
                        const isActive = isNavigationActive(item.path);

                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                                    isActive
                                        ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                        : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 lg:flex">
                    <span className="hidden rounded-full bg-(--sj-primary)/10 px-3 py-1.5 text-xs font-bold text-(--sj-primary) 2xl:inline-flex">
                        Hospital Admin
                    </span>

                    {/* Theme */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div
                        className="relative"
                        ref={notificationRef}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setNotificationOpen(
                                    (current) => !current,
                                );
                                setProfileOpen(false);
                            }}
                            aria-label="Notifications"
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            <Bell className="h-4 w-4" />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--sj-surface)" />
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-2xl">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <p className="text-sm font-black text-(--sj-text)">
                                        Notifications
                                    </p>

                                    <span className="text-[10px] font-bold text-(--sj-primary)">
                                        3 unread
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <Link
                                        to="/dashboard/hospital/emergencies"
                                        onClick={() =>
                                            setNotificationOpen(false)
                                        }
                                        className="block rounded-xl bg-(--sj-primary)/5 p-3 transition hover:bg-(--sj-primary)/10"
                                    >
                                        <p className="text-xs font-black text-(--sj-text)">
                                            New emergency request
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            A critical emergency request is
                                            waiting for hospital response.
                                        </p>
                                    </Link>

                                    <Link
                                        to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                        onClick={() =>
                                            setNotificationOpen(false)
                                        }
                                        className="block rounded-xl p-3 transition hover:bg-(--sj-surface-2)"
                                    >
                                        <p className="text-xs font-black text-(--sj-text)">
                                            Verification update
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Your hospital application remains
                                            under review.
                                        </p>
                                    </Link>

                                    <Link
                                        to="/dashboard/hospital/capacity"
                                        onClick={() =>
                                            setNotificationOpen(false)
                                        }
                                        className="block rounded-xl p-3 transition hover:bg-(--sj-surface-2)"
                                    >
                                        <p className="text-xs font-black text-(--sj-text)">
                                            Capacity reminder
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                            Review emergency bed availability.
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div
                        className="relative"
                        ref={profileRef}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setProfileOpen((current) => !current);
                                setNotificationOpen(false);
                            }}
                            className="flex items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-3 py-2 text-left transition hover:border-(--sj-primary)/40"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                <UserRound className="h-4 w-4" />
                            </div>

                            <div className="hidden xl:block">
                                <p className="text-xs font-black text-(--sj-text)">
                                    Admin
                                </p>

                                <p className="text-[10px] text-(--sj-text-muted)">
                                    Hospital Admin
                                </p>
                            </div>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-2xl">
                                <Link
                                    to="/dashboard/hospital/settings"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <Hospital className="h-4 w-4" />
                                    Hospital settings
                                </Link>

                                <Link
                                    to="/dashboard/hospital/emergencies"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <Siren className="h-4 w-4" />
                                    Emergency requests
                                </Link>

                                <Link
                                    to="/dashboard/hospital/paramedics"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <Users className="h-4 w-4" />
                                    Paramedics
                                </Link>

                                <Link
                                    to="/dashboard/hospital/ambulances"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <Ambulance className="h-4 w-4" />
                                    Ambulances
                                </Link>

                                <Link
                                    to="/dashboard/hospital/capacity"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <Hospital className="h-4 w-4" />
                                    Capacity
                                </Link>

                                <Link
                                    to="/dashboard/hospital/services"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Hospital services
                                </Link>

                                <Link
                                    to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Verification status
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500/5"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(
                            (current) => !current,
                        )
                    }
                    aria-label="Toggle navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) lg:hidden"
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-(--sj-border) px-4 py-4 lg:hidden">
                    <div className="mx-auto max-w-[1600px]">
                        <div className="mb-4 rounded-xl bg-(--sj-primary)/5 p-3">
                            <p className="text-xs font-black text-(--sj-text)">
                                {MOCK_HOSPITAL.name}
                            </p>

                            <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                Hospital Admin
                            </p>
                        </div>

                        <nav className="grid gap-1 sm:grid-cols-2">
                            {NAVIGATION_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = isNavigationActive(
                                    item.path,
                                );

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() =>
                                            setMobileMenuOpen(false)
                                        }
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                                            isActive
                                                ? 'bg-(--sj-primary)/10 text-(--sj-primary)'
                                                : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-3 border-t border-(--sj-border) pt-3">
                            <Link
                                to={`/verification/hospital?applicationId=${MOCK_HOSPITAL.applicationId}`}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Verification status
                            </Link>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            >
                                {isDark ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}

                                Toggle theme
                            </button>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500/5"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default HospitalNavbar;