import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header({ portalTitle, userName, onProfileClick }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[22px] md:text-[24px] font-bold text-[#0f172a] tracking-tight leading-tight">
          {portalTitle}
        </h1>
        <p className="text-[14px] font-medium text-slate-500 mt-1">
          Welcome, {userName}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#11b578] hover:border-[#11b578] hover:bg-emerald-50 hover:shadow-md transition-all duration-300">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_0_2px_white]"></span>
        </button>
        
        {/* Active User Profile Button (Triggers Modal) */}
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#11b578] hover:border-[#11b578] hover:bg-emerald-50 hover:shadow-md transition-all duration-300 cursor-pointer"
          title="Edit Profile"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}