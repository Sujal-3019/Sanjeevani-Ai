
import { api } from './api';
import authService from './authService';

const getToken = () => authService.getAccessToken();

const hospitalService = {
    async getDashboard() {
        return api.get('/hospital/dashboard', {
            token: getToken(),
        });
    },

    async getProfile() {
        return api.get('/hospital/profile', {
            token: getToken(),
        });
    },

    async updateProfile(data) {
        return api.put('/hospital/profile', data, {
            token: getToken(),
        });
    },
};

export default hospitalService;