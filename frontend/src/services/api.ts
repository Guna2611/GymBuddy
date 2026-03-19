import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - attach JWT token, fix Content-Type for FormData
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('rep_token') || localStorage.getItem('gymbuddy_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('gymbuddy_token');
            localStorage.removeItem('gymbuddy_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
