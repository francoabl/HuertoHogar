// Base de datos de artículos
const BLOGS = [
  {
    id: 1,
    titulo: "Cómo crear tu huerto urbano en casa",
    fecha: "2025-09-01",
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    resumen: "Descubre los secretos para iniciar un huerto en tu hogar, sin importar el espacio disponible. Te guiamos paso a paso.",
    contenido: `
      <p>Empezar un huerto urbano es más sencillo de lo que parece y una excelente manera de tener productos frescos en casa. Solo necesitas macetas, tierra fértil y algunas semillas para dar el primer paso hacia la autosuficiencia alimentaria.</p>
      
      <h3>¿Qué necesitas para empezar?</h3>
      <ul>
        <li>Macetas o contenedores con buen drenaje</li>
        <li>Tierra orgánica de calidad</li>
        <li>Semillas de cultivos fáciles (lechugas, rabanitos, hierbas)</li>
        <li>Un lugar con luz solar directa (al menos 6 horas)</li>
      </ul>
      
      <p>Elige cultivos nobles como lechugas, rabanitos y hierbas aromáticas para comenzar tu experiencia agrícola en casa. Estos cultivos crecen rápido y son perfectos para principiantes.</p>
    `
  },
  {
    id: 2,
    titulo: "Beneficios de los alimentos orgánicos",
    fecha: "2025-08-28",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
    resumen: "Explora por qué los alimentos orgánicos son una inversión en tu salud y en el cuidado del medio ambiente.",
    contenido: `
      <p>Consumir alimentos orgánicos no solo reduce la exposición a pesticidas y químicos sintéticos, sino que también promueve prácticas agrícolas más sostenibles que cuidan nuestro planeta.</p>
      
      <h3>Ventajas principales:</h3>
      <ul>
        <li>Mayor contenido nutricional</li>
        <li>Sabor más intenso y natural</li>
        <li>Libre de pesticidas sintéticos</li>
        <li>Apoya la biodiversidad</li>
        <li>Cuida la salud del suelo</li>
      </ul>
      
      <p>En HuertoHogar, todos nuestros productos son cultivados siguiendo estrictos estándares orgánicos, garantizando que lleguen a tu mesa con toda su frescura y valor nutricional intacto.</p>
    `
  },
  {
    id: 3,
    titulo: "Temporada de cosecha: ¿Qué comer en otoño?",
    fecha: "2025-08-15",
    imagen: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop",
    resumen: "Conoce cuáles son los productos de temporada que debes incluir en tu alimentación durante el otoño chileno.",
    contenido: `
      <p>El otoño es una época maravillosa para disfrutar de productos frescos y nutritivos. Comer de temporada no solo es más económico, sino que también garantiza que obtengas los mejores sabores y nutrientes.</p>
      
      <h3>Productos destacados del otoño:</h3>
      <ul>
        <li><strong>Manzanas:</strong> Perfectas para postres, jugos y snacks saludables</li>
        <li><strong>Naranjas:</strong> Ricas en vitamina C, ideales para fortalecer el sistema inmune</li>
        <li><strong>Zanahorias:</strong> Versátiles y nutritivas, perfectas para guisos y ensaladas</li>
        <li><strong>Espinacas:</strong> Fuente de hierro y vitaminas, ideales para batidos verdes</li>
      </ul>
      
      <p>En HuertoHogar seleccionamos cuidadosamente los mejores productos de cada temporada, asegurándonos de que lleguen a tu mesa con la máxima frescura del campo chileno.</p>
    `
  }
];

// Renderiza listado de blog
function renderBlogList() {
  const container = document.getElementById("blog-list");
  container.innerHTML = BLOGS.map(blog => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="feature-card blog-card h-100" data-blog-id="${blog.id}">
        <div class="blog-image-container mb-3">
          <img src="${blog.imagen}" class="blog-image" alt="${blog.titulo}">
        </div>
        <div class="d-flex flex-column h-100">
          <div class="blog-meta mb-2">
            <span class="badge bg-light text-primary">
              <i class="fas fa-calendar-alt me-1"></i>
              ${new Date(blog.fecha).toLocaleDateString("es-CL")}
            </span>
          </div>
          <h5 class="card-title mb-3">${blog.titulo}</h5>
          <p class="card-text text-muted mb-4 flex-grow-1">${blog.resumen}</p>
          <a href="detalle-blog.html?id=${blog.id}" class="btn btn-primary align-self-start blog-link">
            <i class="fas fa-arrow-right me-2"></i>Leer más
          </a>
        </div>
      </div>
    </div>
  `).join("");
  
  // Agregar event listeners para asegurar que funcionen los clics
  document.querySelectorAll('.blog-link').forEach(link => {
    link.addEventListener('click', function(e) {
      console.log('Click en enlace de blog:', this.href);
      // Permitir que el enlace funcione normalmente
      return true;
    });
  });
  
  // También agregar click en toda la tarjeta como alternativa
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Solo si no se hizo click en el botón directamente
      if (!e.target.closest('.blog-link')) {
        const blogId = this.getAttribute('data-blog-id');
        window.location.href = `detalle-blog.html?id=${blogId}`;
      }
    });
  });
}

// Renderiza detalle del blog
function renderBlogDetail() {
  console.log('Iniciando renderBlogDetail...');
  
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const blog = BLOGS.find(b => b.id === id);

  console.log('ID del blog:', id);
  console.log('Blog encontrado:', blog);

  const container = document.getElementById("blog-detail");
  
  if (!container) {
    console.error('Contenedor blog-detail no encontrado');
    return;
  }

  if (!blog) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
        <h3 class="mt-3 mb-3">Artículo no encontrado</h3>
        <p class="text-muted mb-4">Lo sentimos, el artículo que buscas no está disponible.</p>
        <a href="blog.html" class="btn btn-primary">
          <i class="fas fa-arrow-left me-2"></i>Volver al Blog
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="blog-header mb-4">
      <div class="blog-meta mb-3">
        <span class="badge bg-light text-primary">
          <i class="fas fa-calendar-alt me-1"></i>
          ${new Date(blog.fecha).toLocaleDateString("es-CL")}
        </span>
      </div>
      <h1 class="blog-detail-title mb-4">${blog.titulo}</h1>
    </div>
    
    <div class="blog-image-detail mb-4">
      <img src="${blog.imagen}" alt="${blog.titulo}" class="img-fluid rounded">
    </div>
    
    <div class="blog-content">
      ${blog.contenido}
    </div>
    
    <div class="blog-actions mt-5 pt-4 border-top">
      <div class="d-flex gap-3 flex-wrap">
        <a href="blog.html" class="btn btn-outline-primary">
          <i class="fas fa-arrow-left me-2"></i>Volver al Blog
        </a>
        <a href="productos.html" class="btn btn-primary">
          <i class="fas fa-shopping-basket me-2"></i>Ver Productos
        </a>
      </div>
    </div>
  `;
}
