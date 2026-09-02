import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User, X, Save } from 'lucide-react';

export default function DashboardLayout({ children, navigationItems, portalTitle, userName, userProfileData }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: userProfileData?.name || userName || "User",
    email: userProfileData?.email || "",
    phone: userProfileData?.phone || "",
    role: userProfileData?.role || ""
  });

  useEffect(() => {
    if (userProfileData) {
      setUserProfile({
        name: userProfileData.name,
        email: userProfileData.email,
        phone: userProfileData.phone,
        role: userProfileData.role
      });
    }
  }, [userProfileData]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#f8fafc]">
      <Sidebar navigationItems={navigationItems} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <main className="p-8 flex-1 max-w-[1500px] w-full mx-auto overflow-y-auto">
          <Header 
            portalTitle={portalTitle} 
            userName={userName} 
            onProfileClick={() => setIsProfileModalOpen(true)} 
          />
          {children}
        </main>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
            <div className="px-8 py-6 bg-[#042219] text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#11b578]/20 flex items-center justify-center border border-[#11b578]/30 text-[#6ee7b7]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[16px]">User Account Profile</h3>
                  <p className="text-[12px] text-[#6aa292]">Manage your credentials and system access</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="p-8 space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Full Name</label>
                <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone Number</label>
                <input type="text" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Access Role</label>
                <input type="text" disabled value={userProfile.role} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-[14px] text-slate-500 font-medium cursor-not-allowed" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                <button type="submit" className="px-7 py-3 bg-[#11b578] hover:bg-[#0ea569] text-white rounded-xl text-[14px] font-bold shadow-md transition-all flex items-center"><Save size={16} className="mr-2" /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}