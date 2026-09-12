import React, { useEffect, useRef, useState } from 'react';
import {
    Activity,
    Ambulance,
    Bell,
    ChevronDown,
    Clock3,
    History,
    LogOut,
    Menu,
    Moon,
    Navigation,
    Phone,
    ShieldCheck,
    Siren,
    Sun,
    UserRound,
    X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: '/dashboard/paramedic',
        icon: Activity,
    },
    {
        label: 'Active Emergency',
        path: '/dashboard/paramedic/emergency',
        icon: Siren,
    },
    {
        label: 'Navigation',
        path: '/dashboard/paramedic/navigation',
        icon: Navigation,
    },
    {
        label: 'Mission History',
        path: '/dashboard/paramedic/history',
        icon: History,
    },
];

const MOCK_PARAMEDIC = {
    name: 'Rohan Mehta',
    qualification: 'Emergency Medical Technician',
    hospital: 'Sanjeevani Emergency Hospital',
    ambulanceId: 'AMB-042',
    status: 'ACTIVE',
};

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Ready for emergency missions',
        message: 'Your ambulance is currently marked as available.',
        time: 'Just now',
        unread: true,
    },
    {
        id: 2,
        title: 'Profile verified',
        message: 'Your paramedic account is active and authorized.',
        time: '2 hours ago',
        unread: true,
    },
    {
        id: 3,
        title: 'Shift reminder',
        message: 'Remember to keep your mobile location enabled during duty.',
        time: 'Yesterday',
        unread: false,
    },
];

function isNavItemActive(pathname, itemPath) {
    if (itemPath === '/dashboard/paramedic') {
        return pathname === itemPath;
    }

    return pathname.startsWith(itemPath);
}

export default function ParamedicNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(
        MOCK_NOTIFICATIONS,
    );

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

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

    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

    const handleMarkAllRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    const handleSignOut = () => {
        localStorage.removeItem('sanjeevani_auth');
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-(--sj-border) bg-(--sj-surface)/95 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    to="/dashboard/paramedic"
                    className="flex min-w-0 shrink-0 items-center gap-3"
                >
                    <img
                        src={logo}
                        alt="Sanjeevani AI"
                        className="h-10 w-10 rounded-xl object-contain"
                    />

                    <div className="hidden min-w-0 sm:block">
                        <p className="truncate text-sm font-bold text-(--sj-text)">
                            Sanjeevani AI
                        </p>

                        <p className="truncate text-[11px] font-medium text-(--sj-text-muted)">
                            Paramedic command center
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isNavItemActive(
                            location.pathname,
                            item.path,
                        );

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    active
                                        ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                        : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)'
                                }`}
                            >
                                <Icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-full border border-(--sj-border) bg-(--sj-surface-2) px-3 py-1.5 xl:flex">
                        <span className="h-2 w-2 rounded-full bg-(--sj-primary)" />
                        <span className="text-xs font-semibold text-(--sj-text-soft)">
                            On duty
                        </span>
                    </div>

                    <div className="relative" ref={notificationRef}>
                        <button
                            type="button"
                            onClick={() =>
                                setIsNotificationOpen(
                                    (current) => !current,
                                )
                            }
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            aria-label="Notifications"
                        >
                            <Bell size={19} />

                            {unreadCount > 0 ? (
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-(--sj-surface)" />
                            ) : null}
                        </button>

                        {isNotificationOpen ? (
                            <div className="absolute right-0 top-12 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-xl">
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-4 py-3">
                                    <div>
                                        <p className="text-sm font-bold text-(--sj-text)">
                                            Notifications
                                        </p>

                                        <p className="text-xs text-(--sj-text-muted)">
                                            {unreadCount} unread
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-semibold text-(--sj-primary) hover:text-(--sj-primary-dark)"
                                    >
                                        Read all
                                    </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(
                                        (notification) => (
                                            <div
                                                key={notification.id}
                                                className="border-b border-(--sj-border) px-4 py-3 last:border-b-0"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--sj-primary-soft) text-(--sj-primary)">
                                                        <Bell size={15} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-start gap-2">
                                                            <p className="text-xs font-semibold text-(--sj-text)">
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>

                                                            {notification.unread ? (
                                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                                                            ) : null}
                                                        </div>

                                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[11px] text-(--sj-text-muted)">
                                                            {
                                                                notification.time
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={19} />
                        ) : (
                            <Moon size={19} />
                        )}
                    </button>

                    <div
                        className="relative hidden sm:block"
                        ref={profileRef}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setIsProfileOpen(
                                    (current) => !current,
                                )
                            }
                            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-(--sj-surface-2)"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <UserRound size={17} />
                            </div>

                            <div className="hidden text-left xl:block">
                                <p className="max-w-32 truncate text-xs font-semibold text-(--sj-text)">
                                    {MOCK_PARAMEDIC.name}
                                </p>

                                <p className="text-[10px] text-(--sj-text-muted)">
                                    Paramedic
                                </p>
                            </div>

                            <ChevronDown
                                size={15}
                                className="text-(--sj-text-muted)"
                            />
                        </button>

                        {isProfileOpen ? (
                            <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) p-2 shadow-xl">
                                <div className="border-b border-(--sj-border) px-3 py-3">
                                    <p className="text-sm font-bold text-(--sj-text)">
                                        {MOCK_PARAMEDIC.name}
                                    </p>

                                    <p className="mt-1 text-xs text-(--sj-text-muted)">
                                        {MOCK_PARAMEDIC.qualification}
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-[11px] text-(--sj-text-soft)">
                                        <Ambulance size={13} />
                                        {MOCK_PARAMEDIC.ambulanceId}
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard/paramedic/profile"
                                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <UserRound size={16} />
                                    My profile
                                </Link>

                                <Link
                                    to="/dashboard/paramedic/history"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    <History size={16} />
                                    Mission history
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(
                                (current) => !current,
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text) lg:hidden"
                        aria-label="Toggle navigation"
                    >
                        {isMobileMenuOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen ? (
                <div className="border-t border-(--sj-border) bg-(--sj-surface) lg:hidden">
                    <div className="mx-auto max-w-[1600px] space-y-1 px-4 py-3 sm:px-6">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isNavItemActive(
                                location.pathname,
                                item.path,
                            );

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                                        active
                                            ? 'bg-(--sj-primary-soft) text-(--sj-primary)'
                                            : 'text-(--sj-text-soft) hover:bg-(--sj-surface-2)'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="my-2 border-t border-(--sj-border)" />

                        <div className="flex items-center gap-3 rounded-xl bg-(--sj-surface-2) px-3 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <UserRound size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-(--sj-text)">
                                    {MOCK_PARAMEDIC.name}
                                </p>

                                <p className="truncate text-xs text-(--sj-text-muted)">
                                    {MOCK_PARAMEDIC.hospital}
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/dashboard/paramedic/profile"
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface-2)"
                        >
                            <UserRound size={18} />
                            My profile
                        </Link>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-(--sj-text-soft) hover:bg-(--sj-surface-2)"
                        >
                            {theme === 'dark' ? (
                                <Sun size={18} />
                            ) : (
                                <Moon size={18} />
                            )}
                            Toggle theme
                        </button>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                        >
                            <LogOut size={18} />
                            Sign out
                        </button>
                    </div>
                </div>
            ) : null}
        </header>
    );
}