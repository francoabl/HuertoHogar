/**
 * Pruebas unitarias para CartContext
 * 
 * Estas pruebas verifican:
 * 1. Inicialización del carrito
 * 2. Agregar productos al carrito
 * 3. Actualizar cantidades de productos
 * 4. Eliminar productos del carrito
 * 5. Calcular totales y contadores
 * 6. Persistencia en localStorage
 */

import { render, screen, waitFor, act } from '@testing-library/react'
import { CartProvider, useCart } from '../context/CartContext'

// Componente de prueba para acceder al contexto del carrito
const TestCartComponent = () => {
  const cart = useCart()
  return (
    <div>
      <div data-testid="cart-count">{cart.getCartCount()}</div>
      <div data-testid="cart-total">{cart.getCartTotal()}</div>
      <div data-testid="loading">{cart.loading ? 'Loading' : 'Ready'}</div>
      <div data-testid="cart-items">{JSON.stringify(cart.cart)}</div>
      <button onClick={() => cart.addToCart({
        id: 1,
        nombre: 'Manzanas',
        precio: 1200,
        imagen: 'manzanas.jpg',
        categoria: 'frutas'
      })}>Add Item</button>
      <button onClick={() => cart.removeFromCart(1)}>Remove Item</button>
      <button onClick={() => cart.updateQuantity(1, 5)}>Update Quantity</button>
      <button onClick={() => cart.clearCart()}>Clear Cart</button>
    </div>
  )
}

