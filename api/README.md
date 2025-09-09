# API REST para HuertoHogar

Una API completa desarrollada con Node.js, Express y MySQL para el sistema de gestión de productos y usuarios de HuertoHogar.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de login y registro
- **CRUD Completo**: Gestión de usuarios, productos y categorías
- **Roles de Usuario**: Cliente y Administrador
- **Validación de Datos**: Validaciones robustas con express-validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Base de Datos**: MySQL con pool de conexiones
- **Documentación**: Endpoints bien documentados

## 📋 Requisitos Previos

- Node.js 16+ 
- MySQL 8.0+
- npm o yarn

## ⚙️ Instalación

1. **Instalar dependencias**
```bash
cd api
npm install
```

2. **Configurar base de datos**
```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de creación
source database.sql
```

3. **Configurar variables de entorno**
```bash
# Copiar y editar el archivo .env
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=huertohogar_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

# Configuración JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
```

4. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/verify-token` | Verificar token JWT | No |

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/` | Obtener todos los usuarios | Admin |
| GET | `/:id` | Obtener usuario por ID | Usuario/Admin |
| PUT | `/:id` | Actualizar usuario | Usuario/Admin |
| PUT | `/:id/password` | Cambiar contraseña | Usuario/Admin |
| PUT | `/:id/status` | Activar/Desactivar usuario | Admin |
| DELETE | `/:id` | Eliminar usuario | Admin |

### 🛍️ Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/` | Obtener productos | No |
| GET | `/:id` | Obtener producto por ID | No |
| POST | `/` | Crear producto | Admin |
| PUT | `/:id` | Actualizar producto | Admin |
| PUT | `/:id/status` | Activar/Desactivar producto | Admin |
| DELETE | `/:id` | Eliminar producto | Admin |

### 📂 Categorías (`/api/categories`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/` | Obtener categorías | No |
| GET | `/:id` | Obtener categoría por ID | No |
| POST | `/` | Crear categoría | Admin |
| PUT | `/:id` | Actualizar categoría | Admin |
| PUT | `/:id/status` | Activar/Desactivar categoría | Admin |
| DELETE | `/:id` | Eliminar categoría | Admin |

## 🔧 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@ejemplo.com",
    "password": "Password123",
    "telefono": "555-0123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "Password123"
  }'
```

### Obtener Productos
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&search=manzana"
```

### Crear Producto (Admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "nombre": "Peras Verdes",
    "descripcion": "Peras frescas de temporada",
    "precio": 1500,
    "categoria_id": 1,
    "stock": 20
  }'
```

## 🔒 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

```
Authorization: Bearer TU_JWT_TOKEN
```

## 📊 Respuestas de la API

Todas las respuestas siguen este formato:

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos de respuesta
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    // Detalles de errores de validación (opcional)
  ]
}
```

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de recursos de origen cruzado
- **Rate Limiting**: Limitación de solicitudes por IP
- **Validación**: Validación robusta de entrada de datos
- **Hashing**: Contraseñas hasheadas con bcrypt
- **JWT**: Tokens seguros para autenticación

## 🗃️ Base de Datos

### Estructura de Tablas

- **usuarios**: Información de usuarios y administradores
- **categorias**: Categorías de productos
- **productos**: Catálogo de productos
- **pedidos**: Órdenes de compra
- **detalles_pedido**: Líneas de detalle de pedidos

### Usuario Administrador por Defecto

- **Email**: admin@huertohogar.com
- **Contraseña**: admin123

## 🚨 Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `409` - Conflicto
- `500` - Error interno del servidor

## 🔄 Paginación

Los endpoints que devuelven listas soportan paginación:

```
GET /api/products?page=1&limit=10
```

Respuesta incluye información de paginación:

```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

## 📝 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm test` - Ejecutar tests (por implementar)

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
