const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar middlewares
const { errorHandler, notFound } = require('./middleware/validation');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de seguridad
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por ventana de tiempo
    message: {
        success: false,
        message: 'Demasiadas solicitudes, intenta de nuevo en 15 minutos'
    }
});
app.use('/api/', limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login por IP
    message: {
        success: false,
        message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos'
    }
});

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API HuertoHogar funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Rutas principales
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta de información de la API
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API REST de HuertoHogar',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Registrar nuevo usuario',
                'POST /api/auth/login': 'Iniciar sesión',
                'POST /api/auth/verify-token': 'Verificar token JWT'
            },
            users: {
                'GET /api/users': 'Obtener usuarios (Admin)',
                'GET /api/users/:id': 'Obtener usuario por ID',
                'PUT /api/users/:id': 'Actualizar usuario',
                'PUT /api/users/:id/password': 'Cambiar contraseña',
                'PUT /api/users/:id/status': 'Activar/Desactivar usuario (Admin)',
                'DELETE /api/users/:id': 'Eliminar usuario (Admin)'
            },
            products: {
                'GET /api/products': 'Obtener productos',
                'GET /api/products/:id': 'Obtener producto por ID',
                'POST /api/products': 'Crear producto (Admin)',
                'PUT /api/products/:id': 'Actualizar producto (Admin)',
                'PUT /api/products/:id/status': 'Activar/Desactivar producto (Admin)',
                'DELETE /api/products/:id': 'Eliminar producto (Admin)'
            },
            categories: {
                'GET /api/categories': 'Obtener categorías',
                'GET /api/categories/:id': 'Obtener categoría por ID',
                'POST /api/categories': 'Crear categoría (Admin)',
                'PUT /api/categories/:id': 'Actualizar categoría (Admin)',
                'PUT /api/categories/:id/status': 'Activar/Desactivar categoría (Admin)',
                'DELETE /api/categories/:id': 'Eliminar categoría (Admin)'
            }
        }
    });
});

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
    try {
        // Probar conexión a la base de datos
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos. Verifica la configuración.');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n🚀 ===================================');
            console.log(`   Servidor iniciado correctamente`);
            console.log('🚀 ===================================');
            console.log(`📋 Puerto: ${PORT}`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Info: http://localhost:${PORT}/api`);
            console.log('🚀 ===================================\n');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