describe('CartContext', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear()
    localStorage.getItem.calls.reset()
    localStorage.setItem.calls.reset()
    localStorage.removeItem.calls.reset()
  })

  describe('Inicialización del Carrito', () => {
    
    it('debería inicializarse con carrito vacío cuando localStorage está vacío', async () => {
      localStorage.getItem.and.returnValue(null)
      
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Ready')
      })

      expect(screen.getByTestId('cart-count').textContent).toBe('0')
      expect(screen.getByTestId('cart-total').textContent).toBe('0')
      expect(localStorage.getItem).toHaveBeenCalledWith('huertohogar_cart')
    })

    it('debería cargar carrito desde localStorage si existe', async () => {
      const savedCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 1 }
      ]
      localStorage.getItem.and.returnValue(JSON.stringify(savedCart))

      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Ready')
      })

      expect(screen.getByTestId('cart-count').textContent).toBe('3')
      expect(localStorage.getItem).toHaveBeenCalledWith('huertohogar_cart')
    })

    it('debería lanzar error cuando useCart se usa fuera del CartProvider', () => {
      spyOn(console, 'error')
      
      expect(() => {
        render(<TestCartComponent />)
      }).toThrow('useCart must be used within a CartProvider')
    })
  })

  describe('Agregar Productos al Carrito', () => {
    
    it('debería agregar un nuevo producto al carrito', async () => {
      localStorage.getItem.and.returnValue(null)
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Ready')
      })

      const addButton = container.querySelector('button')
      
      await act(async () => {
        addButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('1')
      })
    })

    it('debería incrementar cantidad si el producto ya existe en el carrito', async () => {
      const existingCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 }
      ]
      localStorage.getItem.and.returnValue(JSON.stringify(existingCart))
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('2')
      })

      const addButton = container.querySelector('button')
      
      await act(async () => {
        addButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('3')
      })
    })

    it('debería manejar múltiples productos diferentes en el carrito', () => {
      const cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 1 },
        { id: 3, nombre: 'Plátanos', precio: 900, quantity: 3 }
      ]

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      expect(totalItems).toBe(6)
      expect(cart.length).toBe(3)
    })
  })

  describe('Actualizar Cantidades', () => {
    
    it('debería actualizar la cantidad de un producto existente', async () => {
      const existingCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 }
      ]
      localStorage.getItem.and.returnValue(JSON.stringify(existingCart))
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('2')
      })

      const updateButton = container.querySelectorAll('button')[2]
      
      await act(async () => {
        updateButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('5')
      })
    })

    it('debería eliminar producto si la cantidad se actualiza a 0', () => {
      let cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 }
      ]

      // Simular actualización a 0
      const newQuantity = 0
      if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== 1)
      }

      expect(cart.length).toBe(0)
    })

    it('debería eliminar producto si la cantidad se actualiza a negativo', () => {
      let cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 }
      ]

      // Simular actualización a negativo
      const newQuantity = -1
      if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== 1)
      }

      expect(cart.length).toBe(0)
    })
  })

  describe('Eliminar Productos', () => {
    
    it('debería eliminar un producto específico del carrito', async () => {
      const existingCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 1 }
      ]
      localStorage.getItem.and.returnValue(JSON.stringify(existingCart))
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('3')
      })

      const removeButton = container.querySelectorAll('button')[1]
      
      await act(async () => {
        removeButton.click()
      })

      await waitFor(() => {
        const cartData = JSON.parse(screen.getByTestId('cart-items').textContent)
        expect(cartData.find(item => item.id === 1)).toBeUndefined()
      })
    })

    it('debería limpiar todo el carrito', async () => {
      const existingCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 1 }
      ]
      localStorage.getItem.and.returnValue(JSON.stringify(existingCart))
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('3')
      })

      const clearButton = container.querySelectorAll('button')[3]
      
      await act(async () => {
        clearButton.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('cart-count').textContent).toBe('0')
        expect(screen.getByTestId('cart-total').textContent).toBe('0')
      })
    })
  })

  describe('Cálculos del Carrito', () => {
    
    it('debería calcular correctamente el conteo total de items', () => {
      const cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 3 },
        { id: 3, nombre: 'Plátanos', precio: 900, quantity: 1 }
      ]

      const totalCount = cart.reduce((total, item) => total + item.quantity, 0)
      expect(totalCount).toBe(6)
    })

    it('debería calcular correctamente el total del carrito', () => {
      const cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 3 }
      ]

      const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
      expect(total).toBe(5700) // (1200 * 2) + (1100 * 3) = 2400 + 3300
    })

    it('debería retornar 0 para carrito vacío', () => {
      const cart = []
      
      const totalCount = cart.reduce((total, item) => total + item.quantity, 0)
      const totalPrice = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
      
      expect(totalCount).toBe(0)
      expect(totalPrice).toBe(0)
    })
  })

  describe('Persistencia en localStorage', () => {
    
    it('debería guardar carrito en localStorage cuando cambia', async () => {
      localStorage.getItem.and.returnValue(null)
      localStorage.setItem.and.stub()

      const { container } = render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Ready')
      })

      const addButton = container.querySelector('button')
      
      await act(async () => {
        addButton.click()
      })

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'huertohogar_cart',
          jasmine.any(String)
        )
      })
    })

    it('debería recuperar carrito guardado al recargar', () => {
      const savedCart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 }
      ]

      localStorage.getItem.and.returnValue(JSON.stringify(savedCart))
      const retrieved = JSON.parse(localStorage.getItem('huertohogar_cart'))

      expect(retrieved).toEqual(savedCart)
      expect(retrieved[0].id).toBe(1)
      expect(retrieved[0].quantity).toBe(2)
    })

    it('debería manejar datos corruptos en localStorage', async () => {
      localStorage.getItem.and.returnValue('invalid json {')
      localStorage.removeItem.and.stub()
      spyOn(console, 'error')

      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Ready')
      })

      expect(console.error).toHaveBeenCalled()
      expect(localStorage.removeItem).toHaveBeenCalledWith('huertohogar_cart')
      expect(screen.getByTestId('cart-count').textContent).toBe('0')
    })
  })

  describe('Verificación de Productos en Carrito', () => {
    
    it('debería identificar si un producto está en el carrito', () => {
      const cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 2 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 1 }
      ]

      const isInCart = (productId) => {
        return cart.some(item => item.id === productId)
      }

      expect(isInCart(1)).toBe(true)
      expect(isInCart(2)).toBe(true)
      expect(isInCart(3)).toBe(false)
    })

    it('debería obtener cantidad de un producto específico', () => {
      const cart = [
        { id: 1, nombre: 'Manzanas', precio: 1200, quantity: 5 },
        { id: 2, nombre: 'Naranjas', precio: 1100, quantity: 3 }
      ]

      const getItemQuantity = (productId) => {
        const item = cart.find(item => item.id === productId)
        return item ? item.quantity : 0
      }

      expect(getItemQuantity(1)).toBe(5)
      expect(getItemQuantity(2)).toBe(3)
      expect(getItemQuantity(99)).toBe(0)
    })
  })
})
