import { Container, Row, Col, Button, Dropdown, Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">Del Campo a tu Mesa</h1>
              <p className="hero-subtitle">
                Productos frescos y naturales directo desde el campo chileno hasta la 
                puerta de tu hogar. Más de 6 años conectando familias con la frescura del campo.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Dropdown>
                  <Dropdown.Toggle variant="success" size="lg">
                    <i className="fas fa-shopping-basket me-2"></i>
                    Ver Productos
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/productos?categoria=frutas">
                      Frutas Frescas
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/productos?categoria=verduras">
                      Verduras Orgánicas
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/productos?categoria=organicos">
                      Productos Orgánicos
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/productos?categoria=lacteos">
                      Productos Lácteos
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="outline-success" size="lg" href="#nosotros">
                  <i className="fas fa-info-circle me-2"></i>
                  Conoce más
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <div className="hero-carousel-wrapper">
                <Carousel 
                  fade 
                  interval={3000} 
                  controls={false} 
                  indicators={true}
                  className="hero-carousel"
                >
                  <Carousel.Item>
                    <div className="carousel-image-circle">
                      <img 
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80&fm=webp" 
                        alt="Campo de cultivo verde"
                        className="img-fluid rounded-circle hero-image"
                      />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="carousel-image-circle">
                      <img 
                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=600&fit=crop&q=80&fm=webp" 
                        alt="Granja con vegetales frescos"
                        className="img-fluid rounded-circle hero-image"
                      />
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="carousel-image-circle">
                      <img 
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=600&fit=crop&q=80&fm=webp" 
                        alt="Cosecha de productos orgánicos"
                        className="img-fluid rounded-circle hero-image"
                      />
                    </div>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="productos" className="features-section py-5">
        <Container>
          <h2 className="section-title">¿Por qué elegir HuertoHogar?</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3 className="feature-title">100% Natural</h3>
                <p className="feature-text">
                  Productos sin químicos ni pesticidas, cultivados de forma orgánica
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <h3 className="feature-title">Envío Rápido</h3>
                <p className="feature-text">
                  Entrega en 24-48 horas para mantener la frescura de los productos
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="feature-title">Calidad Garantizada</h3>
                <p className="feature-text">
                  Productos seleccionados con los más altos estándares de calidad
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="feature-title">Apoyo Local</h3>
                <p className="feature-text">
                  Comprando nos apoyas a productores y agricultores locales
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="nosotros" className="about-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="section-title text-start">Sobre Nosotros</h2>
              <p className="lead">
                HuertoHogar nace del amor por el campo y la pasión por conectar a las familias 
                con productos frescos y naturales.
              </p>
              <p>
                Trabajamos directamente con agricultores locales para traerte lo mejor del 
                campo chileno. Cada producto es seleccionado cuidadosamente para garantizar 
                frescura, calidad y sabor excepcional.
              </p>
              <p>
                Nuestra misión es hacer accesible la alimentación saludable y apoyar a los 
                productores locales, creando una comunidad sostenible.
              </p>
              <Button as={Link} to="/nosotros" variant="success" size="lg" className="mt-3">
                Conoce más sobre nosotros
              </Button>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <Row className="g-3">
                <Col xs={6}>
                  <div className="stat-card">
                    <h3 className="stat-number">6+</h3>
                    <p className="stat-label">Años de experiencia</p>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-card">
                    <h3 className="stat-number">500+</h3>
                    <p className="stat-label">Clientes satisfechos</p>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-card">
                    <h3 className="stat-number">50+</h3>
                    <p className="stat-label">Productos frescos</p>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-card">
                    <h3 className="stat-number">100%</h3>
                    <p className="stat-label">Satisfacción garantizada</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">¿Listo para disfrutar lo mejor del campo?</h2>
              <p className="cta-text">
                Únete a cientos de familias que ya disfrutan de productos frescos y naturales
              </p>
              <Button as={Link} to="/productos" variant="light" size="lg" className="mt-3">
                Explorar Productos
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Home

