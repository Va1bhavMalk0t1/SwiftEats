import axios from 'axios'

// ─── Base Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`
    }else{
      delete config.headers.Authorization;
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirect to login if token expired mid-session
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth Endpoints ──────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/signup', data),
  signin: (data) => api.post('/signin', data),
  getUser: () => api.get('/user'),
}

// ─── Food Endpoints ──────────────────────────────────────────────────────────
export const foodAPI = {
  getHome: () => api.get('/foods/home'),
  getCategories: () => api.get('/foods/home/categories'),
  getByCategory: (category) => api.get(`/foods/home/categories/${encodeURIComponent(category)}`),
  create: (data) => api.post('/foods', data),
}

// ─── Restaurant Endpoints ─────────────────────────────────────────────────────
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
}

// ─── Search Endpoint ──────────────────────────────────────────────────────────
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
}

// ─── Admin Endpoints ──────────────────────────────────────────────────────────
export const adminAPI = {
  makeAdmin: (id) => api.put(`/users/make-admin/${id}`),
  makeOwner: (id) => api.put(`/users/make-owner/${id}`),
}

export default api
