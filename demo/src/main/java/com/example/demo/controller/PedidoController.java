package com.example.demo.controller;

import com.example.demo.entity.Pedido;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerPedidos(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(404).build();
        }

        List<Pedido> pedidos = pedidoService.obtenerPedidosPorUsuario(usuario.getId());
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/desde-carrito")
    public ResponseEntity<?> crearPedidoDesdeCarrito(Authentication authentication) {
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

            Pedido pedido = pedidoService.crearPedidoDesdeCarrito(usuario.getId());
            return ResponseEntity.ok(pedido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(
            Authentication authentication,
            @PathVariable String id) {
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

            var pedido = pedidoService.obtenerPedidoPorId(id);
            if (pedido.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que el usuario sea el dueño del pedido
            if (!pedido.get().getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(403).build();
            }

            return ResponseEntity.ok(pedido.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }

            // Solo admins pueden cambiar estado
            if (!authentication.getAuthorities().stream()
                    .anyMatch(g -> g.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(403).build();
            }

            String nuevoEstado = request.get("estado");
            Pedido pedido = pedidoService.actualizarEstado(id, nuevoEstado);

            return ResponseEntity.ok(pedido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/confirmar-pago")
    public ResponseEntity<?> confirmarPago(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody Map<String, Object> paymentData) {
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

            var pedido = pedidoService.obtenerPedidoPorId(id);
            if (pedido.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que el usuario sea el dueño del pedido
            if (!pedido.get().getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(403).build();
            }

            // Confirmar pago con información de Transbank
            Pedido pedidoConfirmado = pedidoService.confirmarPago(
                    id,
                    (String) paymentData.get("numeroOrden"),
                    (String) paymentData.get("codigoAutorizacion"),
                    (String) paymentData.get("codigoRespuesta"),
                    (String) paymentData.get("detallesTarjeta"),
                    (String) paymentData.get("tipoTarjeta"),
                    (Integer) paymentData.get("cuotas")
            );

            return ResponseEntity.ok(pedidoConfirmado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarPedido(
            Authentication authentication,
            @PathVariable String id) {
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

            var pedido = pedidoService.obtenerPedidoPorId(id);
            if (pedido.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que el usuario sea el dueño del pedido o admin
            if (!pedido.get().getUsuario().getId().equals(usuario.getId()) &&
                !authentication.getAuthorities().stream()
                        .anyMatch(g -> g.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(403).build();
            }

            pedidoService.actualizarEstado(id, "CANCELADO");
            return ResponseEntity.ok(Map.of("message", "Pedido cancelado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
