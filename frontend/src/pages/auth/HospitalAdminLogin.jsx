import React from 'react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Mail,
    MapPin,
    MessageSquare,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const LOGIN_METHODS = {
    EMAIL: 'email',
    MOBILE: 'mobile',
};

const INITIAL_FORM = {
    identifier: '',
    password: '',
    otp: '',
};

function HospitalAdminLogin() {
    const navigate = useNavigate();

    const [loginMethod, setLoginMethod] = React.useState(
        LOGIN_METHODS.EMAIL,
    );

    const [formData, setFormData] = React.useState(INITIAL_FORM);

    const [step, setStep] = React.useState('credentials');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [resendCooldown, setResendCooldown] = React.useState(0);

    React.useEffect(() => {
        if (resendCooldown <= 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setResendCooldown((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [resendCooldown]);

    const identifierLabel =
        loginMethod === LOGIN_METHODS.EMAIL
            ? 'Hospital admin email'
            : 'Registered mobile number';

    const identifierPlaceholder =
        loginMethod === LOGIN_METHODS.EMAIL
            ? 'admin@hospital.com'
            : '+91 98765 43210';

    const otpChannel =
        loginMethod === LOGIN_METHODS.EMAIL ? 'email' : 'SMS';

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError('');
        setSuccessMessage('');
    };

    const handleMethodChange = (method) => {
        setLoginMethod(method);
        setFormData(INITIAL_FORM);
        setStep('credentials');
        setError('');
        setSuccessMessage('');
        setResendCooldown(0);
    };

    const validateCredentials = () => {
        if (!formData.identifier.trim()) {
            return `Please enter your ${loginMethod === LOGIN_METHODS.EMAIL
                ? 'hospital admin email'
                : 'registered mobile number'
                }.`;
        }

        if (loginMethod === LOGIN_METHODS.EMAIL) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(formData.identifier.trim())) {
                return 'Please enter a valid email address.';
            }
        }

        if (loginMethod === LOGIN_METHODS.MOBILE) {
            const digitsOnly = formData.identifier.replace(/\D/g, '');

            if (digitsOnly.length < 10) {
                return 'Please enter a valid mobile number.';
            }
        }

        if (!formData.password) {
            return 'Please enter your password.';
        }

        if (formData.password.length < 6) {
            return 'Password must contain at least 6 characters.';
        }

        return '';
    };

    const handleSendOtp = (event) => {
        event.preventDefault();

        const validationError = validateCredentials();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        window.setTimeout(() => {
            setIsSubmitting(false);
            setStep('otp');
            setResendCooldown(30);

            setSuccessMessage(
                `A verification OTP has been sent to your ${otpChannel}.`,
            );
        }, 700);
    };

    const handleVerifyOtp = (event) => {
        event.preventDefault();

        if (!/^\d{6}$/.test(formData.otp)) {
            setError('Please enter the 6-digit verification OTP.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        window.setTimeout(() => {
            setIsSubmitting(false);

            // Mock authentication.
            navigate('/dashboard/hospital');
        }, 700);
    };

    const handleResendOtp = () => {
        if (resendCooldown > 0) {
            return;
        }

        setError('');
        setSuccessMessage(
            `A new verification OTP has been sent to your ${otpChannel}.`,
        );
        setResendCooldown(30);
    };

    const handleGoogleLogin = () => {
        setError(
            'Google authentication is not connected yet. This will be enabled when the backend OAuth flow is integrated.',
        );
        setSuccessMessage('');
    };

    const handleBackToCredentials = () => {
        setStep('credentials');
        setFormData((current) => ({
            ...current,
            otp: '',
        }));
        setError('');
        setSuccessMessage('');
    };

    return (
        <AuthLayout
            eyebrow="Hospital administration"
            title="Secure access for emergency coordination."
            description="Sign in to manage emergency requests, ambulances, paramedics, hospital capacity and active patient coordination."
        >
            {step === 'credentials' ? (
                <>
                    <div className="mb-7">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-(--sj-text)">
                            Hospital Admin Login
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Use your registered hospital administrator account
                            to access the emergency operations portal.
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-1">
                        <button
                            type="button"
                            onClick={() =>
                                handleMethodChange(LOGIN_METHODS.EMAIL)
                            }
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${loginMethod === LOGIN_METHODS.EMAIL
                                ? 'bg-(--sj-surface) text-(--sj-text) shadow-sm'
                                : 'text-(--sj-text-soft) hover:text-(--sj-text)'
                                }`}
                        >
                            <Mail className="h-4 w-4" />
                            Email
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleMethodChange(LOGIN_METHODS.MOBILE)
                            }
                            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${loginMethod === LOGIN_METHODS.MOBILE
                                ? 'bg-(--sj-surface) text-(--sj-text) shadow-sm'
                                : 'text-(--sj-text-soft) hover:text-(--sj-text)'
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                            Mobile
                        </button>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label
                                htmlFor="identifier"
                                className="sj-label"
                            >
                                {identifierLabel}
                            </label>

                            <div className="relative">
                                {loginMethod === LOGIN_METHODS.EMAIL ? (
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                ) : (
                                    <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />
                                )}

                                <input
                                    id="identifier"
                                    name="identifier"
                                    type={
                                        loginMethod === LOGIN_METHODS.EMAIL
                                            ? 'email'
                                            : 'tel'
                                    }
                                    value={formData.identifier}
                                    onChange={handleInputChange}
                                    placeholder={identifierPlaceholder}
                                    autoComplete={
                                        loginMethod === LOGIN_METHODS.EMAIL
                                            ? 'email'
                                            : 'tel'
                                    }
                                    className="sj-input h-12 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="sj-label mb-0"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            'Password recovery will be connected to the backend authentication service.',
                                        )
                                    }
                                    className="text-xs font-bold text-(--sj-primary) transition hover:text-(--sj-primary-dark)"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword ? 'text' : 'password'
                                    }
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="sj-input h-12 pl-10 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                                {error}
                            </div>
                        ) : null}

                        {successMessage ? (
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{successMessage}</span>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="sj-ai-button h-12 w-full px-5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                'Sending OTP...'
                            ) : (
                                <>
                                    Continue with OTP
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-(--sj-border)" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-(--sj-text-muted)">
                            Or
                        </span>
                        <div className="h-px flex-1 bg-(--sj-border)" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text) transition hover:border-(--sj-primary)/40 hover:bg-(--sj-surface-2)"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-black shadow-sm ring-1 ring-black/5">
                            G
                        </span>
                        Continue with Google
                    </button>

                    <div className="mt-7 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text)">
                                    Authorized access
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Hospital administration accounts are
                                    intended for authorized hospital
                                    personnel only.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 text-center">
                        <p className="text-sm text-(--sj-text-soft)">
                            Don't have a hospital admin account?
                        </p>

                        <Link
                            to="/register/hospital-admin"
                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-black text-(--sj-primary) transition hover:text-(--sj-primary-dark)"
                        >
                            Register your hospital
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-(--sj-border) pt-6 text-xs font-bold text-(--sj-text-muted)">
                        <Link
                            to="/login/patient"
                            className="transition hover:text-(--sj-text)"
                        >
                            Patient login
                        </Link>

                        <span className="h-1 w-1 rounded-full bg-(--sj-border)" />

                        <Link
                            to="/login/paramedic"
                            className="transition hover:text-(--sj-text)"
                        >
                            Paramedic login
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-7">
                        <button
                            type="button"
                            onClick={handleBackToCredentials}
                            className="mb-6 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            ← Change login details
                        </button>

                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-(--sj-text)">
                            Verify your login
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Enter the 6-digit OTP sent to your{' '}
                            {loginMethod === LOGIN_METHODS.EMAIL
                                ? 'registered email address'
                                : 'registered mobile number'}
                            .
                        </p>
                    </div>

                    <div className="mb-6 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            {loginMethod === LOGIN_METHODS.EMAIL ? (
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />
                            ) : (
                                <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />
                            )}

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    OTP sent to
                                </p>

                                <p className="mt-1 truncate text-sm font-bold text-(--sj-text)">
                                    {formData.identifier}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                            <label
                                htmlFor="otp"
                                className="sj-label"
                            >
                                Verification OTP
                            </label>

                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={formData.otp}
                                onChange={(event) => {
                                    const value = event.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6);

                                    setFormData((current) => ({
                                        ...current,
                                        otp: value,
                                    }));

                                    setError('');
                                    setSuccessMessage('');
                                }}
                                placeholder="Enter 6-digit OTP"
                                autoComplete="one-time-code"
                                className="sj-input h-14 text-center text-lg font-black tracking-[0.35em]"
                            />
                        </div>

                        {error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                                {error}
                            </div>
                        ) : null}

                        {successMessage ? (
                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{successMessage}</span>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                formData.otp.length !== 6
                            }
                            className="sj-ai-button h-12 w-full px-5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                'Verifying...'
                            ) : (
                                <>
                                    Verify & Sign In
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-(--sj-text-soft)">
                            Didn't receive the OTP?
                        </p>

                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0}
                            className="mt-2 text-sm font-black text-(--sj-primary) transition hover:text-(--sj-primary-dark) disabled:cursor-not-allowed disabled:text-(--sj-text-muted)"
                        >
                            {resendCooldown > 0
                                ? `Resend OTP in ${resendCooldown}s`
                                : 'Resend OTP'}
                        </button>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-(--sj-primary)" />
                                <span className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text)">
                                    Hospital portal
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                                Manage emergency operations from one place.
                            </p>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-(--sj-primary)" />
                                <span className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text)">
                                    Secure login
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-(--sj-text-soft)">
                                OTP verification is required for sign-in.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </AuthLayout>
    );
}

export default HospitalAdminLogin;