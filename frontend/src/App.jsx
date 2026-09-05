import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import PatientLogin from './pages/auth/PatientLogin';
import PatientRegister from './pages/auth/PatientRegister';
import PatientProfileSetup from './pages/auth/PatientProfileSetup';
import PatientDashboard from './pages/patient/PatientDashboard';
import EmergencyPage from './pages/patient/EmergencyPage';
import TrackingPage from './pages/patient/TrackingPage';
import MedicalProfile from './pages/patient/MedicalProfile';
import EmergencyContacts from './pages/patient/EmergencyContacts';
import EmergencyHistory from './pages/patient/EmergencyHistory';
import HospitalAdminLogin from './pages/auth/HospitalAdminLogin';


function AuthPlaceholder({ title, description }) {
  return (
    <div className="sanjeevani-page flex min-h-screen items-center justify-center p-6">
      <div className="sj-card w-full max-w-md p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--sj-primary)">
          Sanjeevani AI
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-(--sj-text)">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
          {description}
        </p>
      </div>
    </div>
  );
}

function DashboardPlaceholder({ title }) {
  return (
    <div className="sanjeevani-page flex min-h-screen items-center justify-center p-6">
      <div className="sj-card w-full max-w-xl p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--sj-primary)">
          Dashboard
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-(--sj-text)">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-  (--sj-text-soft)">
          This dashboard will be built in the next frontend phase.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC
        ===================================================== */}

        <Route path="/" element={<HomePage />} />

        {/* =====================================================
            PATIENT AUTHENTICATION
        ===================================================== */}

        <Route
          path="/login/patient"
          element={<PatientLogin />}
        />

        <Route
          path="/register/patient"
          element={<PatientRegister />
          }
        />
        <Route
          path="/register/patient/profile"
          element={<PatientProfileSetup />}
        />



        {/* =====================================================
            HOSPITAL ADMIN AUTHENTICATION
        ===================================================== */}

        <Route
          path="/login/hospital-admin"
          element={< HospitalAdminLogin />
          }
        />

        <Route
          path="/register/hospital-admin"
          element={
            <AuthPlaceholder
              title="Hospital Admin Registration"
              description="Register your hospital and create its administrator account."
            />
          }
        />

        {/* =====================================================
            PARAMEDIC AUTHENTICATION
            No public registration route.
        ===================================================== */}

        <Route
          path="/login/paramedic"
          element={
            <AuthPlaceholder
              title="Paramedic Login"
              description="Secure operational access for authorized Sanjeevani AI paramedics."
            />
          }
        />

        {/* =====================================================
            PATIENT DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard/patient"
          element={<PatientDashboard />}
        />

        <Route
          path="/dashboard/patient/emergency"
          element={<EmergencyPage />}
        />

        <Route
          path="/dashboard/patient/medical-profile"
          element={<MedicalProfile />}
        />

        <Route
          path="/dashboard/patient/tracking"
          element={<TrackingPage />}
        />

        <Route
          path="/dashboard/patient/emergency-contacts"
          element={<EmergencyContacts />}
        />

        <Route
          path="/dashboard/patient/history"
          element={<EmergencyHistory />}
        />

        {/* =====================================================
            HOSPITAL ADMIN DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard/hospital"
          element={
            <DashboardPlaceholder title="Hospital Admin Dashboard" />
          }
        />

        {/* =====================================================
            PARAMEDIC DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard/paramedic"
          element={
            <DashboardPlaceholder title="Paramedic Dashboard" />
          }
        />

        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}