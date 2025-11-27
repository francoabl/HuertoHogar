package com.example.demo.service;

import com.example.demo.entity.Usuario;
import com.example.demo.entity.Rol;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario con validación de email único
     */
    public Usuario registrar(String nombre, String email, String password) {
        // Validar que email no exista
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El email " + email + " ya está registrado");
        }

        // Validar campos obligatorios
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre.trim());
        usuario.setEmail(email.trim());
        usuario.setPassword(passwordEncoder.encode(password));

        // Asignar rol de cliente por defecto
        Optional<Rol> rolCliente = rolRepository.findByNombre("ROLE_CLIENTE");
        if (rolCliente.isPresent()) {
            usuario.getRoles().add(rolCliente.get());
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * Busca un usuario por email
     */
    public Optional<Usuario> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío");
        }
        return usuarioRepository.findByEmail(email.trim());
    }

    /**
     * Obtiene un usuario por ID
     */
    public Optional<Usuario> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        return usuarioRepository.findById(id);
    }

    /**
     * Asigna un rol a un usuario
     */
    public Usuario asignarRol(Long usuarioId, String nombreRol) {
        if (usuarioId == null || usuarioId <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }
        if (nombreRol == null || nombreRol.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del rol es obligatorio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + usuarioId));

        Rol rol = rolRepository.findByNombre(nombreRol.trim())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + nombreRol));

        usuario.getRoles().add(rol);
        return usuarioRepository.save(usuario);
    }

    /**
     * Obtiene todos los usuarios
     */
    public java.util.List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    /**
     * Elimina un usuario por ID
     */
    public void eliminar(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID inválido");
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Verifica si la contraseña actual es correcta
     */
    public boolean verificarPassword(Usuario usuario, String passwordIngresada) {
        if (usuario == null || passwordIngresada == null) {
            return false;
        }
        return passwordEncoder.matches(passwordIngresada, usuario.getPassword());
    }

    /**
     * Cambia la contraseña de un usuario
     */
    public Usuario cambiarPassword(Usuario usuario, String nuevaPassword) {
        if (usuario == null || nuevaPassword == null || nuevaPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Datos inválidos para cambiar contraseña");
        }
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        return usuarioRepository.save(usuario);
    }
}
