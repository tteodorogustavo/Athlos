import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para refresh token automático
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    Cookies.set('access_token', access);

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login/', { email, password });
        return response.data;
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
    },
    getMe: async () => {
        const response = await api.get('/auth/me/');
        return response.data;
    },
};

// Academias
export const academiaAPI = {
    list: async () => {
        const response = await api.get('/academias/');
        return response.data;
    },
    get: async (id: number | string) => {
        const response = await api.get(`/academias/${id}/`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/academias/', data);
        return response.data;
    },
    update: async (id: number | string, data: any) => {
        const response = await api.put(`/academias/${id}/`, data);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`/academias/${id}/`);
        return response.data;
    },
};

// Alunos
export const alunoAPI = {
    list: async (params?: { personal?: string | number; academia?: string | number }) => {
        let url = '/alunos/';
        const searchParams = new URLSearchParams();
        if (params?.personal) searchParams.append('personal', params.personal.toString());
        if (params?.academia) searchParams.append('academia', params.academia.toString());
        if (searchParams.toString()) url += `?${searchParams.toString()}`;
        const response = await api.get(url);
        return response.data;
    },
    get: async (id: number | string) => {
        const response = await api.get(`/alunos/${id}/`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/alunos/', data);
        return response.data;
    },
    update: async (id: number | string, data: any) => {
        const response = await api.put(`/alunos/${id}/`, data);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`/alunos/${id}/`);
        return response.data;
    },
};

// Treinos
export const treinoAPI = {
    list: async (params?: { aluno?: string | number }) => {
        let url = '/treinos/';
        if (params?.aluno) {
            url += `?aluno=${params.aluno}`;
        }
        const response = await api.get(url);
        return response.data;
    },
    get: async (id: number | string) => {
        const response = await api.get(`/treinos/${id}/`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/treinos/', data);
        return response.data;
    },
    update: async (id: number | string, data: any) => {
        const response = await api.put(`/treinos/${id}/`, data);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`/treinos/${id}/`);
        return response.data;
    },
};

// Exercícios
export const exercicioAPI = {
    list: async () => {
        const response = await api.get('/exercicios/');
        return response.data;
    },
    get: async (id: number | string) => {
        const response = await api.get(`/exercicios/${id}/`);
        return response.data;
    },
};

// Dashboard Stats
export const dashboardAPI = {
    getPersonalStats: async () => {
        const response = await api.get('/dashboard/personal/');
        return response.data;
    },
    getAlunoStats: async () => {
        const response = await api.get('/dashboard/aluno/');
        return response.data;
    },
    getAcademiaStats: async () => {
        const response = await api.get('/dashboard/academia/');
        return response.data;
    },
    getAdminStats: async () => {
        const response = await api.get('/dashboard/admin/');
        return response.data;
    },
};

// Personal Trainers
export const personalAPI = {
    list: async (params?: { academia?: string | number }) => {
        let url = '/personais/';
        if (params?.academia) {
            url += `?academia=${params.academia}`;
        }
        const response = await api.get(url);
        return response.data;
    },
    get: async (id: number | string) => {
        const response = await api.get(`/personais/${id}/`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/personais/', data);
        return response.data;
    },
    update: async (id: number | string, data: any) => {
        const response = await api.put(`/personais/${id}/`, data);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(`/personais/${id}/`);
        return response.data;
    },
};

// Relatórios
export const relatorioAPI = {
    getPersonalReport: async (periodo?: string, alunoId?: string) => {
        const params = new URLSearchParams();
        if (periodo) params.append('periodo', periodo);
        if (alunoId && alunoId !== 'todos') params.append('aluno_id', alunoId);
        const response = await api.get(`/relatorios/personal/?${params.toString()}`);
        return response.data;
    },
    getAlunoReport: async (periodo?: string) => {
        const params = periodo ? `?periodo=${periodo}` : '';
        const response = await api.get(`/relatorios/aluno/${params}`);
        return response.data;
    },
    getAcademiaReport: async (periodo?: string) => {
        const params = periodo ? `?periodo=${periodo}` : '';
        const response = await api.get(`/relatorios/academia/${params}`);
        return response.data;
    },
    getAdminReport: async (periodo?: string) => {
        const params = periodo ? `?periodo=${periodo}` : '';
        const response = await api.get(`/relatorios/admin/${params}`);
        return response.data;
    },
};

export default api;
