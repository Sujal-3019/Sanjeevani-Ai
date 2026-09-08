import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    LockKeyhole,
    MessageSquareText,
    Phone,
    RefreshCw,
    ShieldCheck,
    Smartphone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 30;
const DEMO_OTP = '123456';

function isValidIndianMobile(value) {
    return /^[6-9]\d{9}$/.test(value);
}

function maskMobileNumber(value) {
    if (value.length !== 10) {
        return value;
    }

    return `+91 ${value.slice(0, 2)}•••••${value.slice(-3)}`;
}

export default function ParamedicLogin() {
    const navigate = useNavigate();

    const [step, setStep] = useState('mobile');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const otpInputRefs = useRef([]);

    useEffect(() => {
        if (resendTimer <= 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setResendTimer((current) => {
                if (current <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [resendTimer]);

    useEffect(() => {
        if (step === 'otp') {
            window.setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        }
    }, [step]);

    const handleMobileChange = (event) => {
        const digitsOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10);

        setMobile(digitsOnly);
        setError('');
        setInfoMessage('');
    };

    const handleOtpChange = (index, event) => {
        const value = event.target.value.replace(/\D/g, '');

        if (!value) {
            const nextOtp = otp.split('');
            nextOtp[index] = '';

            setOtp(nextOtp.join(''));
            setError('');
            return;
        }

        const digit = value.slice(-1);
        const nextOtp = otp.padEnd(OTP_LENGTH, '').split('');

        nextOtp[index] = digit;

        const updatedOtp = nextOtp
            .join('')
            .slice(0, OTP_LENGTH);

        setOtp(updatedOtp);
        setError('');

        if (index < OTP_LENGTH - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, event) => {
        if (
            event.key === 'Backspace' &&
            !otp[index] &&
            index > 0
        ) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (event) => {
        event.preventDefault();

        const pastedOtp = event.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, OTP_LENGTH);

        if (!pastedOtp) {
            return;
        }

        setOtp(pastedOtp);
        setError('');

        const nextIndex = Math.min(
            pastedOtp.length,
            OTP_LENGTH - 1,
        );

        otpInputRefs.current[nextIndex]?.focus();
    };

    const handleSendOtp = (event) => {
        event.preventDefault();

        if (mobile.length !== 10) {
            setError(
                'Please enter a complete 10-digit mobile number.',
            );
            return;
        }

        if (!isValidIndianMobile(mobile)) {
            setError(
                'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.',
            );
            return;
        }

        setError('');
        setInfoMessage('');
        setIsLoading(true);

        window.setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
            setOtp('');
            setResendTimer(OTP_RESEND_SECONDS);

            setInfoMessage(
                `OTP sent to ${maskMobileNumber(mobile)}.`,
            );
        }, 900);
    };

    const handleVerifyOtp = (event) => {
        event.preventDefault();

        if (otp.length !== OTP_LENGTH) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }

        setError('');
        setInfoMessage('');
        setIsLoading(true);

        window.setTimeout(() => {
            if (otp !== DEMO_OTP) {
                setIsLoading(false);
                setError(
                    'Invalid OTP. For this frontend demo, use 123456.',
                );
                return;
            }

            localStorage.setItem(
                'sanjeevani_auth',
                JSON.stringify({
                    isAuthenticated: true,
                    role: 'PARAMEDIC',
                    mobile,
                    loginMethod: 'OTP',
                }),
            );

            setIsLoading(false);

            navigate('/dashboard/paramedic');
        }, 900);
    };

    const handleResendOtp = () => {
        if (resendTimer > 0 || isLoading) {
            return;
        }

        setError('');
        setInfoMessage('');
        setIsLoading(true);

        window.setTimeout(() => {
            setIsLoading(false);
            setOtp('');
            setResendTimer(OTP_RESEND_SECONDS);

            setInfoMessage(
                `A new OTP was sent to ${maskMobileNumber(mobile)}.`,
            );

            otpInputRefs.current[0]?.focus();
        }, 800);
    };

    const handleChangeMobile = () => {
        setStep('mobile');
        setOtp('');
        setError('');
        setInfoMessage('');
        setResendTimer(0);
    };

    return (
        <AuthLayout
            eyebrow="Paramedic access"
            title={
                step === 'mobile'
                    ? 'Sign in to your paramedic account'
                    : 'Verify your mobile number'
            }
            description={
                step === 'mobile'
                    ? 'Use the mobile number registered by your hospital to access emergency missions.'
                    : `Enter the 6-digit OTP sent to ${maskMobileNumber(mobile)}.`
            }
        >
            <div className="space-y-6">
                {step === 'mobile' ? (
                    <>
                        <div className="flex items-start gap-3 rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-(--sj-text)">
                                    Authorized paramedic access
                                </p>

                                <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                    Your hospital creates and manages your
                                    Sanjeevani AI paramedic account. No public
                                    registration is available.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSendOtp}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="paramedic-mobile"
                                    className="sj-label"
                                >
                                    Registered mobile number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--sj-text-muted)"
                                    />

                                    <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm font-medium text-(--sj-text-soft)">
                                        +91
                                    </span>

                                    <input
                                        id="paramedic-mobile"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        value={mobile}
                                        onChange={handleMobileChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        disabled={isLoading}
                                        className="sj-input pl-20 h-10"
                                    />
                                </div>

                                <p className="mt-2 text-xs leading-5 text-(--sj-text-muted)">
                                    Enter your registered 10-digit mobile
                                    number without +91.
                                </p>
                            </div>

                            {error ? (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquareText size={18} />
                                        Send OTP
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="border-t border-(--sj-border) pt-5">
                            <div className="flex items-start gap-3">
                                <Smartphone
                                    size={18}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <div>
                                    <p className="text-sm font-medium text-(--sj-text)">
                                        New paramedic?
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                        Your hospital administrator must create
                                        your account before you can sign in.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/login/hospital-admin"
                            className="flex items-center justify-center gap-2 text-sm font-semibold text-(--sj-primary) transition hover:text-(--sj-primary-dark)"
                        >
                            Hospital administrator login
                            <ArrowLeft
                                size={15}
                                className="rotate-180"
                            />
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--sj-primary-soft) text-(--sj-primary)">
                                    <Smartphone size={20} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                        OTP sent to
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-(--sj-text)">
                                        {maskMobileNumber(mobile)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleChangeMobile}
                                    disabled={isLoading}
                                    className="ml-auto shrink-0 text-xs font-semibold text-(--sj-primary) hover:text-(--sj-primary-dark)"
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        {infoMessage ? (
                            <div className="flex items-start gap-3 rounded-xl border border-(--sj-primary)/25 bg-(--sj-primary-soft) px-4 py-3 text-sm text-(--sj-text)">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0 text-(--sj-primary)"
                                />

                                <span>{infoMessage}</span>
                            </div>
                        ) : null}

                        <form
                            onSubmit={handleVerifyOtp}
                            className="space-y-5"
                        >
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="sj-label mb-0">
                                        Enter OTP
                                    </label>

                                    <span className="text-xs font-medium text-(--sj-text-muted)">
                                        6 digits
                                    </span>
                                </div>

                                <div className="flex gap-2 sm:gap-3">
                                    {Array.from(
                                        { length: OTP_LENGTH },
                                        (_, index) => (
                                            <input
                                                key={index}
                                                ref={(element) => {
                                                    otpInputRefs.current[
                                                        index
                                                    ] = element;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete={
                                                    index === 0
                                                        ? 'one-time-code'
                                                        : 'off'
                                                }
                                                maxLength={1}
                                                value={otp[index] || ''}
                                                onChange={(event) =>
                                                    handleOtpChange(
                                                        index,
                                                        event,
                                                    )
                                                }
                                                onKeyDown={(event) =>
                                                    handleOtpKeyDown(
                                                        index,
                                                        event,
                                                    )
                                                }
                                                onPaste={
                                                    index === 0
                                                        ? handleOtpPaste
                                                        : undefined
                                                }
                                                disabled={isLoading}
                                                aria-label={`OTP digit ${
                                                    index + 1
                                                }`}
                                                className="h-13 w-full rounded-xl border border-(--sj-border) bg-(--sj-surface) text-center text-lg font-bold text-(--sj-text) outline-none transition focus:border-(--sj-primary) focus:ring-4 focus:ring-(--sj-primary)/10 disabled:cursor-not-allowed disabled:opacity-60"
                                            />
                                        ),
                                    )}
                                </div>
                            </div>

                            {error ? (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    otp.length !== OTP_LENGTH
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--sj-primary) px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole size={18} />
                                        Verify & Continue
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex flex-col items-center gap-3">
                            {resendTimer > 0 ? (
                                <div className="flex items-center gap-2 text-xs text-(--sj-text-muted)">
                                    <Clock3 size={15} />
                                    Resend OTP in {resendTimer}s
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 text-sm font-semibold text-(--sj-primary) transition hover:text-(--sj-primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <RefreshCw size={15} />
                                    Resend OTP
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleChangeMobile}
                                disabled={isLoading}
                                className="text-xs font-medium text-(--sj-text-soft) underline-offset-4 hover:text-(--sj-text) hover:underline"
                            >
                                Use a different mobile number
                            </button>
                        </div>

                        <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4 py-3">
                            <p className="text-center text-xs leading-5 text-(--sj-text-muted)">
                                For this frontend demo, use OTP{' '}
                                <span className="font-bold text-(--sj-text)">
                                    123456
                                </span>
                                .
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-(--sj-text-muted)">
                <ShieldCheck size={14} />
                <span>
                    Secure access for authorized emergency personnel
                </span>
            </div>
        </AuthLayout>
    );
}