import { api } from './api.js';

export async function getEmergencyShare(
    token,
) {
    return api.get(
        `/emergency-share/${encodeURIComponent(token)}`,
    );
}

export const emergencyShareService = {
    getShare: getEmergencyShare,
};

export default emergencyShareService;