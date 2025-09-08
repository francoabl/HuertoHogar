// Sistema de autenticación básico con localStorage
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('huertohogar_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('huertohogar_currentUser')) || null;
    }

    // Registrar nuevo usuario
    register(userData) {
        try {
            // Validar que el email no exista
            if (this.users.find(user => user.email === userData.email)) {
                throw new Error('El correo electrónico ya está registrado');
            }

            // Validar datos requeridos
            if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Formato de email inválido');
            }

            // Validar contraseña
            if (userData.password.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            // Crear nuevo usuario
            const newUser = {
                id: Date.now().toString(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                password: this.hashPassword(userData.password), // En producción usar bcrypt
                phone: userData.phone || '',
                address: userData.address || '',
                city: userData.city || '',
                zipCode: userData.zipCode || '',
                createdAt: new Date().toISOString(),
                isActive: true
            };

            // Agregar usuario a la lista
            this.users.push(newUser);
            localStorage.setItem('huertohogar_users', JSON.stringify(this.users));

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                user: this.sanitizeUser(newUser)
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Iniciar sesión
    login(email, password, remember = false) {
        try {
            // Buscar usuario
            const user = this.users.find(u => u.email === email.toLowerCase());
            
            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            if (!this.verifyPassword(password, user.password)) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar que el usuario esté activo
            if (!user.isActive) {
                throw new Error('Cuenta desactivada');
            }

            // Actualizar última conexión
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('huertohogar_users', JSON.stringify(this.users));

            // Guardar sesión
            this.currentUser = this.sanitizeUser(user);
            localStorage.setItem('huertohogar_currentUser', JSON.stringify(this.currentUser));

            // Si "recordarme" está marcado, guardar en localStorage permanente
            if (remember) {
                localStorage.setItem('huertohogar_remember', 'true');
            }

            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                user: this.currentUser
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('huertohogar_currentUser');
        localStorage.removeItem('huertohogar_remember');
        
        return {
            success: true,
            message: 'Sesión cerrada exitosamente'
        };
    }

    // Verificar si hay una sesión activa
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Obtener perfil del usuario
    getUserProfile() {
        if (!this.isLoggedIn()) {
            return null;
        }
        return this.currentUser;
    }

    // Actualizar perfil del usuario
    updateProfile(userData) {
        try {
            if (!this.isLoggedIn()) {
                throw new Error('Debes iniciar sesión para actualizar el perfil');
            }

            // Buscar usuario en la lista
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex === -1) {
                throw new Error('Usuario no encontrado');
            }

            // Actualizar datos
            const updatedUser = {
                ...this.users[userIndex],
                ...userData,
                updatedAt: new Date().toISOString()
            };

            // No permitir cambio de email si ya existe otro usuario con ese email
            if (userData.email && userData.email !== this.users[userIndex].email) {
                if (this.users.find(u => u.email === userData.email.toLowerCase() && u.id !== this.currentUser.id)) {
                    throw new Error('El correo electrónico ya está en uso');
                }
                updatedUser.email = userData.email.toLowerCase();
            }

            // Actualizar en la lista
            this.users[userIndex] = updatedUser;
            localStorage.setItem('huertohogar_users', JSON.stringify(this.users));

            // Actualizar sesión actual
            this.currentUser = this.sanitizeUser(updatedUser);
            localStorage.setItem('huertohogar_currentUser', JSON.stringify(this.currentUser));

            return {
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: this.currentUser
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Cambiar contraseña
    changePassword(currentPassword, newPassword) {
        try {
            if (!this.isLoggedIn()) {
                throw new Error('Debes iniciar sesión para cambiar la contraseña');
            }

            // Buscar usuario
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex === -1) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar contraseña actual
            if (!this.verifyPassword(currentPassword, this.users[userIndex].password)) {
                throw new Error('Contraseña actual incorrecta');
            }

            // Validar nueva contraseña
            if (newPassword.length < 8) {
                throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
            }

            // Actualizar contraseña
            this.users[userIndex].password = this.hashPassword(newPassword);
            this.users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('huertohogar_users', JSON.stringify(this.users));

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Hash de contraseña simple (en producción usar bcrypt)
    hashPassword(password) {
        // Esta es una implementación simple para demo
        // En producción debes usar bcrypt o similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        return hash.toString();
    }

    // Verificar contraseña
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Limpiar datos sensibles del usuario
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    // Verificar sesión al cargar la página
    checkSession() {
        const remember = localStorage.getItem('huertohogar_remember');
        if (this.currentUser && remember) {
            return true;
        } else if (this.currentUser && !remember) {
            // Verificar si la sesión ha expirado (ejemplo: 24 horas)
            const user = this.users.find(u => u.id === this.currentUser.id);
            if (user && user.lastLogin) {
                const lastLogin = new Date(user.lastLogin);
                const now = new Date();
                const timeDiff = now - lastLogin;
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff > 24) {
                    this.logout();
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // Obtener todos los usuarios (solo para admin)
    getAllUsers() {
        if (!this.isLoggedIn()) {
            return [];
        }
        return this.users.map(user => this.sanitizeUser(user));
    }
}

// Crear instancia global
const auth = new AuthSystem();

// Funciones de utilidad para manejo de UI
const AuthUI = {
    // Mostrar/ocultar elementos basado en estado de sesión
    updateUI() {
        const isLoggedIn = auth.isLoggedIn();
        const currentUser = auth.getCurrentUser();
        
        // Elementos que se muestran solo cuando está logueado
        const loggedInElements = document.querySelectorAll('.logged-in-only');
        loggedInElements.forEach(el => {
            el.style.display = isLoggedIn ? 'block' : 'none';
        });
        
        // Elementos que se muestran solo cuando NO está logueado
        const loggedOutElements = document.querySelectorAll('.logged-out-only');
        loggedOutElements.forEach(el => {
            el.style.display = isLoggedIn ? 'none' : 'block';
        });
        
        // Actualizar información del usuario en la navegación
        const userInfo = document.querySelector('#userInfo');
        if (userInfo && isLoggedIn) {
            userInfo.innerHTML = `
                <div class="dropdown user-dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle me-2"></i>
                        <span class="d-none d-md-inline">${currentUser.firstName}</span>
                        <i class="fas fa-chevron-down ms-2" style="font-size: 0.8rem;"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><h6 class="dropdown-header">${currentUser.firstName} ${currentUser.lastName}</h6></li>
                        <li><small class="dropdown-item-text text-muted">${currentUser.email}</small></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="perfil.html"><i class="fas fa-user me-2"></i>Mi Perfil</a></li>
                        <li><a class="dropdown-item" href="#" onclick="AuthUI.showOrders()"><i class="fas fa-shopping-bag me-2"></i>Mis Pedidos</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="AuthUI.logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
                    </ul>
                </div>
            `;
        }
    },

    // Mostrar mensaje
    showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Buscar contenedor para mensajes o crear uno
        let messageContainer = document.querySelector('#messageContainer');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'messageContainer';
            messageContainer.className = 'position-fixed top-0 end-0 p-3';
            messageContainer.style.zIndex = '9999';
            document.body.appendChild(messageContainer);
        }
        
        messageContainer.appendChild(alertDiv);
        
        // Auto-dismiss después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    },

    // Cerrar sesión
    logout() {
        const result = auth.logout();
        if (result.success) {
            this.showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = 'huertohogar-web.html';
            }, 1000);
        }
    },

    // Mostrar perfil
    showProfile() {
        window.location.href = 'perfil.html';
    },

    // Mostrar pedidos
    showOrders() {
        // Por ahora redirigir a perfil con tab de pedidos
        window.location.href = 'perfil.html#orders';
    },

    // Formatear nombre para mostrar
    formatUserName(user) {
        if (!user) return '';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName} ${lastName}`.trim() || user.email;
    },

    // Proteger página (requiere login)
    requireAuth() {
        if (!auth.isLoggedIn()) {
            this.showMessage('Debes iniciar sesión para acceder a esta página', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        return true;
    }
};

// Verificar sesión al cargar cualquier página
document.addEventListener('DOMContentLoaded', function() {
    auth.checkSession();
    AuthUI.updateUI();
});
