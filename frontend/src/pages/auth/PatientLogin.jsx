import React from 'react';
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Mail,
    MessageSquare,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

function PatientLogin() {
    const navigate = useNavigate();

    const [loginMethod, setLoginMethod] = React.useState('email');
    const [identifier, setIdentifier] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [otpStep, setOtpStep] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const isEmail = loginMethod === 'email';

    const handleLogin = (event) => {
        event.preventDefault();

        setError('');

        if (!identifier.trim()) {
            setError(
                isEmail
                    ? 'Please enter your email address.'
                    : 'Please enter your mobile number.',
            );
            return;
        }

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setLoading(true);

        /*
         * Temporary frontend-only authentication flow.
         *
         * Later this will call the FastAPI backend:
         * 1. Verify identifier + password.
         * 2. Send OTP.
         * 3. Verify OTP.
         * 4. Issue access/refresh tokens.
         */

        setTimeout(() => {
            setLoading(false);
            setOtpStep(true);
        }, 700);
    };

    const handleVerifyOtp = (event) => {
        event.preventDefault();

        setError('');

        if (otp.length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        setLoading(true);

        /*
         * Temporary frontend-only OTP verification.
         * This will later call the FastAPI OTP verification endpoint.
         */

        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard/patient');
        }, 700);
    };

    const handleGoogleLogin = () => {
        /*
         * Google OAuth will be connected here later.
         */
        setError('Google sign-in will be connected when authentication is integrated.');
    };

    return (
        <AuthLayout
            eyebrow="Patient access"
            title={otpStep ? 'Verify your identity.' : 'Welcome back.'}
            description={
                otpStep
                    ? `Enter the verification code sent to your ${isEmail ? 'email address' : 'mobile number'}.`
                    : 'Securely access your Sanjeevani AI patient account and emergency services.'
            }
        >
            {!otpStep ? (
                <>
                    <div className="mb-7">
                        <h2 className="text-2xl font-black tracking-tight text-(--sj-text)">
                            Patient login
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Sign in to access your emergency coordination profile.
                        </p>
                    </div>

                    {/* Login method selector */}
                    <div className="mb-6 grid grid-cols-2 rounded-xl bg-(--sj-surface-2) p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod('email');
                                setIdentifier('');
                                setError('');
                            }}
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                                isEmail
                                    ? 'bg-(--sj-surface) text-(--sj-text) shadow-sm'
                                    : 'text-(--sj-text-soft) hover:text-(--sj-text)'
                            }`}
                        >
                            <Mail className="h-4 w-4" />
                            Email
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod('mobile');
                                setIdentifier('');
                                setError('');
                            }}
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                                !isEmail
                                    ? 'bg-(--sj-surface) text-(--sj-text) shadow-sm'
                                    : 'text-(--sj-text-soft) hover:text-(--sj-text)'
                            }`}
                        >
                            <Smartphone className="h-4 w-4" />
                            Mobile
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Identifier */}
                        <div>
                            <label htmlFor="patient-identifier" className="sj-label">
                                {isEmail ? 'Email address' : 'Mobile number'}
                            </label>

                            <div className="relative">
                                {isEmail ? (
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />
                                ) : (
                                    <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />
                                )}

                                <input
                                    id="patient-identifier"
                                    type={isEmail ? 'email' : 'tel'}
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    placeholder={
                                        isEmail
                                            ? 'you@example.com'
                                            : '+91 98765 43210'
                                    }
                                    autoComplete={
                                        isEmail ? 'email' : 'tel'
                                    }
                                    className="sj-input h-12 pl-11 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="patient-password"
                                    className="sj-label mb-0"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            'Password recovery will be connected when authentication is integrated.',
                                        )
                                    }
                                    className="text-xs font-bold text-(--sj-primary) hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="relative">
                                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="patient-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="sj-input h-12 pl-11 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-(--sj-text-muted) hover:text-(--sj-text)"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4.5 w-4.5" />
                                    ) : (
                                        <Eye className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium leading-6 text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                'Sending verification code...'
                            ) : (
                                <>
                                    Continue securely
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-(--sj-border)" />

                        <span className="text-xs font-semibold uppercase tracking-wider text-(--sj-text-muted)">
                            Or continue with
                        </span>

                        <div className="h-px flex-1 bg-(--sj-border)" />
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text) transition hover:bg-(--sj-surface-2)"
                    >
                        <span className="flex h-5 w-5 items-center justify-center text-sm font-black">
                            G
                        </span>

                        Continue with Google
                    </button>

                    {/* Register */}
                    <div className="mt-7 text-center text-sm text-(--sj-text-soft)">
                        Don't have a patient account?{' '}
                        <Link
                            to="/register/patient"
                            className="font-bold text-(--sj-primary) hover:underline"
                        >
                            Create account
                        </Link>
                    </div>

                    {/* Other roles */}
                    <div className="mt-7 border-t border-(--sj-border) pt-6">
                        <p className="text-center text-xs font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                            Other access
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Link
                                to="/login/hospital-admin"
                                className="rounded-xl border border-(--sj-border) px-3 py-3 text-center text-xs font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            >
                                Hospital Admin
                            </Link>

                            <Link
                                to="/login/paramedic"
                                className="rounded-xl border border-(--sj-border) px-3 py-3 text-center text-xs font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                            >
                                Paramedic
                            </Link>
                        </div>
                    </div>

                    {/* Security note */}
                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Every email or mobile login requires verification before
                            access is granted.
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-7">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <h2 className="mt-5 text-2xl font-black tracking-tight text-(--sj-text)">
                            Enter verification code
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            We sent a 6-digit verification code to your{' '}
                            {isEmail ? 'email address' : 'mobile number'}.
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                            <label htmlFor="patient-otp" className="sj-label">
                                Verification code
                            </label>

                            <input
                                id="patient-otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(event) =>
                                    setOtp(
                                        event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6),
                                    )
                                }
                                placeholder="000000"
                                autoComplete="one-time-code"
                                className="sj-input h-14 text-center text-xl font-black tracking-[0.45em]"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium leading-6 text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                'Verifying...'
                            ) : (
                                <>
                                    Verify and continue
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setOtpStep(false);
                                setOtp('');
                                setError('');
                            }}
                            className="font-bold text-(--sj-text-soft) hover:text-(--sj-text)"
                        >
                            ← Change login method
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setError(
                                    'A new verification code will be available after backend authentication is connected.',
                                )
                            }
                            className="font-bold text-(--sj-primary) hover:underline"
                        >
                            Resend code
                        </button>
                    </div>

                    <div className="mt-7 flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Verification protects your emergency account from
                            unauthorized access.
                        </p>
                    </div>
                </>
            )}
        </AuthLayout>
    );
}

export default PatientLogin;