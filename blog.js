// Base de datos de artículos
const BLOGS = [
  {
    id: 1,
    titulo: "Huerto urbano en casa",
    fecha: "2025-08-20",
    imagen: "https://picsum.photos/600/400",
    resumen: "Aprende cómo iniciar un huerto en tu propio hogar, incluso con poco espacio.",
    contenido: `
      <p>Empezar un huerto urbano es más sencillo de lo que parece. Solo necesitas
      macetas, tierra fértil y algunas semillas para dar el primer paso.</p>
      <p>Elige cultivos nobles como lechugas, rabanitos y hierbas aromáticas para
      comenzar tu experiencia agrícola en casa.</p>
    `
  },
  {
    id: 2,
    titulo: "Beneficios de la alimentación orgánica",
    fecha: "2025-08-28",
    imagen: "https://picsum.photos/600/400?random=2",
    resumen: "Descubre por qué los alimentos orgánicos son mejores para tu salud y el medio ambiente.",
    contenido: `
      <p>Consumir alimentos orgánicos reduce la exposición a pesticidas y promueve
      prácticas agrícolas más sostenibles.</p>
      <p>Además, los productos orgánicos suelen tener un sabor más intenso y natural,
      aportando nutrientes esenciales.</p>
    `
  },
  {
    id: 3,
    titulo: "Beneficios de la alimentación orgánica",
    fecha: "2025-08-28",
    imagen: "https://picsum.photos/600/400?random=2",
    resumen: "Descubre por qué los alimentos orgánicos son mejores para tu salud y el medio ambiente.",
    contenido: `
      <p>Consumir alimentos orgánicos reduce la exposición a pesticidas y promueve
      prácticas agrícolas más sostenibles.</p>
      <p>Además, los productos orgánicos suelen tener un sabor más intenso y natural,
      aportando nutrientes esenciales.</p>
    `
  }
];

// Renderiza listado de blog
function renderBlogList() {
  const container = document.getElementById("blog-list");
  container.innerHTML = BLOGS.map(blog => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${blog.imagen}" class="card-img-top" alt="${blog.titulo}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${blog.titulo}</h5>
          <p class="card-text text-muted small">${new Date(blog.fecha).toLocaleDateString("es-CL")}</p>
          <p class="card-text">${blog.resumen}</p>
          <a href="detalle-blog.html?id=${blog.id}" class="btn btn-primary mt-auto">Leer más</a>
        </div>
      </div>
    </div>
  `).join("");
}

// Renderiza detalle del blog
function renderBlogDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const blog = BLOGS.find(b => b.id === id);

  const container = document.getElementById("blog-detail");

  if (!blog) {
    container.innerHTML = `<div class="alert alert-danger">Artículo no encontrado.</div>`;
    return;
  }

  container.innerHTML = `
    <h1 class="mb-3">${blog.titulo}</h1>
    <p class="text-muted">${new Date(blog.fecha).toLocaleDateString("es-CL")}</p>
    <img src="${blog.imagen}" alt="${blog.titulo}" class="img-fluid rounded mb-4">
    <div>${blog.contenido}</div>
    <a href="blog.html" class="btn btn-outline-primary mt-4">
      <i class="fas fa-arrow-left me-2"></i> Volver al Blog
    </a>
  `;
}
