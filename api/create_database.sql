-- Script SQL para crear la base de datos HuertoHogar
-- Ejecutar en MySQL Workbench, phpMyAdmin o desde línea de comandos

-- Eliminar base de datos si existe (opcional - cuidado con datos existentes)
DROP DATABASE IF EXISTS huertohogar_db;

-- Crear la base de datos
CREATE DATABASE huertohogar_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE huertohogar_db;

-- Tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    imagen VARCHAR(255) DEFAULT NULL,
    stock INT DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    es_admin TINYINT(1) DEFAULT 0,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('frutas frescas', 'Frutas frescas y de temporada'),
('verduras', 'Verduras frescas y orgánicas'),
('lacteos', 'Productos lácteos frescos'),
('organicos', 'Productos orgánicos certificados');

-- Insertar productos iniciales con imágenes
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen, stock) VALUES
('Manzanas Rojas', 'Manzanas rojas frescas y crujientes, directo del huerto', 1200.00, 1, 'assets/img/productos/manzanas.webp', 50),
('Miel Orgánica', 'Miel pura y natural de abejas locales, sin procesamientos químicos', 2500.00, 4, 'assets/img/productos/miel.webp', 30),
('Leche Fresca', 'Leche fresca de vacas locales, rica en nutrientes', 1800.00, 3, 'assets/img/productos/leche.webp', 25),
('Naranjas Dulces', 'Naranjas jugosas y dulces, perfectas para jugos naturales', 1100.00, 1, 'assets/img/productos/naranjas.webp', 40),
('Espinacas Orgánicas', 'Espinacas frescas cultivadas sin pesticidas, ricas en hierro', 900.00, 2, 'assets/img/productos/espinacas.webp', 35),
('Zanahorias Frescas', 'Zanahorias frescas y crujientes, perfectas para ensaladas', 800.00, 2, 'assets/img/productos/zanahorias.webp', 45);

-- Crear un usuario administrador por defecto
INSERT INTO usuarios (nombre, apellido, email, password, es_admin, activo) VALUES
('Admin', 'HuertoHogar', 'admin@huertohogar.cl', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1);
-- Contraseña: password (cambiar en producción)

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_categorias_activo ON categorias(activo);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Verificar datos insertados
SELECT 'Categorías creadas:' as Info;
SELECT * FROM categorias;

SELECT 'Productos creados:' as Info;
SELECT p.id, p.nombre, p.precio, c.nombre as categoria, p.imagen, p.stock 
FROM productos p 
JOIN categorias c ON p.categoria_id = c.id;

SELECT 'Usuario administrador creado:' as Info;
SELECT id, nombre, apellido, email, es_admin FROM usuarios;
