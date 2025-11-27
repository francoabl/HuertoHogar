package com.example.demo.loader;

import com.example.demo.entity.Producto;
import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        cargarRoles();

        cargarAdministrador();

        cargarUsuarioCliente();

        cargarProductos();
    }

    private void cargarRoles() {
        if (rolRepository.count() == 0) {
            Rol adminRole = new Rol("ROLE_ADMIN");
            rolRepository.save(adminRole);

            Rol clienteRole = new Rol("ROLE_CLIENTE");
            rolRepository.save(clienteRole);

            System.out.println("✓ Roles creados: ROLE_ADMIN, ROLE_CLIENTE");
        }
    }

    private void cargarAdministrador() {
        if (usuarioRepository.findByEmail("admin@demo.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@demo.com");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Rol adminRole = rolRepository.findByNombre("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Rol ROLE_ADMIN no encontrado"));
            admin.getRoles().add(adminRole);

            usuarioRepository.save(admin);
            System.out.println("✓ Usuario Admin creado: admin@demo.com / admin123");
        }
    }

    private void cargarUsuarioCliente() {
        if (usuarioRepository.findByEmail("cliente@demo.com").isEmpty()) {
            Usuario cliente = new Usuario();
            cliente.setNombre("Cliente Demo");
            cliente.setEmail("cliente@demo.com");
            cliente.setPassword(passwordEncoder.encode("cliente123"));

            Rol clienteRole = rolRepository.findByNombre("ROLE_CLIENTE")
                    .orElseThrow(() -> new RuntimeException("Rol ROLE_CLIENTE no encontrado"));
            cliente.getRoles().add(clienteRole);

            usuarioRepository.save(cliente);
            System.out.println("✓ Usuario Cliente creado: cliente@demo.com / cliente123");
        }
    }

    private void cargarProductos() {
        if (productoRepository.count() == 0) {
            // Productos de Hortalizas
            crearProducto("Tomate Cherry", "Tomates cherry frescos y dulces", new BigDecimal("3990"), 50, "Hortalizas", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500");
            crearProducto("Lechuga Romana", "Lechuga romana crujiente", new BigDecimal("2790"), 40, "Hortalizas", "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500");
            crearProducto("Brócoli", "Brócoli fresco y verde", new BigDecimal("4790"), 30, "Hortalizas", "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500");
            crearProducto("Zanahoria", "Zanahorias naranjas y nutritivas", new BigDecimal("2390"), 60, "Hortalizas", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500");

            // Productos de Frutas
            crearProducto("Fresas", "Fresas rojas y jugosas", new BigDecimal("5590"), 35, "Frutas", "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500");
            crearProducto("Manzanas", "Manzanas verdes crujientes", new BigDecimal("3190"), 50, "Frutas", "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500");
            crearProducto("Plátanos", "Plátanos amarillos maduros", new BigDecimal("1990"), 70, "Frutas", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500");
            crearProducto("Naranjas", "Naranjas dulces y jugosas", new BigDecimal("3590"), 45, "Frutas", "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500");

            // Productos de Hierbas Aromáticas
            crearProducto("Albahaca", "Albahaca fresca aromática", new BigDecimal("2390"), 25, "Hierbas", "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=500");
            crearProducto("Perejil", "Perejil fresco y oloroso", new BigDecimal("1590"), 30, "Hierbas", "https://images.unsplash.com/photo-1627524647118-44c299545881?w=500");
            crearProducto("Menta", "Menta fresca para té", new BigDecimal("1990"), 20, "Hierbas", "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500");

            // Productos de Productos de Jardinería
            crearProducto("Maceta Cerámica 15cm", "Maceta cerámica decorativa", new BigDecimal("10390"), 100, "Jardinería", "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500");
            crearProducto("Tierra de Cultivo 5L", "Tierra premium para plantas", new BigDecimal("7190"), 80, "Jardinería", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500");
            crearProducto("Fertilizante Orgánico", "Fertilizante natural orgánico", new BigDecimal("11990"), 60, "Jardinería", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500");
            crearProducto("Regadera 2L", "Regadera de plástico", new BigDecimal("4790"), 40, "Jardinería", "https://images.unsplash.com/photo-1610718909945-10daf85a5e3f?w=500");

            System.out.println("✓ 15 Productos de prueba creados");
        }
    }

    private void crearProducto(String nombre, String descripcion, BigDecimal precio, Integer stock, String categoria, String imagenUrl) {
        Producto producto = new Producto(nombre, descripcion, precio, stock, categoria);
        producto.setImagenUrl(imagenUrl);
        productoRepository.save(producto);
    }
}
