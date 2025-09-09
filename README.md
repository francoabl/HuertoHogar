# HuertoHogar - Guía de Instalación y Uso

Este proyecto es una aplicación web y API REST para la gestión de productos, usuarios y pedidos de HuertoHogar. Incluye frontend, backend y base de datos MySQL.

## Requisitos

- Node.js 16+
- MySQL 8.0+
- npm (o yarn)

## Instalación Paso a Paso

### 1. Clonar el repositorio

Descarga o clona el proyecto en tu máquina local.

### 2. Instalar dependencias del backend

```bash
cd api
npm install
```

### 3. Crear y poblar la base de datos

1. Abre MySQL Workbench, phpMyAdmin o la terminal de MySQL.
2. Ejecuta el script `create_database.sql`:

```sql
source create_database.sql;
```

Esto creará la base de datos, tablas, datos iniciales y el usuario administrador.

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
```

Edita `.env` con tus datos de conexión MySQL y claves JWT:

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=huertohogar_db
DB_USER=root
DB_PASSWORD=tu_password_mysql
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
```

### 5. Iniciar el servidor API

```bash
npm run dev   # modo desarrollo
npm start     # modo producción
```

El servidor estará disponible en `http://localhost:3000`.

### 6. Probar la API

- Verifica el estado: `GET /health`
- Consulta endpoints en `GET /api`
- Usa herramientas como Postman, Insomnia o curl para probar los endpoints.

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

¿Dudas? Revisa la documentación en `api/README.md` o contacta al autor.
