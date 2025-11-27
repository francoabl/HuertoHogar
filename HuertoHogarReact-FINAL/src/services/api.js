import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('huertohogar_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Handle responses and errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // No redirigir por errores de red - dejar que la aplicación maneje estos errores
    if (!error.response) {
      return Promise.reject(error)
    }

    // Solo redirigir a login si hay un 401 Y estamos intentando acceder a una ruta protegida
    if (error.response.status === 401) {
      // Token expired or invalid - solo limpiar si estamos en una ruta que requiere autenticación
      const pathname = window.location.pathname
      const protectedRoutes = ['/perfil', '/admin', '/carrito-checkout']
      
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        localStorage.removeItem('huertohogar_token')
        localStorage.removeItem('huertohogar_currentUser')
        if (pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  profile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
  changePassword: (passwordData) => apiClient.post('/auth/change-password', passwordData)
}

// Products endpoints
export const productsAPI = {
  getAll: (filters = {}) => apiClient.get('/productos', { params: filters }),
  getById: (id) => apiClient.get(`/productos/${id}`),
  search: (query) => apiClient.get('/productos/search', { params: { nombre: query } })
}

// Cart endpoints
export const cartAPI = {
  get: () => apiClient.get('/cart'),
  add: (productId, quantity) => apiClient.post('/cart', { productId, quantity }),
  update: (productId, quantity) => apiClient.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => apiClient.delete(`/cart/${productId}`),
  clear: () => apiClient.post('/cart/clear')
}

// Orders endpoints
export const ordersAPI = {
  create: (orderData) => apiClient.post('/orders', orderData),
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`)
}

// Users endpoints
export const usersAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`)
}

// Blog endpoints
export const blogAPI = {
  getAll: () => apiClient.get('/blog'),
  getById: (id) => apiClient.get(`/blog/${id}`)
}

// Contact endpoints
export const contactAPI = {
  send: (contactData) => apiClient.post('/contact', contactData)
}

export default apiClient
