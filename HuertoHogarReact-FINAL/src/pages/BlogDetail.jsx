import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import './BlogDetail.css'

const BLOGS = [
  {
    id: 1,
    titulo: "Cómo crear tu huerto urbano en casa",
    fecha: "2025-09-01",
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop",
    resumen: "Descubre los secretos para iniciar un huerto en tu hogar, sin importar el espacio disponible. Te guiamos paso a paso.",
    categoria: "Huerto Urbano",
    autor: "María González",
    tiempoLectura: "5 min",
    contenido: `
      <p class="lead">Empezar un huerto urbano es más sencillo de lo que parece y una excelente manera de tener productos frescos en casa. Solo necesitas macetas, tierra fértil y algunas semillas para dar el primer paso hacia la autosuficiencia alimentaria.</p>
      
      <h3>¿Qué necesitas para empezar?</h3>
      <ul>
        <li><strong>Macetas o contenedores con buen drenaje:</strong> Asegúrate de que tengan agujeros en la base para evitar el encharcamiento.</li>
        <li><strong>Tierra orgánica de calidad:</strong> Una buena base de sustrato es fundamental para el crecimiento saludable de tus plantas.</li>
        <li><strong>Semillas de cultivos fáciles:</strong> Lechugas, rabanitos, hierbas aromáticas y tomates cherry son perfectos para comenzar.</li>
        <li><strong>Un lugar con luz solar directa:</strong> La mayoría de las hortalizas necesitan al menos 6 horas de sol al día.</li>
      </ul>
      
      <h3>Paso a paso para tu primer huerto</h3>
      <ol>
        <li><strong>Elige el espacio adecuado:</strong> Puede ser un balcón, terraza, patio o incluso una ventana soleada.</li>
        <li><strong>Selecciona tus plantas:</strong> Comienza con cultivos nobles como lechugas, rabanitos y hierbas aromáticas. Son de crecimiento rápido y muy resistentes.</li>
        <li><strong>Prepara los contenedores:</strong> Limpia bien las macetas y asegúrate de que tienen buen drenaje.</li>
        <li><strong>Planta las semillas:</strong> Sigue las instrucciones del paquete respecto a profundidad y espaciado.</li>
        <li><strong>Riega regularmente:</strong> Mantén la tierra húmeda pero no encharcada. La constancia es clave.</li>
        <li><strong>Ten paciencia:</strong> Los primeros brotes aparecerán en 5-10 días dependiendo del cultivo.</li>
      </ol>
      
      <h3>Consejos para el éxito</h3>
      <p>El éxito de tu huerto urbano depende de varios factores, pero los más importantes son la luz, el agua y la calidad del sustrato. No te desanimes si las primeras plantas no prosperan como esperabas; la jardinería es un aprendizaje constante.</p>
      
      <blockquote class="blockquote border-start border-5 border-success ps-3 my-4">
        <p>"Un huerto urbano no solo te provee de alimentos frescos, sino que también es una terapia para el alma y una conexión directa con la naturaleza."</p>
      </blockquote>
      
      <p>Recuerda que en HuertoHogar ofrecemos productos frescos y orgánicos si necesitas complementar tu cosecha. ¡Feliz cultivo!</p>
    `
  },
  {
    id: 2,
    titulo: "Beneficios de los alimentos orgánicos",
    fecha: "2025-08-28",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop",
    categoria: "Salud",
    autor: "Dr. Carlos Ruiz",
    tiempoLectura: "7 min",
    contenido: `
      <p class="lead">Consumir alimentos orgánicos no solo reduce la exposición a pesticidas y químicos sintéticos, sino que también promueve prácticas agrícolas más sostenibles que cuidan nuestro planeta.</p>
      
      <h3>Ventajas principales de los alimentos orgánicos:</h3>
      <ul>
        <li><strong>Mayor contenido nutricional:</strong> Estudios demuestran que los alimentos orgánicos tienen más antioxidantes y vitaminas.</li>
        <li><strong>Sabor más intenso y natural:</strong> Sin químicos que alteren su composición, el sabor es más auténtico.</li>
        <li><strong>Libre de pesticidas sintéticos:</strong> Tu cuerpo no acumula residuos tóxicos.</li>
        <li><strong>Apoya la biodiversidad:</strong> Las prácticas orgánicas protegen especies y ecosistemas.</li>
        <li><strong>Cuida la salud del suelo:</strong> Métodos naturales mantienen la tierra fértil por generaciones.</li>
      </ul>
      
      <h3>¿Por qué elegir orgánico?</h3>
      <p>La agricultura orgánica no usa fertilizantes sintéticos, pesticidas químicos ni organismos genéticamente modificados (OGM). En su lugar, se basa en métodos naturales como el compostaje, la rotación de cultivos y el control biológico de plagas.</p>
      
      <p>En HuertoHogar, todos nuestros productos son cultivados siguiendo estrictos estándares orgánicos, garantizando que lleguen a tu mesa con toda su frescura y valor nutricional intacto.</p>
    `
  },
  {
    id: 3,
    titulo: "Temporada de cosecha: ¿Qué comer en otoño?",
    fecha: "2025-08-15",
    imagen: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=1200&h=600&fit=crop",
    categoria: "Temporada",
    autor: "Ana Martínez",
    tiempoLectura: "6 min",
    contenido: `
      <p class="lead">El otoño es una época maravillosa para disfrutar de productos frescos y nutritivos. Comer de temporada no solo es más económico, sino que también garantiza que obtengas los mejores sabores y nutrientes.</p>
      
      <h3>Productos destacados del otoño:</h3>
      <ul>
        <li><strong>Manzanas:</strong> Perfectas para postres, jugos y snacks saludables. Ricas en fibra y vitamina C.</li>
        <li><strong>Naranjas:</strong> Fuente excelente de vitamina C, ideales para fortalecer el sistema inmune ante el clima frío.</li>
        <li><strong>Zanahorias:</strong> Versátiles y nutritivas, perfectas para guisos, ensaladas y jugos naturales.</li>
        <li><strong>Espinacas:</strong> Fuente de hierro y vitaminas, ideales para batidos verdes y ensaladas.</li>
        <li><strong>Calabazas:</strong> Ricas en betacarotenos, perfectas para sopas cremosas y postres.</li>
      </ul>
      
      <h3>Beneficios de comer de temporada</h3>
      <p>Los alimentos de temporada son más frescos, más baratos y tienen mejor sabor. Además, al consumirlos apoyas a los agricultores locales y reduces la huella de carbono asociada con el transporte de alimentos.</p>
      
      <p>En HuertoHogar seleccionamos cuidadosamente los mejores productos de cada temporada, asegurándonos de que lleguen a tu mesa con la máxima frescura del campo chileno.</p>
    `
  },
  {
    id: 4,
    titulo: "Compostaje en casa: Guía completa",
    fecha: "2025-08-01",
    imagen: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&h=600&fit=crop",
    categoria: "Sostenibilidad",
    autor: "Pedro Sánchez",
    tiempoLectura: "8 min",
    contenido: `
      <p class="lead">El compostaje es una práctica sencilla y efectiva para reducir tus desechos orgánicos mientras creas un fertilizante natural de alta calidad para tus plantas.</p>
      
      <h3>¿Qué es el compost?</h3>
      <p>El compost es el resultado de la descomposición controlada de materia orgánica. Es un proceso natural que transforma tus restos de cocina y jardín en un rico abono que mejora la estructura del suelo y aporta nutrientes esenciales.</p>
      
      <h3>Materiales para compostar:</h3>
      <ul>
        <li><strong>Verdes (ricos en nitrógeno):</strong> Restos de frutas y verduras, posos de café, césped fresco, cáscaras de huevo.</li>
        <li><strong>Marrones (ricos en carbono):</strong> Hojas secas, ramas pequeñas, papel, cartón sin tinta.</li>
        <li><strong>Lo que NO debes compostar:</strong> Carne, lácteos, grasas, huesos, plásticos, vidrio.</li>
      </ul>
      
      <h3>Paso a paso:</h3>
      <ol>
        <li><strong>Elige un contenedor:</strong> Puede ser una compostera comprada o hecha en casa con pallets.</li>
        <li><strong>Alterna capas:</strong> Comienza con una capa de material marrón, luego verde, y así sucesivamente.</li>
        <li><strong>Mantén la humedad:</strong> El compost debe estar húmedo como una esponja exprimida.</li>
        <li><strong>Airea regularmente:</strong> Remueve el contenido cada 1-2 semanas para oxigenar.</li>
        <li><strong>Espera de 2-6 meses:</strong> El tiempo varía según el clima y los materiales.</li>
      </ol>
      
      <blockquote class="blockquote border-start border-5 border-success ps-3 my-4">
        <p>"El compostaje no solo reduce tu huella ambiental, sino que devuelve a la tierra lo que nos da, cerrando el ciclo de la naturaleza."</p>
      </blockquote>
      
      <p>¡Empieza hoy mismo y contribuye a un planeta más sostenible!</p>
    `
  },
  {
    id: 5,
    titulo: "Recetas saludables con verduras de temporada",
    fecha: "2025-07-20",
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=600&fit=crop",
    categoria: "Recetas",
    autor: "Chef Laura Vega",
    tiempoLectura: "10 min",
    contenido: `
      <p class="lead">Aprovecha al máximo las verduras frescas de cada estación con estas deliciosas recetas nutritivas y fáciles de preparar.</p>
      
      <h3>Ensalada Primaveral de Espinacas</h3>
      <p><strong>Ingredientes:</strong> Espinacas frescas, fresas, nueces, queso de cabra, vinagreta de miel.</p>
      <p>Una combinación perfecta de sabores dulces y salados que resalta la frescura de las espinacas de primavera.</p>
      
      <h3>Crema de Calabaza Otoñal</h3>
      <p><strong>Ingredientes:</strong> Calabaza, cebolla, ajo, caldo de verduras, crema, nuez moscada.</p>
      <p>Reconfortante y nutritiva, esta sopa es perfecta para las tardes frías de otoño.</p>
      
      <h3>Salteado de Verduras de Verano</h3>
      <p><strong>Ingredientes:</strong> Zucchini, tomates cherry, pimientos, ajo, aceite de oliva, albahaca fresca.</p>
      <p>Colorido, rápido y lleno de sabor mediterráneo. Ideal como acompañamiento o plato principal.</p>
      
      <h3>Consejos para cocinar verduras:</h3>
      <ul>
        <li><strong>No sobrecocines:</strong> Las verduras al dente retienen más nutrientes y tienen mejor textura.</li>
        <li><strong>Aprovecha las cáscaras:</strong> Muchas vitaminas están en la piel. Lávalas bien y consúmelas enteras.</li>
        <li><strong>Varía los métodos:</strong> Alterna entre asado, vapor, salteado y crudo para no aburrirte.</li>
      </ul>
      
      <p>En HuertoHogar encontrarás las verduras más frescas para llevar estas recetas a tu mesa. ¡Buen provecho!</p>
    `
  },
  {
    id: 6,
    titulo: "Control natural de plagas en el huerto",
    fecha: "2025-07-10",
    imagen: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=600&fit=crop",
    categoria: "Huerto Urbano",
    autor: "Ing. Roberto Flores",
    tiempoLectura: "7 min",
    contenido: `
      <p class="lead">Mantén tu huerto saludable y libre de plagas sin recurrir a pesticidas químicos. Descubre métodos ecológicos y efectivos.</p>
      
      <h3>Prevención: La mejor estrategia</h3>
      <p>Un huerto sano es menos susceptible a plagas. Mantén plantas fuertes con buen riego, luz solar adecuada y suelo nutritivo.</p>
      
      <h3>Métodos naturales de control:</h3>
      <ul>
        <li><strong>Plantas compañeras:</strong> Albahaca repele moscas y mosquitos, caléndulas alejan pulgones.</li>
        <li><strong>Depredadores naturales:</strong> Atrae mariquitas, mantis religiosas y pájaros a tu huerto.</li>
        <li><strong>Barreras físicas:</strong> Mallas, trampas cromáticas y cintas repelentes.</li>
        <li><strong>Soluciones caseras:</strong> Spray de ajo, jabón potásico, aceite de neem.</li>
      </ul>
      
      <h3>Receta: Spray repelente natural</h3>
      <p><strong>Ingredientes:</strong> 1 cabeza de ajo, 1 litro de agua, 1 cucharada de jabón líquido natural.</p>
      <p><strong>Preparación:</strong> Licúa el ajo con agua, deja reposar 24h, cuela y añade el jabón. Aplica en las hojas afectadas.</p>
      
      <h3>Plagas comunes y soluciones:</h3>
      <ul>
        <li><strong>Pulgones:</strong> Spray de agua con jabón o mariquitas.</li>
        <li><strong>Caracoles:</strong> Barreras de cáscara de huevo triturada o cerveza en recipientes.</li>
        <li><strong>Orugas:</strong> Recogida manual o Bacillus thuringiensis (bacteria natural).</li>
      </ul>
      
      <blockquote class="blockquote border-start border-5 border-success ps-3 my-4">
        <p>"La naturaleza tiene sus propias soluciones. Aprende a trabajar con ella, no contra ella."</p>
      </blockquote>
      
      <p>Con paciencia y observación, tu huerto prosperará de manera natural y sostenible.</p>
    `
  }
]

