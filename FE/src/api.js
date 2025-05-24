import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Product APIs
export const productApi = {
    getAll: (params) => api.get('/products/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products/add', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Cart APIs
export const cartApi = {
    getCart: () => api.get('/cart/cart-list'),
    addToCart: (data) => api.post('/cart/add-to-cart', data),
    updateCart: (productId, data) => api.put(`/cart/update-product/${productId}`, data),
    removeFromCart: (productId) => api.delete(`/cart/delete-product/${productId}`),
};

// Order APIs
export const orderApi = {
    createOrder: () => api.get('/orders/create-order'),
    getOrders: (params) => api.get('/orders/order-list', { params }),
    getMyOrders: () => api.get('/orders/my-orders'),
};

// Auth APIs
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
};

export default api; 