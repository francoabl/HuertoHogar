import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { blogAPI } from '../services/api'
import './Blog.css'

const BLOGS_DEFAULT = [
  {
    id: 1,
    titulo: "Cómo crear tu huerto urbano en casa",
    fecha: "2025-09-01",
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    resumen: "Descubre los secretos para iniciar un huerto en tu hogar, sin importar el espacio disponible. Te guiamos paso a paso.",
    categoria: "Huerto Urbano"
  },
  {
    id: 2,
    titulo: "Beneficios de los alimentos orgánicos",
    fecha: "2025-08-28",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
    resumen: "Explora por qué los alimentos orgánicos son una inversión en tu salud y en el cuidado del medio ambiente.",
    categoria: "Salud"
  },
  {
    id: 3,
    titulo: "Temporada de cosecha: ¿Qué comer en otoño?",
    fecha: "2025-08-15",
    imagen: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop",
    resumen: "Conoce cuáles son los productos de temporada que debes incluir en tu alimentación durante el otoño chileno.",
    categoria: "Temporada"
  },
  {
    id: 4,
    titulo: "Compostaje en casa: Guía completa",
    fecha: "2025-08-01",
    imagen: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&h=400&fit=crop",
    resumen: "Aprende a crear tu propio compost casero y reduce tus desechos orgánicos mientras nutres tus plantas.",
    categoria: "Sostenibilidad"
  },
  {
    id: 5,
    titulo: "Recetas saludables con verduras de temporada",
    fecha: "2025-07-20",
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    resumen: "Descubre deliciosas recetas que aprovechan las verduras más frescas de cada estación del año.",
    categoria: "Recetas"
  },
  {
    id: 6,
    titulo: "Control natural de plagas en el huerto",
    fecha: "2025-07-10",
    imagen: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
    resumen: "Métodos ecológicos y efectivos para mantener tu huerto libre de plagas sin usar químicos dañinos.",
    categoria: "Huerto Urbano"
  }
]

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await blogAPI.getAll()
        setBlogs(response.data || [])
      } catch (error) {
        console.warn('API not available, using default blog data:', error.message)
        // Fallback to default blogs
        setBlogs(BLOGS_DEFAULT)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando artículos...</p>
      </div>
    )
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="hero-title">Blog HuertoHogar</h1>
              <p className="hero-subtitle">
                Descubre consejos, técnicas y todo lo que necesitas saber sobre agricultura 
                urbana, alimentación saludable y vida sustentable.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button href="#articulos" variant="success" size="lg">
                  <i className="fas fa-book-open me-2"></i>
                  Ver Artículos
                </Button>
                <Button as={Link} to="/" variant="outline-success" size="lg">
                  <i className="fas fa-home me-2"></i>
                  Volver al Inicio
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog List */}
      <section id="articulos" className="py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Últimos Artículos</h2>
          <Row className="g-4">
            {blogs.map(blog => (
              <Col key={blog.id} md={6} lg={4}>
                <Card className="blog-card h-100">
                  <div className="blog-image-container">
                    <Card.Img 
                      variant="top" 
                      src={blog.imagen} 
                      alt={blog.titulo}
                      className="blog-image"
                    />
                    <div className="blog-overlay">
                      <Button 
                        as={Link} 
                        to={`/blog/${blog.id}`}
                        variant="light"
                        size="sm"
                      >
                        Leer artículo
                      </Button>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="blog-meta mb-2">
                      <Badge bg="success" className="me-2">
                        <i className="fas fa-folder me-1"></i>
                        {blog.categoria}
                      </Badge>
                      <Badge bg="light" text="dark">
                        <i className="fas fa-calendar-alt me-1"></i>
                        {formatDate(blog.fecha)}
                      </Badge>
                    </div>
                    <Card.Title className="blog-title">
                      <Link to={`/blog/${blog.id}`} className="blog-link">
                        {blog.titulo}
                      </Link>
                    </Card.Title>
                    <Card.Text className="blog-excerpt text-muted flex-grow-1">
                      {blog.resumen}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/blog/${blog.id}`}
                      variant="success" 
                      className="align-self-start"
                    >
                      <i className="fas fa-arrow-right me-2"></i>
                      Leer más
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">¿Por qué seguir nuestro blog?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0">
                <Card.Body>
                  <div className="feature-icon">
                    <i className="fas fa-seedling"></i>
                  </div>
                  <h4>Consejos Prácticos</h4>
                  <p className="text-muted">
                    Aprende técnicas probadas para cultivar tus propios alimentos de forma 
                    natural y sostenible.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0">
                <Card.Body>
                  <div className="feature-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h4>Vida Saludable</h4>
                  <p className="text-muted">
                    Descubre cómo una alimentación consciente puede mejorar tu bienestar 
                    y el de tu familia.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card h-100 text-center border-0">
                <Card.Body>
                  <div className="feature-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h4>Sostenibilidad</h4>
                  <p className="text-muted">
                    Conoce prácticas amigables con el medio ambiente que puedes implementar 
                    en tu día a día.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">¿Te gustó nuestro contenido?</h2>
              <p className="cta-text">
                Explora nuestros productos frescos y orgánicos, cultivados con los mismos 
                principios que compartimos en nuestro blog.
              </p>
              <Button as={Link} to="/productos" variant="light" size="lg" className="mt-3">
                <i className="fas fa-shopping-basket me-2"></i>
                Ver Productos
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Blog

