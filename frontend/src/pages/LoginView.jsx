import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';
import logo from '../assets/logo.png';

export default function LoginView({ isRegistration = false }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [authMethod, setAuthMethod] = useState('gmail');

  const titleConfig = {
    patient: { title: "Patient Portal", sub: "Signin to access your patient dashboard", reg: "Patient Registration", regSub: "Create a new patient account" },
    hospital: { title: "Hospital Portal", sub: "Signin to access your hospital dashboard", reg: "Hospital Registration", regSub: "Create a new hospital account" },
    admin: { title: "Admin Portal", sub: "Signin to Manage your organization", reg: "Admin Registration", regSub: "Create a new admin account" }
  };

  const config = titleConfig[role] || titleConfig['patient'];

  return (
    <div className="min-h-screen flex font-sans bg-[#fafcfa]">
      {/* Left Branding Panel */}
      <div className="w-1/2 sanjeevani-gradient-bg flex flex-col items-center justify-center p-12 text-center relative  md:flex">
        <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl mb-8 w-52.5 h-52.5 flex items-center justify-center relative z-10">
          <img src={logo} alt="Sanjeevani AI Logo" className="w-full h-full object-contain drop-shadow-sm p-2" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white z-10 leading-none">
          Sanjeevani <span className="text-[#6ee7b7] font-semibold">AI</span>
        </h1>
        <p className="max-w-115 text-emerald-50/95 text-[15px] leading-relaxed z-10 font-medium mt-2">
          Streamline emergency responses, manage hospital triage, and empower your patients with intelligent Ayurvedic and AI-driven healthcare solutions.
        </p>
      </div>

      {/* Right Interaction Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white">
        <div className="max-w-105 w-full mt-10">
          
          <button onClick={() => navigate('/')} className="absolute top-10 left-8 lg:left-12 flex items-center text-[13px] font-medium text-slate-400 hover:text-slate-600">
            <ArrowLeft size={16} className="mr-2" /> Back to portals
          </button>

          {/* Dynamic Header */}
          <div className="mb-6">
            <h2 className={`${isRegistration ? 'text-[2.25rem] font-black text-[#0f172a]' : 'text-[1.75rem] text-slate-800'} mb-1 tracking-tight`}>
              {isRegistration ? config.reg : config.title}
            </h2>
            <p className="text-[15px] text-slate-500 font-medium">
              {isRegistration ? config.regSub : config.sub}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate(`/dashboard/${role}`); }}>
            
            {/* ========================================== */}
            {/* REGISTRATION LAYOUT                        */}
            {/* ========================================== */}
            {isRegistration ? (
              <div className="border border-gray-100 rounded-3xl p-6 space-y-4">
                <input type="text" placeholder="Enter Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-slate-700 outline-none focus:border-emerald-500 transition-colors" required />
                <input type="tel" placeholder="Enter Mobile Number" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-slate-700 outline-none focus:border-emerald-500 transition-colors" required />
                
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="Generate Password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-slate-700 outline-none focus:border-emerald-500 transition-colors" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-center space-x-6 py-2 text-[14px] text-slate-700">
                    <span className="font-medium text-slate-600">Verify by OTP</span>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" checked={authMethod === 'gmail'} onChange={() => setAuthMethod('gmail')} className="accent-blue-600 mr-2 w-4 h-4" /> via Gmail
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" checked={authMethod === 'phone'} onChange={() => setAuthMethod('phone')} className="accent-blue-600 mr-2 w-4 h-4" /> via Mobile Number
                    </label>
                  </div>
                  <div className="relative mt-1">
                    <input type="text" placeholder="Enter OTP" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-slate-700 outline-none focus:border-emerald-500 transition-colors" />
                    <Clock size={16} className="absolute right-4 top-3.5 text-slate-400" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-[#047857] text-white font-semibold text-[15px] transition-colors">
                  Register
                </button>
                
                <Link to={`/login/${role}`} className="w-full flex justify-center items-center py-3.5 rounded-xl border border-gray-200 bg-white text-slate-600 font-semibold text-[15px] hover:bg-slate-50 mt-4 transition-colors">
                  Login
                </Link>
              </div>
            ) : (
            
            /* ========================================== */
            /* LOGIN LAYOUT                               */
            /* ========================================== */
              <div className="space-y-5">
                
                {/* Email Textbox - Now a standalone detached box */}
                <div className="auth-glow-box relative flex items-center">
                  <input type="email" placeholder="Enter Email" className="w-full px-5 py-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none bg-transparent rounded-xl" required />
                </div>
                
                {/* Password Textbox - Now a standalone detached box */}
                <div className="auth-glow-box relative flex items-center">
                  <input type={showPass ? "text" : "password"} placeholder="Enter Password" className="w-full px-5 py-4 pr-12 text-[14px] text-slate-800 placeholder-slate-400 outline-none bg-transparent rounded-xl" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center my-6">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="px-4 text-[12px] font-medium text-slate-500">OR</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Mobile & Verify Attached Group */}
                <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <input type="tel" placeholder="Mobile Number" className="flex-1 px-4 py-3 text-[14px] outline-none text-slate-700" />
                  <button type="button" className="px-6 bg-[#047857] text-white font-medium text-[14px]">Verify</button>
                </div>

                {/* OTP Input */}
                <div className="pt-1">
                  <div className="relative flex items-center">
                    <input type="text" placeholder="Enter OTP" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] outline-none text-slate-700 focus:border-emerald-500" />
                    <Clock size={16} className="absolute right-4 text-slate-400" />
                  </div>
                </div>

                {/* Primary Login Buttons */}
                <div className="pt-3 space-y-3">
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-[#047857] text-white font-semibold text-[15px]">
                    Sign in
                  </button>
                  
                  <Link to={`/register/${role}`} className="w-full flex justify-center items-center py-3.5 rounded-xl border border-gray-300 bg-white text-[#047857] font-semibold text-[15px] hover:bg-slate-50 transition-colors">
                    Sign Up as New {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Link>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <p className="absolute bottom-6 text-center text-[12px] text-slate-500 font-medium">
          © 2026 Sanjeevani AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}