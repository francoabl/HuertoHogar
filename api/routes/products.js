const express = require('express');
const { body, param, query: queryValidator } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validaciones para producto
const productValidation = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    body('categoria_id')
        .isInt({ min: 1 })
        .withMessage('Debe seleccionar una categoría válida'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un número entero positivo'),
    body('imagen')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La URL de la imagen no puede exceder 255 caracteres')
];

const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID debe ser un número entero positivo')
];

// GET /api/products - Obtener todos los productos
router.get('/',
    [
        queryValidator('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
        queryValidator('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
        queryValidator('search').optional().isLength({ max: 100 }).withMessage('La búsqueda no puede exceder 100 caracteres'),
        queryValidator('categoria').optional().isInt({ min: 1 }).withMessage('Categoría inválida'),
        queryValidator('precio_min').optional().isFloat({ min: 0 }).withMessage('Precio mínimo inválido'),
        queryValidator('precio_max').optional().isFloat({ min: 0 }).withMessage('Precio máximo inválido'),
        queryValidator('activo').optional().isBoolean().withMessage('Activo debe ser true o false')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const categoria = req.query.categoria;
            const precioMin = req.query.precio_min;
            const precioMax = req.query.precio_max;

            console.log('Parámetros de entrada:', { page, limit, offset, search, categoria, precioMin, precioMax });

            // Construir consulta dinámicamente
            let whereClause = 'WHERE 1=1';
            const params = [];

            // Filtro de activo - por defecto solo productos activos
            if (req.query.activo !== undefined) {
                const activo = req.query.activo === 'true' ? 1 : 0;
                whereClause += ' AND p.activo = ?';
                params.push(activo);
            } else {
                // Por defecto, solo mostrar productos activos
                whereClause += ' AND p.activo = ?';
                params.push(1);
            }

            if (search && search.trim() !== '') {
                whereClause += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
                const searchParam = `%${search.trim()}%`;
                params.push(searchParam, searchParam);
            }

            if (categoria) {
                whereClause += ' AND p.categoria_id = ?';
                params.push(parseInt(categoria));
            }

            if (precioMin && precioMin > 0) {
                whereClause += ' AND p.precio >= ?';
                params.push(parseFloat(precioMin));
            }

            if (precioMax && precioMax > 0) {
                whereClause += ' AND p.precio <= ?';
                params.push(parseFloat(precioMax));
            }

            // Obtener productos con información de categoría
            console.log('Ejecutando consulta con parámetros:', params);
            console.log('WHERE clause:', whereClause);
            console.log('LIMIT:', limit, 'OFFSET:', offset);
            
            // Validar que limit y offset sean números válidos
            if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros de paginación inválidos'
                });
            }

            const finalParams = [...params, limit, offset];
            console.log('Parámetros finales:', finalParams);
            
            // Primero verificar que las tablas existen
            try {
                const testQuery = await query('SELECT COUNT(*) as count FROM productos');
                console.log('Productos en BD:', testQuery[0].count);
            } catch (testError) {
                console.error('Error verificando tabla productos:', testError);
                return res.status(500).json({
                    success: false,
                    message: 'Error de configuración de base de datos: tabla productos no existe'
                });
            }
            
            const products = await query(
                `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, 
                        c.nombre as categoria_nombre, p.imagen, p.stock, p.activo, 
                        p.fecha_creacion, p.fecha_actualizacion
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 ${whereClause}
                 ORDER BY p.fecha_creacion DESC 
                 LIMIT ? OFFSET ?`,
                finalParams
            );

            // Contar total
            const totalResult = await query(
                `SELECT COUNT(*) as total 
                 FROM productos p 
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 ${whereClause}`,
                params
            );
            const total = totalResult[0].total;

            console.log(`Productos encontrados: ${products.length}, Total: ${total}`);

            res.json({
                success: true,
                data: {
                    products,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener productos:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
);


// GET /api/products/:id - Obtener producto por ID
router.get('/:id',
    idValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const productId = req.params.id;

            const products = await query(
                `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, 
                        c.nombre as categoria_nombre, p.imagen, p.stock, p.activo, 
                        p.fecha_creacion, p.fecha_actualizacion
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 WHERE p.id = ?`,
                [productId]
            );

            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: {
                    product: products[0]
                }
            });

        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// POST /api/products - Crear nuevo producto (solo admin)
router.post('/',
    verifyToken,
    verifyAdmin,
    productValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { nombre, descripcion, precio, categoria_id, imagen, stock } = req.body;

            // Verificar que la categoría existe
            const categories = await query('SELECT id FROM categorias WHERE id = ? AND activo = TRUE', [categoria_id]);
            if (categories.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Categoría no válida'
                });
            }

            // Insertar nuevo producto
            const result = await query(
                `INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen, stock)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, descripcion || null, precio, categoria_id, imagen || null, stock || 0]
            );

            // Obtener el producto creado
            const newProduct = await query(
                `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, 
                        c.nombre as categoria_nombre, p.imagen, p.stock, p.activo, 
                        p.fecha_creacion, p.fecha_actualizacion
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 WHERE p.id = ?`,
                [result.insertId]
            );

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: {
                    product: newProduct[0]
                }
            });

        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put('/:id',
    verifyToken,
    verifyAdmin,
    idValidation,
    [
        body('nombre')
            .optional()
            .trim()
            .isLength({ min: 2, max: 200 })
            .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
        body('descripcion')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('La descripción no puede exceder 1000 caracteres'),
        body('precio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número positivo'),
        body('categoria_id')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Debe seleccionar una categoría válida'),
        body('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('El stock debe ser un número entero positivo'),
        body('imagen')
            .optional()
            .isLength({ max: 255 })
            .withMessage('La URL de la imagen no puede exceder 255 caracteres')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const productId = req.params.id;
            const { nombre, descripcion, precio, categoria_id, imagen, stock } = req.body;

            // Verificar que el producto existe
            const existingProducts = await query('SELECT id FROM productos WHERE id = ?', [productId]);
            if (existingProducts.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            // Verificar categoría si se está cambiando
            if (categoria_id) {
                const categories = await query('SELECT id FROM categorias WHERE id = ? AND activo = TRUE', [categoria_id]);
                if (categories.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Categoría no válida'
                    });
                }
            }

            // Construir consulta de actualización dinámicamente
            const updates = [];
            const params = [];

            if (nombre !== undefined) {
                updates.push('nombre = ?');
                params.push(nombre);
            }
            if (descripcion !== undefined) {
                updates.push('descripcion = ?');
                params.push(descripcion);
            }
            if (precio !== undefined) {
                updates.push('precio = ?');
                params.push(precio);
            }
            if (categoria_id !== undefined) {
                updates.push('categoria_id = ?');
                params.push(categoria_id);
            }
            if (imagen !== undefined) {
                updates.push('imagen = ?');
                params.push(imagen);
            }
            if (stock !== undefined) {
                updates.push('stock = ?');
                params.push(stock);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay datos para actualizar'
                });
            }

            params.push(productId);

            await query(
                `UPDATE productos SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            // Obtener producto actualizado
            const updatedProduct = await query(
                `SELECT p.id, p.nombre, p.descripcion, p.precio, p.categoria_id, 
                        c.nombre as categoria_nombre, p.imagen, p.stock, p.activo, 
                        p.fecha_creacion, p.fecha_actualizacion
                 FROM productos p
                 LEFT JOIN categorias c ON p.categoria_id = c.id
                 WHERE p.id = ?`,
                [productId]
            );

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: {
                    product: updatedProduct[0]
                }
            });

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/products/:id/status - Activar/Desactivar producto (solo admin)
router.put('/:id/status',
    verifyToken,
    verifyAdmin,
    idValidation,
    [
        body('activo').isBoolean().withMessage('El estado debe ser true o false')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const productId = req.params.id;
            const { activo } = req.body;
            
            // Convertir booleano a entero para MySQL
            const activoValue = activo ? 1 : 0;

            // Verificar que el producto existe
            const products = await query('SELECT id FROM productos WHERE id = ?', [productId]);
            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            await query('UPDATE productos SET activo = ? WHERE id = ?', [activoValue, productId]);

            res.json({
                success: true,
                message: `Producto ${activo ? 'activado' : 'desactivado'} exitosamente`
            });

        } catch (error) {
            console.error('Error al cambiar estado del producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete('/:id',
    verifyToken,
    verifyAdmin,
    idValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const productId = req.params.id;

            // Verificar que el producto existe
            const products = await query('SELECT id FROM productos WHERE id = ?', [productId]);
            if (products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            await query('DELETE FROM productos WHERE id = ?', [productId]);

            res.json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

module.exports = router;
