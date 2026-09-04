import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo4.png';

function AuthLayout({ children, eyebrow, title, description }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="sanjeevani-page min-h-screen">
            <header className="border-b border-(--sj-border) bg-(--sj-bg)/95 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <Link to="/" className="flex items-center gap-3">
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
                                <span className="text-(--sj-primary)"> AI</span>
                            </div>

                            <div className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-(--sj-text-muted) sm:block">
                                Emergency coordination
                            </div>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--sj-border) bg-(--sj-surface) text-sm text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text)"
                    >
                        {isDark ? '☀' : '☾'}
                    </button>
                </div>
            </header>

            <main className="px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                    {/* Left information panel */}
                    <section className="hidden lg:block">
                        <div className="max-w-xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--sj-border) bg-(--sj-surface) px-3.5 py-2 shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                <span className="text-xs font-bold uppercase tracking-[0.15em] text-(--sj-text-soft)">
                                    Secure access
                                </span>
                            </div>

                            <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                {eyebrow}
                            </p>

                            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] text-(--sj-text) xl:text-5xl">
                                {title}
                            </h1>

                            <p className="mt-5 max-w-lg text-base leading-7 text-(--sj-text-soft)">
                                {description}
                            </p>

                            <div className="mt-10 grid gap-4">
                                <div className="sj-card p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <h2 className="text-sm font-black text-(--sj-text)">
                                                Protected emergency information
                                            </h2>

                                            <p className="mt-1 text-sm leading-6 text-(--sj-text-soft)">
                                                Access is controlled by role and verified
                                                authentication.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="sj-card p-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                                        Sanjeevani AI
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                                        Connecting patients, hospitals and paramedics
                                        during emergencies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Authentication content */}
                    <section className="w-full">
                        <div className="mx-auto max-w-lg">
                            <Link
                                to="/"
                                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to home
                            </Link>

                            <div className="sj-card p-6 sm:p-8">
                                <div className="mb-8 lg:hidden">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-(--sj-primary)">
                                        {eyebrow}
                                    </p>

                                    <h1 className="mt-3 text-3xl font-black tracking-tight text-(--sj-text)">
                                        {title}
                                    </h1>

                                    <p className="mt-3 text-sm leading-6 text-(--sj-text-soft)">
                                        {description}
                                    </p>
                                </div>

                                {children}
                            </div>

                            <p className="mt-5 text-center text-xs leading-5 text-(--sj-text-muted)">
                                By continuing, you agree to use Sanjeevani AI only for
                                authorized emergency coordination purposes.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;