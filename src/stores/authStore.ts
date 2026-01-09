import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
    isTokenExpired: (token: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            login: (user, accessToken, refreshToken) => {
                // Also manually set localStorage for API client to pick up easily without accessing store
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                }
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                }
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
            setUser: (user) => set({ user }),
            isTokenExpired: (token: string): boolean => {
                if (!token) return true;
                try {
                    const parts = token.split('.');
                    if (parts.length !== 3) return true;
                    const payload = JSON.parse(atob(parts[1]));
                    if (!payload.exp) return true;
                    const now = Math.floor(Date.now() / 1000);
                    return payload.exp < now;
                } catch {
                    return true;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
