import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 & refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Try to refresh token
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('access_token', accessToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (email: string, password: string, role: string) => {
        const response = await api.post('/auth/register', { email, password, role });
        return response.data;
    },

    me: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    refresh: async (refreshToken: string) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },
};

// Talleres API
export const talleresAPI = {
    create: async (data: any) => {
        const response = await api.post('/talleres', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/talleres');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/talleres/me');
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch(`/talleres/${id}`, data);
        return response.data;
    },

    updateMe: async (data: any) => {
        const response = await api.patch('/talleres/me', data);
        return response.data;
    },
};

// Tiendas API
export const tiendasAPI = {
    create: async (data: any) => {
        const response = await api.post('/tiendas', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/tiendas');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/tiendas/me');
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch(`/tiendas/${id}`, data);
        return response.data;
    },

    updateMe: async (data: any) => {
        const response = await api.patch('/tiendas/me', data);
        return response.data;
    },
};

// Repuestos API
export const repuestosAPI = {
    create: async (data: any) => {
        const response = await api.post('/repuestos', data);
        return response.data;
    },

    search: async (query: any) => {
        const response = await api.get('/repuestos/search', { params: query });
        return response.data;
    },

    getAll: async (tiendaId?: string) => {
        const response = await api.get('/repuestos', { params: { tiendaId } });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get(`/repuestos/${id}`);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch(`/repuestos/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/repuestos/${id}`);
        return response.data;
    },
};

// Cotizaciones API
export const cotizacionesAPI = {
    create: async (data: any) => {
        const response = await api.post('/cotizaciones', data);
        return response.data;
    },

    getAll: async (status?: string) => {
        const response = await api.get('/cotizaciones', { params: { status } });
        return response.data;
    },

    getAvailable: async () => {
        const response = await api.get('/cotizaciones/available');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get(`/cotizaciones/${id}`);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch(`/cotizaciones/${id}`, data);
        return response.data;
    },

    close: async (id: string) => {
        const response = await api.post(`/cotizaciones/${id}/close`);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/cotizaciones/${id}`);
        return response.data;
    },
};

// Ofertas API
export const ofertasAPI = {
    getAll: async () => {
        const response = await api.get('/ofertas/my-offers');
        return response.data;
    },

    create: async (cotizacionId: string, data: any) => {
        const response = await api.post(`/ofertas/cotizacion/${cotizacionId}`, data);
        return response.data;
    },

    getByCotizacion: async (cotizacionId: string) => {
        const response = await api.get(`/ofertas/cotizacion/${cotizacionId}`);
        return response.data;
    },

    compare: async (cotizacionId: string) => {
        const response = await api.get(`/ofertas/cotizacion/${cotizacionId}/compare`);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get(`/ofertas/${id}`);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/ofertas/${id}`);
        return response.data;
    },
};

// Pedidos API
export const pedidosAPI = {
    create: async (data: any) => {
        const response = await api.post('/pedidos', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/pedidos');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/pedidos/${id}/status`, { status });
        return response.data;
    },

    cancel: async (id: string) => {
        const response = await api.post(`/pedidos/${id}/cancel`);
        return response.data;
    },
};

// Admin API
export const adminAPI = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    toggleUserStatus: async (id: string) => {
        const response = await api.patch(`/admin/users/${id}/toggle-status`);
        return response.data;
    },

    getActivity: async () => {
        const response = await api.get('/admin/activity');
        return response.data;
    },

    getUserMetrics: async (userId: string) => {
        const response = await api.get(`/admin/users/${userId}/metrics`);
        return response.data;
    },

    getPlatformAnalytics: async (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get(`/admin/analytics?${params.toString()}`);
        return response.data;
    },

    // Cotizaciones Management
    getAllCotizaciones: async (filters?: {
        status?: string;
        tallerId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.tallerId) params.append('tallerId', filters.tallerId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/admin/cotizaciones?${params.toString()}`);
        return response.data;
    },

    getCotizacionById: async (id: string) => {
        const response = await api.get(`/admin/cotizaciones/${id}`);
        return response.data;
    },

    updateCotizacionStatus: async (id: string, status: string) => {
        const response = await api.patch(`/admin/cotizaciones/${id}/status`, { status });
        return response.data;
    },

    deleteCotizacion: async (id: string) => {
        const response = await api.delete(`/admin/cotizaciones/${id}`);
        return response.data;
    },

    // Ofertas Management
    getAllOfertas: async (filters?: {
        status?: string;
        tiendaId?: string;
        cotizacionId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.tiendaId) params.append('tiendaId', filters.tiendaId);
        if (filters?.cotizacionId) params.append('cotizacionId', filters.cotizacionId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/admin/ofertas?${params.toString()}`);
        return response.data;
    },

    getOfertaById: async (id: string) => {
        const response = await api.get(`/admin/ofertas/${id}`);
        return response.data;
    },

    updateOfertaStatus: async (id: string, status: string) => {
        const response = await api.patch(`/admin/ofertas/${id}/status`, { status });
        return response.data;
    },

    deleteOferta: async (id: string) => {
        const response = await api.delete(`/admin/ofertas/${id}`);
        return response.data;
    },

    // Pedidos Management
    getAllPedidos: async (filters?: {
        status?: string;
        tallerId?: string;
        tiendaId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.tallerId) params.append('tallerId', filters.tallerId);
        if (filters?.tiendaId) params.append('tiendaId', filters.tiendaId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/admin/pedidos?${params.toString()}`);
        return response.data;
    },

    getPedidoById: async (id: string) => {
        const response = await api.get(`/admin/pedidos/${id}`);
        return response.data;
    },

    updatePedidoStatus: async (id: string, status: string) => {
        const response = await api.patch(`/admin/pedidos/${id}/status`, { status });
        return response.data;
    },

    deletePedido: async (id: string) => {
        const response = await api.delete(`/admin/pedidos/${id}`);
        return response.data;
    },
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
};

