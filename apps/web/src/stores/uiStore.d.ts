type Theme = 'light' | 'dark';
interface UIState {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    theme: Theme;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}
export declare const useUIStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UIState>>;
export {};
//# sourceMappingURL=uiStore.d.ts.map