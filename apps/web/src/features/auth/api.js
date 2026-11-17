import { apiClient } from '@/lib/api';
export async function login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
}
export async function register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
}
export async function getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
}
export async function logout() {
    try {
        await apiClient.post('/auth/logout');
    }
    catch {
        // Ignore error on logout
    }
}
//# sourceMappingURL=api.js.map