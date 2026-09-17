import React from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import RoleRoute from './routes/RoleRoute';

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
import HospitalAdminRegister from './pages/auth/HospitalAdminRegister';
import HospitalProfileSetup from './pages/auth/HospitalProfileSetup';

import HospitalVerificationStatus from './pages/verification/HospitalVerificationStatus';

import HospitalDashboard from './pages/hospital/HospitalDashboard';
import EmergencyRequests from './pages/hospital/EmergencyRequests';
import ActiveEmergency from './pages/hospital/ActiveEmergency';
import Ambulances from './pages/hospital/Ambulances';
import Paramedics from './pages/hospital/Paramedics';
import Capacity from './pages/hospital/Capacity';
import Services from './pages/hospital/Services';
import HospitalSettings from './pages/hospital/HospitalSettings';

import ParamedicLogin from './pages/auth/ParamedicLogin';
import ParamedicDashboard from './pages/paramedic/ParamedicDashboard';
import ActiveEmergencyParamedic from './pages/paramedic/ActiveEmergencyParamedic';
import ActiveEmergencyDetails from './pages/paramedic/ActiveEmergencyDetails';
import Navigation from './pages/paramedic/Navigation';
import MissionHistory from './pages/paramedic/MissionHistory';
import ParamedicProfile from './pages/paramedic/ParamedicProfile';


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

                <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                    This dashboard will be built in the next frontend phase.
                </p>
            </div>
        </div>
    );
}


export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* =====================================================
                        PUBLIC
                    ===================================================== */}

                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    {/* =====================================================
                        PATIENT AUTHENTICATION
                    ===================================================== */}

                    <Route
                        path="/login/patient"
                        element={<PatientLogin />}
                    />

                    <Route
                        path="/register/patient"
                        element={<PatientRegister />}
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
                        element={<HospitalAdminLogin />}
                    />

                    <Route
                        path="/register/hospital-admin"
                        element={<HospitalAdminRegister />}
                    />

                    <Route
                        path="/register/hospital/profile"
                        element={<HospitalProfileSetup />}
                    />

                    <Route
                        path="/verification/hospital"
                        element={<HospitalVerificationStatus />}
                    />

                    {/* =====================================================
                        PARAMEDIC AUTHENTICATION
                        No public registration route.
                    ===================================================== */}

                    <Route
                        path="/login/paramedic"
                        element={<ParamedicLogin />}
                    />

                    {/* =====================================================
                        PATIENT DASHBOARD
                    ===================================================== */}

                    <Route
                        path="/dashboard/patient"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <PatientDashboard />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient/emergency"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <EmergencyPage />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient/medical-profile"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <MedicalProfile />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient/tracking"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <TrackingPage />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient/emergency-contacts"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <EmergencyContacts />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient/history"
                        element={
                            <RoleRoute allowedRoles={['PATIENT']}>
                                <EmergencyHistory />
                            </RoleRoute>
                        }
                    />

                    {/* =====================================================
                        HOSPITAL ADMIN DASHBOARD
                    ===================================================== */}

                    <Route
                        path="/dashboard/hospital"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <HospitalDashboard />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/emergencies"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <EmergencyRequests />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/emergencies/:emergencyId"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <ActiveEmergency />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/ambulances"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <Ambulances />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/paramedics"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <Paramedics />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/capacity"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <Capacity />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/services"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <Services />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/hospital/settings"
                        element={
                            <RoleRoute allowedRoles={['HOSPITAL_ADMIN']}>
                                <HospitalSettings />
                            </RoleRoute>
                        }
                    />

                    {/* =====================================================
                        PARAMEDIC DASHBOARD
                    ===================================================== */}

                    <Route
                        path="/dashboard/paramedic"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <ParamedicDashboard />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/emergency"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <ActiveEmergencyParamedic />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/emergency/:emergencyId"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <ActiveEmergencyDetails />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/navigation"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <Navigation />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/navigation/:emergencyId"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <Navigation />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/history"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <MissionHistory />
                            </RoleRoute>
                        }
                    />

                    <Route
                        path="/dashboard/paramedic/profile"
                        element={
                            <RoleRoute allowedRoles={['PARAMEDIC']}>
                                <ParamedicProfile />
                            </RoleRoute>
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
        </AuthProvider>
    );
}