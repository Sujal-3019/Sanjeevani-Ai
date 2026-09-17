import { api } from './api';


const ACCESS_TOKEN_KEY = 'sanjeevani_access_token';
const REFRESH_TOKEN_KEY = 'sanjeevani_refresh_token';


function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}


function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}


function saveTokens(data) {
    if (data?.access_token) {
        localStorage.setItem(
            ACCESS_TOKEN_KEY,
            data.access_token,
        );
    }

    if (data?.refresh_token) {
        localStorage.setItem(
            REFRESH_TOKEN_KEY,
            data.refresh_token,
        );
    }
}


function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}


async function registerPatient(data) {
    return api.post(
        '/auth/register/patient',
        {
            full_name: data.full_name,
            email: data.email,
            mobile_number: data.mobile_number,
            password: data.password,
            confirm_password: data.confirm_password,
        },
    );
}


async function registerHospitalAdmin(data) {
    return api.post(
        '/auth/register/hospital-admin',
        {
            full_name: data.full_name,
            email: data.email,
            mobile_number: data.mobile_number,
            password: data.password,
            confirm_password: data.confirm_password,
        },
    );
}


async function verifyRegistrationOTP(
    identifier,
    otp,
) {
    return api.post(
        '/auth/register/verify-otp',
        {
            identifier,
            otp,
        },
    );
}


async function loginWithPassword(
    identifier,
    password,
) {
    return api.post(
        '/auth/login/password',
        {
            identifier,
            password,
        },
    );
}


async function verifyLoginOTP(
    identifier,
    otp,
) {
    const data = await api.post(
        '/auth/login/verify-otp',
        {
            identifier,
            otp,
        },
    );

    saveTokens(data);

    return data;
}


async function sendParamedicOTP(mobileNumber) {
    return api.post(
        '/auth/paramedic/otp/send',
        {
            mobile_number: mobileNumber,
        },
    );
}


async function verifyParamedicOTP(
    mobileNumber,
    otp,
) {
    const data = await api.post(
        '/auth/paramedic/otp/verify',
        {
            mobile_number: mobileNumber,
            otp,
        },
    );

    saveTokens(data);

    return data;
}


async function getCurrentUser() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return null;
    }

    return api.get(
        '/auth/me',
        {
            token: accessToken,
        },
    );
}


async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        return null;
    }

    try {
        const data = await api.post(
            '/auth/refresh',
            {
                refresh_token: refreshToken,
            },
        );

        saveTokens(data);

        return data;
    } catch (error) {
        clearTokens();
        throw error;
    }
}


async function logout() {
    const refreshToken = getRefreshToken();

    try {
        if (refreshToken) {
            await api.post(
                '/auth/logout',
                {
                    refresh_token: refreshToken,
                },
            );
        }
    } finally {
        clearTokens();
    }
}


const authService = {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens,

    registerPatient,
    registerHospitalAdmin,
    verifyRegistrationOTP,

    loginWithPassword,
    verifyLoginOTP,

    sendParamedicOTP,
    verifyParamedicOTP,

    getCurrentUser,
    refreshAccessToken,
    logout,
};


export default authService;