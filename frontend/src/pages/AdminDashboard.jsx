import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { Shield, Activity, Users, Tag, Bot, Server, Database, Wifi, Search, Edit, Trash2, Save, ToggleRight } from 'lucide-react';
import { dummyAdminDashboardData, adminProfileInfo, categorizedUsersData } from '../assets/asset';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [activeUserTab, setActiveUserTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');

  const [usersData, setUsersData] = useState(categorizedUsersData);
  const currentList = usersData[activeUserTab] || [];
  
  const filteredUsers = currentList.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) || 
      user.phone.includes(query)
    );
  });

  const handleDeleteUser = (id, name) => {
    if(window.confirm(`Are you sure you want to delete account: ${name}?`)) {
      setUsersData(prevData => ({
        ...prevData,
        [activeUserTab]: prevData[activeUserTab].filter(user => user.id !== id)
      }));
    }
  };

  const navItems = [
    { name: 'Admin Dashboard', icon: Shield, isActive: activeTab === 'dashboard', onClick: () => setActiveTab('dashboard') },
    { name: 'System Monitoring', icon: Activity, isActive: activeTab === 'monitoring', onClick: () => setActiveTab('monitoring') },
    { name: 'User Management', icon: Users, isActive: activeTab === 'users', onClick: () => setActiveTab('users') },
    { name: 'Platform Configuration', icon: Tag, isActive: activeTab === 'config', onClick: () => setActiveTab('config') }
  ];

  return (
    <DashboardLayout navigationItems={navItems} portalTitle="Sanjeevani AI Admin Portal" userName={adminProfileInfo.name} userProfileData={adminProfileInfo}>
      <div className="space-y-8 relative pb-16">
        
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="System Mode" value={dummyAdminDashboardData?.systemMode || 'Active'} />
              <StatCard label="Active Hospitals" value={`${dummyAdminDashboardData?.totalHospitals || 0} Nodes`} />
              <StatCard label="Live Emergencies" value={`${dummyAdminDashboardData?.activeEmergencies || 0} Active`} />
              <StatCard label="Total Patients" value={(dummyAdminDashboardData?.totalPatients || 0).toLocaleString()} />
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-[#0f172a] text-[18px]">Geofencing & Coverage Map</h4>
                <div className="flex items-center space-x-5 text-[13px] font-bold text-slate-500">
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#7c3aed] mr-2"></span>GPT API</div>
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></span>EasyOCR</div>
                  <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></span>Geolocation API</div>
                </div>
              </div>
              <div className="h-75 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-[14px] overflow-hidden relative">
                 <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <span className="relative z-10 font-bold tracking-wide">📊 API Usage Distribution Canvas Hook</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <h3 className="text-[20px] font-bold text-[#0f172a] mb-2">Infrastructure Health</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center space-x-5">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Server size={28} /></div>
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">Node.js Backend</p>
                  <p className="text-[20px] font-black text-slate-800">Online <span className="text-[13px] font-bold text-emerald-500 ml-2">99.9% Uptime</span></p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center space-x-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Database size={28} /></div>
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">MongoDB Atlas</p>
                  <p className="text-[20px] font-black text-slate-800">Connected <span className="text-[13px] font-bold text-slate-400 ml-2">12ms Ping</span></p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center space-x-5">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Wifi size={28} /></div>
                <div>
                  <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">Socket.IO Server</p>
                  <p className="text-[20px] font-black text-slate-800">Active <span className="text-[13px] font-bold text-slate-400 ml-2">142 Conn</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden min-h-150">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex space-x-8 text-[15px] font-bold">
                <button onClick={() => { setActiveUserTab('patients'); setSearchQuery(''); }} className={`pb-2 border-b-2 transition-colors ${activeUserTab === 'patients' ? 'text-[#7c3aed] border-[#7c3aed]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>Patients</button>
                <button onClick={() => { setActiveUserTab('hospitals'); setSearchQuery(''); }} className={`pb-2 border-b-2 transition-colors ${activeUserTab === 'hospitals' ? 'text-[#7c3aed] border-[#7c3aed]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>Hospitals</button>
                <button onClick={() => { setActiveUserTab('admins'); setSearchQuery(''); }} className={`pb-2 border-b-2 transition-colors ${activeUserTab === 'admins' ? 'text-[#7c3aed] border-[#7c3aed]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>Admins</button>
              </div>

              <div className="relative w-full md:w-72">
                <input type="text" placeholder={`Search ${activeUserTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 bg-slate-50 transition-all" />
                <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[12px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4 font-bold">{activeUserTab === 'hospitals' ? 'Hospital Name' : 'User Name'}</th>
                    <th className="px-8 py-4 font-bold">Email / Mobile</th>
                    <th className="px-8 py-4 font-bold">Registration Date</th>
                    <th className="px-8 py-4 font-bold">Status</th>
                    <th className="px-8 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5 font-bold text-slate-800">{user.name}</td>
                        <td className="px-8 py-5 text-slate-500">
                          <div className="font-medium text-slate-600">{user.email}</div>
                          <div className="text-[12px] text-slate-400 mt-0.5">{user.phone}</div>
                        </td>
                        <td className="px-8 py-5 text-slate-500 font-medium">{user.date}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-100/50 text-emerald-600 border border-emerald-200/50 uppercase tracking-wider">{user.status}</span>
                        </td>
                        <td className="px-8 py-5 flex justify-end space-x-3 mt-1.5">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Record"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteUser(user.id, user.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Record"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-medium">No {activeUserTab} found matching "{searchQuery}"</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8">
              <h4 className="font-bold text-[#0f172a] text-[18px] mb-6 border-b border-slate-100 pb-3">API Integration Keys</h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">OpenAI API Key</label>
                  <input type="password" value="sk-xxxxxxxxxxxxxxxxxxxxxxxx" readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-600 outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2">Google Maps Key</label>
                  <input type="password" value="AIzaSyBxxxxxxxxxxxxxxxxxxxxx" readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-600 outline-none" />
                </div>
                <button className="flex items-center space-x-2 mt-2 px-6 py-3 bg-[#0f172a] text-white text-[14px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"><Edit size={16} /> <span>Edit Keys</span></button>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-[#0f172a] text-[18px] mb-6 border-b border-slate-100 pb-3">System Preferences</h4>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h5 className="text-[15px] font-bold text-slate-800">Global Maintenance Mode</h5>
                    <p className="text-[13px] text-slate-500 mt-1">Temporarily suspends patient logins.</p>
                  </div>
                  <ToggleRight size={36} className="text-slate-300 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between py-4 border-t border-slate-100">
                  <div>
                    <h5 className="text-[15px] font-bold text-slate-800">Auto-Dispatch Ambulances</h5>
                    <p className="text-[13px] text-slate-500 mt-1">Ping nearest hospitals without admin review.</p>
                  </div>
                  <ToggleRight size={36} className="text-[#10b981] cursor-pointer" />
                </div>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 mt-8 px-6 py-3.5 bg-[#10b981] text-white text-[15px] font-bold rounded-xl hover:bg-[#0ea569] transition-all shadow-md hover:-translate-y-0.5"><Save size={18} /> <span>Save Configuration</span></button>
            </div>
          </div>
        )}

        <button className="fixed bottom-8 right-8 bg-[#1e1b4b] hover:bg-[#312e81] text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 transition-all hover:scale-105 hover:-translate-y-1 z-50">
          <Bot size={24} className="text-[#818cf8]" />
          <span className="font-bold text-[15px] tracking-wide">Chatbot</span>
        </button>
      </div>
    </DashboardLayout>
  );
}