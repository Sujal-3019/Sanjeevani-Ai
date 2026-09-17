import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function RoleRoute({ allowedRoles, children }) {
    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div className="sanjeevani-page flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--sj-primary)/20 border-t-(--sj-primary)" />

                    <p className="mt-4 text-sm font-semibold text-(--sj-text-soft)">
                        Verifying your session...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: `${location.pathname}${location.search}${location.hash}`,
                }}
            />
        );
    }

    if (!allowedRoles.includes(user.role)) {
        if (user.role === 'PATIENT') {
            return (
                <Navigate
                    to="/dashboard/patient"
                    replace
                />
            );
        }

        if (user.role === 'HOSPITAL_ADMIN') {
            return (
                <Navigate
                    to="/dashboard/hospital"
                    replace
                />
            );
        }

        if (user.role === 'PARAMEDIC') {
            return (
                <Navigate
                    to="/dashboard/paramedic"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}

export default RoleRoute;