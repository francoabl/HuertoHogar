# 🌱 HuertoHogar - E-commerce Full Stack

**Aplicación web completa para venta de productos agrícolas**  
Stack: React + Spring Boot + MongoDB Atlas + Transbank Webpay Plus SDK

---

## 📋 Requisitos Previos

- **Java 17+** (para backend Spring Boot)
- **Node.js 18+** (para frontend React)
- **Maven** (incluido con mvnw)
- **npm** (viene con Node.js)
- **MongoDB Atlas** (base de datos en la nube - gratuito)

---

## 🚀 INICIO RÁPIDO

### ⚠️ IMPORTANTE: Configurar MongoDB Atlas primero

Antes de iniciar la aplicación, debes configurar MongoDB Atlas:

1. **Lee la guía completa**: `demo/MONGODB_SETUP.md`
2. **Crea una cuenta gratuita** en MongoDB Atlas
3. **Configura tu cluster** y obtén la cadena de conexión
4. **Actualiza** `demo/src/main/resources/application.properties` con tus credenciales

**Configuración rápida en `application.properties`:**
```properties
spring.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/huertohogar?retryWrites=true&w=majority
spring.mongodb.database=huertohogar
```

📖 **Guía detallada paso a paso**: Ver `demo/MONGODB_SETUP.md`

---

### Opción 1: Script Automático (Recomendado) ⚡

Ejecuta este comando en PowerShell desde la raíz del proyecto:

```powershell
.\start-all-servers.ps1
```

Esto iniciará automáticamente los 3 servidores necesarios:
1. ✅ Backend Spring Boot (puerto 8080)
2. ✅ Servidor Transbank Proxy (puerto 3001)
3. ✅ Frontend React (puerto 3000)

---

### Opción 2: Manual (3 Terminales Separadas)

#### Terminal 1 - Backend Spring Boot
```powershell
cd demo
.\mvnw spring-boot:run
```
✅ Backend corriendo en `http://localhost:8080`

#### Terminal 2 - Servidor Transbank Proxy
```powershell
cd HuertoHogarReact-FINAL
npm run transbank-proxy
```
✅ Proxy Transbank corriendo en `http://localhost:3001`

**Deberías ver este mensaje:**
```
═══════════════════════════════════════════════
🚀 Servidor Transbank Proxy iniciado
📡 Puerto: 3001
🔧 Ambiente: INTEGRACIÓN (Pruebas)
✅ Listo para recibir peticiones del frontend
═══════════════════════════════════════════════
```

#### Terminal 3 - Frontend React
```powershell
cd HuertoHogarReact-FINAL
npm install  # Solo la primera vez
npm start
```
✅ Frontend corriendo en `http://localhost:3000`

---

## 🌐 URLs de la Aplicación

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Frontend** | 3000 | http://localhost:3000 | Aplicación React |
| **Backend API** | 8080 | http://localhost:8080 | REST API Spring Boot |
| **Transbank Proxy** | 3001 | http://localhost:3001 | Servidor SDK Transbank |
| **MongoDB Atlas** | - | Cloud | Base de datos MongoDB (en la nube) |

---

## 👤 Usuarios de Prueba

### Usuario Normal
```
Email: user@test.com
Password: password123
```

### Usuario Administrador
```
Email: admin@test.com
Password: admin123
```

---

## 💳 Probar el Flujo de Pago con Transbank

### 1. Iniciar sesión
- Ir a http://localhost:3000/login
- Usar credenciales de prueba

### 2. Agregar productos al carrito
- Navegar a "Productos"
- Click en "Agregar al Carrito"

### 3. Proceder al checkout
- Click en el ícono del carrito
- Click en "Proceder al Pago"

### 4. Pagar con Transbank SDK
- Click en "Pagar con Webpay (SDK Real)"
- Serás redirigido a la página de pago de Transbank

### 5. Usar tarjeta de prueba
En la página de Transbank, usa estos datos:

**Tarjetas de Crédito de Prueba:**

| Tipo | Número | CVV | Fecha | Resultado |
|------|--------|-----|-------|-----------|
| Visa | `4051 8856 0000 0002` | 123 | Cualquier futura | ✅ Aprobada |
| Mastercard | `5186 0595 0000 0002` | 123 | Cualquier futura | ✅ Aprobada |

**RUT de prueba:** `11.111.111-1`

### 6. Confirmar pago
- Completar el formulario en Transbank
- Serás redirigido de vuelta a la app
- Verás la pantalla de confirmación con código de autorización real

### 7. Ver historial de compras
- Ir a "Mi Perfil" → Tab "Mis Pedidos"
- Verás todos los detalles del pedido confirmado

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐
│  React Frontend     │
│  (Puerto 3000)      │
└──────────┬──────────┘
           │
           ├──────────────────┐
           │                  │
           ↓                  ↓
