import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navigation.css'

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { currentUser, logout, isAdmin } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setExpanded(false)
  }

  const closeMenu = () => {
    setExpanded(false)
  }

  const cartCount = getCartCount()

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand" onClick={closeMenu}>
          <i className="fas fa-seedling me-2"></i>
          HuertoHogar
        </Navbar.Brand>

        {/* Cart icon - Always visible outside menu */}
        <Nav.Link 
          as={Link} 
          to="/carrito" 
          className="cart-link d-lg-none position-relative order-lg-last"
          onClick={closeMenu}
        >
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && (
            <Badge bg="danger" className="cart-badge">{cartCount}</Badge>
          )}
        </Nav.Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" onClick={closeMenu}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos" onClick={closeMenu}>Productos</Nav.Link>
            <Nav.Link as={Link} to="/nosotros" onClick={closeMenu}>Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/contacto" onClick={closeMenu}>Contacto</Nav.Link>
            <Nav.Link as={Link} to="/blog" onClick={closeMenu}>Blog</Nav.Link>
            
            {/* Cart - Desktop only */}
            <Nav.Link as={Link} to="/carrito" className="cart-link ms-lg-3 d-none d-lg-block" onClick={closeMenu}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <Badge bg="danger" className="cart-badge">{cartCount}</Badge>
              )}
            </Nav.Link>

            {/* Admin Panel Button - Only for admins */}
            {currentUser && isAdmin() && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className="admin-panel-btn ms-lg-2" 
                onClick={closeMenu}
              >
                <i className="fas fa-tools me-1"></i>
                Panel Admin
              </Nav.Link>
            )}

            {/* Auth buttons/dropdown */}
            {currentUser ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="fas fa-user-circle me-2"></i>
                    {currentUser.firstName}
                  </span>
                }
                id="user-dropdown"
                className="user-dropdown ms-lg-2"
              >
                <NavDropdown.Item as={Link} to="/perfil" onClick={closeMenu}>
                  <i className="fas fa-user me-2"></i>
                  Mi Perfil
                </NavDropdown.Item>
                {isAdmin() && (
                  <NavDropdown.Item as={Link} to="/admin" onClick={closeMenu}>
                    <i className="fas fa-cog me-2"></i>
                    Administración
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Link to="/registro" className="btn btn-outline-success me-2 ms-lg-3" onClick={closeMenu}>
                  <i className="fas fa-user-plus me-2"></i>
                  Registro
                </Link>
                <Link to="/login" className="btn btn-success" onClick={closeMenu}>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Ingresar
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation

