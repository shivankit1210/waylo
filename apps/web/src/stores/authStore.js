import { create } from 'zustand';
const STORAGE_KEY_TOKEN = 'waylo_auth_token';
const STORAGE_KEY_USER = 'waylo_auth_user';
const initialToken = localStorage.getItem(STORAGE_KEY_TOKEN);
const initialUserJson = localStorage.getItem(STORAGE_KEY_USER);
let initialUser = null;
if (initialUserJson) {
    try {
        initialUser = JSON.parse(initialUserJson);
    }
    catch {
        localStorage.removeItem(STORAGE_KEY_USER);
    }
}
export const useAuthStore = create((set, get) => ({
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),
    setAuth: (user, token) => {
        localStorage.setItem(STORAGE_KEY_TOKEN, token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        set({ user: null, token: null, isAuthenticated: false });
    },
    getToken: () => {
        return get().token ?? localStorage.getItem(STORAGE_KEY_TOKEN);
    },
}));
//# sourceMappingURL=authStore.js.map