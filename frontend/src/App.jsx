import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PortalSelection from './pages/PortalSelection';
import LoginView from './pages/LoginView';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalSelection />} />
          <Route path="/login/:role" element={<LoginView isRegistration={false} />} />
          <Route path="/register/:role" element={<LoginView isRegistration={true} />} />
          
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}