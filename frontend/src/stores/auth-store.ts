import { AuthResponse } from '@/types/auth';
import { create } from 'zustand';
import { authService } from '@/services/auth-service';

type AuthStore = {
    user: AuthResponse['user'] | null;
    isAuthenticated: boolean;
    setAuth: (response: AuthResponse | null) => void;
    logout: () => void;
    initialize: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    setAuth: (response) => {
        if (response) {
            authService.storeToken(response.token);
            set({
                user: response.user,
                isAuthenticated: true,
            });
        } else {
            authService.removeToken();
            set({
                user: null,
                isAuthenticated: false,
            });
        }
    },
    logout: () => {
        authService.removeToken();
        set({
            user: null,
            isAuthenticated: false,
        });
    },
    initialize: () => {
        const token = authService.getStoredToken();
        set({ isAuthenticated: !!token });
    },
}));
