import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';
import logo from '../assets/logo.png';

export default function LoginView() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const titleConfig = {
    patient: {
      title: 'Patient Portal',
      sub: 'Sign in to continue to your patient dashboard',
    },
    hospital: {
      title: 'Hospital Portal',
      sub: 'Sign in to continue to your hospital dashboard',
    },
  };

  // Only patient and hospital login are allowed.
  if (!titleConfig[role]) {
    navigate('/');
    return null;
  }

  const config = titleConfig[role];

  const roleName =
    role.charAt(0).toUpperCase() + role.slice(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary navigation.
    // Real authentication will be connected to FastAPI later.
    navigate(`/dashboard/${role}`);
  };

  const handleGoogleLogin = () => {
    // Google authentication will be connected later.
    console.log(`Google login selected for ${role}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#fafcfa] font-sans">
      {/* ========================================== */}
      {/* LEFT BRANDING PANEL                       */}
      {/* ========================================== */}
      <div className="sanjeevani-gradient-bg relative hidden w-1/2 flex-col items-center justify-center p-12 text-center md:flex">
        <div className="relative z-10 mb-8 flex h-52.5 w-52.5 items-center justify-center rounded-[2.5rem] bg-white p-3 shadow-2xl">
          <img
            src={logo}
            alt="Sanjeevani AI Logo"
            className="h-full w-full object-contain p-2 drop-shadow-sm"
          />
        </div>

        <h1 className="z-10 mb-4 text-5xl font-extrabold leading-none tracking-tight text-white">
          Sanjeevani{' '}
          <span className="font-semibold text-[#6ee7b7]">
            AI
          </span>
        </h1>

        <p className="z-10 mt-2 max-w-115 text-[15px] font-medium leading-relaxed text-emerald-50/95">
          Streamline emergency responses, manage hospital triage,
          and empower your patients with intelligent Ayurvedic and
          AI-driven healthcare solutions.
        </p>
      </div>

      {/* ========================================== */}
      {/* RIGHT LOGIN PANEL                          */}
      {/* ========================================== */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white px-5 py-8 sm:px-8 md:w-1/2 lg:px-16">
        <div className="w-full max-w-105">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-10 flex items-center text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to portals
          </button>

          {/* Header */}
          <div className="mb-7">
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {roleName} Access
            </div>

            <h2 className="mb-2 text-[1.8rem] font-bold tracking-tight text-slate-900 sm:text-[2rem]">
              Welcome back
            </h2>

            <p className="text-[14px] font-medium leading-relaxed text-slate-500 sm:text-[15px]">
              {config.sub}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* ========================================== */}
              {/* GOOGLE LOGIN                               */}
              {/* ========================================== */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 text-[14px] font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]"
              >
                {/* Google Icon */}
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.86c2.63 0 4.84-.87 6.45-2.4l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.74 9.74 0 0 0 12 21.86Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.92A5.86 5.86 0 0 1 6.23 12c0-.67.12-1.32.31-1.92V7.57H3.3A9.85 9.85 0 0 0 2.26 12c0 1.6.38 3.11 1.04 4.43l3.24-2.51Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.05c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.11 14.63 2.14 12 2.14a9.74 9.74 0 0 0-8.7 5.43l3.24 2.51C7.31 7.77 9.46 6.05 12 6.05Z"
                  />
                </svg>

                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* ========================================== */}
              {/* EMAIL                                      */}
              {/* ========================================== */}
              <div className="auth-glow-box relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full rounded-xl bg-transparent px-5 py-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
                  required
                />
              </div>

              {/* ========================================== */}
              {/* PASSWORD                                   */}
              {/* ========================================== */}
              <div className="auth-glow-box relative flex items-center">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter Password"
                  className="w-full rounded-xl bg-transparent px-5 py-4 pr-12 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={
                    showPass
                      ? 'Hide password'
                      : 'Show password'
                  }
                  className="absolute right-4 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[12px] font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  Forgot password?
                </button>
              </div>

              {/* ========================================== */}
              {/* OR MOBILE OTP                              */}
              {/* ========================================== */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  or use mobile OTP
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Mobile + Verify */}
              <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white transition-colors focus-within:border-emerald-500">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="min-w-0 flex-1 px-4 py-3 text-[14px] text-slate-700 outline-none"
                />

                <button
                  type="button"
                  className="shrink-0 bg-[#047857] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#036b4d] sm:px-6"
                >
                  Verify
                </button>
              </div>

              {/* OTP */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-[14px] text-slate-700 outline-none transition-colors focus:border-emerald-500"
                />

                <Clock
                  size={16}
                  className="absolute right-4 top-3.5 text-slate-400"
                />
              </div>

              {/* ========================================== */}
              {/* SIGN IN                                    */}
              {/* ========================================== */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#047857] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#036b4d] hover:shadow-md active:scale-[0.99]"
              >
                Sign in
              </button>

              {/* ========================================== */}
              {/* REGISTER LINK                              */}
              {/* ========================================== */}
              <div className="border-t border-slate-100 pt-5 text-center">
                <p className="text-[13px] text-slate-500">
                  Don't have an account?
                </p>

                <Link
                  to={`/register/${role}`}
                  className="mt-2 mb-3 flex justify-center mx-auto font-semibold  border-black text-[#f9fcfb] bg-[#11946f] transition-colors hover:text-[#c5c5c5] w-60 border rounded-2xl"
                >
                  Create a new {roleName.toLowerCase()} account
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Copyright */}
        <p className="absolute bottom-4 px-4 text-center text-[11px] font-medium text-slate-500 sm:bottom-6 sm:text-[12px]">
          © 2026 Sanjeevani AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}