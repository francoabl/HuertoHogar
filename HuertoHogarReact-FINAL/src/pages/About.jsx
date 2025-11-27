import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './About.css';

function About() {
  const teamMembers = [
    {
      name: 'Agustín Aceval',
      role: 'Full Stack Developer',
      description: 'Especialista en desarrollo web con experiencia en tecnologías modernas. Responsable de la arquitectura del sistema y la implementación de funcionalidades avanzadas.',
      gradient: 'linear-gradient(135deg, var(--accent-green), var(--fresh-green))'
    },
    {
      name: 'Aaron Gorigoitia',
      role: 'Frontend Developer',
      description: 'Experto en experiencia de usuario y diseño de interfaces. Encargado de crear una experiencia intuitiva y atractiva para nuestros usuarios.',
      gradient: 'linear-gradient(135deg, var(--light-green), var(--accent-green))'
    },
    {
      name: 'Franco Alarcón',
      role: 'Backend Developer',
      description: 'Desarrollador backend con enfoque en la seguridad y performance. Responsable de la infraestructura del servidor y la gestión de datos.',
      gradient: 'linear-gradient(135deg, var(--fresh-green), var(--light-green))'
    }
  ];

  const values = [
    {
      icon: 'fa-heart',
      title: 'Calidad',
      description: 'Nos comprometemos a ofrecer solo los mejores productos, verificando la calidad en cada paso del proceso.',
      color: 'var(--accent-green)'
    },
    {
      icon: 'fa-handshake',
      title: 'Confianza',
      description: 'Construimos relaciones duraderas basadas en la transparencia y el cumplimiento de nuestras promesas.',
      color: 'var(--fresh-green)'
    },
    {
      icon: 'fa-leaf',
      title: 'Sostenibilidad',
      description: 'Promovemos prácticas agrícolas responsables que cuiden el medio ambiente para las futuras generaciones.',
      color: 'var(--light-green)'
    },
    {
      icon: 'fa-users',
      title: 'Comunidad',
      description: 'Apoyamos a los productores locales y fortalecemos los vínculos entre campo y ciudad.',
      color: 'var(--accent-green)'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="about-hero-title">Acerca de HuertoHogar</h1>
              <p className="about-hero-subtitle">
                Conectando productores locales con familias que buscan alimentos frescos y naturales
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Historia Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <Card className="about-feature-card mb-5">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <h2 className="about-section-title mb-4">Nuestra Historia</h2>
                      <p className="lead mb-4">
                        HuertoHogar nació de la pasión por conectar a las familias con productos frescos, 
                        naturales y de calidad directamente desde los huertos locales hasta sus hogares.
                      </p>
                      <p className="mb-4">
                        Creemos en la importancia de una alimentación saludable y en el apoyo a los 
                        productores locales. Por eso, creamos una plataforma que facilita el acceso a 
                        productos orgánicos y frescos, eliminando intermediarios y garantizando la mejor 
                        calidad para nuestros clientes.
                      </p>
                      <p>
                        Nuestro compromiso es brindar transparencia en el origen de cada producto, 
                        promover prácticas agrícolas sostenibles y contribuir al desarrollo de las 
                        comunidades rurales.
                      </p>
                    </Col>
                    <Col lg={6}>
                      <div className="text-center">
                        <i className="fas fa-leaf about-large-icon"></i>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Misión y Visión Section */}
      <section className="py-5 about-mission-section">
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="about-feature-card h-100">
                <Card.Body>
                  <div className="text-center mb-4">
                    <i className="fas fa-bullseye about-icon" style={{ color: 'var(--accent-green)' }}></i>
                  </div>
                  <h3 className="text-center about-section-title mb-4">Nuestra Misión</h3>
                  <p className="text-center">
                    Facilitar el acceso a productos agrícolas frescos y de calidad, conectando 
                    directamente a productores locales con consumidores conscientes, promoviendo 
                    una alimentación saludable y el desarrollo sostenible de las comunidades rurales.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="about-feature-card h-100">
                <Card.Body>
                  <div className="text-center mb-4">
                    <i className="fas fa-eye about-icon" style={{ color: 'var(--fresh-green)' }}></i>
                  </div>
                  <h3 className="text-center about-section-title mb-4">Nuestra Visión</h3>
                  <p className="text-center">
                    Ser la plataforma líder en el mercado de productos agrícolas frescos, reconocida 
                    por la calidad de nuestros productos, la transparencia en nuestros procesos y 
                    nuestro compromiso con la sostenibilidad ambiental y social.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Equipo Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="about-section-title">Nuestro Equipo de Desarrollo</h2>
              <p className="lead">Conoce a los desarrolladores que hicieron posible HuertoHogar</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {teamMembers.map((member, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <Card className="about-feature-card text-center h-100">
                  <Card.Body>
                    <div className="mb-4">
                      <div 
                        className="about-avatar mx-auto mb-3"
                        style={{ background: member.gradient }}
                      >
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <h4 className="about-section-title">{member.name}</h4>
                    <p className="text-muted mb-3">{member.role}</p>
                    <p>{member.description}</p>
                    <div className="mt-3">
                      <i className="fab fa-github me-2 about-social-icon"></i>
                      <i className="fab fa-linkedin about-social-icon"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Valores Section */}
      <section className="py-5 about-values-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 className="about-section-title">Nuestros Valores</h2>
              <p className="lead">Los principios que guían nuestro trabajo diario</p>
            </Col>
          </Row>
          <Row>
            {values.map((value, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className="about-feature-card text-center h-100">
                  <Card.Body>
                    <i 
                      className={`fas ${value.icon} about-value-icon mb-3`}
                      style={{ color: value.color }}
                    ></i>
                    <h5 className="about-section-title">{value.title}</h5>
                    <p>{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <Card className="about-feature-card">
                <Card.Body>
                  <h3 className="mb-4 about-section-title">¿Listo para probar nuestros productos?</h3>
                  <p className="lead mb-4">
                    Únete a nuestra comunidad y descubre la diferencia de los productos frescos del campo.
                  </p>
                  <Link to="/productos" className="btn btn-success me-3">
                    <i className="fas fa-shopping-cart me-2"></i>Ver Productos
                  </Link>
                  <Link to="/registro" className="btn btn-outline-success">
                    <i className="fas fa-user-plus me-2"></i>Registrarse
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default About;
