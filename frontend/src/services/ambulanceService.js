
import { api } from './api';
import authService from './authService';

const BASE_PATH = '/hospital/ambulances';

function getToken() {
    return authService.getAccessToken();
}

function toCrewMember(member, index) {
    return {
        id: member.id ?? index + 1,
        name: member.name ?? '',
        phone: member.phone ?? '',
        role: member.role ?? 'Other',
        qualification: member.qualification ?? '',
        primary: Boolean(member.is_primary ?? member.primary),
    };
}

function normalizeAmbulance(item) {
    const crew = Array.isArray(item.crew) ? item.crew : [];

    const equipment = Array.isArray(item.equipment)
        ? item.equipment
        : typeof item.equipment === 'string'
          ? item.equipment.split(',').map(part => part.trim()).filter(Boolean)
          : [];

    return {
        recordId: item.id ?? item.ambulance_id ?? item.record_id,
        id: String(
            item.ambulance_code ??
            item.code ??
            item.display_id ??
            item.id ??
            ''
        ),
        registrationNumber:
            item.registration_number ?? item.registrationNumber ?? '',
        type: String(item.ambulance_type ?? item.type ?? 'BLS').toUpperCase(),
        status: String(item.status ?? 'OFFLINE').toUpperCase(),
        location: item.current_location ?? item.location ?? 'Location not reported',
        lastUpdated: item.updated_at
            ? new Date(item.updated_at).toLocaleString()
            : item.last_updated ?? 'Not reported',
        equipment,
        notes: item.notes ?? '',
        crew: crew.map(toCrewMember),
    };
}

function unwrapList(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.ambulances)) return response.ambulances;
    if (Array.isArray(response?.results)) return response.results;

    throw new Error(
        'The ambulance API returned an unexpected response. Expected a list of ambulances.'
    );
}

const ambulanceService = {
    async list() {
        const response = await api.get(BASE_PATH, {
            token: getToken(),
        });

        return unwrapList(response).map(normalizeAmbulance);
    },

    async create(payload) {
        const response = await api.post(BASE_PATH, payload, {
            token: getToken(),
        });

        return response ? normalizeAmbulance(response) : null;
    },

    async update(id, payload) {
        const response = await api.put(
            `${BASE_PATH}/${encodeURIComponent(id)}`,
            payload,
            { token: getToken() }
        );

        return response ? normalizeAmbulance(response) : null;
    },

    async remove(id) {
        return api.delete(
            `${BASE_PATH}/${encodeURIComponent(id)}`,
            { token: getToken() }
        );
    },
};

export default ambulanceService;
