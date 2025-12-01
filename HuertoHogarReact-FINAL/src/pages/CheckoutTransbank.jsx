import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import transbankService from '../services/transbank'
import { ordersAPI } from '../services/api'
import './CheckoutTransbank.css'

const CheckoutTransbank = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [serverStatus, setServerStatus] = useState(null)
  const [transactionDetails, setTransactionDetails] = useState(null)

  // Verificar si venimos de vuelta de Transbank
  useEffect(() => {
    const token_ws = searchParams.get('token_ws')
    if (token_ws) {
      handleTransbankReturn(token_ws)
    } else {
      checkProxyServer()
    }
    // eslint-disable-next-line
  }, [searchParams])

  // Verificar que el servidor proxy esté disponible
  const checkProxyServer = async () => {
    const isHealthy = await transbankService.checkServerHealth()
    setServerStatus(isHealthy)
    
    if (!isHealthy) {
      setError('⚠️ El servidor de pagos no está disponible. Ejecuta: npm run transbank-proxy en otra terminal')
    }
  }

  // Manejar el retorno desde Transbank
  const handleTransbankReturn = async (token) => {
    setLoading(true)
    try {
      // Confirmar la transacción con Transbank
      const response = await transbankService.commitTransaction(token)

      console.log('Respuesta de Transbank:', response)

      // Verificar que el pago fue aprobado
      if (response.status === 'AUTHORIZED' && response.responseCode === 0) {
        // Recuperar el ID del pedido pendiente
        const pendingOrderId = localStorage.getItem('pendingOrderId')

        if (!pendingOrderId) {
          throw new Error('No se encontró el pedido pendiente')
        }

        // Confirmar el pago en el backend con información de Transbank
        const paymentData = {
          numeroOrden: response.buyOrder,
          codigoAutorizacion: response.authorizationCode,
          codigoRespuesta: String(response.responseCode),
          detallesTarjeta: response.cardDetail?.cardNumber || '',
          tipoTarjeta: response.paymentTypeCode === 'VD' ? 'DEBIT' : 'CREDIT',
          cuotas: response.installmentsNumber || 1
        }

        await ordersAPI.confirmPayment(pendingOrderId, paymentData)

        console.log('✅ Pedido confirmado en base de datos:', pendingOrderId)

        // Limpiar datos temporales
        localStorage.removeItem('pendingOrderId')
        localStorage.removeItem('pendingCartItems')
        localStorage.removeItem('pendingCustomer')
        localStorage.removeItem('orders') // Ya no necesitamos localStorage para pedidos

        // Limpiar carrito
        clearCart()

        // Mostrar éxito
        setTransactionDetails(response)
        setPaymentSuccess(true)

        // Redirigir al perfil después de 5 segundos
        setTimeout(() => {
          navigate('/perfil')
        }, 5000)
      } else {
        setError(`Pago rechazado. Código: ${response.responseCode}. Por favor intenta nuevamente.`)
      }

    } catch (err) {
      console.error('Error al confirmar transacción:', err)
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  // Función para iniciar pago con Transbank SDK REAL
  const handlePaymentWithTransbank = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('Debes iniciar sesión para realizar una compra')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      setError('El carrito está vacío')
      return
    }

    if (serverStatus === false) {
      setError('El servidor de pagos no está disponible. Por favor contacta a soporte.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Paso 1: Crear el pedido en el backend (estado PENDIENTE)
      const pedidoResponse = await ordersAPI.createFromCart()
      const pedido = pedidoResponse.data
      
      console.log('✅ Pedido creado en base de datos:', pedido)

      // Guardar el ID del pedido para usarlo cuando regresemos de Transbank
      localStorage.setItem('pendingOrderId', pedido.id)

      // Paso 2: Preparar datos para Transbank
      const buyOrder = 'ORD-' + Date.now()
      const sessionId = 'SES-' + currentUser.email + '-' + Date.now()
      const amount = pedido.total
      const returnUrl = window.location.origin + '/checkout' // Transbank redirige aquí con token_ws

      // Guardar datos temporales (para mostrar en confirmación)
      localStorage.setItem('pendingCartItems', JSON.stringify(pedido.items))
      localStorage.setItem('pendingCustomer', JSON.stringify({
        nombre: currentUser.nombre,
        email: currentUser.email
      }))

      console.log('Iniciando transacción con Transbank...', {
        buyOrder,
        sessionId,
        amount,
        returnUrl
      })

      // Paso 3: Crear transacción con Transbank a través del proxy
      const response = await transbankService.createTransaction(
        buyOrder,
        sessionId,
        amount,
        returnUrl
      )

      console.log('Transacción creada, redirigiendo a Transbank...', response)

      // Paso 4: Redirigir al usuario a la página de pago de Transbank
      window.location.href = `${response.url}?token_ws=${response.token}`

    } catch (err) {
      console.error('Error al procesar el pago:', err)
      
      // Si es error 401, la sesión expiró
      if (err.response && err.response.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(err.message || 'Error al procesar el pago. Por favor intenta nuevamente.')
      }
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <Alert.Heading>Debes iniciar sesión</Alert.Heading>
          <p>Para realizar una compra, primero debes iniciar sesión en tu cuenta.</p>
          <Button variant="success" onClick={() => navigate('/login')}>
            Ir a Iniciar Sesión
          </Button>
        </Alert>
      </Container>
    )
  }

  if (cart.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <Alert.Heading>Carrito vacío</Alert.Heading>
          <p>No tienes productos en tu carrito.</p>
          <Button variant="success" onClick={() => navigate('/productos')}>
            Ir a Productos
          </Button>
        </Alert>
      </Container>
    )
  }

  if (paymentSuccess) {
    return (
      <Container className="checkout-page">
        <Card className="success-card text-center p-5">
          <div className="success-icon mb-4">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
          </div>
          <h2 className="text-success mb-3">¡Pago Exitoso!</h2>
          <p className="lead">Tu compra ha sido procesada correctamente con Transbank</p>
          
          {transactionDetails && (
            <div className="mt-4">
              <Alert variant="success">
                <p><strong>Número de Orden:</strong> {transactionDetails.buyOrder}</p>
                <p><strong>Código de Autorización:</strong> {transactionDetails.authorizationCode}</p>
                <p><strong>Monto:</strong> ${transactionDetails.amount.toLocaleString()}</p>
                <p><strong>Fecha:</strong> {new Date(transactionDetails.transactionDate).toLocaleString('es-CL')}</p>
                {transactionDetails.cardDetail && (
                  <p><strong>Tarjeta:</strong> **** {transactionDetails.cardDetail.card_number}</p>
                )}
              </Alert>
            </div>
          )}

          <p className="text-muted">Serás redirigido a tu perfil en 5 segundos...</p>
          <div className="mt-4">
            <img 
              src="https://www.webpay.cl/wp-content/uploads/2019/06/webpay-plus-logo.png"
              alt="Webpay Plus"
              style={{ maxWidth: '150px' }}
            />
          </div>
        </Card>
      </Container>
    )
  }

  return (
    <div className="checkout-page">
      <Container>
        <h1 className="mb-4">Finalizar Compra con Webpay</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {serverStatus === false && (
          <Alert variant="warning">
            <Alert.Heading>⚠️ Servidor de Pagos No Disponible</Alert.Heading>
            <p>Para usar Transbank SDK, necesitas ejecutar el servidor proxy en otra terminal:</p>
            <code>npm run transbank-proxy</code>
            <p className="mt-2 mb-0">El servidor debe estar corriendo en el puerto 3001</p>
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Resumen del Pedido</h5>
              </Card.Header>
              <Card.Body>
                {cart.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.imagenUrl || item.imagen || '/assets/img/placeholder.jpg'} 
                        alt={item.nombre}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        className="me-3"
                      />
                      <div>
                        <h6 className="mb-1">{item.nombre}</h6>
                        <small className="text-muted">Cantidad: {item.quantity}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <div>${item.precio.toLocaleString()}</div>
                      <small className="text-muted">
                        Subtotal: ${(item.precio * item.quantity).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5>Datos de Entrega</h5>
              </Card.Header>
              <Card.Body>
                <p><strong>Nombre:</strong> {currentUser.nombre}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p className="text-muted">
                  <small>Los productos serán enviados a la dirección registrada en tu perfil.</small>
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5>Total a Pagar</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span className="text-success">Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-success">${getCartTotal().toLocaleString()}</strong>
                </div>

                <Form onSubmit={handlePaymentWithTransbank}>
                  <div className="text-center mb-3">
                    <img 
                      src="https://www.webpay.cl/wp-content/uploads/2019/06/webpay-plus-logo.png"
                      alt="Webpay Plus"
                      style={{ maxWidth: '150px' }}
                    />
                  </div>

                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100 mb-3"
                    type="submit"
                    disabled={loading || serverStatus === false}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Redirigiendo a Transbank...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card me-2"></i>
                        Pagar con Webpay (SDK Real)
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted small mb-2">
                      <i className="fas fa-lock me-1"></i>
                      Pago 100% seguro con Transbank
                    </p>
                    <p className="text-success small">
                      <strong>✅ Usando SDK oficial de Transbank</strong>
                    </p>
                    <p className="text-muted small">
                      <strong>Ambiente:</strong> Integración (Pruebas)
                    </p>
                  </div>
                </Form>

                <div className="mt-3">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => navigate('/carrito')}
                    disabled={loading}
                  >
                    Volver al Carrito
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CheckoutTransbank
