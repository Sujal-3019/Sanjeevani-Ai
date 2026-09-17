import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import authService from '../services/authService';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const isAuthenticated = Boolean(user);


    const loadCurrentUser = useCallback(
        async () => {
            const accessToken =
                authService.getAccessToken();

            if (!accessToken) {
                setUser(null);
                setIsLoading(false);
                return null;
            }

            try {
                const currentUser =
                    await authService.getCurrentUser();

                setUser(currentUser);

                return currentUser;
            } catch (error) {
                console.warn(
                    'Access token validation failed:',
                    error,
                );

                try {
                    const refreshData =
                        await authService.refreshAccessToken();

                    if (!refreshData?.access_token) {
                        throw new Error(
                            'Token refresh failed.',
                        );
                    }

                    const refreshedUser =
                        await authService.getCurrentUser();

                    setUser(refreshedUser);

                    return refreshedUser;
                } catch (refreshError) {
                    console.warn(
                        'Session refresh failed:',
                        refreshError,
                    );

                    authService.clearTokens();
                    setUser(null);

                    return null;
                }
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );


    useEffect(() => {
        loadCurrentUser();
    }, [loadCurrentUser]);


    const loginWithPassword = useCallback(
        async (identifier, password) => {
            const response =
                await authService.loginWithPassword(
                    identifier,
                    password,
                );

            return response;
        },
        [],
    );


    const verifyLoginOTP = useCallback(
        async (identifier, otp) => {
            const tokenData =
                await authService.verifyLoginOTP(
                    identifier,
                    otp,
                );

            const currentUser =
                await authService.getCurrentUser();

            setUser(currentUser);

            return {
                ...tokenData,
                user: currentUser,
            };
        },
        [],
    );


    const registerPatient = useCallback(
        async (data) => {
            return authService.registerPatient(data);
        },
        [],
    );


    const registerHospitalAdmin = useCallback(
        async (data) => {
            return authService.registerHospitalAdmin(data);
        },
        [],
    );


    const verifyRegistrationOTP = useCallback(
        async (identifier, otp) => {
            return authService.verifyRegistrationOTP(
                identifier,
                otp,
            );
        },
        [],
    );


    const loginParamedic = useCallback(
        async (mobileNumber) => {
            return authService.sendParamedicOTP(
                mobileNumber,
            );
        },
        [],
    );


    const verifyParamedicOTP = useCallback(
        async (mobileNumber, otp) => {
            const tokenData =
                await authService.verifyParamedicOTP(
                    mobileNumber,
                    otp,
                );

            const currentUser =
                await authService.getCurrentUser();

            setUser(currentUser);

            return {
                ...tokenData,
                user: currentUser,
            };
        },
        [],
    );


    const logout = useCallback(
        async () => {
            try {
                await authService.logout();
            } finally {
                setUser(null);
            }
        },
        [],
    );


    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isLoading,

            loginWithPassword,
            verifyLoginOTP,

            registerPatient,
            registerHospitalAdmin,
            verifyRegistrationOTP,

            loginParamedic,
            verifyParamedicOTP,

            logout,

            refreshUser: loadCurrentUser,
        }),
        [
            user,
            isAuthenticated,
            isLoading,
            loginWithPassword,
            verifyLoginOTP,
            registerPatient,
            registerHospitalAdmin,
            verifyRegistrationOTP,
            loginParamedic,
            verifyParamedicOTP,
            logout,
            loadCurrentUser,
        ],
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside an AuthProvider.',
        );
    }

    return context;
}