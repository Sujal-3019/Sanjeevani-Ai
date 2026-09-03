import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, X, Save, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
  navigationItems,
  portalTitle,
  userName,
  userProfileData,
}) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: userProfileData?.name || userName || 'User',
    email: userProfileData?.email || '',
    phone: userProfileData?.phone || '',
    role: userProfileData?.role || '',
  });

  useEffect(() => {
    if (userProfileData) {
      setUserProfile({
        name: userProfileData.name || '',
        email: userProfileData.email || '',
        phone: userProfileData.phone || '',
        role: userProfileData.role || '',
      });
    }
  }, [userProfileData]);

  // Prevent background scrolling while mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  const updateProfileField = (field, value) => {
    setUserProfile((previousProfile) => ({
      ...previousProfile,
      [field]: value,
    }));
  };

  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <Sidebar
        navigationItems={navigationItems}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      {/* Main Application Area */}
      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        <main className="mx-auto flex w-full max-w-375 min-w-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
          {/* Mobile Top Bar */}
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={openMobileSidebar}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-[#11b578] hover:bg-emerald-50 hover:text-[#11b578] active:scale-95"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                Sanjeevani{' '}
                <span className="text-[#11b578]">AI</span>
              </p>

              <p className="truncate text-[11px] font-medium text-slate-400">
                Emergency Healthcare Coordination
              </p>
            </div>
          </div>

          {/* Header */}
          <Header
            portalTitle={portalTitle}
            userName={userName}
            onProfileClick={() => setIsProfileModalOpen(true)}
          />

          {/* Page Content */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <div className="my-auto flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:rounded-3xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 bg-[#042219] px-4 py-4 text-white sm:px-6 sm:py-5 lg:px-8 lg:py-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#11b578]/30 bg-[#11b578]/20 text-[#6ee7b7] sm:h-10 sm:w-10">
                  <User size={18} className="sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0">
                  <h3
                    id="profile-modal-title"
                    className="truncate text-sm font-bold sm:text-[16px]"
                  >
                    User Account Profile
                  </h3>

                  <p className="mt-0.5 truncate text-[10px] text-[#6aa292] sm:text-[12px]">
                    Manage your credentials and system access
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Close profile"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleProfileUpdate}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto"
            >
              <div className="space-y-4 p-4 sm:space-y-5 sm:p-6 lg:p-8">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-bold text-slate-700 sm:text-[13px]"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={userProfile.name}
                    onChange={(e) =>
                      updateProfileField('name', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#11b578] focus:bg-white focus:ring-4 focus:ring-[#11b578]/10 sm:px-4"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-xs font-bold text-slate-700 sm:text-[13px]"
                  >
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) =>
                      updateProfileField('email', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#11b578] focus:bg-white focus:ring-4 focus:ring-[#11b578]/10 sm:px-4"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 block text-xs font-bold text-slate-700 sm:text-[13px]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) =>
                      updateProfileField('phone', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#11b578] focus:bg-white focus:ring-4 focus:ring-[#11b578]/10 sm:px-4"
                  />
                </div>

                {/* Access Role */}
                <div>
                  <label
                    htmlFor="profile-role"
                    className="mb-2 block text-xs font-bold text-slate-700 sm:text-[13px]"
                  >
                    Access Role
                  </label>

                  <input
                    id="profile-role"
                    type="text"
                    disabled
                    value={userProfile.role}
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-3 text-sm font-medium text-slate-500 outline-none sm:px-4"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-auto flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:justify-end sm:gap-3 sm:bg-white sm:p-6 lg:px-8 lg:pb-8">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 active:scale-[0.98] sm:w-auto sm:px-6"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-xl bg-[#11b578] px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0ea569] hover:shadow-lg active:scale-[0.98] sm:w-auto sm:px-6"
                >
                  <Save size={16} className="mr-2 shrink-0" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}