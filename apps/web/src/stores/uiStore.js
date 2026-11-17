import { create } from 'zustand';
const THEME_STORAGE_KEY = 'waylo_theme';
const getInitialTheme = () => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};
const initialTheme = getInitialTheme();
if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
}
else {
    document.documentElement.classList.remove('dark');
}
export const useUIStore = create((set, get) => ({
    sidebarOpen: true,
    mobileMenuOpen: false,
    theme: initialTheme,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    setTheme: (theme) => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        set({ theme });
    },
    toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
    },
}));
//# sourceMappingURL=uiStore.js.map