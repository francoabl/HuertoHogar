import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Badge, Tabs, Tab, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './AdminPanel.css'

const API_URL = 'http://localhost:8080/api'

const AdminPanel = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pedidos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados para Pedidos
  const [pedidos, setPedidos] = useState([])
  const [showPedidoModal, setShowPedidoModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState(null)

  // Estados para Productos
  const [productos, setProductos] = useState([])
  const [showProductoModal, setShowProductoModal] = useState(false)
  const [productoForm, setProductoForm] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    imagenUrl: ''
  })
  const [isEditingProducto, setIsEditingProducto] = useState(false)

  // Estados para Usuarios
  const [usuarios, setUsuarios] = useState([])
  const [showUsuarioModal, setShowUsuarioModal] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    loadData()
  }, [isAdmin, navigate, activeTab])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('huertohogar_token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (activeTab === 'pedidos') {
        const response = await axios.get(`${API_URL}/pedidos/admin/todos`, config)
        setPedidos(response.data)
      } else if (activeTab === 'productos') {
        const response = await axios.get(`${API_URL}/productos`)
        setProductos(response.data)
      } else if (activeTab === 'usuarios') {
        const response = await axios.get(`${API_URL}/usuarios`, config)
        setUsuarios(response.data)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  // ========== PEDIDOS ==========
  const handleViewPedido = (pedido) => {
    setSelectedPedido(pedido)
    setShowPedidoModal(true)
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      'PENDIENTE': 'warning',
      'CONFIRMADO': 'success',
      'EN_PROCESO': 'info',
      'ENVIADO': 'primary',
      'ENTREGADO': 'success',
      'CANCELADO': 'danger'
    }
    return badges[estado] || 'secondary'
  }

  // ========== PRODUCTOS ==========
  const handleAddProducto = () => {
    setProductoForm({
      id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      imagenUrl: ''
    })
    setIsEditingProducto(false)
    setShowProductoModal(true)
  }

  const handleEditProducto = (producto) => {
    setProductoForm({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagenUrl: producto.imagenUrl
    })
    setIsEditingProducto(true)
    setShowProductoModal(true)
  }

  const handleSaveProducto = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('huertohogar_token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (isEditingProducto) {
        await axios.put(`${API_URL}/productos/${productoForm.id}`, productoForm, config)
        setSuccess('Producto actualizado exitosamente')
      } else {
        // Crear copia del producto sin el campo id
        const { id, ...productoSinId } = productoForm
        await axios.post(`${API_URL}/productos`, productoSinId, config)
        setSuccess('Producto creado exitosamente')
      }

      setShowProductoModal(false)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving producto:', err)
      setError('Error al guardar el producto')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteProducto = async (id) => {
    console.log('Intentando eliminar producto con ID:', id);
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const token = localStorage.getItem('huertohogar_token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      console.log('Enviando petición DELETE a:', `${API_URL}/productos/${id}`);
      const response = await axios.delete(`${API_URL}/productos/${id}`, config)
      console.log('Respuesta del servidor:', response);
      setSuccess('Producto eliminado exitosamente')
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error deleting producto:', err)
      console.error('Detalles del error:', err.response?.data);
      setError('Error al eliminar el producto: ' + (err.response?.data?.message || err.message))
      setTimeout(() => setError(''), 3000)
    }
  }

  // ========== USUARIOS ==========
  const handleViewUsuario = (usuario) => {
    setSelectedUsuario(usuario)
    setShowUsuarioModal(true)
  }

  return (
    <div className="admin-panel-page">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1 className="admin-title">
              <i className="fas fa-tools me-3"></i>
              Panel de Administración
            </h1>
          </Col>
        </Row>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          {/* TAB PEDIDOS */}
          <Tab eventKey="pedidos" title={<><i className="fas fa-shopping-bag me-2"></i>Pedidos</>}>
            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Método Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                          <td>#{pedido.id.substring(0, 8)}</td>
                          <td>{pedido.nombreCliente}</td>
                          <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                          <td>${pedido.total.toLocaleString()}</td>
                          <td>
                            <Badge bg={getEstadoBadge(pedido.estado)}>
                              {pedido.estado}
                            </Badge>
                          </td>
                          <td>{pedido.metodoPago || 'N/A'}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleViewPedido(pedido)}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* TAB PRODUCTOS */}
          <Tab eventKey="productos" title={<><i className="fas fa-box me-2"></i>Productos</>}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Gestión de Productos</h5>
                <Button variant="success" onClick={handleAddProducto}>
                  <i className="fas fa-plus me-2"></i>
                  Nuevo Producto
                </Button>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map(producto => (
                        <tr key={producto.id}>
                          <td>
                            <img
                              src={producto.imagenUrl}
                              alt={producto.nombre}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                          </td>
                          <td>{producto.nombre}</td>
                          <td>{producto.categoria}</td>
                          <td>${producto.precio.toLocaleString()}</td>
                          <td>
                            <Badge bg={producto.stock > 10 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}>
                              {producto.stock}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="warning"
                              className="me-2"
                              onClick={() => handleEditProducto(producto)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteProducto(producto.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* TAB USUARIOS */}
          <Tab eventKey="usuarios" title={<><i className="fas fa-users me-2"></i>Usuarios</>}>
            <Card>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Roles</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(usuario => (
                        <tr key={usuario.id}>
                          <td>{usuario.firstName} {usuario.lastName}</td>
                          <td>{usuario.email}</td>
                          <td>{usuario.phone || 'N/A'}</td>
                          <td>
                            {usuario.roles?.map(rol => (
                              <Badge key={rol.id} bg="primary" className="me-1">
                                {rol.nombre}
                              </Badge>
                            ))}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleViewUsuario(usuario)}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* MODAL VER PEDIDO */}
        <Modal show={showPedidoModal} onHide={() => setShowPedidoModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPedido && (
              <>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>ID:</strong> #{selectedPedido.id.substring(0, 8)}
                  </Col>
                  <Col md={6}>
                    <strong>Estado:</strong>{' '}
                    <Badge bg={getEstadoBadge(selectedPedido.estado)}>
                      {selectedPedido.estado}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Cliente:</strong> {selectedPedido.nombreCliente}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {selectedPedido.emailCliente}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <strong>Teléfono:</strong> {selectedPedido.telefonoCliente}
                  </Col>
                  <Col md={6}>
                    <strong>Fecha:</strong> {new Date(selectedPedido.fechaPedido).toLocaleString()}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <strong>Dirección:</strong> {selectedPedido.direccionEnvio}
                  </Col>
                </Row>
                
                {selectedPedido.metodoPago && (
                  <>
                    <hr />
                    <h6>Información de Pago</h6>
                    <Row className="mb-2">
                      <Col md={6}>
                        <strong>Método:</strong> {selectedPedido.metodoPago}
                      </Col>
                      <Col md={6}>
                        <strong>Código Auth:</strong> {selectedPedido.codigoAutorizacion || 'N/A'}
                      </Col>
                    </Row>
                    {selectedPedido.detallesTarjeta && (
                      <Row>
                        <Col md={6}>
                          <strong>Tarjeta:</strong> {selectedPedido.detallesTarjeta}
                        </Col>
                        <Col md={6}>
                          <strong>Tipo:</strong> {selectedPedido.tipoTarjeta || 'N/A'}
                        </Col>
                      </Row>
                    )}
                  </>
                )}

                <hr />
                <h6>Items del Pedido</h6>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPedido.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombreProducto}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precioUnitario.toLocaleString()}</td>
                        <td>${item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td><strong>${selectedPedido.total.toLocaleString()}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPedidoModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL PRODUCTO */}
        <Modal show={showProductoModal} onHide={() => setShowProductoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditingProducto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveProducto}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={productoForm.nombre}
                  onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={productoForm.descripcion}
                  onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={productoForm.precio}
                      onChange={(e) => setProductoForm({ ...productoForm, precio: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={productoForm.stock}
                      onChange={(e) => setProductoForm({ ...productoForm, stock: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  required
                  value={productoForm.categoria}
                  onChange={(e) => {
                    console.log('Categoría seleccionada:', e.target.value);
                    setProductoForm({ ...productoForm, categoria: e.target.value });
                  }}
                >
                  <option value="">Seleccionar...</option>
                  <option value="frutas">Frutas</option>
                  <option value="verduras">Verduras</option>
                  <option value="organicos">Orgánicos</option>
                  <option value="lacteos">Lácteos</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>URL de Imagen</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={productoForm.imagenUrl}
                  onChange={(e) => setProductoForm({ ...productoForm, imagenUrl: e.target.value })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowProductoModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                {isEditingProducto ? 'Actualizar' : 'Crear'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* MODAL USUARIO */}
        <Modal show={showUsuarioModal} onHide={() => setShowUsuarioModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUsuario && (
              <>
                <p><strong>Nombre:</strong> {selectedUsuario.firstName} {selectedUsuario.lastName}</p>
                <p><strong>Email:</strong> {selectedUsuario.email}</p>
                <p><strong>Teléfono:</strong> {selectedUsuario.phone || 'N/A'}</p>
                <p><strong>Dirección:</strong> {selectedUsuario.address || 'N/A'}</p>
                <p><strong>Ciudad:</strong> {selectedUsuario.city || 'N/A'}</p>
                <p><strong>Código Postal:</strong> {selectedUsuario.zipCode || 'N/A'}</p>
                <p>
                  <strong>Roles:</strong>{' '}
                  {selectedUsuario.roles?.map(rol => (
                    <Badge key={rol.id} bg="primary" className="me-1">
                      {rol.nombre}
                    </Badge>
                  ))}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUsuarioModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default AdminPanel
