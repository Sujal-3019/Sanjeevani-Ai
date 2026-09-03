import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header({
  portalTitle,
  userName,
  onProfileClick,
}) {
  return (
    <header className="mb-5 flex w-full min-w-0 items-center justify-between gap-3 sm:mb-6 lg:mb-8">
      {/* Portal Information */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[22px] md:text-[24px]">
          {portalTitle}
        </h1>

        <p className="mt-1 truncate text-xs font-medium text-slate-500 sm:text-[14px]">
          Welcome, {userName}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:border-[#11b578] hover:bg-emerald-50 hover:text-[#11b578] hover:shadow-md active:scale-95 sm:h-10 sm:w-10"
        >
          <Bell size={17} className="sm:h-4.5 sm:w-4.5" />

          {/* Notification Indicator */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_0_2px_white] sm:right-2.5 sm:top-2.5" />
        </button>

        {/* User Profile */}
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="Edit profile"
          title="Edit Profile"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:border-[#11b578] hover:bg-emerald-50 hover:text-[#11b578] hover:shadow-md active:scale-95 sm:h-10 sm:w-10"
        >
          <User size={17} className="sm:h-4.5 sm:w-4.5" />
        </button>
      </div>
    </header>
  );
}
