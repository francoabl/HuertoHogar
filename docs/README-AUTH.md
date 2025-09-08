# Sistema de Autenticación HuertoHogar

Este sistema de autenticación funcional ha sido implementado para el sitio web de HuertoHogar. Utiliza localStorage para simular una base de datos y gestión de sesiones.

## 🚀 Funcionalidades Implementadas

### ✅ Registro de Usuarios
- Formulario de registro completo con validaciones
- Verificación de email único
- Validación de contraseña (mínimo 8 caracteres)
- Confirmación de contraseña
- Campos para información personal y dirección

### ✅ Inicio de Sesión
- Login con email y contraseña
- Opción "Recordarme" para sesiones persistentes
- Validación de credenciales
- Redirección automática después del login

### ✅ Gestión de Sesiones
- Verificación automática de sesión al cargar páginas
- Sesiones con expiración (24 horas sin "recordarme")
- Cierre de sesión funcional
- Protección de páginas que requieren autenticación

### ✅ Perfil de Usuario
- Página dedicada para ver y editar perfil
- Actualización de información personal
- Cambio de contraseña
- Sección para pedidos (preparada para futuras funcionalidades)

### ✅ Interfaz Dinámica
- Navegación que cambia según el estado de sesión
- Botones de login/registro se ocultan cuando está logueado
- Menú de usuario con dropdown
- Mensajes de notificación elegantes

## 📋 Usuarios de Demostración

El sistema incluye usuarios precargados para pruebas inmediatas:

| Email | Contraseña | Nombre |
|-------|------------|---------|
| `juan@ejemplo.com` | `12345678` | Juan Pérez |
| `maria@ejemplo.com` | `password123` | María González |
| `carlos@ejemplo.com` | `mipassword` | Carlos Rodríguez |

## 🛠️ Archivos del Sistema

### Archivos JavaScript
- **`js/auth.js`** - Sistema principal de autenticación
- **`js/demo-data.js`** - Datos de demostración y funciones de utilidad

### Páginas HTML Actualizadas
- **`login.html`** - Página de inicio de sesión
- **`registro.html`** - Página de registro
- **`perfil.html`** - Página de perfil de usuario (nueva)
- **`huertohogar-web.html`** - Página principal con navegación dinámica

## 🧪 Cómo Probar el Sistema

1. **Abrir cualquier página** - Los datos de demo se cargan automáticamente
2. **Ir a `login.html`** 
3. **Usar credenciales de demo**:
   - Email: `juan@ejemplo.com`
   - Contraseña: `12345678`
4. **Explorar funcionalidades**:
   - Ver cómo cambia la navegación
   - Ir a perfil desde el menú de usuario
   - Editar información personal
   - Cambiar contraseña
   - Cerrar sesión

## 🔧 Funciones de Utilidad

### Consola del Navegador
Puedes usar estas funciones en la consola del navegador:

```javascript
// Mostrar todos los usuarios de demo
demoData.show();

// Reiniciar datos de demo
demoData.reset();

// Cargar datos de demo nuevamente
demoData.load();

// Ver usuario actual
auth.getCurrentUser();

// Verificar si está logueado
auth.isLoggedIn();
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Este es un sistema de demostración que usa localStorage. Para producción:

1. **Reemplazar con backend real** (Node.js, PHP, Python, etc.)
2. **Usar HTTPS** para todas las comunicaciones
3. **Implementar hash seguro** (bcrypt, Argon2)
4. **Añadir tokens JWT** para autenticación
5. **Validaciones del lado del servidor**
6. **Rate limiting** para prevenir ataques
7. **Base de datos real** (MySQL, PostgreSQL, MongoDB)

## 📱 Características de la UI

### Mensajes de Notificación
- Aparecen en la esquina superior derecha
- Se auto-descartan después de 5 segundos
- Colores según el tipo (éxito, error, info)

### Validaciones en Tiempo Real
- Campos se destacan en rojo cuando hay errores
- Validación de contraseña en registro
- Verificación de email único

### Estados de Botones
- Botones se deshabilitan durante procesos
- Indicadores de carga (spinner)
- Feedback visual inmediato

### Navegación Inteligente
- Elementos cambian según estado de sesión
- Redirección automática cuando es necesario
- Menú de usuario con opciones contextuales

## 🚀 Siguientes Pasos para Producción

1. **Backend API**:
   ```
   POST /api/auth/register
   POST /api/auth/login
   POST /api/auth/logout
   GET /api/auth/profile
   PUT /api/auth/profile
   PUT /api/auth/password
   ```

2. **Base de Datos**:
   ```sql
   CREATE TABLE users (
       id INT PRIMARY KEY AUTO_INCREMENT,
       firstName VARCHAR(100),
       lastName VARCHAR(100),
       email VARCHAR(255) UNIQUE,
       password_hash VARCHAR(255),
       phone VARCHAR(20),
       address TEXT,
       city VARCHAR(100),
       zipCode VARCHAR(10),
       created_at TIMESTAMP,
       updated_at TIMESTAMP,
       is_active BOOLEAN DEFAULT TRUE
   );
   ```

3. **Integración con Frameworks**:
   - **React/Vue/Angular** para frontend
   - **Express.js/FastAPI/Django** para backend
   - **JWT** para tokens de autenticación
   - **Redis** para cache de sesiones

## 📞 Soporte

Si necesitas ayuda para implementar en producción o agregar más funcionalidades, puedes:

1. Revisar los comentarios en el código
2. Consultar la documentación de las APIs que planees usar
3. Buscar tutoriales específicos del stack tecnológico elegido

¡El sistema está listo para usar y probar! 🎉
