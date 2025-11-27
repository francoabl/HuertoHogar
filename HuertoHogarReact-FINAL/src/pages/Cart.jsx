import { Container, Row, Col, Button, Card, Table, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Container>
          <div className="empty-cart text-center py-5">
            <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
            <h2>Tu carrito está vacío</h2>
            <p className="text-muted">Agrega productos para comenzar tu compra</p>
            <Button as={Link} to="/productos" variant="success" size="lg" className="mt-3">
              <i className="fas fa-shopping-basket me-2"></i>
              Ir a Productos
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Container>
        <h1 className="cart-title mb-4">
          <i className="fas fa-shopping-cart me-3"></i>
          Mi Carrito
        </h1>

        <Row>
          <Col lg={8}>
            <Card className="cart-items-card mb-4">
              <Card.Body>
                <Table responsive className="cart-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.imagenUrl || item.imagen || '/assets/img/placeholder.jpg'}
                              alt={item.nombre}
                              className="cart-item-image me-3"
                            />
                            <div>
                              <h6 className="mb-1">{item.nombre}</h6>
                              <small className="text-muted">{item.categoria}</small>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          ${item.precio.toLocaleString()}
                        </td>
                        <td className="align-middle">
                          <div className="quantity-controls">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <i className="fas fa-minus"></i>
                            </Button>
                            <Form.Control
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="quantity-input"
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="fas fa-plus"></i>
                            </Button>
                          </div>
                        </td>
                        <td className="align-middle fw-bold">
                          ${(item.precio * item.quantity).toLocaleString()}
                        </td>
                        <td className="align-middle">
                          <Button
                            variant="link"
                            className="text-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="cart-actions mt-3">
                  <Button
                    variant="outline-danger"
                    onClick={clearCart}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Vaciar Carrito
                  </Button>
                  <Button
                    as={Link}
                    to="/productos"
                    variant="outline-success"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Seguir Comprando
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="cart-summary-card sticky-top">
              <Card.Body>
                <h5 className="mb-4">Resumen del Pedido</h5>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>

                <hr />

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>

                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100 mt-4"
                  as={Link}
                  to="/checkout"
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Proceder al Pago
                </Button>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="fas fa-lock me-1"></i>
                    Compra 100% segura
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Cart

