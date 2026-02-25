import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse } from '../services/authService';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isProfileComplete: boolean;
    isEmailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            const savedToken = localStorage.getItem('gymbuddy_token');

            if (!savedToken) {
                // No token at all — not logged in
                setIsLoading(false);
                return;
            }

            try {
                // Validate token with backend — if expired/invalid this throws 401
                const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/me`, {
                    headers: { Authorization: `Bearer ${savedToken}` }
                });

                if (!res.ok) throw new Error('Invalid token');

                const data = await res.json();
                // Token is valid — restore session with fresh user data from backend
                setToken(savedToken);
                setUser(data.user);
                localStorage.setItem('gymbuddy_user', JSON.stringify(data.user));
            } catch {
                // Token invalid or expired — clear everything
                localStorage.removeItem('gymbuddy_token');
                localStorage.removeItem('gymbuddy_user');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        validateSession();
    }, []);

    const handleAuthResponse = (data: AuthResponse) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('gymbuddy_token', data.token);
        localStorage.setItem('gymbuddy_user', JSON.stringify(data.user));
    };

    const login = async (email: string, password: string) => {
        const data = await authService.login({ email, password });
        handleAuthResponse(data);
    };

    const register = async (name: string, email: string, password: string, role?: string) => {
        const data = await authService.register({ name, email, password, role });
        handleAuthResponse(data);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('gymbuddy_token');
        localStorage.removeItem('gymbuddy_user');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...userData };
            setUser(updated);
            localStorage.setItem('gymbuddy_user', JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
