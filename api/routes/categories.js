const express = require('express');
const { body, param } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validaciones para categoría
const categoryValidation = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La descripción no puede exceder 500 caracteres')
];

const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID debe ser un número entero positivo')
];

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const { activo = 'true' } = req.query;
        
        let whereClause = '';
        const params = [];
        
        if (activo !== 'all') {
            whereClause = 'WHERE activo = ?';
            params.push(activo === 'true');
        }

        const categories = await query(
            `SELECT id, nombre, descripcion, activo, fecha_creacion
             FROM categorias 
             ${whereClause}
             ORDER BY nombre ASC`,
            params
        );

        res.json({
            success: true,
            data: {
                categories
            }
        });

    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/categories/:id - Obtener categoría por ID
router.get('/:id',
    idValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const categoryId = req.params.id;

            const categories = await query(
                'SELECT id, nombre, descripcion, activo, fecha_creacion FROM categorias WHERE id = ?',
                [categoryId]
            );

            if (categories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            res.json({
                success: true,
                data: {
                    category: categories[0]
                }
            });

        } catch (error) {
            console.error('Error al obtener categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// POST /api/categories - Crear nueva categoría (solo admin)
router.post('/',
    verifyToken,
    verifyAdmin,
    categoryValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;

            // Verificar que el nombre no exista
            const existingCategories = await query(
                'SELECT id FROM categorias WHERE nombre = ?',
                [nombre]
            );

            if (existingCategories.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                });
            }

            // Insertar nueva categoría
            const result = await query(
                'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
                [nombre, descripcion || null]
            );

            // Obtener la categoría creada
            const newCategory = await query(
                'SELECT id, nombre, descripcion, activo, fecha_creacion FROM categorias WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json({
                success: true,
                message: 'Categoría creada exitosamente',
                data: {
                    category: newCategory[0]
                }
            });

        } catch (error) {
            console.error('Error al crear categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/categories/:id - Actualizar categoría (solo admin)
router.put('/:id',
    verifyToken,
    verifyAdmin,
    idValidation,
    [
        body('nombre')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        body('descripcion')
            .optional()
            .isLength({ max: 500 })
            .withMessage('La descripción no puede exceder 500 caracteres')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const categoryId = req.params.id;
            const { nombre, descripcion } = req.body;

            // Verificar que la categoría existe
            const existingCategories = await query('SELECT id FROM categorias WHERE id = ?', [categoryId]);
            if (existingCategories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            // Verificar nombre único si se está cambiando
            if (nombre) {
                const nameExists = await query('SELECT id FROM categorias WHERE nombre = ? AND id != ?', [nombre, categoryId]);
                if (nameExists.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe una categoría con ese nombre'
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

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay datos para actualizar'
                });
            }

            params.push(categoryId);

            await query(
                `UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            // Obtener categoría actualizada
            const updatedCategory = await query(
                'SELECT id, nombre, descripcion, activo, fecha_creacion FROM categorias WHERE id = ?',
                [categoryId]
            );

            res.json({
                success: true,
                message: 'Categoría actualizada exitosamente',
                data: {
                    category: updatedCategory[0]
                }
            });

        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/categories/:id/status - Activar/Desactivar categoría (solo admin)
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
            const categoryId = req.params.id;
            const { activo } = req.body;

            // Verificar que la categoría existe
            const categories = await query('SELECT id FROM categorias WHERE id = ?', [categoryId]);
            if (categories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            await query('UPDATE categorias SET activo = ? WHERE id = ?', [activo, categoryId]);

            res.json({
                success: true,
                message: `Categoría ${activo ? 'activada' : 'desactivada'} exitosamente`
            });

        } catch (error) {
            console.error('Error al cambiar estado de la categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// DELETE /api/categories/:id - Eliminar categoría (solo admin)
router.delete('/:id',
    verifyToken,
    verifyAdmin,
    idValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const categoryId = req.params.id;

            // Verificar que la categoría existe
            const categories = await query('SELECT id FROM categorias WHERE id = ?', [categoryId]);
            if (categories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            // Verificar que no hay productos asociados
            const products = await query('SELECT id FROM productos WHERE categoria_id = ?', [categoryId]);
            if (products.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar la categoría porque tiene productos asociados'
                });
            }

            await query('DELETE FROM categorias WHERE id = ?', [categoryId]);

            res.json({
                success: true,
                message: 'Categoría eliminada exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

module.exports = router;
