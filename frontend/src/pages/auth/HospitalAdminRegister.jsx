import React from 'react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Mail,
    MessageSquare,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const INITIAL_FORM = {
    adminFullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    otp: '',
};

function HospitalAdminRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState(INITIAL_FORM);
    const [step, setStep] = React.useState('details');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        React.useState(false);

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError('');
        setSuccessMessage('');
    };

    const validateDetails = () => {
        if (!formData.adminFullName.trim()) {
            return 'Please enter the admin full name.';
        }

        if (formData.adminFullName.trim().length < 2) {
            return 'Admin full name must contain at least 2 characters.';
        }

        if (!formData.email.trim()) {
            return 'Please enter the admin email address.';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email.trim())) {
            return 'Please enter a valid email address.';
        }

        if (!formData.mobile.trim()) {
            return 'Please enter the mobile number.';
        }

        const mobileDigits = formData.mobile.replace(/\D/g, '');

        if (mobileDigits.length < 10) {
            return 'Please enter a valid mobile number.';
        }

        if (!formData.password) {
            return 'Please create a password.';
        }

        if (formData.password.length < 8) {
            return 'Password must contain at least 8 characters.';
        }

        if (!formData.confirmPassword) {
            return 'Please confirm your password.';
        }

        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match.';
        }

        return '';
    };

    const handleSendOtp = (event) => {
        event.preventDefault();

        const validationError = validateDetails();

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
                'A verification OTP has been sent to your mobile number.',
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

            navigate('/register/hospital-admin/profile');
        }, 700);
    };

    const handleResendOtp = () => {
        if (resendCooldown > 0) {
            return;
        }

        setError('');
        setSuccessMessage(
            'A new verification OTP has been sent to your mobile number.',
        );
        setResendCooldown(30);
    };

    const handleBackToDetails = () => {
        setStep('details');

        setFormData((current) => ({
            ...current,
            otp: '',
        }));

        setError('');
        setSuccessMessage('');
        setResendCooldown(0);
    };

    const handleGoogleSignup = () => {
        setError(
            'Google signup is not connected yet. It will be enabled when the backend OAuth flow is integrated.',
        );
        setSuccessMessage('');
    };

    return (
        <AuthLayout
            eyebrow="Hospital administration"
            title="Create your hospital admin account."
            description="Create the secure administrator account first. Hospital information and operational details will be completed in the next setup step."
        >
            {step === 'details' ? (
                <>
                    <div className="mb-7">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-(--sj-text)">
                            Create Admin Account
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Start with the details required to create your
                            hospital administrator account.
                        </p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label
                                htmlFor="adminFullName"
                                className="sj-label"
                            >
                                Admin Full name *
                            </label>

                            <div className="relative">
                                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="adminFullName"
                                    name="adminFullName"
                                    type="text"
                                    value={formData.adminFullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter admin full name"
                                    autoComplete="name"
                                    className="sj-input h-12 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="sj-label"
                            >
                                Email *
                            </label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@hospital.com"
                                    autoComplete="email"
                                    className="sj-input h-12 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="mobile"
                                className="sj-label"
                            >
                                Mobile number *
                            </label>

                            <div className="relative">
                                <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    placeholder="+91 98765 43210"
                                    autoComplete="tel"
                                    className="sj-input h-12 pl-10 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="sj-label"
                            >
                                Password *
                            </label>

                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    className="sj-input h-12 pl-10 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) => !current,
                                        )
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

                            <p className="mt-2 text-xs text-(--sj-text-muted)">
                                Use at least 8 characters.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="sj-label"
                            >
                                Confirm password *
                            </label>

                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    className="sj-input h-12 pl-10 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) => !current,
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? 'Hide confirm password'
                                            : 'Show confirm password'
                                    }
                                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-(--sj-text-muted) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                                >
                                    {showConfirmPassword ? (
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
                                'Creating account...'
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
                        onClick={handleGoogleSignup}
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
                                    Two-step account verification
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Your mobile number will be verified with
                                    an OTP before the hospital setup process
                                    begins.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 text-center">
                        <p className="text-sm text-(--sj-text-soft)">
                            Already have a hospital admin account?
                        </p>

                        <Link
                            to="/login/hospital-admin"
                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-black text-(--sj-primary) transition hover:text-(--sj-primary-dark)"
                        >
                            Sign in
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-5 border-t border-(--sj-border) pt-6 text-xs font-bold text-(--sj-text-muted)">
                        <Link
                            to="/login/patient"
                            className="rounded-xl border border-(--sj-border) px-3 py-3 w-50 text-center text-xs font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
                        >
                            Patient login
                        </Link>


                        <Link
                            to="/login/paramedic"
                            className="rounded-xl border border-(--sj-border) px-3 py-3 w-50 text-center text-xs font-bold text-(--sj-text-soft) transition hover:bg-(--sj-surface-2) hover:text-(--sj-text)"
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
                            onClick={handleBackToDetails}
                            className="mb-6 text-sm font-bold text-(--sj-text-soft) transition hover:text-(--sj-text)"
                        >
                            ← Change account details
                        </button>

                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-(--sj-text)">
                            Verify your mobile
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Enter the 6-digit OTP sent to your registered
                            mobile number.
                        </p>
                    </div>

                    <div className="mb-6 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                    OTP sent to
                                </p>

                                <p className="mt-1 truncate text-sm font-bold text-(--sj-text)">
                                    {formData.mobile}
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
                                Mobile OTP *
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
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 " />
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
                                    Verify & Continue
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

                    <div className="mt-7 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text)">
                                    Next step
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    After verification, you'll complete your
                                    hospital profile and submit it for
                                    verification.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AuthLayout>
    );
}

export default HospitalAdminRegister;