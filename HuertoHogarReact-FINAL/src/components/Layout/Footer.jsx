import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h5 className="footer-title">
              <i className="fas fa-seedling me-2"></i>
              HuertoHogar
            </h5>
            <p className="footer-text">
              Productos frescos y naturales directo desde el campo chileno hasta la puerta de tu hogar.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </Col>

          <Col md={2}>
            <h6 className="footer-subtitle">Enlaces</h6>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="footer-subtitle">Categorías</h6>
            <ul className="footer-links">
              <li><Link to="/productos?categoria=frutas">Frutas Frescas</Link></li>
              <li><Link to="/productos?categoria=verduras">Verduras</Link></li>
              <li><Link to="/productos?categoria=organicos">Orgánicos</Link></li>
              <li><Link to="/productos?categoria=lacteos">Lácteos</Link></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="footer-subtitle">Contacto</h6>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>
                Santiago, Chile
              </li>
              <li>
                <i className="fas fa-phone me-2"></i>
                +56 9 1234 5678
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>
                info@huertohogar.cl
              </li>
              <li>
                <i className="fas fa-clock me-2"></i>
                Lun - Sáb: 8:00 - 18:00
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row>
          <Col className="text-center">
            <p className="footer-copyright">
              &copy; {currentYear} HuertoHogar. Todos los derechos reservados.
              <span className="ms-3">
                <Link to="/terminos" className="footer-legal-link">Términos de Servicio</Link>
                {' | '}
                <Link to="/privacidad" className="footer-legal-link">Política de Privacidad</Link>
              </span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
