import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Badge, Form, Alert, Spinner } from 'react-bootstrap'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productsAPI } from '../services/api'
import productosData from '../data/productos.json'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Primero intentar cargar desde datos locales
        const foundProduct = productosData.productos.find(p => p.id === parseInt(id))
        if (foundProduct) {
          setProduct(foundProduct)
        }
        
        // Luego intentar actualizar desde API si está disponible
        try {
          const response = await productsAPI.getById(id)
          if (response.data) {
            setProduct(response.data)
          }
        } catch (apiError) {
          console.warn('API not available, using local data:', apiError.message)
          // Si la API falla pero ya tenemos datos locales, está bien
        }
      } catch (error) {
        console.error('Error loading product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      setMainImage(product.imagenUrl || product.imagen || '/assets/img/placeholder.jpg')
    }
  }, [product])

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      setMessage({ type: 'danger', text: 'Por favor ingresa una cantidad válida' })
      return
    }

    const result = await addToCart(product, quantity)
    setMessage({ type: 'success', text: result.message || 'Producto agregado al carrito' })
    setQuantity(1)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    if (value > 0) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando producto...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h2>Producto no encontrado</h2>
          <p className="text-muted mb-4">No pudimos encontrar el producto que buscas</p>
          <Button variant="success" onClick={() => navigate('/productos')}>
            <i className="fas fa-arrow-left me-2"></i>
            Volver a Productos
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="product-detail-page">
      <Container className="py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.nombre}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <Row className="g-4">
          {/* Product Images */}
          <Col lg={6}>
            <div className="product-images-section">
              {/* Main Image */}
              <div className="main-image-container mb-3">
                <img 
                  src={mainImage} 
                  alt={product.nombre}
                  className="main-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=' + product.nombre
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="thumbnail-images">
                <div 
                  className="thumbnail-item"
                  onClick={() => {
                    setMainImage(product.imagenUrl || product.imagen || '/assets/img/placeholder.jpg')
                  }}
                >
                  <img 
                    src={product.imagenUrl || product.imagen || '/assets/img/placeholder.jpg'}
                    alt={product.nombre}
                    className="thumbnail-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=' + product.nombre
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div className="product-info-section">
              {/* Badge Category */}
              <div className="mb-3">
                <Badge bg="success" className="category-badge">
                  {product.categoria?.charAt(0).toUpperCase() + product.categoria?.slice(1)}
                </Badge>
              </div>

              {/* Product Name */}
              <h1 className="product-detail-name mb-3">{product.nombre}</h1>

              {/* Rating */}
              <div className="rating-section mb-3">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-muted ms-2">(245 reseñas)</span>
              </div>

              {/* Price */}
              <div className="price-section mb-4">
                <h2 className="product-price-large">${product.precio.toLocaleString()}</h2>
                <span className="text-muted">por unidad</span>
              </div>

              {/* Description */}
              <div className="description-section mb-4">
                <h5>Descripción</h5>
                <p className="text-muted">{product.descripcion}</p>
              </div>

              {/* Product Details */}
              <Card className="details-card mb-4">
                <Card.Body>
                  <Row className="g-3">
                    <Col xs={6} sm={4}>
                      <div className="detail-item text-center">
                        <div className="detail-icon">
                          <i className="fas fa-leaf"></i>
                        </div>
                        <p className="detail-label small">100% Fresco</p>
                      </div>
                    </Col>
                    <Col xs={6} sm={4}>
                      <div className="detail-item text-center">
                        <div className="detail-icon">
                          <i className="fas fa-truck"></i>
                        </div>
                        <p className="detail-label small">Envío Rápido</p>
                      </div>
                    </Col>
                    <Col xs={6} sm={4}>
                      <div className="detail-item text-center">
                        <div className="detail-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <p className="detail-label small">Garantizado</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Message */}
              {message.text && (
                <Alert 
                  variant={message.type} 
                  dismissible 
                  onClose={() => setMessage({ type: '', text: '' })}
                  className="mb-3"
                >
                  {message.text}
                </Alert>
              )}

              {/* Add to Cart Section */}
              <div className="add-to-cart-section mb-4">
                <Row className="g-3 align-items-end">
                  <Col xs={12} sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Cantidad</Form.Label>
                      <Form.Control 
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Button
                      variant="success"
                      size="lg"
                      className="w-100 add-cart-btn"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-cart-plus me-2"></i>
                      Agregar al Carrito
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Additional Info */}
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="fas fa-info-circle me-2 text-success"></i>
                    Información adicional
                  </h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <strong>SKU:</strong> {product.id ? `HH-${product.id.toString().padStart(4, '0')}` : 'N/A'}
                    </li>
                    <li className="mb-2">
                      <strong>Categoría:</strong> {product.categoria}
                    </li>
                    <li className="mb-2">
                      <strong>Disponibilidad:</strong> <Badge bg="success">En Stock</Badge>
                    </li>
                    <li>
                      <strong>Envío:</strong> A todo Chile
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Related Products Section */}
        <hr className="my-5" />

        <div className="related-products-section">
          <h3 className="mb-4">Productos Relacionados</h3>
          <Row className="g-4">
            {productosData.productos
              .filter(p => p.categoria === product.categoria && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Col key={relatedProduct.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="product-card-related h-100">
                    <Link to={`/producto/${relatedProduct.id}`} className="product-link">
                      <Card.Img
                        variant="top"
                        src={`/${relatedProduct.imagen}`}
                        alt={relatedProduct.nombre}
                        className="product-image-related"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=' + relatedProduct.nombre
                        }}
                      />
                    </Link>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="small mb-2">
                        <Link to={`/producto/${relatedProduct.id}`} className="text-decoration-none">
                          {relatedProduct.nombre}
                        </Link>
                      </Card.Title>
                      <Card.Text className="small text-muted flex-grow-1">
                        {relatedProduct.descripcion}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold text-success">${relatedProduct.precio.toLocaleString()}</span>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => addToCart(relatedProduct)}
                        >
                          <i className="fas fa-cart-plus"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>

        {/* Back Button */}
        <div className="text-center mt-5">
          <Button 
            variant="outline-success" 
            onClick={() => navigate('/productos')}
            className="back-button"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver a Productos
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default ProductDetail