┌─────────────────────┐  ┌─────────────────────┐
│  Spring Boot API    │  │  Transbank Proxy    │
│  (Puerto 8080)      │  │  Express + SDK      │
│                     │  │  (Puerto 3001)      │
│  • REST Endpoints   │  └──────────┬──────────┘
│  • JWT Auth         │             │
│  • H2 Database      │             ↓
│  • JPA/Hibernate    │  ┌─────────────────────┐
└─────────────────────┘  │  Transbank API      │
                         │  Webpay Plus        │
                         │  (Integración)      │
                         └─────────────────────┘
```

### ¿Por qué 3 servidores?

1. **Backend Spring Boot (8080):** Maneja la lógica de negocio, productos, usuarios, pedidos
2. **Transbank Proxy (3001):** El SDK de Transbank requiere Node.js y no puede ejecutarse en el navegador
3. **Frontend React (3000):** Interfaz de usuario

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework UI
- **React Router DOM** - Navegación
- **React Bootstrap** - Componentes UI
- **Axios** - Cliente HTTP
- **Context API** - Estado global

### Backend
- **Spring Boot 4.0.0** - Framework backend
- **Spring Security** - Autenticación/Autorización
- **JWT** - Tokens de sesión
- **Spring Data MongoDB** - ODM (Object Document Mapper)
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Maven** - Gestión de dependencias

### Integración de Pagos
- **Transbank SDK 6.1.0** - SDK oficial Node.js
- **Express 5.1.0** - Servidor proxy
- **Ambiente:** Integración (Pruebas)

---

## 📦 Principales Endpoints API

### Autenticación
```
POST /api/auth/register  # Registro
POST /api/auth/login     # Login
```

### Productos
```
GET    /api/productos           # Listar todos
GET    /api/productos/{id}      # Obtener uno
POST   /api/productos           # Crear (ADMIN)
PUT    /api/productos/{id}      # Actualizar (ADMIN)
DELETE /api/productos/{id}      # Eliminar (ADMIN)
```

### Usuarios
```
GET /api/usuarios/perfil     # Ver perfil
PUT /api/usuarios/perfil     # Actualizar perfil
```

### Pedidos
```
POST /api/pedidos            # Crear pedido
GET  /api/pedidos            # Listar (ADMIN)
GET  /api/pedidos/usuario    # Mis pedidos
```

### Transbank Proxy
```
POST /api/transbank/create   # Crear transacción
POST /api/transbank/commit   # Confirmar pago
GET  /health                 # Health check
```

---

## ✅ Verificación de Servicios

### 1. Backend Spring Boot
```powershell
curl http://localhost:8080/api/productos
```
Debe retornar JSON con lista de productos.

### 2. MongoDB Atlas Connection
Verifica los logs del backend al iniciar. Deberías ver:
```
Cluster created with settings {hosts=[cluster0.xxxxx.mongodb.net...
MongoDB ready to accept connections
```

### 3. Servidor Transbank Proxy
```powershell
curl http://localhost:3001/health
```
Debe retornar:
```json
{
  "status": "OK",
  "service": "Transbank Proxy Server",
  "environment": "Integration",
  "commerceCode": "597055555532"
}
```

### 3. Frontend React
Abrir navegador en: http://localhost:3000

---

## 🐛 Solución de Problemas

### Error: Puerto ocupado

**Backend (8080):**
```powershell
netstat -ano | findstr :8080
taskkill /PID <número> /F
```

**Proxy Transbank (3001):**
```powershell
netstat -ano | findstr :3001
taskkill /PID <número> /F
```

**Frontend (3000):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <número> /F
```

### Error: "Cannot find module"

Instalar dependencias:
```powershell
cd HuertoHogarReact-FINAL
npm install
```

### Error: MongoDB connection failed

1. Verifica que tu usuario y contraseña sean correctos en `application.properties`
2. Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas (Network Access)
3. Verifica la cadena de conexión completa
4. **Consulta**: `demo/MONGODB_SETUP.md` para más detalles

### Error: El servidor proxy no inicia

Verificar que el SDK de Transbank esté instalado:
```powershell
cd HuertoHogarReact-FINAL
npm install transbank-sdk express cors
```

### Error: CORS

Verificar que `WebConfig.java` en el backend permite el origen `http://localhost:3000`

### Error: JWT inválido

1. Limpiar localStorage del navegador (F12 → Application → Local Storage)
2. Hacer login nuevamente

---

## 🗄️ Base de Datos MongoDB Atlas

### Acceso a los datos
- **Plataforma**: MongoDB Atlas Dashboard
- **URL**: https://cloud.mongodb.com/
- **Database**: `huertohogar`
- **Colecciones**:
  - `usuarios` - Usuarios del sistema
  - `roles` - Roles (USER, ADMIN)
  - `productos` - Catálogo de productos
  - `pedidos` - Pedidos realizados
  - `carrito_items` - Items en carritos de compra

### Ver datos
1. Inicia sesión en MongoDB Atlas
2. Ve a Database → Browse Collections
3. Selecciona la base de datos `huertohogar`
4. Explora las colecciones

### Ventajas de MongoDB Atlas
- ✅ **Gratis** hasta 512 MB (suficiente para desarrollo)
- ✅ **En la nube** - accesible desde cualquier lugar
- ✅ **Escalable** - fácil upgrade cuando sea necesario
- ✅ **Backups automáticos** - en planes pagos
- ✅ **Sin instalación local** - no necesitas instalar MongoDB

📖 **Configuración completa**: Ver `demo/MONGODB_SETUP.md`

---

## 📁 Estructura del Proyecto

```
fullstack api terminada/
├── demo/                          # Backend Spring Boot
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/            # REST Controllers
│   │   ├── entity/                # Entidades JPA
│   │   ├── repository/            # Repositorios
│   │   ├── service/               # Servicios
│   │   ├── config/                # Configuración
│   │   └── security/              # JWT & Security
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── data/                      # Base de datos H2
│
├── HuertoHogarReact-FINAL/        # Frontend React
│   ├── src/
│   │   ├── components/            # Componentes
│   │   ├── pages/                 # Páginas
│   │   │   └── CheckoutTransbank.jsx  # Checkout con SDK
│   │   ├── context/               # React Context
│   │   ├── services/
│   │   │   ├── api.js            # API REST
│   │   │   └── transbank.js      # Cliente Transbank
│   │   └── App.jsx
│   ├── transbank-proxy-server.mjs # Servidor proxy SDK
│   ├── start-transbank-proxy.bat  # Script Windows
│   └── package.json
│
├── start-all-servers.ps1          # Script de inicio automático
└── README.md                      # Este archivo
```

---

## 🔒 Seguridad

### Ambiente Actual: INTEGRACIÓN (Pruebas)

**Configuración:**
- Commerce Code: `597055555532` (prueba)
- API Key: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C` (prueba)
- URL: `https://webpay3gint.transbank.cl`

### Para Producción:

⚠️ **IMPORTANTE:** Antes de llevar a producción:

1. **Obtener credenciales reales de Transbank:**
   - Registrarse en https://www.transbankdevelopers.cl/
   - Completar proceso de certificación
   - Obtener Commerce Code y API Key de producción

2. **Actualizar `transbank-proxy-server.mjs`:**
   ```javascript
   import Transbank from 'transbank-sdk';
   const { WebpayPlus, Environment } = Transbank;
   
   const COMMERCE_CODE = 'TU_CODIGO_REAL';
   const API_KEY = 'TU_API_KEY_REAL';
   
   const transaction = new WebpayPlus.Transaction(
     new Transbank.Options(COMMERCE_CODE, API_KEY, Environment.Production)
   );
   ```

3. **Implementar seguridad adicional:**
   - Hashear contraseñas con BCrypt
   - Variables de entorno para secrets
   - HTTPS obligatorio
   - Base de datos PostgreSQL/MySQL
   - Rate limiting
   - Logs y auditoría

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Transbank Developers](https://www.transbankdevelopers.cl/)
- [SDK Node.js](https://github.com/TransbankDevelopers/transbank-sdk-nodejs)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)

### Archivos Importantes
- `demo/README.md` - Documentación específica del backend
- `HuertoHogarReact-FINAL/README.md` - Documentación del frontend

---

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

**E-commerce:**
- Catálogo de productos con filtros
- Carrito de compras reactivo
- Sistema de categorías
- Búsqueda de productos

**Autenticación:**
- Registro de usuarios
- Login con JWT
- Roles (USER, ADMIN)
- Perfil editable

**Pasarela de Pago:**
- Integración real con Transbank SDK
- Webpay Plus
- Confirmación de pagos
- Códigos de autorización reales
- Historial de compras

**Administración:**
- Panel de administración
- CRUD de productos
- Gestión de usuarios (próximamente)

**Otras:**
- Blog informativo
- Página "Nosotros"
- Formulario de contacto
- Diseño responsive

---

## 🎉 ¡Listo para Usar!

La aplicación está completamente funcional con:
- ✅ Backend API REST
- ✅ Frontend React moderno
- ✅ Integración real con Transbank SDK
- ✅ Base de datos MongoDB Atlas en la nube
- ✅ Autenticación JWT
- ✅ Sistema de pagos funcional (ambiente de pruebas)

**Siguiente paso:** 
1. Configura MongoDB Atlas siguiendo `demo/MONGODB_SETUP.md`
2. Ejecuta `.\start-all-servers.ps1` y comienza a probar la aplicación!

---

**Versión:** 3.0.0 (MongoDB)  
**Última actualización:** Diciembre 2024  
**Desarrollado con ❤️ por el equipo HuertoHogar**

🌱 *Llevando productos frescos del campo a tu hogar*
