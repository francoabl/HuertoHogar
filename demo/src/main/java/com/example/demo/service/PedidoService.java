package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoItemRepository pedidoItemRepository;

    /**
     * Obtiene un pedido por ID
     */
    public Optional<Pedido> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        return pedidoRepository.findById(id);
    }

    /**
     * Obtiene un pedido por ID
     */
    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return findById(id);
    }

    /**
     * Obtiene todos los pedidos de un usuario
     */
    public List<Pedido> obtenerPedidosUsuario(Long usuarioId) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));

        return pedidoRepository.findByUsuario(usuario);
    }

    /**
     * Obtiene todos los pedidos de un usuario
     */
    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return obtenerPedidosUsuario(usuarioId);
    }

    /**
     * Obtiene pedidos por estado
     */
    public List<Pedido> obtenerPedidosPorEstado(String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado no puede estar vacío");
        }
        return pedidoRepository.findByEstado(estado.trim());
    }

    /**
     * Obtiene pedidos de un usuario con estado específico
     */
    public List<Pedido> obtenerPedidosUsuarioPorEstado(Long usuarioId, String estado) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }
        if (estado == null || estado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));

        return pedidoRepository.findByUsuarioAndEstado(usuario, estado.trim());
    }

    /**
     * Crea un pedido desde el carrito del usuario
     * Valida stock y calcula el total automáticamente
     */
    public Pedido crearPedidoDesdeCarrito(Long usuarioId) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));

        // Obtener items del carrito
        List<CarritoItem> carritoItems = carritoItemRepository.findByUsuario(usuario);

        if (carritoItems.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }

        // Validar stock para todos los items
        for (CarritoItem item : carritoItems) {
            if (item.getProducto().getStock() < item.getCantidad()) {
                throw new IllegalArgumentException(
                        "No hay suficiente stock para el producto: " + item.getProducto().getNombre() +
                        " (disponible: " + item.getProducto().getStock() +
                        ", solicitado: " + item.getCantidad() + ")"
                );
            }
        }

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        // Calcular total y crear items del pedido
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoItem carritoItem : carritoItems) {
            Producto producto = carritoItem.getProducto();

            // Crear item del pedido
            PedidoItem pedidoItem = new PedidoItem(
                    producto,
                    carritoItem.getCantidad(),
                    producto.getPrecio()
            );
            pedido.getItems().add(pedidoItem);

            // Sumar al total
            total = total.add(pedidoItem.getSubtotal());

            // Actualizar stock del producto
            producto.setStock(producto.getStock() - carritoItem.getCantidad());
            productoRepository.save(producto);
        }

        pedido.setTotal(total);

        // Guardar pedido
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Vaciar carrito
        carritoItemRepository.deleteByUsuario(usuario);

        return pedidoGuardado;
    }

    /**
     * Crea un pedido manualmente especificando items
     */
    public Pedido crearPedido(Long usuarioId, List<PedidoItem> items) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Debe proporcionar al menos un item");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));

        // Validar stock
        for (PedidoItem item : items) {
            if (item.getProducto().getStock() < item.getCantidad()) {
                throw new IllegalArgumentException(
                        "No hay suficiente stock para: " + item.getProducto().getNombre()
                );
            }
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");
        pedido.setItems(items);

        // Calcular total y actualizar stock
        BigDecimal total = BigDecimal.ZERO;
        for (PedidoItem item : items) {
            total = total.add(item.getSubtotal());
            item.getProducto().setStock(item.getProducto().getStock() - item.getCantidad());
            productoRepository.save(item.getProducto());
        }

        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }

    /**
     * Actualiza el estado de un pedido
     */
    public Pedido actualizarEstado(Long pedidoId, String nuevoEstado) {
        if (pedidoId == null || pedidoId <= 0) {
            throw new IllegalArgumentException("ID de pedido inválido");
        }
        if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado no puede estar vacío");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + pedidoId));

        String estadoValido = nuevoEstado.trim().toUpperCase();
        pedido.setEstado(estadoValido);

        return pedidoRepository.save(pedido);
    }

    /**
     * Calcula el total de un pedido (suma de subtotales)
     */
    public BigDecimal calcularTotal(Long pedidoId) {
        if (pedidoId == null || pedidoId <= 0) {
            throw new IllegalArgumentException("ID de pedido inválido");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + pedidoId));

        BigDecimal total = BigDecimal.ZERO;
        for (PedidoItem item : pedido.getItems()) {
            total = total.add(item.getSubtotal());
        }

        return total;
    }

    /**
     * Obtiene todos los pedidos
     */
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }
}
