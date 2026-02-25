import api from './api';

export const userService = {
    getProfile: async () => {
        const res = await api.get('/users/profile');
        return res.data;
    },

    updateProfile: async (data: any) => {
        const res = await api.put('/users/profile', data);
        return res.data;
    }
};

export const notificationService = {
    getNotifications: async () => {
        const res = await api.get('/notifications');
        return res.data;
    },

    markAsRead: async (id: string) => {
        const res = await api.put(`/notifications/${id}/read`);
        return res.data;
    },

    markAllAsRead: async () => {
        const res = await api.put('/notifications/read-all');
        return res.data;
    }
};

export const adminService = {
    getStats: async () => {
        const res = await api.get('/admin/stats');
        return res.data;
    },

    getUsers: async (page = 1) => {
        const res = await api.get('/admin/users', { params: { page } });
        return res.data;
    },

    deleteUser: async (id: string) => {
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    }
};
