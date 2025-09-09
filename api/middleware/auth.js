const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware para verificar JWT
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el usuario aún existe y está activo
        const user = await query(
            'SELECT id, nombre, apellido, email, rol, activo FROM usuarios WHERE id = ? AND activo = TRUE',
            [decoded.userId]
        );

        if (user.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado o inactivo'
            });
        }

        // Agregar información del usuario a la request
        req.user = user[0];
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        console.error('Error en verificación de token:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar rol de administrador
const verifyAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
    next();
};

// Middleware para verificar que el usuario sea el propietario o admin
const verifyOwnerOrAdmin = (req, res, next) => {
    const requestedUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;
    const isAdmin = req.user.rol === 'admin';

    if (!isAdmin && currentUserId !== requestedUserId) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo puedes acceder a tu propia información'
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyOwnerOrAdmin
};