const BlogDetail = () => {
  const { id } = useParams()
  const blog = BLOGS.find(b => b.id === parseInt(id))

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (!blog) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>
            <i className="fas fa-exclamation-triangle me-2"></i>
            Artículo no encontrado
          </Alert.Heading>
          <p>Lo sentimos, el artículo que buscas no está disponible.</p>
          <hr />
          <Button as={Link} to="/blog" variant="success">
            <i className="fas fa-arrow-left me-2"></i>
            Volver al Blog
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <div className="blog-detail-page">
      {/* Hero Section */}
      <section className="blog-detail-hero">
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <div className="blog-detail-meta mb-3">
                <Badge bg="success" className="me-2">
                  <i className="fas fa-folder me-1"></i>
                  {blog.categoria}
                </Badge>
                <Badge bg="light" text="dark" className="me-2">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {formatDate(blog.fecha)}
                </Badge>
                <Badge bg="light" text="dark" className="me-2">
                  <i className="fas fa-user me-1"></i>
                  {blog.autor || 'HuertoHogar'}
                </Badge>
                <Badge bg="light" text="dark">
                  <i className="fas fa-clock me-1"></i>
                  {blog.tiempoLectura || '5 min'}
                </Badge>
              </div>
              <h1 className="blog-detail-title">{blog.titulo}</h1>
              <p className="blog-detail-excerpt">{blog.resumen}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="blog-detail-image-section py-4">
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <div className="blog-detail-image-container">
                <img 
                  src={blog.imagen} 
                  alt={blog.titulo} 
                  className="blog-detail-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div 
                className="blog-detail-content"
                dangerouslySetInnerHTML={{ __html: blog.contenido }}
              />

              {/* Actions */}
              <div className="blog-detail-actions mt-5 pt-4 border-top">
                <div className="d-flex gap-3 flex-wrap justify-content-between align-items-center">
                  <Button as={Link} to="/blog" variant="outline-success">
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver al Blog
                  </Button>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-share-alt me-2"></i>
                      Compartir
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-bookmark me-2"></i>
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Related CTA */}
              <div className="blog-detail-cta mt-5 p-4 rounded">
                <h4 className="mb-3">¿Te gustó este artículo?</h4>
                <p className="mb-3">
                  Descubre nuestros productos frescos y orgánicos, cultivados con los mismos 
                  principios que compartimos en nuestro blog.
                </p>
                <Button as={Link} to="/productos" variant="success" size="lg">
                  <i className="fas fa-shopping-basket me-2"></i>
                  Ver Productos
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default BlogDetail

