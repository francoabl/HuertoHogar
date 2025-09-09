const express = require('express');
const bcrypt = require('bcryptjs');
const { body, param, query: queryValidator } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, verifyAdmin, verifyOwnerOrAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validaciones para usuario
const userValidation = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('apellido')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Debe ser un email válido'),
    body('telefono')
        .optional()
        .matches(/^[0-9+\-\s()]*$/)
        .withMessage('Formato de teléfono inválido'),
    body('direccion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La dirección no puede exceder 500 caracteres'),
    body('ciudad')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La ciudad no puede exceder 100 caracteres'),
    body('codigo_postal')
        .optional()
        .isLength({ max: 10 })
        .withMessage('El código postal no puede exceder 10 caracteres'),
    body('rol')
        .optional()
        .isIn(['cliente', 'admin'])
        .withMessage('El rol debe ser cliente o admin')
];

const passwordValidation = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID debe ser un número entero positivo')
];

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', 
    verifyToken, 
    verifyAdmin,
    [
        queryValidator('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
        queryValidator('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
        queryValidator('search').optional().isLength({ max: 100 }).withMessage('La búsqueda no puede exceder 100 caracteres'),
        queryValidator('rol').optional().isIn(['cliente', 'admin']).withMessage('Rol inválido'),
        queryValidator('activo').optional().isBoolean().withMessage('Activo debe ser true o false')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';
            const rol = req.query.rol;
            const activo = req.query.activo;

            // Construir consulta dinámicamente
            let whereClause = 'WHERE 1=1';
            const params = [];

            if (search) {
                whereClause += ' AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)';
                const searchParam = `%${search}%`;
                params.push(searchParam, searchParam, searchParam);
            }

            if (rol) {
                whereClause += ' AND rol = ?';
                params.push(rol);
            }

            if (activo !== undefined) {
                whereClause += ' AND activo = ?';
                params.push(activo === 'true');
            }

            // Obtener usuarios
            const users = await query(
                `SELECT id, nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol, activo, fecha_creacion, fecha_actualizacion 
                 FROM usuarios 
                 ${whereClause}
                 ORDER BY fecha_creacion DESC 
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );

            // Contar total
            const totalResult = await query(
                `SELECT COUNT(*) as total FROM usuarios ${whereClause}`,
                params
            );
            const total = totalResult[0].total;

            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', 
    verifyToken, 
    idValidation, 
    handleValidationErrors,
    verifyOwnerOrAdmin,
    async (req, res) => {
        try {
            const userId = req.params.id;

            const users = await query(
                'SELECT id, nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: {
                    user: users[0]
                }
            });

        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', 
    verifyToken,
    idValidation,
    userValidation,
    handleValidationErrors,
    verifyOwnerOrAdmin,
    async (req, res) => {
        try {
            const userId = req.params.id;
            const { nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol } = req.body;

            // Verificar que el usuario existe
            const existingUsers = await query('SELECT id, rol FROM usuarios WHERE id = ?', [userId]);
            if (existingUsers.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Solo admin puede cambiar roles
            if (rol && req.user.rol !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los administradores pueden cambiar roles'
                });
            }

            // Verificar email único si se está cambiando
            if (email) {
                const emailExists = await query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, userId]);
                if (emailExists.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: 'El email ya está en uso'
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
            if (apellido !== undefined) {
                updates.push('apellido = ?');
                params.push(apellido);
            }
            if (email !== undefined) {
                updates.push('email = ?');
                params.push(email);
            }
            if (telefono !== undefined) {
                updates.push('telefono = ?');
                params.push(telefono);
            }
            if (direccion !== undefined) {
                updates.push('direccion = ?');
                params.push(direccion);
            }
            if (ciudad !== undefined) {
                updates.push('ciudad = ?');
                params.push(ciudad);
            }
            if (codigo_postal !== undefined) {
                updates.push('codigo_postal = ?');
                params.push(codigo_postal);
            }
            if (rol !== undefined && req.user.rol === 'admin') {
                updates.push('rol = ?');
                params.push(rol);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay datos para actualizar'
                });
            }

            params.push(userId);

            await query(
                `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            // Obtener usuario actualizado
            const updatedUser = await query(
                'SELECT id, nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = ?',
                [userId]
            );

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: {
                    user: updatedUser[0]
                }
            });

        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/users/:id/password - Cambiar contraseña
router.put('/:id/password',
    verifyToken,
    idValidation,
    [
        body('currentPassword').notEmpty().withMessage('La contraseña actual es requerida'),
        ...passwordValidation
    ],
    handleValidationErrors,
    verifyOwnerOrAdmin,
    async (req, res) => {
        try {
            const userId = req.params.id;
            const { currentPassword, password } = req.body;

            // Obtener usuario con contraseña
            const users = await query('SELECT id, password FROM usuarios WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const user = users[0];

            // Verificar contraseña actual (excepto si es admin cambiando otra cuenta)
            if (req.user.id === parseInt(userId)) {
                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Contraseña actual incorrecta'
                    });
                }
            }

            // Hashear nueva contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Actualizar contraseña
            await query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, userId]);

            res.json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });

        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// PUT /api/users/:id/status - Activar/Desactivar usuario (solo admin)
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
            const userId = req.params.id;
            const { activo } = req.body;

            // Verificar que el usuario existe
            const users = await query('SELECT id FROM usuarios WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // No permitir desactivar el propio usuario admin
            if (req.user.id === parseInt(userId) && !activo) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes desactivar tu propia cuenta'
                });
            }

            await query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, userId]);

            res.json({
                success: true,
                message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`
            });

        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id',
    verifyToken,
    verifyAdmin,
    idValidation,
    handleValidationErrors,
    async (req, res) => {
        try {
            const userId = req.params.id;

            // Verificar que el usuario existe
            const users = await query('SELECT id FROM usuarios WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // No permitir eliminar el propio usuario admin
            if (req.user.id === parseInt(userId)) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes eliminar tu propia cuenta'
                });
            }

            await query('DELETE FROM usuarios WHERE id = ?', [userId]);

            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
);

module.exports = router;
