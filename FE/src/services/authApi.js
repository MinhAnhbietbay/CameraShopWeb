import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const authApi = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getCurrentUser: () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            return true;
        }
        return false;
    },

    // Thêm interceptor để tự động thêm token vào header
    setupAxiosInterceptors: () => {
        axios.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Xử lý refresh token khi access token hết hạn
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                            refreshToken
                        });
                        const { accessToken } = response.data;
                        localStorage.setItem('accessToken', accessToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axios(originalRequest);
                    } catch (error) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
};