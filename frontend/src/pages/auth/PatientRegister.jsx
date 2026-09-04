import React from 'react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Mail,
    MessageSquare,
    Phone,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

function PatientRegister() {
    const navigate = useNavigate();

    const [step, setStep] = React.useState('details');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [otp, setOtp] = React.useState('');

    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
    });

    const updateField = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return 'Please enter your full name.';
        }

        if (!formData.email.trim()) {
            return 'Please enter your email address.';
        }

        if (!formData.mobile.trim()) {
            return 'Please enter your mobile number.';
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

    const handleSubmit = (event) => {
        event.preventDefault();

        setError('');

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        /*
         * Temporary frontend-only registration flow.
         *
         * Later this will call the FastAPI backend:
         * 1. Validate name, email, mobile and password.
         * 2. Hash the password on the backend.
         * 3. Create the user account.
         * 4. Send mobile OTP.
         * 5. Verify the OTP.
         * 6. Activate the patient account.
         */

        setTimeout(() => {
            setLoading(false);
            setStep('otp');
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
         *
         * Later this will call the FastAPI OTP verification endpoint.
         */

        setTimeout(() => {
            setLoading(false);

            /*
             * For now we send the user to the patient dashboard.
             *
             * Later this should redirect to the first-login
             * profile completion page before full dashboard access.
             */
            navigate('/register/patient/profile');
        }, 700);
    };

    return (
        <AuthLayout
            eyebrow="Patient registration"
            title={
                step === 'otp'
                    ? 'Verify your mobile number.'
                    : 'Create your patient account.'
            }
            description={
                step === 'otp'
                    ? 'Enter the verification code sent to your mobile number to complete registration.'
                    : 'Create your Sanjeevani AI account in a few simple steps. You can complete your emergency profile after signup.'
            }
        >
            {step === 'details' ? (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <h2 className="mt-5 text-2xl font-black tracking-tight text-(--sj-text)">
                            Create your account
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Start with your basic account information. We'll
                            collect additional emergency details after signup.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full name */}
                        <div>
                            <label
                                htmlFor="patient-full-name"
                                className="sj-label"
                            >
                                Full name *
                            </label>

                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="patient-full-name"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(event) =>
                                        updateField(
                                            'fullName',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className="sj-input h-12 pl-11 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="patient-register-email"
                                className="sj-label"
                            >
                                Email address *
                            </label>

                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="patient-register-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(event) =>
                                        updateField(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="sj-input h-12 pl-11 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <label
                                htmlFor="patient-register-mobile"
                                className="sj-label"
                            >
                                Mobile number *
                            </label>

                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--sj-text-muted)" />

                                <input
                                    id="patient-register-mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(event) =>
                                        updateField(
                                            'mobile',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="+91 98765 43210"
                                    autoComplete="tel"
                                    className="sj-input h-12 pl-11 pr-4 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="patient-register-password"
                                className="sj-label"
                            >
                                Password *
                            </label>

                            <div className="relative">
                                <input
                                    id="patient-register-password"
                                    type={
                                        showPassword ? 'text' : 'password'
                                    }
                                    value={formData.password}
                                    onChange={(event) =>
                                        updateField(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    className="sj-input h-12 px-4 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value,
                                        )
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

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="patient-register-confirm-password"
                                className="sj-label"
                            >
                                Confirm password *
                            </label>

                            <div className="relative">
                                <input
                                    id="patient-register-confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.confirmPassword}
                                    onChange={(event) =>
                                        updateField(
                                            'confirmPassword',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    className="sj-input h-12 px-4 pr-12 text-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value,
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-(--sj-text-muted) hover:text-(--sj-text)"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4.5 w-4.5" />
                                    ) : (
                                        <Eye className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Information note */}
                        <div className="flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                            <p className="text-xs leading-5 text-(--sj-text-soft)">
                                Your emergency profile, medical information,
                                and emergency contacts can be completed after
                                your account is created.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium leading-6 text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 text-sm font-bold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                'Creating account...'
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-7 text-center text-sm text-(--sj-text-soft)">
                        Already have an account?{' '}
                        <Link
                            to="/login/patient"
                            className="font-bold text-(--sj-primary) hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    {/* OTP header */}
                    <div className="mb-7">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <h2 className="mt-5 text-2xl font-black tracking-tight text-(--sj-text)">
                            Verify your mobile
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            We sent a 6-digit verification code to your mobile
                            number.
                        </p>

                        <div className="mt-4 rounded-xl bg-(--sj-surface-2) px-4 py-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-(--sj-text-muted)">
                                Verification number
                            </p>

                            <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                {formData.mobile}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                            <label
                                htmlFor="patient-register-otp"
                                className="sj-label"
                            >
                                Verification code
                            </label>

                            <input
                                id="patient-register-otp"
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

                    {/* OTP actions */}
                    <div className="mt-6 flex items-center justify-between text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('details');
                                setOtp('');
                                setError('');
                            }}
                            className="inline-flex items-center gap-1 font-bold text-(--sj-text-soft) hover:text-(--sj-text)"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Edit details
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

                    {/* Verification note */}
                    <div className="mt-7 flex items-start gap-3 rounded-xl bg-(--sj-primary)/5 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                        <p className="text-xs leading-5 text-(--sj-text-soft)">
                            Mobile verification helps protect your account and
                            ensures Sanjeevani AI can securely contact you during
                            emergencies.
                        </p>
                    </div>
                </>
            )}
        </AuthLayout>
    );
}

export default PatientRegister;
