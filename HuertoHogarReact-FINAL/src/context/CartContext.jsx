import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { cartAPI } from '../services/api'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Only try to load from API if user is authenticated
        const token = localStorage.getItem('huertohogar_token')
        if (token) {
          try {
            const response = await cartAPI.get()
            setCart(response.data.items || [])
          } catch (error) {
            // Si falla la API, usar localStorage
            if (error.code === 'ERR_NETWORK' || !error.response) {
              const savedCart = localStorage.getItem('huertohogar_cart')
              if (savedCart) {
                try {
                  setCart(JSON.parse(savedCart))
                } catch (e) {
                  console.error('Error loading cart from localStorage:', e)
                }
              }
            } else {
              throw error
            }
          }
        } else {
          // Load from localStorage if no token
          const savedCart = localStorage.getItem('huertohogar_cart')
          if (savedCart) {
            try {
              setCart(JSON.parse(savedCart))
            } catch (e) {
              console.error('Error loading cart from localStorage:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await cartAPI.add(product.id, quantity)
      setCart(response.data.items || [])
      
      // Fallback: update local state if needed
      return {
        success: true,
        message: 'Producto agregado al carrito'
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Fallback: update local cart
      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(item => item.id === product.id)
        
        if (existingIndex !== -1) {
          const newCart = [...prevCart]
          newCart[existingIndex].quantity += quantity
          localStorage.setItem('huertohogar_cart', JSON.stringify(newCart))
          return newCart
        } else {
          const newCart = [...prevCart, {
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            categoria: product.categoria,
            quantity: quantity
          }]
          localStorage.setItem('huertohogar_cart', JSON.stringify(newCart))
          return newCart
        }
      })
      
      return {
        success: true,
        message: 'Producto agregado al carrito (offline)'
      }
    }
  }

  // Remove product from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await cartAPI.remove(productId)
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Error removing from cart:', error)
      // Fallback: update local cart
      const newCart = cart.filter(item => item.id !== productId)
      setCart(newCart)
      localStorage.setItem('huertohogar_cart', JSON.stringify(newCart))
    }
  }

  // Update product quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    try {
      const response = await cartAPI.update(productId, newQuantity)
      setCart(response.data.items || [])
    } catch (error) {
      console.error('Error updating quantity:', error)
      // Fallback: update local cart
      const newCart = [...cart]
      const index = newCart.findIndex(item => item.id === productId)
      if (index !== -1) {
        newCart[index].quantity = newQuantity
        setCart(newCart)
        localStorage.setItem('huertohogar_cart', JSON.stringify(newCart))
      }
    }
  }

  // Clear cart
  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setCart([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Fallback: clear local cart
      setCart([])
      localStorage.removeItem('huertohogar_cart')
    }
  }

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0)
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }

  // Get product quantity in cart
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isInCart,
    getProductQuantity
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
}
