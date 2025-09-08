# 🎮 Demostración en Vivo - Sistema de Autenticación HuertoHogar

## 🚀 Guía Paso a Paso para Demostrar

### 1. Preparación Inicial
1. Abrir el navegador y navegar a `huertohogar-web.html`
2. Abrir las herramientas de desarrollador (F12)
3. En la consola, escribir: `demoData.show()` para ver usuarios disponibles

### 2. Demostrar Registro de Usuario
1. Hacer clic en **"Registro"** en la navegación
2. Llenar el formulario con datos reales:
   - Nombre: `Ana`
   - Apellido: `Silva`
   - Email: `ana@test.com`
   - Teléfono: `+56 9 9999 8888`
   - Dirección: `Calle Nueva 123`
   - Ciudad: `Santiago`
   - Contraseña: `mipassword2024`
   - Confirmar contraseña: `mipassword2024`
   - ✅ Aceptar términos
3. Hacer clic en **"Crear Cuenta"**
4. ✅ **Resultado**: Usuario registrado exitosamente y redirección a login

### 3. Demostrar Login con Usuario Demo
1. En la página de login, usar credenciales de demo:
   - Email: `juan@ejemplo.com`
   - Contraseña: `12345678`
   - ✅ Marcar "Recordarme"
2. Hacer clic en **"Iniciar Sesión"**
3. ✅ **Resultado**: Login exitoso y redirección a página principal

### 4. Mostrar Cambios en la Navegación
1. **Observar** cómo cambió la navegación:
   - Los botones "Registro" e "Ingresar" desaparecieron
   - Apareció un menú desplegable con el nombre del usuario
2. Hacer clic en el menú del usuario y mostrar opciones:
   - Mi Perfil
   - Mis Pedidos
   - Cerrar Sesión

### 5. Demostrar Página de Perfil
1. Hacer clic en **"Mi Perfil"**
2. **Mostrar información del usuario** cargada automáticamente
3. **Editar información**:
   - Cambiar teléfono a `+56 9 1111 2222`
   - Cambiar dirección a `Nueva Dirección 456`
4. Hacer clic en **"Guardar Cambios"**
5. ✅ **Resultado**: Información actualizada exitosamente

### 6. Demostrar Cambio de Contraseña
1. En el perfil, ir a la pestaña **"Seguridad"**
2. Llenar formulario de cambio de contraseña:
   - Contraseña actual: `12345678`
   - Nueva contraseña: `nuevapassword`
   - Confirmar nueva: `nuevapassword`
3. Hacer clic en **"Cambiar Contraseña"**
4. ✅ **Resultado**: Contraseña cambiada exitosamente

### 7. Demostrar Persistencia de Sesión
1. **Cerrar** la pestaña del navegador
2. **Abrir nueva pestaña** y navegar a `huertohogar-web.html`
3. ✅ **Resultado**: Usuario sigue logueado (porque marcamos "Recordarme")

### 8. Demostrar Cierre de Sesión
1. Hacer clic en el menú del usuario
2. Hacer clic en **"Cerrar Sesión"**
3. ✅ **Resultado**: 
   - Mensaje de confirmación
   - Redirección a página principal
   - Navegación vuelve al estado original (botones de login/registro)

### 9. Demostrar Protección de Páginas
1. **Sin estar logueado**, navegar directamente a `perfil.html`
2. ✅ **Resultado**: 
   - Mensaje de advertencia
   - Redirección automática a login

### 10. Demostrar Validaciones
1. En login, intentar con email inválido: `test` (sin @)
2. En registro, usar email que ya existe: `juan@ejemplo.com`
3. En registro, poner contraseñas que no coinciden
4. ✅ **Resultado**: Mensajes de error apropiados y campos destacados

## 🛠️ Comandos de Consola para Demostración

```javascript
// Ver todos los usuarios registrados
demoData.show()

// Ver usuario actual
auth.getCurrentUser()

// Verificar si está logueado
auth.isLoggedIn()

// Reiniciar datos de demo
demoData.reset()

// Ver estructura de un usuario
console.log(JSON.parse(localStorage.getItem('huertohogar_users'))[0])
```

## 📱 Puntos Clave a Destacar

### ✅ Funcionalidades Implementadas
- ✅ Registro completo con validaciones
- ✅ Login con recordar sesión
- ✅ Gestión de perfil de usuario
- ✅ Cambio de contraseña
- ✅ Navegación dinámica
- ✅ Protección de páginas
- ✅ Persistencia de datos
- ✅ Mensajes de feedback elegantes

### 🎨 Experiencia de Usuario
- ✅ Interfaz responsive y moderna
- ✅ Animaciones sutiles
- ✅ Feedback visual inmediato
- ✅ Estados de carga en botones
- ✅ Validaciones en tiempo real

### 🔧 Aspectos Técnicos
- ✅ JavaScript modular y organizado
- ✅ LocalStorage para persistencia
- ✅ Manejo de errores robusto
- ✅ Código reutilizable y escalable

## 🚀 Transición a Producción

### Lo que está listo:
- Frontend completamente funcional
- Lógica de autenticación implementada
- Validaciones del lado del cliente
- Interfaz de usuario pulida

### Lo que falta para producción:
1. **Backend API** (Node.js, PHP, Python)
2. **Base de datos real** (MySQL, PostgreSQL)
3. **Hash seguro de contraseñas** (bcrypt)
4. **Tokens JWT** para autenticación
5. **Validaciones del servidor**
6. **HTTPS** y certificados SSL

## 💡 Preguntas Frecuentes para la Demo

**P: ¿Los datos se pierden al refrescar?**
R: No, se guardan en localStorage y persisten entre sesiones.

**P: ¿Funciona en móviles?**
R: Sí, es completamente responsive.

**P: ¿Se puede usar en producción?**
R: El frontend sí, pero necesita backend real para producción.

**P: ¿Qué pasa si olvido la contraseña?**
R: En esta demo no, pero es fácil de implementar con backend.

**P: ¿Soporta múltiples usuarios simultáneos?**
R: En la demo uno por navegador, en producción sí con backend.

---

¡Lista para impresionar! 🎉
