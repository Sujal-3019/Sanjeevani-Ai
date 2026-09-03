import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';

import {
  ShieldAlert,
  Truck,
  MapPin,
  Bot,
  Bed,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Navigation,
  Phone,
  Gauge,
  Signal,
} from 'lucide-react';

import {
  dummyHospitalDashboardData,
  dummyEmergencyRequests,
  dummyAmbulanceData,
  formatEmergencyTime,
  getSeverityDisplay,
  hospitalProfileInfo,
} from '../assets/asset';

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('tracking');

  const navItems = [
    {
      name: 'Emergency Response',
      icon: ShieldAlert,
      isActive: activeTab === 'response',
      onClick: () => setActiveTab('response'),
    },
    {
      name: 'Ambulance Dispatch',
      icon: Truck,
      isActive: activeTab === 'dispatch',
      onClick: () => setActiveTab('dispatch'),
    },
    {
      name: 'Live Tracking',
      icon: MapPin,
      isActive: activeTab === 'tracking',
      onClick: () => setActiveTab('tracking'),
    },
  ];

  return (
    <DashboardLayout
      navigationItems={navItems}
      portalTitle="Sanjeevani AI Hospital Portal"
      userName={hospitalProfileInfo.name}
      userProfileData={hospitalProfileInfo}
    >
      <div className="relative w-full min-w-0 space-y-5 pb-24 sm:space-y-6 lg:space-y-8">

        {/* =========================================================
            EMERGENCY RESPONSE
        ========================================================== */}

        {activeTab === 'response' && (
          <>
            {/* Hospital Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 lg:gap-6">
              <StatCard
                label="Hospital Capacity"
                value={`${dummyHospitalDashboardData.availableBeds} Beds`}
                icon={Bed}
              />

              <StatCard
                label="Active Dispatches"
                value={`${dummyHospitalDashboardData.activeDispatches} Active`}
                icon={Activity}
              />

              <StatCard
                label="Ambulance Fleet"
                value={`${dummyHospitalDashboardData.totalAmbulances} Total`}
                icon={Truck}
              />
            </div>

            {/* Ambulance Map */}
            <div className="sanjeevani-card mt-5 overflow-hidden sm:mt-6 lg:mt-8">

              <div className="p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <div className="dashboard-section-header mb-5 flex-col items-start sm:mb-6 sm:flex-row sm:items-center">

                  <h4 className="text-base font-bold text-[#0f172a] sm:text-[18px]">
                    Ambulance Fleet & Emergency Map
                  </h4>

                  <span className="live-indicator">
                    <span className="live-indicator-dot" />
                    Live Map Connected
                  </span>

                </div>

                {/* Map */}
                <div className="sanjeevani-map">

                  <div className="sanjeevani-map-grid" />

                  <div className="relative z-10 flex max-w-[90%] flex-col items-center rounded-xl border border-white/60 bg-white/80 px-5 py-4 text-center shadow-sm backdrop-blur-md sm:rounded-2xl sm:px-8 sm:py-5">

                    <MapPin
                      size={28}
                      className="mb-2 text-[#3b82f6] sm:mb-3"
                    />

                    <span className="text-sm font-bold text-slate-800 sm:text-[15px]">
                      Google Maps Geolocation Telemetry Feed
                    </span>

                    <span className="mt-1 text-xs font-medium text-slate-500 sm:text-[13px]">
                      [Active Instance Hooked]
                    </span>

                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* =========================================================
            AMBULANCE DISPATCH
        ========================================================== */}

        {activeTab === 'dispatch' && (
          <div className="grid grid-cols-1 gap-5 lg:gap-8 xl:grid-cols-3">

            {/* Emergency Requests */}
            <div className="min-w-0 space-y-4 sm:space-y-6 xl:col-span-2">

              <div className="dashboard-section-header">

                <h3 className="text-lg font-bold text-[#0f172a] sm:text-[20px]">
                  Incoming Emergency SOS (Triage)
                </h3>

                <span className="hidden items-center gap-1.5 text-xs font-bold text-slate-400 sm:flex">
                  <Clock size={14} />
                  Live
                </span>

              </div>

              {dummyEmergencyRequests.map((req) => {
                const severityData = getSeverityDisplay(req.severity);

                return (
                  <div
                    key={req._id}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:rounded-3xl ${severityData.classes
                      .replace('text-', 'border-')
                      .replace('bg-', 'border-')}`}
                  >

                    {/* Emergency Header */}
                    <div
                      className={`flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-8 ${severityData.classes.split(' ')[0]} ${severityData.classes.split(' ')[2]}`}
                    >

                      <div
                        className={`flex items-start gap-3 text-sm font-bold sm:items-center sm:text-[15px] ${severityData.classes.split(' ')[1]}`}
                      >
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 sm:h-3 sm:w-3 ${severityData.dot}`}
                        />

                        <span className="leading-snug">
                          {severityData.label} - {req.description}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold sm:text-[13px] ${severityData.classes.split(' ')[1]}`}
                      >
                        {formatEmergencyTime(req.timestamp)}
                      </span>

                    </div>

                    {/* Emergency Information */}
                    <div className="p-4 sm:p-6 lg:p-8">

                      <div className="mb-6 grid grid-cols-1 gap-5 sm:mb-8 sm:grid-cols-2 sm:gap-6">

                        {/* Location */}
                        <div className="min-w-0">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                            Location
                          </p>

                          <p className="wrap-break-words text-sm font-bold leading-relaxed text-slate-800 sm:text-[15px]">
                            {req.incidentLocation.address}
                          </p>

                        </div>

                        {/* Patient */}
                        <div className="min-w-0">

                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                            Patient Profile
                          </p>

                          <p className="text-sm font-bold leading-relaxed text-slate-800 sm:text-[15px]">
                            {req.patientDetails.firstName}{' '}
                            {req.patientDetails.lastName}{' '}
                            <span className="font-medium text-slate-500">
                              (Age: {req.patientDetails.age})
                            </span>
                          </p>

                          <p className="mt-1.5 wrap-break-words text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                            <strong className="text-red-500">
                              Blood: {req.patientDetails.bloodGroup}
                            </strong>

                            <span className="mx-1">|</span>

                            Allergies:{' '}
                            {req.patientDetails.allergies.join(', ')}
                          </p>

                        </div>

                      </div>

                      {/* Action Buttons */}
                      {req.status === 'PENDING' ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">

                          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0ea569] active:scale-[0.98] sm:flex-1 sm:text-[15px]">
                            <CheckCircle size={19} />
                            <span>Accept & Dispatch</span>
                          </button>

                          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 active:scale-[0.98] sm:w-auto sm:px-8 sm:text-[15px]">
                            <XCircle size={19} />
                            <span>Reject / Reroute</span>
                          </button>

                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs font-bold text-slate-500 sm:p-4 sm:text-sm">
                          Action Taken: {req.status}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ambulance Fleet */}
            <div className="min-w-0">

              <h3 className="mb-4 text-lg font-bold text-[#0f172a] sm:mb-6 sm:text-[20px]">
                Ambulance Fleet Status
              </h3>

              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:rounded-3xl">

                <div className="divide-y divide-slate-100">

                  {dummyAmbulanceData.map((amb) => (
                    <div
                      key={amb._id}
                      className={`flex items-start gap-3 p-4 transition-colors sm:gap-4 sm:p-5 lg:p-6 ${
                        amb.status === 'EN_ROUTE'
                          ? 'bg-slate-50/80'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >

                      {/* Icon */}
                      <div
                        className={`shrink-0 rounded-xl p-2.5 sm:p-3 ${
                          amb.status === 'EN_ROUTE'
                            ? 'bg-blue-100 text-blue-600'
                            : amb.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Truck
                          size={20}
                          className="sm:h-5.5 sm:w-5.5"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">

                        <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <h4 className="text-sm font-bold text-slate-800 sm:text-[15px]">
                            {amb.callSign}
                          </h4>

                          <span
                            className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-[11px] ${
                              amb.status === 'EN_ROUTE'
                                ? 'bg-blue-100 text-blue-700'
                                : amb.status === 'AVAILABLE'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {amb.status}
                          </span>

                        </div>

                        <p className="text-xs font-medium leading-relaxed text-slate-500 sm:text-[13px]">
                          Driver: {amb.driverName}
                          <br />

                          <span className="mt-0.5 block text-[11px] sm:text-xs">
                            {amb.driverPhone}
                          </span>
                        </p>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            LIVE TRACKING
        ========================================================== */}

        {activeTab === 'tracking' && (
          <div className="grid min-h-0 grid-cols-1 gap-5 sm:gap-6 lg:gap-8 xl:grid-cols-3">

            {/* Mission Telemetry */}
            <div className="relative flex min-h-150 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_25px_rgb(0,0,0,0.04)] sm:rounded-3xl xl:min-h-162.5">

              {/* Gradient Top Border */}
              <div className="h-1.5 w-full shrink-0 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

              {/* Header */}
              <div className="border-b border-slate-100 bg-white p-5 sm:p-6 lg:p-8">

                <h3 className="text-lg font-bold text-[#0f172a] sm:text-[20px]">
                  Mission Telemetry
                </h3>

                <p className="mt-1 flex flex-wrap items-center text-xs font-medium text-slate-500 sm:text-sm">

                  Monitoring

                  <span className="ml-1 font-bold text-slate-700">
                    {dummyEmergencyRequests[0].ambulanceDetails.callSign}
                  </span>

                  <span className="mx-2 h-1.5 w-1.5 rounded-full bg-blue-500" />

                  NH-19 Route

                </p>
              </div>

              {/* Telemetry Body */}
              <div className="flex flex-1 flex-col bg-slate-50/50 p-5 sm:p-6 lg:p-8">

                {/* ETA */}
                <div className="mb-8 sm:mb-10">

                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
                      Estimated Arrival
                    </span>

                    <span className="flex w-fit items-center rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-[10px] font-bold text-blue-600 sm:text-xs">
                      <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                      Live Sync
                    </span>

                  </div>

                  <p className="text-5xl font-black leading-none tracking-tighter text-slate-800 sm:text-[56px]">
                    {dummyEmergencyRequests[0].etaToPatient}
                  </p>

                  {/* Progress */}
                  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">

                    <div className="relative h-full w-[70%] rounded-full bg-linear-to-r from-blue-400 to-blue-600">

                      <div className="absolute bottom-0 right-0 top-0 w-20 animate-[ping_2s_ease-in-out_infinite] bg-linear-to-r from-transparent to-white opacity-30" />

                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-auto mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4">

                  {/* Distance */}
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

                    <Navigation
                      size={19}
                      className="mb-2 text-slate-400 sm:mb-3"
                    />

                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                      Distance
                    </p>

                    <p className="text-base font-bold text-slate-800 sm:text-[18px]">
                      {dummyEmergencyRequests[0].distanceRemaining}
                    </p>

                  </div>

                  {/* Speed */}
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

                    <Gauge
                      size={19}
                      className="mb-2 text-slate-400 sm:mb-3"
                    />

                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                      Speed
                    </p>

                    <p className="text-base font-bold text-slate-800 sm:text-[18px]">
                      65 km/h
                    </p>

                  </div>

                  {/* Traffic */}
                  <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

                    <div className="min-w-0">

                      <Signal
                        size={19}
                        className="mb-2 text-emerald-500"
                      />

                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                        Traffic Conditions
                      </p>

                      <p className="truncate text-sm font-bold text-slate-800 sm:text-[15px]">
                        Light / Optimal Route
                      </p>

                    </div>

                    <div className="shrink-0">

                      <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 sm:px-3 sm:text-xs">
                        Clear
                      </span>

                    </div>

                  </div>
                </div>
              </div>

              {/* Contact Paramedic */}
              <div className="border-t border-slate-100 bg-white p-4 sm:p-5 lg:p-6">

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1128] py-3.5 text-xs font-bold text-white shadow-[0_4px_15px_rgba(10,17,40,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#111A35] hover:shadow-[0_6px_20px_rgba(10,17,40,0.2)] active:scale-[0.98] sm:gap-3 sm:py-4 sm:text-sm">

                  <Phone size={17} />

                  <span>
                    Contact Paramedic Unit
                  </span>

                </button>

              </div>
            </div>

            {/* =====================================================
                LIVE MAP
            ====================================================== */}

            <div className="relative flex min-h-105 min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#e2e8f0] shadow-[0_4px_25px_rgb(0,0,0,0.04)] sm:min-h-130 sm:rounded-3xl xl:col-span-2 xl:min-h-162.5">

              {/* Map Background */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/cartographer.png')",
                }}
              />

              {/* Map Grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* GPS Status */}
              <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md sm:left-6 sm:top-6 sm:gap-3 sm:px-5 sm:py-3">

                <span className="relative flex h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 sm:h-3 sm:w-3" />

                </span>

                <span className="text-xs font-bold text-slate-800 sm:text-sm">
                  GPS Link Active
                </span>

              </div>

              {/* Live Coordinates */}
              <div className="absolute bottom-4 right-4 z-20 flex max-w-[calc(100%-2rem)] flex-col items-end rounded-xl border border-slate-700 bg-[#0f172a]/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-6 sm:px-5 sm:py-3">

                <span className="mb-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 sm:text-[10px]">
                  Live Coordinates
                </span>

                <span className="font-mono text-[10px] text-blue-400 sm:text-[13px]">
                  25.4358° N, 81.8463° E
                </span>

              </div>

              {/* Ambulance Marker */}
              <div className="relative z-10 flex flex-col items-center">

                <div className="relative flex items-center justify-center">

                  <div className="absolute h-24 w-24 animate-ping rounded-full bg-blue-400/20 sm:h-32 sm:w-32" />

                  <div className="absolute h-16 w-16 animate-pulse rounded-full bg-blue-500/20 sm:h-20 sm:w-20" />

                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.6)] sm:h-14 sm:w-14">

                    <Truck
                      size={21}
                      className="text-white sm:h-6 sm:w-6"
                    />

                  </div>

                </div>

                {/* Ambulance Label */}
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 text-center shadow-lg backdrop-blur-md sm:mt-4 sm:px-6 sm:py-3">

                  <h2 className="text-sm font-black tracking-wide text-slate-800 sm:text-[15px]">
                    Ambulance A-01
                  </h2>

                  <p className="mt-0.5 text-[10px] font-bold text-blue-600 sm:text-xs">
                    EN ROUTE TO SCENE
                  </p>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            MEDICAL AI ASSIST
        ========================================================== */}

        <button className="sanjeevani-ai-button">

          <Bot
            size={20}
            className="text-[#818cf8] sm:h-6 sm:w-6"
          />

          <span className="text-xs font-bold tracking-wide sm:text-sm lg:text-[15px]">
            Medical AI Assist
          </span>

        </button>

      </div>
    </DashboardLayout>
  );
}
