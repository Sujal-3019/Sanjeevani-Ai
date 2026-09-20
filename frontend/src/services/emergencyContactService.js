import { api } from './api.js';

export async function getEmergencyContacts(token) {
    return api.get('/patient/emergency-contacts', {
        token,
    });
}

export async function createEmergencyContact(
    payload,
    token,
) {
    return api.post(
        '/patient/emergency-contacts',
        payload,
        {
            token,
        },
    );
}

export async function updateEmergencyContact(
    contactId,
    payload,
    token,
) {
    return api.put(
        `/patient/emergency-contacts/${contactId}`,
        payload,
        {
            token,
        },
    );
}

export async function deleteEmergencyContact(
    contactId,
    token,
) {
    return api.delete(
        `/patient/emergency-contacts/${contactId}`,
        {
            token,
        },
    );
}

export async function makeEmergencyContactPrimary(
    contactId,
    token,
) {
    return api.patch(
        `/patient/emergency-contacts/${contactId}/primary`,
        {},
        {
            token,
        },
    );
}

export const emergencyContactService = {
    getContacts: getEmergencyContacts,
    createContact: createEmergencyContact,
    updateContact: updateEmergencyContact,
    deleteContact: deleteEmergencyContact,
    makePrimary: makeEmergencyContactPrimary,
};