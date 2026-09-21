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

export const emergencyService = {
    createSOS: createEmergencySOS,
    getSOS: getEmergencySOS,
};

export default emergencyService;