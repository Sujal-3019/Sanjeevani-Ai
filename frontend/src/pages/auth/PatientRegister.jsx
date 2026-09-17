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
import { useAuth } from '../../context/AuthContext';

function PatientRegister() {
    const navigate = useNavigate();

    const {
        registerPatient,
        verifyRegistrationOTP,
    } = useAuth();

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
        const fullName = formData.fullName.trim();
        const email = formData.email.trim();
        const mobileDigits = formData.mobile.replace(/\D/g, '');

        if (!fullName) {
            return 'Please enter your full name.';
        }

        if (fullName.length < 2) {
            return 'Full name must contain at least 2 characters.';
        }

        if (!email) {
            return 'Please enter your email address.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Please enter a valid email address.';
        }

        if (!mobileDigits) {
            return 'Please enter your mobile number.';
        }

        if (mobileDigits.length !== 10) {
            return 'Please enter a complete 10-digit mobile number.';
        }

        if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
            return (
                'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.'
            );
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

    const getMobileDigits = () => {
        return formData.mobile.replace(/\D/g, '').slice(0, 10);
    };

    const handleMobileChange = (event) => {
        const digitsOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10);

        updateField('mobile', digitsOnly);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const mobileDigits = getMobileDigits();

            await registerPatient({
                full_name: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile_number: mobileDigits,
                password: formData.password,
                confirm_password: formData.confirmPassword,
            });

            setOtp('');
            setStep('otp');
        } catch (requestError) {
            console.error(
                'Patient registration failed:',
                requestError,
            );

            setError(
                requestError?.message ||
                'Unable to create your account. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();

        setError('');

        if (otp.length !== 6) {
            setError(
                'Please enter the 6-digit verification code.',
            );
            return;
        }

        setLoading(true);

        try {
            const mobileDigits = getMobileDigits();

            await verifyRegistrationOTP(
                mobileDigits,
                otp,
            );

            navigate(
                '/register/patient/profile',
                {
                    replace: true,
                },
            );
        } catch (requestError) {
            console.error(
                'Patient registration OTP verification failed:',
                requestError,
            );

            setError(
                requestError?.message ||
                'Invalid or expired verification code. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');

        const mobileDigits = getMobileDigits();

        if (mobileDigits.length !== 10) {
            setError(
                'Your mobile number is incomplete. Please edit your details.',
            );
            return;
        }

        setLoading(true);

        try {
            await registerPatient({
                full_name: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile_number: mobileDigits,
                password: formData.password,
                confirm_password: formData.confirmPassword,
            });

            setOtp('');

            setError(
                'A new verification code has been sent to your mobile number.',
            );
        } catch (requestError) {
            console.error(
                'Patient registration OTP resend failed:',
                requestError,
            );

            setError(
                requestError?.message ||
                'Unable to resend the verification code.',
            );
        } finally {
            setLoading(false);
        }
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

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
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
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={formData.mobile}
                                    onChange={handleMobileChange}
                                    placeholder="9876543210"
                                    autoComplete="tel"
                                    className="sj-input h-12 pl-11 pr-4 text-sm"
                                />
                            </div>

                            <p className="mt-2 text-xs text-(--sj-text-muted)">
                                Enter a 10-digit Indian mobile number.
                            </p>
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
                                        showPassword
                                            ? 'text'
                                            : 'password'
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

                    <form
                        onSubmit={handleVerifyOtp}
                        className="space-y-5"
                    >
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
                            disabled={loading}
                            onClick={() => {
                                setStep('details');
                                setOtp('');
                                setError('');
                            }}
                            className="inline-flex items-center gap-1 font-bold text-(--sj-text-soft) hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Edit details
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleResendOtp}
                            className="font-bold text-(--sj-primary) hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? 'Sending...'
                                : 'Resend code'}
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