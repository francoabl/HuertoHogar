import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, InputGroup, Spinner, Collapse } from 'react-bootstrap'
import { useSearchParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productsAPI } from '../services/api'
import productosData from '../../src/data/productos.json'
import './Products.css'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || 'todos')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Primero cargar datos locales
        setProducts(productosData.productos)
        
        // Luego intentar actualizar desde API
        try {
          const response = await productsAPI.getAll()
          setProducts(response.data.productos || response.data)
        } catch (apiError) {
          console.warn('API not available, using local data:', apiError.message)
          // Si la API falla pero ya tenemos datos locales, está bien
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts(productosData.productos)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice])

  const filterProducts = () => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(product =>
        product.categoria.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.precio >= parseInt(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.precio <= parseInt(maxPrice))
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('todos')
    setMinPrice('')
    setMaxPrice('')
    setSearchParams({})
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    // Auto-close filters on mobile after selection
    if (window.innerWidth < 992) {
      setTimeout(() => setShowFilters(false), 300)
    }
  }

  const categories = [
    { value: 'todos', label: 'Todos los productos' },
    { value: 'frutas', label: 'Frutas Frescas' },
    { value: 'verduras', label: 'Verduras' },
    { value: 'organicos', label: 'Orgánicos' },
    { value: 'lacteos', label: 'Lácteos' }
  ]

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="products-page">
      <Container>
        {/* Header */}
        <div className="products-header text-center mb-5">
          <h1 className="products-title">Nuestros Productos</h1>
          <p className="lead text-muted">Descubre la frescura del campo chileno</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filter-section mb-4">
          {/* Search bar with view mode toggle */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={8}>
              <InputGroup className="search-input-group">
                <Form.Control
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <Button variant="outline-secondary" className="search-button">
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col xs={12} md={4} className="d-flex gap-2">
              {/* View mode toggle */}
              <div className="btn-group flex-grow-1" role="group">
                <Button
                  variant={viewMode === 'grid' ? 'success' : 'outline-success'}
                  onClick={() => setViewMode('grid')}
                  className="view-toggle-btn"
                >
                  <i className="fas fa-th me-2"></i>
                  <span className="d-none d-sm-inline">Cuadrícula</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'success' : 'outline-success'}
                  onClick={() => setViewMode('list')}
                  className="view-toggle-btn"
                >
                  <i className="fas fa-list me-2"></i>
                  <span className="d-none d-sm-inline">Lista</span>
                </Button>
              </div>
              {/* Filter toggle button (mobile only) */}
              <Button
                variant="outline-success"
                className="d-lg-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className={`fas fa-filter me-2`}></i>
                Filtros
              </Button>
            </Col>
          </Row>

          {/* Collapsible Filters */}
          <Collapse in={showFilters}>
            <div>
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Control
                        type="number"
                        placeholder="Precio mín."
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="number"
                        placeholder="Precio máx."
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={8}>
                  <div className="category-filters">
                    {categories.map(cat => (
                      <Button
                        key={cat.value}
                        variant={selectedCategory === cat.value ? 'success' : 'outline-success'}
                        size="sm"
                        className="me-2 mb-2"
                        onClick={() => handleCategoryChange(cat.value)}
                      >
                        {cat.label}
                      </Button>
                    ))}
                  </div>
                </Col>
                <Col md={4} className="text-md-end">
                  <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                    <i className="fas fa-times me-2"></i>
                    Limpiar filtros
                  </Button>
                </Col>
              </Row>
            </div>
          </Collapse>
        </div>

        {/* Results count */}
        <div className="results-info mb-4">
          <p className="text-muted">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h3>No se encontraron productos</h3>
            <p className="text-muted">Intenta ajustar tus filtros de búsqueda</p>
            <Button variant="success" onClick={clearFilters}>
              Ver todos los productos
            </Button>
          </div>
        ) : (
          <Row className={`g-4 ${viewMode === 'list' ? 'product-list-view' : ''}`}>
            {filteredProducts.map(product => (
              <Col 
                key={product.id} 
                xs={12}
                sm={viewMode === 'list' ? 12 : 6} 
                md={viewMode === 'list' ? 6 : 4} 
                lg={viewMode === 'list' ? 6 : 3}
              >
                <Card className={`product-card h-100 ${viewMode === 'list' ? 'product-card-list' : ''}`}>
                  {viewMode === 'grid' ? (
                    // Grid view (original)
                    <>
                      <Link to={`/producto/${product.id}`} className="product-link">
                        <Card.Img
                          variant="top"
                          src={product.imagenUrl || product.imagen || '/assets/img/placeholder.jpg'}
                          alt={product.nombre}
                          className="product-image"
                        />
                      </Link>
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                          <span className="badge bg-success">{product.categoria}</span>
                        </div>
                        <Card.Title className="product-name">
                          <Link to={`/producto/${product.id}`} className="product-link">
                            {product.nombre}
                          </Link>
                        </Card.Title>
                        <Card.Text className="product-description text-muted">
                          {product.descripcion}
                        </Card.Text>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="product-price">${product.precio.toLocaleString()}</span>
                            <span className="text-muted small">por unidad</span>
                          </div>
                          <Button
                            variant="success"
                            className="w-100"
                            onClick={() => handleAddToCart(product)}
                          >
                            <i className="fas fa-cart-plus me-2"></i>
                            Agregar
                          </Button>
                        </div>
                      </Card.Body>
                    </>
                  ) : (
                    // List view (horizontal layout)
                    <Row className="g-0">
                      <Col xs={4} md={3}>
                        <Link to={`/producto/${product.id}`} className="product-link">
                          <Card.Img
                            src={product.imagenUrl || product.imagen || '/assets/img/placeholder.jpg'}
                            alt={product.nombre}
                            className="product-image-list"
                          />
                        </Link>
                      </Col>
                      <Col xs={8} md={9}>
                        <Card.Body className="d-flex flex-column h-100">
                          <div className="mb-2">
                            <span className="badge bg-success">{product.categoria}</span>
                          </div>
                          <Card.Title className="product-name">
                            <Link to={`/producto/${product.id}`} className="product-link">
                              {product.nombre}
                            </Link>
                          </Card.Title>
                          <Card.Text className="product-description text-muted d-none d-md-block">
                            {product.descripcion}
                          </Card.Text>
                          <div className="mt-auto">
                            <Row className="align-items-center">
                              <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                                <span className="product-price">${product.precio.toLocaleString()}</span>
                                <span className="text-muted small ms-2">por unidad</span>
                              </Col>
                              <Col xs={12} sm={6}>
                                <Button
                                  variant="success"
                                  className="w-100"
                                  size="sm"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <i className="fas fa-cart-plus me-2"></i>
                                  Agregar
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default Products

