import axios from 'axios';

// Apuntamos al backend
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Interceptor: Antes de cada peticion pega el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;