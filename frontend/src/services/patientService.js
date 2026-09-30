import { api } from './api.js';

export async function getPatientProfile(
    token,
) {
    return api.get(
        '/patient/profile',
        {
            token,
        },
    );
}

export async function createPatientProfile(
    payload,
    token,
) {
    return api.post(
        '/patient/profile',
        payload,
        {
            token,
        },
    );
}

export async function updatePatientProfile(
    payload,
    token,
) {
    return api.put(
        '/patient/profile',
        payload,
        {
            token,
        },
    );
}

export async function reverseGeocodePatientLocation(
    latitude,
    longitude,
    token,
) {
    return api.get(
        `/patient/location/reverse-geocode?latitude=${encodeURIComponent(
            latitude,
        )}&longitude=${encodeURIComponent(
            longitude,
        )}`,
        {
            token,
        },
    );
}

export const patientService = {
    getProfile: getPatientProfile,
    createProfile: createPatientProfile,
    updateProfile: updatePatientProfile,
    reverseGeocodeLocation:
        reverseGeocodePatientLocation,
};

export default patientService;