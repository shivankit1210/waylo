import { create } from 'zustand';
import type { User } from '@waylo/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  getToken: () => string | null;
}

const STORAGE_KEY_TOKEN = 'waylo_auth_token';
const STORAGE_KEY_USER = 'waylo_auth_user';

const initialToken = localStorage.getItem(STORAGE_KEY_TOKEN);
const initialUserJson = localStorage.getItem(STORAGE_KEY_USER);
let initialUser: User | null = null;

if (initialUserJson) {
  try {
    initialUser = JSON.parse(initialUserJson);
  } catch {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),

  setAuth: (user: User, token: string) => {
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
