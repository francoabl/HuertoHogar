import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Nav, Tab, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

// Componente para mostrar historial de pedidos
function OrdersHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Cargar pedidos desde localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Ordenar por fecha más reciente primero
    const sortedOrders = savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(sortedOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-shopping-bag text-muted mb-3" style={{ fontSize: '3rem' }}></i>
        <h4 className="text-muted">Sin pedidos aún</h4>
        <p className="text-muted mb-4">
          Cuando realices tu primer pedido, aparecerá aquí.
        </p>
        <Button as={Link} to="/productos" variant="success">
          <i className="fas fa-shopping-basket me-2"></i>Ver Productos
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-4">
        <i className="fas fa-history me-2"></i>Historial de Pedidos
      </h5>
      {orders.map((order, index) => (
        <Card key={index} className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Pedido #{order.orderNumber}</strong>
              <Badge bg="success" className="ms-2">{order.status}</Badge>
            </div>
            <small className="text-muted">
              {new Date(order.date).toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <h6 className="mb-3">Productos:</h6>
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nombre}</td>
                        <td className="text-center">{item.cantidad}</td>
                        <td className="text-end">${item.precio.toLocaleString()}</td>
                        <td className="text-end">${item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col md={4}>
                <h6 className="mb-3">Detalles del Pago:</h6>
                <div className="mb-2">
                  <small className="text-muted">Método de pago:</small>
                  <div>
                    <img 
                      src="https://www.webpay.cl/wp-content/uploads/2019/06/webpay-plus-logo.png"
                      alt="Webpay Plus"
                      style={{ maxWidth: '100px' }}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Código de autorización:</small>
                  <div className="fw-bold">{order.authCode}</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Total pagado:</strong>
                  <strong className="text-success fs-5">${order.amount.toLocaleString()}</strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

function Profile() {
  const { currentUser, updateProfile, changePassword, loading } = useAuth();
  const navigate = useNavigate();
  
  // Estado del formulario de perfil
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Estado del formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Estados de feedback
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        zipCode: currentUser.zipCode || ''
      });
    }
  }, [currentUser]);

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando perfil...</p>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h2>Acceso denegado</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para acceder al perfil</p>
          <Button variant="success" onClick={() => navigate('/login')}>
            <i className="fas fa-sign-in-alt me-2"></i>
            Ir al Login
          </Button>
        </div>
      </Container>
    );
  }

  // Manejar cambios en formulario de perfil
  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar cambios en formulario de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Enviar formulario de perfil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProfileError('');
    setShowProfileSuccess(false);

    const result = await updateProfile(formData);
    
    if (result.success) {
      setShowProfileSuccess(true);
      setTimeout(() => {
        setShowProfileSuccess(false);
      }, 3000);
    } else {
      setProfileError(result.message);
    }
    
    setIsSubmitting(false);
  };

  // Enviar formulario de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError('');
    setShowPasswordSuccess(false);

    // Validar contraseñas
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      setIsSubmitting(false);
      return;
    }

    // Llamar a la API para cambiar contraseña
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

    if (result.success) {
      setShowPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      setTimeout(() => {
        setShowPasswordSuccess(false);
      }, 3000);
    } else {
      setPasswordError(result.message);
    }
    
    setIsSubmitting(false);
  };

  // Formatear fecha de registro
  const getMemberSince = () => {
    if (currentUser?.createdAt) {
      return new Date(currentUser.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Miembro desde 2024';
  };

  return (
    <div className="profile-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={9}>
            <Card className="profile-card">
              {/* Header del Perfil */}
              <div className="profile-header">
                <div className="profile-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <h2 className="mb-0">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p className="mb-0 mt-2">{currentUser?.email}</p>
                <small className="opacity-75 mt-1">{getMemberSince()}</small>
              </div>

              {/* Tabs */}
              <Card.Body className="profile-body">
                <Tab.Container defaultActiveKey="info">
                  <Nav variant="tabs" className="profile-tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="info">
                        <i className="fas fa-user me-2"></i>Información Personal
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security">
                        <i className="fas fa-lock me-2"></i>Seguridad
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="orders">
                        <i className="fas fa-shopping-bag me-2"></i>Mis Pedidos
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className="profile-tab-content">
                    {/* Tab: Información Personal */}
                    <Tab.Pane eventKey="info">
                      {showProfileSuccess && (
                        <Alert variant="success" className="mt-3">
                          <i className="fas fa-check-circle me-2"></i>
                          Perfil actualizado correctamente
                        </Alert>
                      )}
                      {profileError && (
                        <Alert variant="danger" className="mt-3">
                          <i className="fas fa-exclamation-circle me-2"></i>
                          {profileError}
                        </Alert>
                      )}

                      <Form onSubmit={handleProfileSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <i className="fas fa-user me-2"></i>Nombre
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleProfileChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <i className="fas fa-user me-2"></i>Apellido
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleProfileChange}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-envelope me-2"></i>Correo Electrónico
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-phone me-2"></i>Teléfono
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-map-marker-alt me-2"></i>Dirección
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <i className="fas fa-city me-2"></i>Ciudad
                              </Form.Label>
                              <Form.Select
                                name="city"
                                value={formData.city}
                                onChange={handleProfileChange}
                              >
                                <option value="">Selecciona tu ciudad</option>
                                <option value="santiago">Santiago</option>
                                <option value="valparaiso">Valparaíso</option>
                                <option value="vina-del-mar">Viña del Mar</option>
                                <option value="concepcion">Concepción</option>
                                <option value="temuco">Temuco</option>
                                <option value="la-serena">La Serena</option>
                                <option value="antofagasta">Antofagasta</option>
                                <option value="iquique">Iquique</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <i className="fas fa-mail-bulk me-2"></i>Código Postal
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleProfileChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Button 
                          type="submit" 
                          variant="success"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>Guardando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>Guardar Cambios
                            </>
                          )}
                        </Button>
                      </Form>
                    </Tab.Pane>

                    {/* Tab: Seguridad */}
                    <Tab.Pane eventKey="security">
                      {showPasswordSuccess && (
                        <Alert variant="success" className="mt-3">
                          <i className="fas fa-check-circle me-2"></i>
                          Contraseña cambiada correctamente
                        </Alert>
                      )}
                      {passwordError && (
                        <Alert variant="danger" className="mt-3">
                          <i className="fas fa-exclamation-circle me-2"></i>
                          {passwordError}
                        </Alert>
                      )}

                      <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-lock me-2"></i>Contraseña Actual
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-key me-2"></i>Nueva Contraseña
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Form.Text className="text-muted">
                            Mínimo 8 caracteres
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-key me-2"></i>Confirmar Nueva Contraseña
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>

                        <Button 
                          type="submit" 
                          variant="success"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>Cambiando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>Cambiar Contraseña
                            </>
                          )}
                        </Button>
                      </Form>
                    </Tab.Pane>

                    {/* Tab: Mis Pedidos */}
                    <Tab.Pane eventKey="orders">
                      <OrdersHistory />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;
