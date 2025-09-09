const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Datos de prueba (simulando base de datos)
let productos = [
    {
        id: 1,
        nombre: "Manzanas Rojas",
        descripcion: "Manzanas rojas frescas y crujientes, directo del huerto",
        precio: 1200.00,
        categoria_id: 1,
        categoria_nombre: "frutas frescas",
        imagen: "/public/assets/img/productos/manzanas.webp",
        stock: 50,
        activo: true,
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 2,
        nombre: "Miel Orgánica",
        descripcion: "Miel pura y natural de abejas locales, sin procesamientos químicos",
        precio: 2500.00,
        categoria_id: 4,
        categoria_nombre: "organicos",
        imagen: "/public/assets/img/productos/miel.webp",
        stock: 30,
        activo: true,
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 3,
        nombre: "Leche Fresca",
        descripcion: "Leche fresca de vacas locales, rica en nutrientes",
        precio: 1800.00,
        categoria_id: 3,
        categoria_nombre: "lacteos",
        imagen: "/public/assets/img/productos/leche.webp",
        stock: 25,
        activo: true,
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 4,
        nombre: "Naranjas Dulces",
        descripcion: "Naranjas jugosas y dulces, perfectas para jugos naturales",
        precio: 1100.00,
        categoria_id: 1,
        categoria_nombre: "frutas frescas",
        imagen: "/public/assets/img/productos/naranjas.webp",
        stock: 40,
        activo: true,
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 5,
        nombre: "Espinacas Orgánicas",
        descripcion: "Espinacas frescas cultivadas sin pesticidas, ricas en hierro",
        precio: 900.00,
        categoria_id: 2,
        categoria_nombre: "verduras",
        imagen: "/public/assets/img/productos/espinacas.webp",
        stock: 35,
        activo: true,
        fecha_creacion: new Date().toISOString()
    },
    {
        id: 6,
        nombre: "Zanahorias Frescas",
        descripcion: "Zanahorias frescas y crujientes, perfectas para ensaladas",
        precio: 800.00,
        categoria_id: 2,
        categoria_nombre: "verduras",
        imagen: "/public/assets/img/productos/zanahorias.webp",
        stock: 45,
        activo: true,
        fecha_creacion: new Date().toISOString()
    }
];

let categorias = [
    { id: 1, nombre: "frutas frescas", descripcion: "Frutas frescas y de temporada", activo: true },
    { id: 2, nombre: "verduras", descripcion: "Verduras frescas y orgánicas", activo: true },
    { id: 3, nombre: "lacteos", descripcion: "Productos lácteos frescos", activo: true },
    { id: 4, nombre: "organicos", descripcion: "Productos orgánicos certificados", activo: true }
];

let nextProductId = 7;
let nextCategoryId = 5;

// Middleware para logging en desarrollo
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API HuertoHogar funcionando correctamente (Modo Test)',
        timestamp: new Date().toISOString(),
        version: '1.0.0-test'
    });
});

// GET /api/products - Obtener todos los productos
app.get('/api/products', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const categoria = req.query.categoria;
        const precioMin = req.query.precio_min;
        const precioMax = req.query.precio_max;
        
        let filteredProducts = productos.filter(p => p.activo);
        
        // Filtrar por búsqueda
        if (search) {
            filteredProducts = filteredProducts.filter(p => 
                p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Filtrar por categoría
        if (categoria) {
            filteredProducts = filteredProducts.filter(p => p.categoria_id == categoria);
        }
        
        // Filtrar por precio
        if (precioMin) {
            filteredProducts = filteredProducts.filter(p => p.precio >= parseFloat(precioMin));
        }
        if (precioMax) {
            filteredProducts = filteredProducts.filter(p => p.precio <= parseFloat(precioMax));
        }
        
        // Paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: {
                products: paginatedProducts,
                pagination: {
                    page,
                    limit,
                    total: filteredProducts.length,
                    pages: Math.ceil(filteredProducts.length / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/products/:id - Obtener producto por ID
app.get('/api/products/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const producto = productos.find(p => p.id === productId);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: {
                product: producto
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/products - Crear nuevo producto
app.post('/api/products', (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria_id, imagen, stock } = req.body;
        
        // Validaciones básicas
        if (!nombre || !precio || !categoria_id) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, precio y categoría son requeridos'
            });
        }
        
        // Verificar que la categoría existe
        const categoria = categorias.find(c => c.id === categoria_id && c.activo);
        if (!categoria) {
            return res.status(400).json({
                success: false,
                message: 'Categoría no válida'
            });
        }
        
        const nuevoProducto = {
            id: nextProductId++,
            nombre,
            descripcion: descripcion || '',
            precio: parseFloat(precio),
            categoria_id,
            categoria_nombre: categoria.nombre,
            imagen: imagen || '',
            stock: parseInt(stock) || 0,
            activo: true,
            fecha_creacion: new Date().toISOString()
        };
        
        productos.push(nuevoProducto);
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: {
                product: nuevoProducto
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/categories - Obtener categorías
app.get('/api/categories', (req, res) => {
    try {
        const { activo = 'true' } = req.query;
        
        let filteredCategories = categorias;
        if (activo !== 'all') {
            filteredCategories = categorias.filter(c => c.activo === (activo === 'true'));
        }
        
        res.json({
            success: true,
            data: {
                categories: filteredCategories
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/categories - Crear categoría
app.post('/api/categories', (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido'
            });
        }
        
        // Verificar que el nombre no exista
        const existe = categorias.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }
        
        const nuevaCategoria = {
            id: nextCategoryId++,
            nombre,
            descripcion: descripcion || '',
            activo: true,
            fecha_creacion: new Date().toISOString()
        };
        
        categorias.push(nuevaCategoria);
        
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: {
                category: nuevaCategoria
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Autenticación básica (para pruebas)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'admin@huertohogar.com' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: 1,
                    nombre: 'Administrador',
                    email: 'admin@huertohogar.com',
                    rol: 'admin'
                },
                token: 'fake-jwt-token-for-testing'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Credenciales inválidas'
        });
    }
});

// Ruta de información de la API
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'API REST de HuertoHogar (Modo Test)',
        version: '1.0.0-test',
        note: 'Esta es una versión de prueba que funciona en memoria, sin base de datos.',
        endpoints: {
            products: {
                'GET /api/products': 'Obtener productos',
                'GET /api/products/:id': 'Obtener producto por ID',
                'POST /api/products': 'Crear producto'
            },
            categories: {
                'GET /api/categories': 'Obtener categorías',
                'POST /api/categories': 'Crear categoría'
            },
            auth: {
                'POST /api/auth/login': 'Login (admin@huertohogar.com / admin123)'
            }
        }
    });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.originalUrl} no encontrada`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('\n🚀 ===================================');
    console.log(`   Servidor TEST iniciado correctamente`);
    console.log('🚀 ===================================');
    console.log(`📋 Puerto: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Info: http://localhost:${PORT}/api`);
    console.log(`🧪 Test Page: file:///C:/Users/Franco/Downloads/HuertoHogar-dev-franco/HuertoHogar-dev-franco/api/test-api.html`);
    console.log('🚀 ===================================\n');
});

module.exports = app;
