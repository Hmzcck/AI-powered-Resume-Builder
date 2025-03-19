import { AuthError, AuthResponse, LoginData, RegisterData } from '@/types/auth';

const API_URL = 'http://localhost:5235/api';

export class AuthenticationError extends Error {
    constructor(public error: AuthError) {
        super(error.message);
    }
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new AuthenticationError(error);
        }

        return response.json();
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new AuthenticationError(error);
        }

        return response.json();
    },

    getStoredToken(): string | null {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    },

    storeToken(token: string): void {
        // Set cookie with HTTPOnly and Secure flags
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Strict${location.protocol === 'https:' ? '; Secure' : ''}`;
    },

    removeToken(): void {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    isAuthenticated(): boolean {
        return !!this.getStoredToken();
    }
};
