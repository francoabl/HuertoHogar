const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { query } = require('../config/database');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validaciones para registro
const registerValidation = [
    body('nombre')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('apellido')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Debe ser un email válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    body('telefono')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
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
        .withMessage('El código postal no puede exceder 10 caracteres')
];

// Validaciones para login
const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Debe ser un email válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, direccion, ciudad, codigo_postal } = req.body;

        // Verificar si el email ya existe
        const existingUser = await query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Hashear la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar nuevo usuario
        const result = await query(
            `INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, ciudad, codigo_postal)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, email, hashedPassword, telefono || null, direccion || null, ciudad || null, codigo_postal || null]
        );

        // Obtener el usuario creado (sin la contraseña)
        const newUser = await query(
            'SELECT id, nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol, fecha_creacion FROM usuarios WHERE id = ?',
            [result.insertId]
        );

        // Generar JWT
        const token = jwt.sign(
            { userId: newUser[0].id, email: newUser[0].email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: newUser[0],
                token
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const users = await query(
            'SELECT id, nombre, apellido, email, password, telefono, direccion, ciudad, codigo_postal, rol, activo FROM usuarios WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const user = users[0];

        // Verificar si el usuario está activo
        if (!user.activo) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada. Contacta al administrador'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Remover contraseña del objeto usuario
        delete user.password;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/auth/verify-token - Verificar token
router.post('/verify-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener información del usuario
        const users = await query(
            'SELECT id, nombre, apellido, email, telefono, direccion, ciudad, codigo_postal, rol, activo FROM usuarios WHERE id = ? AND activo = TRUE',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado o inactivo'
            });
        }

        res.json({
            success: true,
            message: 'Token válido',
            data: {
                user: users[0]
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        console.error('Error en verificación de token:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
