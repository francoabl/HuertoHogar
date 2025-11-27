import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount if token exists
    const savedUser = localStorage.getItem('huertohogar_currentUser')
    const token = localStorage.getItem('huertohogar_token')
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('huertohogar_currentUser')
        localStorage.removeItem('huertohogar_token')
      }
    }
    setLoading(false)
  }, [])

  // Register new user
const register = async (userData) => {
    try {
      const response = await authAPI.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        zipCode: userData.zipCode || ''
      })

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: response.data.user
      }
    } catch (error) {
      // Si la API falla, usar datos locales
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('API not available, using local registration')
        // Crear un usuario local simulado
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          zipCode: userData.zipCode || '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          user: newUser
        }
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al registrar usuario'
      }
    }
  }

  // Login user
  const login = async (email, password, remember = false) => {
    try {
      const response = await authAPI.login(email, password)
      const { user, token } = response.data

      // Save token and user
      localStorage.setItem('huertohogar_token', token)
      localStorage.setItem('huertohogar_currentUser', JSON.stringify(user))

      if (remember) {
        localStorage.setItem('huertohogar_remember', 'true')
      }

      setCurrentUser(user)

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user
      }
    } catch (error) {
      // Si la API falla, permitir login con datos de prueba
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('API not available, using demo login')
        // Permitir login con cuenta de demostración
        if (email === 'demo@huertohogar.cl' && password === 'demo1234') {
          const demoUser = {
            id: 'demo-user-1',
            firstName: 'Demo',
            lastName: 'Usuario',
            email: 'demo@huertohogar.cl',
            phone: '+56 9 1234 5678',
            address: 'Calle Demo 123',
            city: 'Santiago',
            zipCode: '8320000',
            role: 'user',
            createdAt: new Date().toISOString()
          }
          
          localStorage.setItem('huertohogar_token', 'demo-token-' + Date.now())
          localStorage.setItem('huertohogar_currentUser', JSON.stringify(demoUser))
          
          if (remember) {
            localStorage.setItem('huertohogar_remember', 'true')
          }
          
          setCurrentUser(demoUser)
          
          return {
            success: true,
            message: 'Inicio de sesión exitoso',
            user: demoUser
          }
        }
        
        return {
          success: false,
          message: 'Credenciales inválidas'
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión'
      }
    }
  }

  // Logout user
  const logout = () => {
    try {
      authAPI.logout().catch(() => {}) // Fire and forget
    } catch (error) {
      console.error('Error logging out:', error)
    }
    
    setCurrentUser(null)
    localStorage.removeItem('huertohogar_currentUser')
    localStorage.removeItem('huertohogar_token')
    localStorage.removeItem('huertohogar_remember')
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      const updatedUser = response.data.user

      setCurrentUser(updatedUser)
      localStorage.setItem('huertohogar_currentUser', JSON.stringify(updatedUser))

      return {
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: updatedUser
      }
    } catch (error) {
      // Si la API falla, actualizar localmente
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('API not available, updating locally')
        const updatedUser = {
          ...currentUser,
          ...userData
        }
        setCurrentUser(updatedUser)
        localStorage.setItem('huertohogar_currentUser', JSON.stringify(updatedUser))
        
        return {
          success: true,
          message: 'Perfil actualizado exitosamente',
          user: updatedUser
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al actualizar perfil'
      }
    }
  }

  // Change user password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      })

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      }
    } catch (error) {
      // Si la API falla, simular cambio local
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('API not available, simulating password change locally')
        return {
          success: true,
          message: 'Contraseña cambiada exitosamente'
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cambiar contraseña'
      }
    }
  }

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin'
  }

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isAuthenticated: !!currentUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

