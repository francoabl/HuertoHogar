package com.example.demo.controller;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.RegisterResponse;
import com.example.demo.dto.UserInfoResponse;
import com.example.demo.entity.Usuario;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Validar que las contraseñas coincidan
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("Las contraseñas no coinciden", false));
            }

            // Validar campos obligatorios
            if (registerRequest.getFirstName() == null || registerRequest.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("El nombre es obligatorio", false));
            }

            if (registerRequest.getLastName() == null || registerRequest.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("El apellido es obligatorio", false));
            }

            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("El email es obligatorio", false));
            }

            if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("La contraseña es obligatoria", false));
            }

            // Combinar nombre y apellido
            String nombreCompleto = registerRequest.getFirstName().trim() + " " + registerRequest.getLastName().trim();

            // Registrar usuario
            Usuario usuarioCreado = usuarioService.registrar(
                    nombreCompleto,
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RegisterResponse("Usuario registrado exitosamente", true));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new RegisterResponse(e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse("Error durante el registro: " + e.getMessage(), false));
        }
    }

    /**
     * POST /api/auth/login
     * Autentica al usuario y devuelve JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validar campos obligatorios
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("El email es obligatorio", false));
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("La contraseña es obligatoria", false));
            }

            // Autenticar
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generar JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);

            // Obtener información del usuario
            Usuario usuario = usuarioService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<String> roles = usuario.getRoles().stream()
                    .map(rol -> rol.getNombre())
                    .collect(Collectors.toList());

            // Separar nombre completo en firstName y lastName
            String[] nombreParts = usuario.getNombre().split(" ", 2);
            String firstName = nombreParts[0];
            String lastName = nombreParts.length > 1 ? nombreParts[1] : "";

            LoginResponse response = new LoginResponse(
                    jwt,
                    usuario.getId(),
                    firstName,
                    lastName,
                    usuario.getEmail(),
                    roles
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RegisterResponse("Email o contraseña incorrectos", false));
        }
    }

    /**
     * GET /api/auth/me
     * Devuelve la información del usuario autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new RegisterResponse("No hay usuario autenticado", false));
            }

            String email = authentication.getName();
            Usuario usuario = usuarioService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<String> roles = usuario.getRoles().stream()
                    .map(rol -> rol.getNombre())
                    .collect(Collectors.toList());

            UserInfoResponse response = new UserInfoResponse(
                    usuario.getId(),
                    usuario.getNombre(),
                    usuario.getEmail(),
                    roles
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse("Error obteniendo información del usuario: " + e.getMessage(), false));
        }
    }

    /**
     * POST /api/auth/change-password
     * Cambia la contraseña del usuario autenticado
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new RegisterResponse("No hay usuario autenticado", false));
            }

            // Validar campos
            if (changePasswordRequest.getCurrentPassword() == null || changePasswordRequest.getCurrentPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("La contraseña actual es obligatoria", false));
            }

            if (changePasswordRequest.getNewPassword() == null || changePasswordRequest.getNewPassword().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("La nueva contraseña es obligatoria", false));
            }

            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("Las nuevas contraseñas no coinciden", false));
            }

            String email = authentication.getName();
            Usuario usuario = usuarioService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Verificar que la contraseña actual es correcta
            if (!usuarioService.verificarPassword(usuario, changePasswordRequest.getCurrentPassword())) {
                return ResponseEntity.badRequest()
                        .body(new RegisterResponse("La contraseña actual es incorrecta", false));
            }

            // Cambiar contraseña
            usuarioService.cambiarPassword(usuario, changePasswordRequest.getNewPassword());

            return ResponseEntity.ok(new RegisterResponse("Contraseña cambiada exitosamente", true));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegisterResponse("Error al cambiar la contraseña: " + e.getMessage(), false));
        }
    }
}
