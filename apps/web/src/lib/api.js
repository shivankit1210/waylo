import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
});
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
});
export default apiClient;
//# sourceMappingURL=api.js.map