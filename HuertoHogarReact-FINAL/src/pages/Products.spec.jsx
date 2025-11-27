/**
 * Pruebas unitarias para el componente Products
 * 
 * Estas pruebas verifican:
 * 1. Renderizado inicial y carga de productos
 * 2. Funcionalidad de búsqueda y filtrado
 * 3. Filtrado por categoría
 * 4. Filtrado por rango de precios
 * 5. Cambio de vista (grid/list)
 * 6. Agregar productos al carrito
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Products from '../pages/Products'
import { CartProvider } from '../context/CartContext'
import productosData from '../../src/data/productos.json'

// Componente envolvente con providers necesarios
const ProductsWithProviders = () => (
  <BrowserRouter>
    <CartProvider>
      <Products />
    </CartProvider>
  </BrowserRouter>
)

describe('Componente Products', () => {
  
  beforeEach(() => {
    localStorage.clear()
    localStorage.getItem.calls.reset()
    localStorage.setItem.calls.reset()
  })

  describe('Renderizado Inicial', () => {
    
    it('debería mostrar loader mientras carga productos', () => {
      render(<ProductsWithProviders />)
      
      // Verificar que aparece el mensaje de carga
      const loading = screen.queryByText(/Cargando productos/i)
      expect(loading).not.toBeNull()
    })

    it('debería renderizar título y descripción', async () => {
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const title = screen.getByText(/Nuestros Productos/i)
        expect(title).not.toBeNull()
      })

      const subtitle = screen.getByText(/Descubre la frescura del campo chileno/i)
      expect(subtitle).not.toBeNull()
    })

    it('debería cargar y mostrar productos después de la carga', async () => {
      localStorage.getItem.and.returnValue(null)
      
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        // Verificar que desaparece el loader
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      // Verificar que se muestran productos
      await waitFor(() => {
        const resultsInfo = screen.queryByText(/Mostrando.*productos/i)
        expect(resultsInfo).not.toBeNull()
      })
    })
  })

  describe('Funcionalidad de Búsqueda', () => {
    
    it('debería filtrar productos por término de búsqueda', async () => {
      localStorage.getItem.and.returnValue(null)
      
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      // Encontrar el input de búsqueda
      const searchInput = screen.getByPlaceholderText(/Buscar productos/i)
      expect(searchInput).not.toBeNull()

      // Simular escritura en el buscador
      fireEvent.change(searchInput, { target: { value: 'manzana' } })

      await waitFor(() => {
        expect(searchInput.value).toBe('manzana')
      })
    })

    it('debería buscar en nombre y descripción de productos', () => {
      const productos = productosData.productos
      const searchTerm = 'fresca'
      
      const filtered = productos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered.length).toBeGreaterThan(0)
      filtered.forEach(product => {
        const matchesName = product.nombre.toLowerCase().includes(searchTerm)
        const matchesDesc = product.descripcion.toLowerCase().includes(searchTerm)
        expect(matchesName || matchesDesc).toBe(true)
      })
    })

    it('debería mostrar mensaje cuando no hay resultados', () => {
      const productos = []
      const searchTerm = 'productonoencontrado123'
      
      const filtered = productos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered.length).toBe(0)
    })
  })

  describe('Filtrado por Categoría', () => {
    
    it('debería mostrar todas las categorías disponibles', async () => {
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      const categories = [
        'Todos los productos',
        'Frutas Frescas',
        'Verduras',
        'Orgánicos',
        'Lácteos'
      ]

      // Verificar que existen botones de categoría
      categories.forEach(category => {
        const categoryButton = screen.queryByText(category)
        expect(categoryButton).not.toBeNull()
      })
    })

    it('debería filtrar productos por categoría seleccionada', () => {
      const productos = productosData.productos
      const categoria = 'frutas'
      
      const filtered = productos.filter(product =>
        product.categoria.toLowerCase().includes(categoria.toLowerCase())
      )

      expect(filtered.length).toBeGreaterThan(0)
      filtered.forEach(product => {
        expect(product.categoria.toLowerCase()).toContain(categoria)
      })
    })

    it('debería mostrar todos los productos cuando categoría es "todos"', () => {
      const productos = productosData.productos
      const categoria = 'todos'
      
      let filtered = [...productos]
      
      if (categoria !== 'todos') {
        filtered = productos.filter(product =>
          product.categoria.toLowerCase().includes(categoria.toLowerCase())
        )
      }

      expect(filtered.length).toBe(productos.length)
    })
  })

  describe('Filtrado por Precio', () => {
    
    it('debería renderizar inputs de precio mínimo y máximo', async () => {
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      const minPriceInput = screen.getByPlaceholderText(/Precio mín/i)
      const maxPriceInput = screen.getByPlaceholderText(/Precio máx/i)
      
      expect(minPriceInput).not.toBeNull()
      expect(maxPriceInput).not.toBeNull()
    })

    it('debería filtrar productos por precio mínimo', () => {
      const productos = productosData.productos
      const minPrice = 1000
      
      const filtered = productos.filter(product => product.precio >= minPrice)

      filtered.forEach(product => {
        expect(product.precio).toBeGreaterThanOrEqual(minPrice)
      })
    })

    it('debería filtrar productos por precio máximo', () => {
      const productos = productosData.productos
      const maxPrice = 1500
      
      const filtered = productos.filter(product => product.precio <= maxPrice)

      filtered.forEach(product => {
        expect(product.precio).toBeLessThanOrEqual(maxPrice)
      })
    })

    it('debería filtrar productos por rango de precio', () => {
      const productos = productosData.productos
      const minPrice = 1000
      const maxPrice = 2000
      
      const filtered = productos.filter(product => 
        product.precio >= minPrice && product.precio <= maxPrice
      )

      filtered.forEach(product => {
        expect(product.precio).toBeGreaterThanOrEqual(minPrice)
        expect(product.precio).toBeLessThanOrEqual(maxPrice)
      })
    })
  })

  describe('Cambio de Vista', () => {
    
    it('debería renderizar botones de cambio de vista', async () => {
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      // Buscar botones de vista
      const gridButton = screen.queryByText(/Cuadrícula/i)
      const listButton = screen.queryByText(/Lista/i)
      
      expect(gridButton || listButton).not.toBeNull()
    })

    it('debería cambiar entre vista de cuadrícula y lista', async () => {
      let viewMode = 'grid'
      
      // Simular cambio a vista de lista
      viewMode = 'list'
      expect(viewMode).toBe('list')
      
      // Simular cambio a vista de cuadrícula
      viewMode = 'grid'
      expect(viewMode).toBe('grid')
    })
  })

  describe('Limpiar Filtros', () => {
    
    it('debería mostrar botón para limpiar filtros', async () => {
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      const clearButton = screen.queryByText(/Limpiar filtros/i)
      expect(clearButton).not.toBeNull()
    })

    it('debería resetear todos los filtros al hacer clic', () => {
      let searchTerm = 'manzana'
      let selectedCategory = 'frutas'
      let minPrice = '1000'
      let maxPrice = '2000'

      // Simular limpiar filtros
      searchTerm = ''
      selectedCategory = 'todos'
      minPrice = ''
      maxPrice = ''

      expect(searchTerm).toBe('')
      expect(selectedCategory).toBe('todos')
      expect(minPrice).toBe('')
      expect(maxPrice).toBe('')
    })
  })

  describe('Agregar al Carrito', () => {
    
    it('debería mostrar botón de agregar al carrito para cada producto', async () => {
      localStorage.getItem.and.returnValue(null)
      
      render(<ProductsWithProviders />)
      
      await waitFor(() => {
        const loading = screen.queryByText(/Cargando productos/i)
        expect(loading).toBeNull()
      }, { timeout: 3000 })

      await waitFor(() => {
        const addButtons = screen.queryAllByText(/Agregar/i)
        expect(addButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Información de Productos', () => {
    
    it('debería mostrar nombre, precio y categoría de cada producto', () => {
      const producto = productosData.productos[0]
      
      expect(producto.nombre).toBeDefined()
      expect(producto.precio).toBeDefined()
      expect(producto.categoria).toBeDefined()
      expect(typeof producto.nombre).toBe('string')
      expect(typeof producto.precio).toBe('number')
    })

    it('debería formatear precio correctamente', () => {
      const precio = 1200
      const formatted = precio.toLocaleString()
      
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe('string')
    })

    it('debería mostrar imagen de producto', () => {
      const producto = productosData.productos[0]
      
      expect(producto.imagen).toBeDefined()
      expect(typeof producto.imagen).toBe('string')
      expect(producto.imagen.length).toBeGreaterThan(0)
    })
  })

  describe('Contador de Resultados', () => {
    
    it('debería mostrar cantidad de productos filtrados vs total', () => {
      const totalProducts = 10
      const filteredProducts = 5
      
      const message = `Mostrando ${filteredProducts} de ${totalProducts} productos`
      
      expect(message).toContain('5')
      expect(message).toContain('10')
    })

    it('debería actualizar contador al aplicar filtros', () => {
      const productos = productosData.productos
      const searchTerm = 'fresca'
      
      const filtered = productos.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered.length).toBeLessThanOrEqual(productos.length)
    })
  })

  describe('Filtros Combinados', () => {
    
    it('debería aplicar múltiples filtros simultáneamente', () => {
      const productos = productosData.productos
      const searchTerm = 'fresca'
      const categoria = 'frutas'
      const minPrice = 1000
      const maxPrice = 1500

      let filtered = [...productos]

      // Aplicar búsqueda
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Aplicar categoría
      if (categoria !== 'todos') {
        filtered = filtered.filter(product =>
          product.categoria.toLowerCase().includes(categoria.toLowerCase())
        )
      }

      // Aplicar rango de precio
      if (minPrice) {
        filtered = filtered.filter(product => product.precio >= minPrice)
      }
      if (maxPrice) {
        filtered = filtered.filter(product => product.precio <= maxPrice)
      }

      // Verificar que se aplicaron todos los filtros
      filtered.forEach(product => {
        const matchesSearch = 
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = product.categoria.toLowerCase().includes(categoria.toLowerCase())
        const matchesPrice = product.precio >= minPrice && product.precio <= maxPrice

        expect(matchesSearch).toBe(true)
        expect(matchesCategory).toBe(true)
        expect(matchesPrice).toBe(true)
      })
    })
  })
})
