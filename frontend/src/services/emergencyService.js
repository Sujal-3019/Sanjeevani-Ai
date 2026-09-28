import { api } from './api.js';

export async function createEmergencySOS(
    payload,
    token,
) {
    return api.post(
        '/patient/emergency/sos',
        payload,
        {
            token,
        },
    );
}

export async function getEmergencySOS(
    sosId,
    token,
) {
    return api.get(
        `/patient/emergency/${sosId}`,
        {
            token,
        },
    );
}

export async function getEmergencyHistory(
    token,
) {
    return api.get(
        '/patient/emergency-history',
        {
            token,
        },
    );
}

export const emergencyService = {
    createSOS: createEmergencySOS,
    getSOS: getEmergencySOS,
    getHistory: getEmergencyHistory,
};

export default emergencyService;