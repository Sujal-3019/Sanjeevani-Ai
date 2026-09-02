import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { ShieldAlert, Truck, MapPin, Bot, Bed, Activity, CheckCircle, XCircle, Clock, Navigation, Phone, Gauge, Signal } from 'lucide-react';
import { dummyHospitalDashboardData, dummyEmergencyRequests, dummyAmbulanceData, formatEmergencyTime, getSeverityDisplay, hospitalProfileInfo } from '../assets/asset';

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('tracking');

  const navItems = [
    { name: 'Emergency Response', icon: ShieldAlert, isActive: activeTab === 'response', onClick: () => setActiveTab('response') },
    { name: 'Ambulance Dispatch', icon: Truck, isActive: activeTab === 'dispatch', onClick: () => setActiveTab('dispatch') },
    { name: 'Live Tracking', icon: MapPin, isActive: activeTab === 'tracking', onClick: () => setActiveTab('tracking') }
  ];

  return (
    <DashboardLayout navigationItems={navItems} portalTitle="Sanjeevani AI Hospital Portal" userName={hospitalProfileInfo.name} userProfileData={hospitalProfileInfo}>
      <div className="space-y-8 relative pb-16">
        
        {activeTab === 'response' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Hospital Capacity" value={`${dummyHospitalDashboardData.availableBeds} Beds`} icon={Bed} />
              <StatCard label="Active Dispatches" value={`${dummyHospitalDashboardData.activeDispatches} Active`} icon={Activity} />
              <StatCard label="Ambulance Fleet" value={`${dummyHospitalDashboardData.totalAmbulances} Total`} icon={Truck} />
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden mt-8">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-[#0f172a] text-[18px]">Ambulance Fleet & Emergency Map</h4>
                  <span className="text-[12px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Live Map Connected
                  </span>
                </div>
                
                <div className="h-95 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-[13px] relative overflow-hidden">
                   <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                   <div className="relative z-10 flex flex-col items-center justify-center bg-white/80 px-8 py-5 rounded-2xl shadow-sm border border-white/60 backdrop-blur-md">
                     <MapPin size={32} className="text-[#3b82f6] mb-3" />
                     <span className="font-bold text-slate-800 text-[15px]">Google Maps Geolocation Telemetry Feed</span>
                     <span className="text-[13px] font-medium text-slate-500 mt-1">[Active Instance Hooked]</span>
                   </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'dispatch' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[20px] font-bold text-[#0f172a]">Incoming Emergency SOS (Triage)</h3>
              {dummyEmergencyRequests.map((req) => {
                const severityData = getSeverityDisplay(req.severity);
                return (
                  <div key={req._id} className={`bg-white border rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden ${severityData.classes.replace('text-', 'border-').replace('bg-', 'border-')}`}>
                    <div className={`px-8 py-4 flex justify-between items-center ${severityData.classes.split(' ')[0]} border-b ${severityData.classes.split(' ')[2]}`}>
                      <div className={`flex items-center space-x-3 font-bold text-[15px] ${severityData.classes.split(' ')[1]}`}>
                        <span className={`w-3 h-3 rounded-full ${severityData.dot}`}></span>
                        <span>{severityData.label} - {req.description}</span>
                      </div>
                      <span className={`text-[13px] font-bold ${severityData.classes.split(' ')[1]}`}>{formatEmergencyTime(req.timestamp)}</span>
                    </div>
                    
                    <div className="p-8">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location</p>
                          <p className="text-[15px] font-bold text-slate-800">{req.incidentLocation.address}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Profile</p>
                          <p className="text-[15px] font-bold text-slate-800">{req.patientDetails.firstName} {req.patientDetails.lastName} (Age: {req.patientDetails.age})</p>
                          <p className="text-[13px] text-slate-500 mt-1"><strong className="text-red-500">Blood: {req.patientDetails.bloodGroup}</strong> | Allergies: {req.patientDetails.allergies.join(", ")}</p>
                        </div>
                      </div>
                      
                      {req.status === 'PENDING' ? (
                        <div className="flex space-x-4">
                          <button className="flex-1 flex items-center justify-center space-x-2 bg-[#10b981] hover:bg-[#0ea569] text-white py-3.5 rounded-xl font-bold text-[15px] shadow-sm transition-all hover:-translate-y-0.5"><CheckCircle size={20} /> <span>Accept & Dispatch</span></button>
                          <button className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-[15px] transition-colors"><XCircle size={20} /> <span>Reject / Reroute</span></button>
                        </div>
                      ) : (
                         <div className="bg-slate-50 p-4 rounded-xl text-center text-[14px] font-bold text-slate-500 border border-slate-200">Action Taken: {req.status}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-[#0f172a] mb-6">Ambulance Fleet Status</h3>
              <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {dummyAmbulanceData.map((amb) => (
                    <div key={amb._id} className={`p-6 flex items-start space-x-4 transition-colors ${amb.status === 'EN_ROUTE' ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}>
                      <div className={`p-3 rounded-xl ${amb.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-600' : amb.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><Truck size={22} /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <h4 className="font-bold text-slate-800 text-[15px]">{amb.callSign}</h4>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${amb.status === 'EN_ROUTE' ? 'bg-blue-100 text-blue-700' : amb.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{amb.status}</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Driver: {amb.driverName} <br/><span className="text-[12px] mt-0.5 block">{amb.driverPhone}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-175">
            <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden relative">
              <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="p-8 border-b border-slate-100 bg-white">
                <h3 className="text-[20px] font-bold text-[#0f172a]">Mission Telemetry</h3>
                <p className="text-[14px] text-slate-500 mt-1 font-medium flex items-center">Monitoring {dummyEmergencyRequests[0].ambulanceDetails.callSign} <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-2"></span> NH-19 Route</p>
              </div>
              <div className="p-8 flex-1 flex flex-col bg-slate-50/50">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Estimated Arrival</span>
                    <span className="text-[12px] font-bold text-blue-600 flex items-center bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></div> Live Sync
                    </span>
                  </div>
                  <p className="text-[56px] font-black text-slate-800 tracking-tighter leading-none">{dummyEmergencyRequests[0].etaToPatient}</p>
                  <div className="w-full bg-slate-200 h-1.5 mt-5 rounded-full overflow-hidden">
                    <div className="bg-linear-to-r from-blue-400 to-blue-600 h-full w-[70%] rounded-full relative">
                      <div className="absolute top-0 right-0 bottom-0 w-20 bg-linear-to-r from-transparent to-white opacity-30 animate-[ping_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-auto mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <Navigation size={20} className="text-slate-400 mb-3" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-[18px] font-bold text-slate-800">{dummyEmergencyRequests[0].distanceRemaining}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <Gauge size={20} className="text-slate-400 mb-3" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Speed</p>
                    <p className="text-[18px] font-bold text-slate-800">65 km/h</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 flex items-center justify-between">
                    <div>
                      <Signal size={20} className="text-emerald-500 mb-2" />
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Traffic Conditions</p>
                      <p className="text-[15px] font-bold text-slate-800">Light / Optimal Route</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">Clear</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                <button className="w-full flex items-center justify-center space-x-3 bg-[#0A1128] hover:bg-[#111A35] text-white py-4 rounded-xl font-bold text-[14px] transition-all shadow-[0_4px_15px_rgba(10,17,40,0.15)] hover:shadow-[0_6px_20px_rgba(10,17,40,0.2)] hover:-translate-y-0.5">
                  <Phone size={18} /> <span>Contact Paramedic Unit</span>
                </button>
              </div>
            </div>

            <div className="xl:col-span-2 bg-[#e2e8f0] rounded-3xl shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-slate-200 relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-linear(#94a3b8 1px, transparent 1px), linear-linear(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-200 flex items-center space-x-3 transition-transform hover:scale-105 cursor-default">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                <span className="font-bold text-[14px] text-slate-800">GPS Link Active</span>
              </div>
              <div className="absolute bottom-6 right-6 z-20 bg-[#0f172a]/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-700 flex flex-col items-end">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Live Coordinates</span>
                 <span className="font-mono text-[13px] text-blue-400">25.4358° N, 81.8463° E</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                 <div className="relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-blue-400/20 rounded-full animate-ping"></div>
                    <div className="absolute w-20 h-20 bg-blue-500/20 rounded-full animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-[#3b82f6] rounded-full flex items-center justify-center border-[3px] border-white shadow-[0_0_20px_rgba(59,130,246,0.6)] z-10">
                      <Truck size={24} className="text-white" />
                    </div>
                 </div>
                 <div className="mt-4 bg-white/95 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border border-slate-200 text-center">
                   <h2 className="text-[15px] font-black text-slate-800 tracking-wide">Ambulance A-01</h2>
                   <p className="text-[12px] font-bold text-blue-600 mt-0.5">EN ROUTE TO SCENE</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        <button className="fixed bottom-8 right-8 bg-[#1e1b4b] hover:bg-[#312e81] text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 transition-all hover:scale-105 hover:-translate-y-1 z-50">
          <Bot size={24} className="text-[#818cf8]" />
          <span className="font-bold text-[15px] tracking-wide">Medical AI Assist</span>
        </button>
      </div>
    </DashboardLayout>
  );
}