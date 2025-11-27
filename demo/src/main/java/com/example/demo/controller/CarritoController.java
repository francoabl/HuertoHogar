package com.example.demo.controller;

import com.example.demo.entity.CarritoItem;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.CarritoItemRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CarritoController {

    @Autowired
    private CarritoItemRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public ResponseEntity<List<CarritoItem>> obtenerCarrito(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(404).build();
        }

        List<CarritoItem> items = carritoRepository.findByUsuario(usuario);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarAlCarrito(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(404).build();
            }

            Long productoId = Long.valueOf(request.get("productoId").toString());
            Integer cantidad = Integer.valueOf(request.get("cantidad").toString());

            if (cantidad <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "La cantidad debe ser mayor a 0"));
            }

            var producto = productoRepository.findById(productoId);
            if (producto.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Producto no encontrado"));
            }

            if (producto.get().getStock() < cantidad) {
                return ResponseEntity.badRequest().body(Map.of("error", "Stock insuficiente"));
            }

            // Verificar si ya existe en el carrito
            var existente = carritoRepository.findByUsuarioAndProductoId(usuario, productoId);
            if (existente.isPresent()) {
                CarritoItem item = existente.get();
                item.setCantidad(item.getCantidad() + cantidad);
                carritoRepository.save(item);
            } else {
                CarritoItem nuevoItem = new CarritoItem();
                nuevoItem.setUsuario(usuario);
                nuevoItem.setProducto(producto.get());
                nuevoItem.setCantidad(cantidad);
                carritoRepository.save(nuevoItem);
            }

            return ResponseEntity.ok(Map.of("message", "Producto agregado al carrito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar/{productoId}")
    public ResponseEntity<?> eliminarDelCarrito(
            Authentication authentication,
            @PathVariable Long productoId) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(404).build();
            }

            var items = carritoRepository.findByUsuarioAndProductoId(usuario, productoId);
            if (items.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Producto no encontrado en el carrito"));
            }

            carritoRepository.delete(items.get());
            return ResponseEntity.ok(Map.of("message", "Producto eliminado del carrito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/vaciar")
    public ResponseEntity<?> vaciarCarrito(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(404).build();
            }

            carritoRepository.deleteByUsuario(usuario);
            return ResponseEntity.ok(Map.of("message", "Carrito vaciado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
