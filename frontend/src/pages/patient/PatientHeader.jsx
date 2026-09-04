import React from 'react';
import {
    Bell,
    CheckCheck,
    ChevronDown,
    FileHeart,
    History,
    LogOut,
    Moon,
    Phone,
    Sun,
    UserRound,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';

const notifications = [
    {
        id: 1,
        title: 'Emergency coordination ready',
        message: 'Your emergency request can be coordinated when SOS is activated.',
        time: 'Just now',
        unread: true,
    },
    {
        id: 2,
        title: 'Medical profile reminder',
        message: 'Keeping your medical information updated can help emergency teams.',
        time: '2 hours ago',
        unread: true,
    },
    {
        id: 3,
        title: 'Emergency contacts',
        message: 'Make sure your primary emergency contact information is current.',
        time: 'Yesterday',
        unread: false,
    },
];

function PatientHeader() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const [notificationOpen, setNotificationOpen] =
        React.useState(false);

    const [profileOpen, setProfileOpen] =
        React.useState(false);

    const [notificationItems, setNotificationItems] =
        React.useState(notifications);

    const notificationRef = React.useRef(null);
    const profileRef = React.useRef(null);

    const unreadCount = notificationItems.filter(
        (notification) => notification.unread,
    ).length;

    React.useEffect(() => {
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

    const toggleNotifications = () => {
        setNotificationOpen((current) => !current);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen((current) => !current);
        setNotificationOpen(false);
    };

    const markAllAsRead = () => {
        setNotificationItems((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    const markAsRead = (id) => {
        setNotificationItems((current) =>
            current.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          unread: false,
                      }
                    : notification,
            ),
        );
    };

    const handleLogout = () => {
        setProfileOpen(false);

        // Mock logout for frontend development.
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-40 border-b border-(--sj-border) bg-(--sj-bg)/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to="/dashboard/patient"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                        <FileHeart className="h-5 w-5" />
                    </div>

                    <div>
                        <div className="text-base font-black tracking-tight text-(--sj-text)">
                            Sanjeevani
                            <span className="text-(--sj-primary)">
                                {' '}
                                AI
                            </span>
                        </div>

                        <div className="hidden text-[9px] font-bold uppercase tracking-[0.14em] text-(--sj-text-muted) sm:block">
                            Patient portal
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
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
                        ref={notificationRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={toggleNotifications}
                            aria-label="Open notifications"
                            aria-expanded={notificationOpen}
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                        >
                            <Bell className="h-4 w-4" />

                            {unreadCount > 0 && (
                                <span className="absolute right-2 top-2 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                                <div className="flex items-center justify-between border-b border-(--sj-border) px-4 py-4">
                                    <div>
                                        <h2 className="text-sm font-black text-(--sj-text)">
                                            Notifications
                                        </h2>

                                        <p className="mt-0.5 text-xs text-(--sj-text-soft)">
                                            {unreadCount > 0
                                                ? `${unreadCount} unread`
                                                : 'All caught up'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-(--sj-primary) transition hover:text-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        Read all
                                    </button>
                                </div>

                                <div className="max-h-90 overflow-y-auto">
                                    {notificationItems.length === 0 ? (
                                        <div className="px-5 py-10 text-center">
                                            <Bell className="mx-auto h-7 w-7 text-(--sj-text-muted)" />

                                            <p className="mt-3 text-sm font-bold text-(--sj-text)">
                                                No notifications
                                            </p>
                                        </div>
                                    ) : (
                                        notificationItems.map(
                                            (notification) => (
                                                <button
                                                    key={notification.id}
                                                    type="button"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                    className="flex w-full gap-3 border-b border-(--sj-border) px-4 py-4 text-left transition hover:bg-(--sj-surface-2)"
                                                >
                                                    <div className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                                        <Bell className="h-4 w-4" />

                                                        {notification.unread && (
                                                            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <p className="text-sm font-black text-(--sj-text)">
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>

                                                            <span className="shrink-0 text-[10px] font-semibold text-(--sj-text-muted)">
                                                                {
                                                                    notification.time
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>
                                                </button>
                                            ),
                                        )
                                    )}
                                </div>

                                <div className="border-t border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                                    <p className="text-center text-[10px] leading-4 text-(--sj-text-muted)">
                                        Emergency alerts will appear here
                                        during an active coordination.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div
                        ref={profileRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={toggleProfile}
                            aria-label="Open profile menu"
                            aria-expanded={profileOpen}
                            className="flex items-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-2 py-1.5 transition hover:border-(--sj-primary)/40"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--sj-primary)/10 text-(--sj-primary)">
                                <UserRound className="h-4 w-4" />
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="max-w-24 truncate text-xs font-black text-(--sj-text)">
                                    Aarav Sharma
                                </p>

                                <p className="text-[10px] text-(--sj-text-muted)">
                                    Patient
                                </p>
                            </div>

                            <ChevronDown
                                className={`hidden h-3.5 w-3.5 text-(--sj-text-muted) transition sm:block ${
                                    profileOpen
                                        ? 'rotate-180'
                                        : ''
                                }`}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-(--sj-border) bg-(--sj-surface) shadow-2xl">
                                <div className="border-b border-(--sj-border) p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                            <UserRound className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-black text-(--sj-text)">
                                                Aarav Sharma
                                            </p>

                                            <p className="truncate text-xs text-(--sj-text-soft)">
                                                aarav.sharma@example.com
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <Link
                                        to="/dashboard/patient/medical-profile"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    >
                                        <FileHeart className="h-4 w-4" />
                                        Medical profile
                                    </Link>

                                    <Link
                                        to="/dashboard/patient/emergency-contacts"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Emergency contacts
                                    </Link>

                                    <Link
                                        to="/dashboard/patient/history"
                                        onClick={() =>
                                            setProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                    >
                                        <History className="h-4 w-4" />
                                        Emergency history
                                    </Link>
                                </div>

                                <div className="border-t border-(--sj-border) p-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default PatientHeader;