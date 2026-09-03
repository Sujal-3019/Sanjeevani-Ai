import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, User, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png'; 

export default function PortalSelection() {
  const navigate = useNavigate();
  
  const portals = [
    // { 
    //   id: 'admin', 
    //   title: 'Admin Portal', 
    //   desc: 'Manage employees, departments, payroll, and system configurations.', 
    //   icon: Shield,
    //   iconColor: 'text-teal-700'
    // },
    { 
      id: 'hospital', 
      title: 'Hospital Portal', 
      desc: 'Update live bed availability, manage incoming triage from the Smart Routing system.', 
      icon: Building,
      iconColor: 'text-cyan-700'
    },
    { 
      id: 'patient', 
      title: 'Patient Portal', 
      desc: 'Access emergency SOS, AI Chatbot, medicine verification, and Ayurvedic care guides.', 
      icon: User,
      iconColor: 'text-emerald-700'
    },
  ];

  return (
    <div className="min-h-screen flex font-sans bg-[#fafcfa]">
      {/* Left Branding Panel */}
      <div className="w-1/2 sanjeevani-gradient-bg flex flex-col items-center justify-center p-12 text-center relative">
        
        <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl mb-8 w-52.5 h-52.5 flex items-center justify-center relative z-10">
          <img 
            src={logo} 
            alt="Sanjeevani AI Logo" 
            className="w-full h-full object-contain drop-shadow-sm p-2"
          />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-white z-10 leading-none">
          Sanjeevani <span className="text-[#6ee7b7] font-semibold">AI</span>
        </h1>
        
        <p className="max-w-115 text-emerald-50/95 text-[15px] leading-relaxed z-10 font-medium mt-2">
          Streamline emergency responses, manage hospital triage, and empower your patients with intelligent Ayurvedic and AI-driven healthcare solutions.
        </p>
      </div>

      {/* Right Interaction Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center p-16 relative bg-white">
        <div className="max-w-125 w-full">
          {/* Deep Navy/Slate heading matching the mockup */}
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 mb-10 text-[15px] font-medium">Select your portal to securely access the System</p>
          
          <div className="space-y-6">
            {portals.map((portal) => {
              const IconComponent = portal.icon;
              return (
                <div 
                  key={portal.id}
                  onClick={() => navigate(`/login/${portal.id}`)}
                  className="glass-portal-card flex items-center p-5 rounded-3xl cursor-pointer group"
                >
                  <div className="flex items-center space-x-5 w-full pl-2">
                    {/* Glowing Icon Box */}
                    <div className="icon-glass-box w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105">
                      <IconComponent size={28} className={portal.iconColor} strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 pr-4">
                      <h4 className="text-[17px] font-bold text-slate-800 mb-1">{portal.title}</h4>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{portal.desc}</p>
                    </div>
                    
                    {/* Emerald Arrow Button */}
                    <div className="w-9 h-9 shrink-0 bg-[#059669] group-hover:bg-[#047857] rounded-full flex items-center justify-center text-white shadow-md transition-colors mr-2">
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <p className="absolute bottom-8 text-center text-[13px] text-slate-400 font-medium">
          © 2026 Sanjeevani AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}