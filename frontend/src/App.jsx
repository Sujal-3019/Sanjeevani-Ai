import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PortalSelection from './pages/PortalSelection';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';

import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Portal Selection */}
          <Route
            path="/"
            element={<PortalSelection />}
          />

          {/* Authentication */}
          <Route
            path="/login/:role"
            element={<LoginView />}
          />

          <Route
            path="/register/:role"
            element={<RegisterView />}
          />

          {/* Patient Portal */}
          <Route
            path="/dashboard/patient"
            element={<PatientDashboard />}
          />

          {/* Hospital Portal */}
          <Route
            path="/dashboard/hospital"
            element={<HospitalDashboard />}
          />

          {/* Admin Portal
              Keep this route for future admin development.
              Do not expose it from the normal portal UI. */}
          <Route
            path="/dashboard/admin"
            element={<AdminDashboard />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
