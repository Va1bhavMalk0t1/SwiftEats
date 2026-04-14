import axios from 'axios'

// ✅ FIXED PORT (VERY IMPORTANT)
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ───────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/signup', data),
  signin: (data) => api.post('/signin', data),
  getUser: () => api.get('/user'),
}

// ─── Food API ───────────────────────────────────────────────────
export const foodAPI = {
  getHome: () => api.get('/foods/home'),
  getCategories: () => api.get('/foods/home/categories'),
  getByCategory: (category) => api.get(`/foods/home/categories/${encodeURIComponent(category)}`),
  create: (data) => api.post('/foods', data),
}

// ─── Restaurant API ─────────────────────────────────────────────
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
}

// ─── Search API ─────────────────────────────────────────────────
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
}

// ─── Admin API (FIXED ROUTES) ───────────────────────────────────
export const adminAPI = {
  makeAdmin: (id) => api.put(`/admin/make-admin/${id}`),
  makeOwner: (id) => api.put(`/admin/make-owner/${id}`),

  getOrders: () => api.get('/admin/orders'),
  updateOrder: (orderId, data) => api.put(`/admin/order/${orderId}`, data),
}

// ─── Cart API ───────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  remove: (foodId) => api.delete(`/cart/remove/${foodId}`),
  update: (data) => api.put('/cart/update', data),
}

// ─── Order API ──────────────────────────────────────────────────
export const orderAPI = {
  create: (address) => api.post('/orders/create', { address }),
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/${orderId}`),
}

export default api