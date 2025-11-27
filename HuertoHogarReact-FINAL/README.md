# HuertoHogar React

Aplicación web moderna para la venta de productos agrícolas desarrollada con React y Bootstrap.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/francoabl/HuertoHogarReact.git
cd HuertoHogarReact
```

2. **Instalar dependencias**
```bash
cd src-react
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Construir para producción**
```bash
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Herramienta de construcción
- **Bootstrap 5** - Framework CSS
- **React Router** - Enrutamiento
- **Context API** - Gestión de estado

## 🏗️ Estructura del Proyecto

```
src-react/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   ├── context/       # Context API para estado global
│   └── data/          # Datos estáticos
├── public/            # Archivos estáticos
└── dist/             # Build de producción
```

## 📱 Características

- ✅ Diseño responsivo
- ✅ Carrito de compras
- ✅ Sistema de autenticación
- ✅ Catálogo de productos
- ✅ Blog integrado
- ✅ Optimizado para SEO



#### Ejemplo: Registro de usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "apellido": "Pérez", "email": "juan@ejemplo.com", "password": "Password123", "telefono": "555-0123"}'
```

#### Ejemplo: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@ejemplo.com", "password": "Password123"}'
```

#### Ejemplo: Obtener productos

```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&search=manzana"
```

## Estructura del Proyecto

- `api/` - Backend Node.js (Express, MySQL)
- `src/` - Frontend (HTML, CSS, JS)
- `public/` - Archivos públicos y assets

## Scripts útiles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en desarrollo con nodemon

## Usuario administrador por defecto

- Email: `admin@huertohogar.cl`
- Contraseña: `password` (cambiar en producción)

## Seguridad

- Autenticación JWT
- Validación de datos
- Rate limiting
- Helmet y CORS

## Contribución

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/NuevaFeature`
3. Haz commit y push
4. Abre un Pull Request

## Licencia

ISC

---
