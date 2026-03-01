import { create } from 'zustand';
import { setAuthToken } from '../api/client';

interface User {
    id: number;
    username: string;
    email: string;
    roleType?: 'student' | 'teacher';
    class?: string;
    city?: string;
}

interface AuthState {
    user: User | null;
    role: 'student' | 'teacher' | null;
    token: string | null;
    darkMode: boolean;
    setAuth: (user: User, token: string, role: 'student' | 'teacher') => void;
    logout: () => void;
    toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    token: null,
    darkMode: false,

    setAuth: (user, token, role) => {
        // Inject JWT into all future API requests
        setAuthToken(token);
        set({ user, token, role });
    },

    logout: () => {
        setAuthToken(null);
        set({ user: null, role: null, token: null });
    },

    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
