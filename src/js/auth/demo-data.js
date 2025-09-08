// Datos de demostración para HuertoHogar
// Este archivo carga usuarios de ejemplo para poder probar el sistema inmediatamente

function loadDemoData() {
    // Verificar si ya hay datos cargados
    const existingUsers = JSON.parse(localStorage.getItem('huertohogar_users'));
    if (existingUsers && existingUsers.length > 0) {
        console.log('Demo data already exists');
        return;
    }

    // Usuarios de demostración
    const demoUsers = [
        {
            id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@ejemplo.com',
            password: auth.hashPassword('12345678'), // Contraseña: 12345678
            phone: '+56 9 1234 5678',
            address: 'Avenida Libertador 1234',
            city: 'santiago',
            zipCode: '8320000',
            createdAt: new Date('2024-01-15').toISOString(),
            isActive: true,
            lastLogin: new Date().toISOString()
        },
        {
            id: '2',
            firstName: 'María',
            lastName: 'González',
            email: 'maria@ejemplo.com',
            password: auth.hashPassword('password123'), // Contraseña: password123
            phone: '+56 9 8765 4321',
            address: 'Calle Las Flores 567',
            city: 'valparaiso',
            zipCode: '2340000',
            createdAt: new Date('2024-02-20').toISOString(),
            isActive: true,
            lastLogin: new Date('2024-03-01').toISOString()
        },
        {
            id: '3',
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            email: 'carlos@ejemplo.com',
            password: auth.hashPassword('mipassword'), // Contraseña: mipassword
            phone: '+56 9 5555 6666',
            address: 'Pasaje Los Rosales 890',
            city: 'concepcion',
            zipCode: '4030000',
            createdAt: new Date('2024-03-10').toISOString(),
            isActive: true,
            lastLogin: new Date('2024-03-15').toISOString()
        }
    ];

    // Guardar usuarios de demo en localStorage
    localStorage.setItem('huertohogar_users', JSON.stringify(demoUsers));
    
    console.log('Demo data loaded successfully!');
    console.log('Available demo users:');
    console.log('1. juan@ejemplo.com / 12345678');
    console.log('2. maria@ejemplo.com / password123');
    console.log('3. carlos@ejemplo.com / mipassword');
    
    // Mostrar mensaje informativo
    if (typeof AuthUI !== 'undefined') {
        AuthUI.showMessage('Datos de demostración cargados. Puedes usar: juan@ejemplo.com / 12345678', 'info');
    }
}

// Función para resetear todos los datos
function resetDemoData() {
    localStorage.removeItem('huertohogar_users');
    localStorage.removeItem('huertohogar_currentUser');
    localStorage.removeItem('huertohogar_remember');
    
    // Recargar datos de demo
    loadDemoData();
    
    if (typeof AuthUI !== 'undefined') {
        AuthUI.showMessage('Datos de demostración reiniciados', 'success');
    }
    
    console.log('Demo data reset complete');
}

// Función para mostrar todos los usuarios de demo
function showDemoUsers() {
    const users = JSON.parse(localStorage.getItem('huertohogar_users')) || [];
    console.log('=== USUARIOS DE DEMOSTRACIÓN ===');
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contraseña: [ver código fuente de demo-data.js]`);
        console.log(`   Teléfono: ${user.phone}`);
        console.log(`   Ciudad: ${user.city}`);
        console.log('---');
    });
}

// Cargar datos de demo cuando se carga este script
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que auth.js se cargue completamente
    setTimeout(() => {
        loadDemoData();
    }, 100);
});

// Exportar funciones para uso global
window.demoData = {
    load: loadDemoData,
    reset: resetDemoData,
    show: showDemoUsers
};
