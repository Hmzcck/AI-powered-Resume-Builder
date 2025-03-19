export type LoginData = {
    email: string;
    password: string;
};

export type RegisterData = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type AuthResponse = {
    token: string;
    refreshToken: string;
    user : {
        id: number;
        email: string;
    };
};

export type AuthError = {
    message: string;
    errors?: Record<string, string[]>;
};
