import api from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        isProfileComplete: boolean;
        isEmailVerified: boolean;
    };
}

export const authService = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const res = await api.post('/auth/login', data);
        return res.data;
    },

    getMe: async () => {
        const res = await api.get('/auth/me');
        return res.data;
    }
};
