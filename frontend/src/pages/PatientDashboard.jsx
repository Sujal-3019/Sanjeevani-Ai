import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, User, Camera, Leaf, AlertTriangle, MessageSquare, Bot, Save, X, Activity, Search, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { dummyPatientData, dummyMedicineVerifications, patientProfileInfo } from '../assets/asset';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sosActive, setSosActive] = useState(false);

  const [patientProfile, setPatientProfile] = useState(dummyPatientData[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = () => {
    setEditForm({
      ...patientProfile,
      allergiesStr: patientProfile.allergies.join(", "),
      conditionsStr: patientProfile.chronicConditions.join(", "),
      medicationsStr: patientProfile.currentMedications.join(", ")
    });
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setPatientProfile({
      ...editForm,
      allergies: editForm.allergiesStr.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: editForm.conditionsStr.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: editForm.medicationsStr.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  const navItems = [
    { name: 'Patient Dashboard', icon: LayoutDashboard, isActive: activeTab === 'dashboard', onClick: () => setActiveTab('dashboard') },
    { name: 'My Medical Profile', icon: User, isActive: activeTab === 'profile', onClick: () => setActiveTab('profile') },
    { name: 'Medicine Verification', icon: Camera, isActive: activeTab === 'medicine', onClick: () => setActiveTab('medicine') },
    { name: 'Ayurveda Guidance', icon: Leaf, isActive: activeTab === 'ayurveda', onClick: () => setActiveTab('ayurveda') }
  ];

  return (
    <DashboardLayout navigationItems={navItems} portalTitle="Sanjeevani AI Patient Portal" userName={patientProfileInfo.name} userProfileData={patientProfileInfo}>
      
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-8 flex flex-col justify-between relative overflow-hidden min-h-60">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-70"></div>
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-[20px] flex items-center">
                  <AlertTriangle size={24} className="text-red-500 mr-3" /> Emergency SOS
                </h4>
                <p className="text-[15px] text-slate-500 mt-3 leading-relaxed">One-tap orchestration to instantly dispatch an ambulance to your live location.</p>
              </div>
              <button onClick={() => setSosActive(!sosActive)} className={`w-full py-4 mt-8 rounded-xl font-bold text-[16px] transition-all duration-300 flex items-center justify-center space-x-3 relative z-10 ${sosActive ? 'bg-red-600 text-white animate-pulse shadow-[0_0_25px_rgba(220,38,38,0.4)] border border-red-500' : 'bg-[#ef4444] hover:bg-red-600 text-white shadow-md hover:shadow-lg'}`}>
                <AlertTriangle size={20} /><span>{sosActive ? 'SOS TRIGGERED - HELP ON THE WAY' : 'TRIGGER EMERGENCY SOS'}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col justify-between min-h-60">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h4 className="font-bold text-slate-800 text-[20px] flex items-center"><User size={22} className="text-[#11b578] mr-3"/> Quick Profile</h4>
                <span className="bg-emerald-50 text-emerald-600 text-[12px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border border-emerald-100">Verified</span>
              </div>
              <div className="space-y-4 text-[15px] flex-1">
                <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100"><span className="font-semibold text-slate-500">Blood Group</span><strong className="text-red-600 font-black text-[18px]">{patientProfile.bloodGroup}</strong></div>
                <div className="flex justify-between items-center px-4 py-1"><span className="font-semibold text-slate-500">Allergies</span><strong className="text-slate-800">{patientProfile.allergies.length ? patientProfile.allergies.join(", ") : "None"}</strong></div>
                <div className="flex justify-between items-center px-4 py-1"><span className="font-semibold text-slate-500">Medications</span><strong className="text-slate-800 truncate max-w-37.5">{patientProfile.currentMedications.length ? patientProfile.currentMedications[0] : "None"}{patientProfile.currentMedications.length > 1 ? ', ...' : ''}</strong></div>
              </div>
            </div>

            <div className="bg-linear-to-br from-[#042219] to-[#073628] rounded-3xl shadow-md border border-[#0a4a37] p-8 flex flex-col justify-between text-white relative overflow-hidden min-h-60">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4"><Activity size={180} /></div>
              <div className="relative z-10">
                <h4 className="font-bold text-[22px] flex items-center"><Activity size={24} className="text-[#11b578] mr-3"/> Medicine Hub</h4>
                <p className="text-[15px] text-[#6aa292] mt-3 leading-relaxed">Intelligent database matching & OCR prescription verification pipeline.</p>
              </div>
              <div className="relative z-10 mt-8 flex items-center justify-between">
                <span className="text-[13px] bg-[#11b578]/20 border border-[#11b578]/30 px-4 py-2 rounded-xl text-[#6ee7b7] font-bold tracking-wider flex items-center uppercase"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981] mr-3 animate-pulse shadow-[0_0_10px_#10b981]"></span> Fully Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h4 className="font-bold text-[#0f172a] text-[20px]">My Health Trends</h4>
                 <p className="text-[15px] text-slate-500 mt-1 font-medium">Blood Pressure & Heart Rate (Last 30 Days)</p>
               </div>
               <div className="flex items-center space-x-6 text-[14px] font-bold text-slate-500 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                  <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#f87171] mr-2.5"></span>Systolic</div>
                  <div className="flex items-center"><span className="w-3.5 h-3.5 rounded-full bg-[#60a5fa] mr-2.5"></span>Diastolic</div>
               </div>
            </div>
            <div className="h-100 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
              <div className="relative z-10 flex flex-col items-center bg-white/80 px-10 py-8 rounded-3xl shadow-sm border border-white/60 backdrop-blur-md text-center">
                 <Activity size={48} className="text-[#11b578] mb-4" />
                 <span className="font-bold text-slate-800 text-[18px]">Live Health Data Canvas Hook</span>
                 <span className="text-[14px] font-medium text-slate-500 mt-2">Awaiting MongoDB Time-Series Integration</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="flex justify-between items-center px-10 py-8 border-b border-slate-100 bg-white">
            <h4 className="text-[22px] font-bold text-[#0f172a] flex items-center"><User size={26} className="mr-3 text-[#11b578]" /> {isEditing ? "Edit Medical Record" : "Official Medical Record"}</h4>
            {!isEditing && <button onClick={handleEditClick} className="bg-[#042219] hover:bg-[#073628] text-white px-8 py-3 text-[15px] rounded-xl font-bold transition-colors shadow-sm">Edit Profile</button>}
          </div>
          {isEditing ? (
            <form onSubmit={handleSaveChanges} className="flex flex-col bg-slate-50/30">
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                <div className="space-y-6">
                  <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-4">Physical Details</h5>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-700 mb-3">Blood Group</label>
                    <select name="bloodGroup" value={editForm.bloodGroup} onChange={handleFormChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all">
                      <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-[15px] font-bold text-slate-700 mb-3">Height</label><input type="text" name="height" value={editForm.height} onChange={handleFormChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all" /></div>
                    <div><label className="block text-[15px] font-bold text-slate-700 mb-3">Weight</label><input type="text" name="weight" value={editForm.weight} onChange={handleFormChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all" /></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-4">Health Conditions</h5>
                  <div><label className="block text-[15px] font-bold text-slate-700 mb-3">Chronic Conditions (Comma separated)</label><input type="text" name="conditionsStr" value={editForm.conditionsStr} onChange={handleFormChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all" /></div>
                  <div><label className="block text-[15px] font-bold text-slate-700 mb-3">Allergies (Comma separated)</label><input type="text" name="allergiesStr" value={editForm.allergiesStr} onChange={handleFormChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all" /></div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-4">Medications</h5>
                  <div><label className="block text-[15px] font-bold text-slate-700 mb-3">Current Medications (Comma separated)</label><textarea name="medicationsStr" value={editForm.medicationsStr} onChange={handleFormChange} rows={3} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-[15px] text-slate-800 outline-none focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all resize-none"></textarea></div>
                </div>
              </div>
              <div className="px-10 py-6 bg-white border-t border-slate-200 flex justify-end space-x-5">
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-[15px] font-bold hover:bg-slate-50 transition-colors flex items-center shadow-sm"><X size={20} className="mr-2" /> Cancel</button>
                <button type="submit" className="px-10 py-3.5 bg-[#11b578] hover:bg-[#0ea569] text-white rounded-xl text-[15px] font-bold shadow-md transition-all flex items-center hover:-translate-y-0.5"><Save size={20} className="mr-2" /> Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="p-0 bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-10">
                  <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-8">Medical Details</h5>
                  <div className="space-y-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100"><span className="text-[15px] font-semibold text-slate-500">Blood Group</span><strong className="text-[18px] text-red-600 font-black">{patientProfile.bloodGroup}</strong></div>
                    <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100"><span className="text-[15px] font-semibold text-slate-500">Height</span><strong className="text-[16px] text-slate-800">{patientProfile.height}</strong></div>
                    <div className="flex justify-between items-center px-6 py-5"><span className="text-[15px] font-semibold text-slate-500">Weight</span><strong className="text-[16px] text-slate-800">{patientProfile.weight}</strong></div>
                  </div>
                </div>
                <div className="p-10">
                  <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-8">Conditions & Allergies</h5>
                  <div className="space-y-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100"><span className="text-[15px] font-semibold text-slate-500">Chronic Conditions</span><strong className="text-[16px] text-slate-800 text-right">{patientProfile.chronicConditions.join(", ") || "None"}</strong></div>
                    <div className="flex justify-between items-center px-6 py-5"><span className="text-[15px] font-semibold text-slate-500">Allergies</span><strong className="text-[16px] text-slate-800 text-right">{patientProfile.allergies.join(", ") || "None"}</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-10 border-t border-slate-200 bg-white">
                <h5 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-6">Current Medications</h5>
                {patientProfile.currentMedications.length > 0 && patientProfile.currentMedications[0] !== "None" ? (
                  <div className="flex flex-wrap gap-4">
                    {patientProfile.currentMedications.map((med, i) => <div key={i} className="bg-slate-50 px-6 py-3.5 rounded-xl border border-slate-200 text-[#0f172a] font-bold text-[16px] shadow-sm flex items-center"><div className="w-2 h-2 rounded-full bg-[#11b578] mr-3"></div>{med}</div>)}
                  </div>
                ) : (
                  <div className="bg-slate-50 px-6 py-5 rounded-xl border border-slate-200 text-slate-500 font-medium text-[16px]">No current medications recorded.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'medicine' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-10 flex flex-col">
            <h4 className="font-bold text-[#0f172a] text-[18px] mb-6">Upload Prescription / Image</h4>
            <div className="group border-2 border-dashed border-slate-200 hover:border-[#11b578] bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer min-h-55">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"><UploadCloud size={28} className="text-slate-400 group-hover:text-[#11b578] transition-colors" /></div>
              <button className="px-8 py-3 bg-[#042219] text-white font-bold text-[15px] rounded-xl shadow-md hover:bg-[#073628] transition-colors mb-4">Choose File</button>
              <p className="text-[14px] text-slate-400 font-medium text-center px-4">Drag and drop or browse to upload.<br/>Use OCR to automatically extract details.</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-10 flex flex-col">
            <h4 className="font-bold text-[#0f172a] text-[18px] mb-6">Manual Medicine Search</h4>
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <p className="text-[15px] text-slate-500 font-medium mb-2">Search our extensive database for verified medicinal information, side effects, and guidelines.</p>
              <div className="relative flex items-center">
                <Search size={22} className="absolute left-5 text-slate-400" />
                <input type="text" placeholder="Enter Medicine Name..." className="w-full pl-14 pr-5 py-4 border border-slate-200 rounded-xl text-[15px] text-slate-800 bg-slate-50/50 outline-none focus:bg-white focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all duration-300" />
              </div>
              <button className="w-full py-4 bg-[#042219] hover:bg-[#073628] text-white font-bold text-[15px] rounded-xl shadow-md transition-colors mt-2">Search Database</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ayurveda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-162.5">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col overflow-hidden">
            <div className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-[#0f172a] text-[18px] flex items-center"><div className="w-10 h-10 rounded-xl bg-[#11b578]/10 flex items-center justify-center mr-4"><Bot size={22} className="text-[#11b578]"/></div>AI Health Assistant</h4>
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Online</span>
            </div>
            <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto space-y-4">
              <div className="flex items-start max-w-[85%]"><div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)] text-[15px] text-slate-700 leading-relaxed font-medium">Hello, how can I assist you with your health today? For first-aid guidance, please specify your symptoms.</div></div>
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input type="text" placeholder="Type your message..." className="w-full pl-6 pr-32 py-5 bg-slate-50/80 border border-slate-200 rounded-3xl text-[15px] text-slate-800 outline-none focus:bg-white focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all duration-300" />
                <button className="absolute right-3 px-8 py-3 bg-[#042219] hover:bg-[#073628] text-white font-bold text-[14px] rounded-xl shadow-md transition-colors">Send</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-10 flex flex-col">
            <h4 className="font-bold text-[#0f172a] text-[18px] mb-6">Ayurvedic Remedies</h4>
            <textarea placeholder="Describe your symptoms for quick analysis..." rows={5} className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 rounded-[1.25rem] text-[15px] text-slate-800 outline-none focus:bg-white focus:border-[#11b578] focus:ring-4 focus:ring-[#11b578]/10 transition-all duration-300 resize-none mb-5" />
            <button className="w-full py-4 bg-[#042219] hover:bg-[#073628] text-white font-bold text-[15px] rounded-xl shadow-md transition-colors mb-8 flex justify-center items-center"><Leaf size={18} className="mr-3" /> Suggest Remedies</button>
            <div className="mt-auto">
              <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-5 border-b border-slate-100 pb-3">Common Conditions</h5>
              <div className="grid grid-cols-2 gap-y-5 gap-x-3">
                <label className="flex items-center space-x-3 text-[14px] font-semibold text-slate-600 cursor-pointer group"><input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#042219] focus:ring-[#042219] accent-[#042219] transition-colors" /> <span className="group-hover:text-slate-900 transition-colors">Fever</span></label>
                <label className="flex items-center space-x-3 text-[14px] font-semibold text-slate-600 cursor-pointer group"><input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#042219] focus:ring-[#042219] accent-[#042219] transition-colors" /> <span className="group-hover:text-slate-900 transition-colors">Headache</span></label>
                <label className="flex items-center space-x-3 text-[14px] font-semibold text-slate-600 cursor-pointer group"><input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#042219] focus:ring-[#042219] accent-[#042219] transition-colors" /> <span className="group-hover:text-slate-900 transition-colors">Cough</span></label>
                <label className="flex items-center space-x-3 text-[14px] font-semibold text-slate-600 cursor-pointer group"><input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#042219] focus:ring-[#042219] accent-[#042219] transition-colors" /> <span className="group-hover:text-slate-900 transition-colors">Cold</span></label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-[#042219] hover:bg-[#073628] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center text-white hover:scale-105 transition-transform border-2 border-[#11b578]/20"><MessageSquare size={28} /></button>
      </div>
    </DashboardLayout>
  );
}