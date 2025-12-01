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

  // Validate and clean cart item
  const validateCartItem = (item) => {
    if (!item || typeof item !== 'object') return null
    
    return {
      id: item.id || item.productId,
      nombre: item.nombre || '',
      precio: Number(item.precio) || 0,
      imagenUrl: item.imagenUrl || item.imagen || '',
      categoria: item.categoria || '',
      quantity: Number(item.quantity) || Number(item.cantidad) || 1
    }
  }

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Only try to load from API if user is authenticated
        const token = localStorage.getItem('huertohogar_token')
        if (token) {
          try {
            const response = await cartAPI.get()
            const items = (response.data.items || []).map(validateCartItem).filter(item => item !== null)
            setCart(items)
          } catch (error) {
            // Si falla la API, usar localStorage
            if (error.code === 'ERR_NETWORK' || !error.response) {
              const savedCart = localStorage.getItem('huertohogar_cart')
              if (savedCart) {
                try {
                  const parsed = JSON.parse(savedCart)
                  const items = parsed.map(validateCartItem).filter(item => item !== null)
                  setCart(items)
                } catch (e) {
                  console.error('Error loading cart from localStorage:', e)
                  localStorage.removeItem('huertohogar_cart')
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
              const parsed = JSON.parse(savedCart)
              const items = parsed.map(validateCartItem).filter(item => item !== null)
              setCart(items)
            } catch (e) {
              console.error('Error loading cart from localStorage:', e)
              localStorage.removeItem('huertohogar_cart')
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
      const items = (response.data.items || []).map(validateCartItem).filter(item => item !== null)
      setCart(items)
      
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
          const newItem = validateCartItem({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagenUrl: product.imagenUrl || product.imagen,
            categoria: product.categoria,
            quantity: quantity
          })
          const newCart = [...prevCart, newItem]
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
      const items = (response.data.items || []).map(validateCartItem).filter(item => item !== null)
      setCart(items)
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
      const items = (response.data.items || []).map(validateCartItem).filter(item => item !== null)
      setCart(items)
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
    return cart.reduce((total, item) => {
      const quantity = item?.quantity || 0
      return total + quantity
    }, 0)
  }

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const precio = item?.precio || 0
      const quantity = item?.quantity || 0
      return total + (precio * quantity)
    }, 0)
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
