import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
    aceptoTerminos: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [charCount, setCharCount] = useState(0)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Contador de caracteres para mensaje
    if (name === 'mensaje') {
      setCharCount(value.length)
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Por favor ingresa tu nombre completo (mínimo 2 caracteres)'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.correo) {
      newErrors.correo = 'El correo electrónico es requerido'
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo electrónico válido'
    }

    if (!formData.mensaje.trim() || formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    } else if (formData.mensaje.length > 500) {
      newErrors.mensaje = 'El mensaje no puede exceder 500 caracteres'
    }

    if (!formData.aceptoTerminos) {
      newErrors.aceptoTerminos = 'Debes aceptar los términos y condiciones'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    // Simular envío del formulario
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% de éxito para demo

      if (success) {
        setMessage({
          type: 'success',
          text: '¡Gracias por contactarnos! Hemos recibido tu mensaje y nos pondremos en contacto contigo en menos de 24 horas.'
        })
        // Reset form
        setFormData({
          nombre: '',
          correo: '',
          asunto: '',
          mensaje: '',
          aceptoTerminos: false
        })
        setCharCount(0)
        setErrors({})
      } else {
        setMessage({
          type: 'danger',
          text: 'Hubo un error al enviar tu mensaje. Por favor intenta nuevamente o contáctanos directamente por teléfono.'
        })
      }

      setLoading(false)
      // Scroll to message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 2000)
  }

  const getCharCountColor = () => {
    if (charCount < 10) return 'text-warning'
    if (charCount > 500) return 'text-danger'
    return 'text-success'
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="hero-title">Contáctanos</h1>
              <p className="hero-subtitle">
                ¿Tienes preguntas sobre nuestros productos? ¿Necesitas ayuda con tu pedido? 
                Estamos aquí para ayudarte. Envíanos un mensaje y nos pondremos en contacto 
                contigo lo antes posible.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button href="#formulario" variant="success" size="lg">
                  <i className="fas fa-envelope me-2"></i>
                  Enviar Mensaje
                </Button>
                <Button href="tel:+56223456789" variant="outline-success" size="lg">
                  <i className="fas fa-phone me-2"></i>
                  +56 2 2345 6789
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="contact-info-card h-100 text-center">
                <Card.Body>
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h5>Nuestra Oficina</h5>
                  <p className="text-muted mb-0">
                    Av. Providencia 1234<br />
                    Santiago, Chile
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="contact-info-card h-100 text-center">
                <Card.Body>
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <h5>Teléfono</h5>
                  <p className="text-muted mb-0">
                    +56 2 2345 6789<br />
                    Lun - Sáb: 8:00 - 18:00
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="contact-info-card h-100 text-center">
                <Card.Body>
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h5>Email</h5>
                  <p className="text-muted mb-0">
                    info@huertohogar.cl<br />
                    ventas@huertohogar.cl
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section id="formulario" className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="contact-form-card">
                <Card.Body className="p-4 p-md-5">
                  <div className="text-center mb-5">
                    <h2 className="section-title">Envíanos un Mensaje</h2>
                    <p className="text-muted">
                      Completa el siguiente formulario y nos pondremos en contacto contigo 
                      en menos de 24 horas.
                    </p>
                  </div>

                  {message.text && (
                    <Alert 
                      variant={message.type} 
                      dismissible 
                      onClose={() => setMessage({ type: '', text: '' })}
                      className="mb-4"
                    >
                      {message.text}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            <i className="fas fa-user me-2 text-success"></i>
                            Nombre Completo *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            isInvalid={!!errors.nombre}
                            placeholder="Juan Pérez"
                            size="lg"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.nombre}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            <i className="fas fa-envelope me-2 text-success"></i>
                            Correo Electrónico *
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            isInvalid={!!errors.correo}
                            placeholder="tu@email.com"
                            size="lg"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.correo}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        <i className="fas fa-tag me-2 text-success"></i>
                        Asunto
                      </Form.Label>
                      <Form.Select
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        size="lg"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="consulta-productos">Consulta sobre productos</option>
                        <option value="pedido">Información sobre pedidos</option>
                        <option value="entrega">Consulta sobre entregas</option>
                        <option value="calidad">Calidad de productos</option>
                        <option value="sugerencia">Sugerencias</option>
                        <option value="otro">Otro</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        <i className="fas fa-comment me-2 text-success"></i>
                        Mensaje *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        isInvalid={!!errors.mensaje}
                        placeholder="Escribe tu mensaje aquí..."
                        size="lg"
                        maxLength={500}
                      />
                      <div className="d-flex justify-content-between">
                        <Form.Control.Feedback type="invalid">
                          {errors.mensaje}
                        </Form.Control.Feedback>
                        <Form.Text className={getCharCountColor()}>
                          {charCount}/500 caracteres
                          {charCount < 10 && ' (mínimo 10)'}
                        </Form.Text>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="aceptoTerminos"
                        checked={formData.aceptoTerminos}
                        onChange={handleChange}
                        isInvalid={!!errors.aceptoTerminos}
                        label={
                          <>
                            Acepto los{' '}
                            <a href="#" className="text-success">términos y condiciones</a>
                            {' '}y la{' '}
                            <a href="#" className="text-success">política de privacidad</a> *
                          </>
                        }
                      />
                      {errors.aceptoTerminos && (
                        <div className="invalid-feedback d-block">
                          {errors.aceptoTerminos}
                        </div>
                      )}
                    </Form.Group>

                    <Button
                      variant="success"
                      type="submit"
                      size="lg"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Contact

