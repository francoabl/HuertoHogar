// Script para actualizar rutas en archivos HTML
// Este script actualiza las referencias a archivos CSS, JS y otros recursos

const fs = require('fs');
const path = require('path');

// Rutas de archivos HTML
const htmlFiles = [
    'src/pages/blog.html',
    'src/pages/contacto.html', 
    'src/pages/detalle-blog.html',
    'src/pages/detalle-producto.html',
    'src/pages/login.html',
    'src/pages/nosotros.html',
    'src/pages/perfil.html',
    'src/pages/productos.html',
    'src/pages/registro.html'
];

// Mapeo de rutas antiguas a nuevas
const pathMappings = {
    'huertohogar-web.css': '../css/huertohogar-web.css',
    'huertohogar-web.js': '../js/components/huertohogar-web.js',
    'js/auth.js': '../js/auth/auth.js',
    'js/demo-data.js': '../js/auth/demo-data.js',
    'blog.js': '../js/components/blog.js',
    'contacto.js': '../js/components/contacto.js'
};

function updatePaths() {
    htmlFiles.forEach(file => {
        try {
            let content = fs.readFileSync(file, 'utf8');
            
            // Actualizar rutas CSS y JS
            Object.keys(pathMappings).forEach(oldPath => {
                const newPath = pathMappings[oldPath];
                content = content.replace(new RegExp(oldPath, 'g'), newPath);
            });
            
            fs.writeFileSync(file, content);
            console.log(`✅ Updated: ${file}`);
        } catch (error) {
            console.log(`❌ Error updating ${file}:`, error.message);
        }
    });
}

// Solo para documentación - el script real se ejecutará manualmente
console.log('Path update script ready');
