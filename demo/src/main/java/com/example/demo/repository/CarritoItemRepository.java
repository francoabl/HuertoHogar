package com.example.demo.repository;

import com.example.demo.entity.CarritoItem;
import com.example.demo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuario(Usuario usuario);
    Optional<CarritoItem> findByUsuarioAndProductoId(Usuario usuario, Long productoId);
    void deleteByUsuario(Usuario usuario);
}
