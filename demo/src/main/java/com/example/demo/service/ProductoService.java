package com.example.demo.service;

import com.example.demo.entity.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Obtiene un producto por ID
     */
    public Optional<Producto> findById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID inválido");
        }
        return productoRepository.findById(id);
    }

    /**
     * Obtiene un producto por ID
     */
    public Optional<Producto> obtenerPorId(String id) {
        return findById(id);
    }

    /**
     * Obtiene todos los productos
     */
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    /**
     * Obtiene todos los productos
     */
    public List<Producto> listarTodos() {
        return obtenerTodos();
    }

    /**
     * Crea un nuevo producto con validaciones (sobrecargado para recibir Producto)
     */
    public Producto crear(Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (producto.getStock() == null || producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        if (producto.getCategoria() == null || producto.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        producto.setNombre(producto.getNombre().trim());
        if (producto.getDescripcion() != null) {
            producto.setDescripcion(producto.getDescripcion().trim());
        }
        producto.setCategoria(producto.getCategoria().trim());

        return productoRepository.save(producto);
    }

    /**
     * Crea un nuevo producto con validaciones (versión original)
     */
    public Producto crear(String nombre, String descripcion, BigDecimal precio, Integer stock, String categoria) {
        // Validar campos obligatorios
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        if (precio == null || precio.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        if (categoria == null || categoria.trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        Producto producto = new Producto();
        producto.setNombre(nombre.trim());
        producto.setDescripcion(descripcion != null ? descripcion.trim() : "");
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setCategoria(categoria.trim());

        return productoRepository.save(producto);
    }

    /**
     * Actualiza un producto existente (sobrecargado para recibir Producto)
     */
    public Producto actualizar(Producto producto) {
        if (producto.getId() == null || producto.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("ID inválido");
        }
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (producto.getStock() == null || producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        if (producto.getCategoria() == null || producto.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        // Verificar que existe
        productoRepository.findById(producto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + producto.getId()));

        return productoRepository.save(producto);
    }

    /**
     * Actualiza un producto existente (versión original)
     */
    public Producto actualizar(String id, String nombre, String descripcion, BigDecimal precio, Integer stock, String categoria) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID inválido");
        }

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        if (nombre != null && !nombre.trim().isEmpty()) {
            producto.setNombre(nombre.trim());
        }
        if (descripcion != null && !descripcion.trim().isEmpty()) {
            producto.setDescripcion(descripcion.trim());
        }
        if (precio != null && precio.compareTo(BigDecimal.ZERO) > 0) {
            producto.setPrecio(precio);
        }
        if (stock != null && stock >= 0) {
            producto.setStock(stock);
        }
        if (categoria != null && !categoria.trim().isEmpty()) {
            producto.setCategoria(categoria.trim());
        }

        return productoRepository.save(producto);
    }

    /**
     * Busca productos por nombre (case-insensitive)
     */
    public List<Producto> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        return productoRepository.findByNombreContainingIgnoreCase(nombre.trim());
    }

    /**
     * Busca productos por categoría
     */
    public List<Producto> buscarPorCategoria(String categoria) {
        if (categoria == null || categoria.trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría no puede estar vacía");
        }
        return productoRepository.findByCategoria(categoria.trim());
    }

    /**
     * Elimina un producto
     */
    public void eliminar(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID inválido");
        }
        productoRepository.deleteById(id);
    }

    /**
     * Actualiza el stock de un producto
     */
    public void actualizarStock(String productoId, Integer cantidad) {
        if (productoId == null || productoId.trim().isEmpty()) {
            throw new IllegalArgumentException("ID de producto inválido");
        }
        if (cantidad == null) {
            throw new IllegalArgumentException("La cantidad no puede ser nula");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + productoId));

        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new IllegalArgumentException("No hay suficiente stock disponible");
        }

        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }
}
