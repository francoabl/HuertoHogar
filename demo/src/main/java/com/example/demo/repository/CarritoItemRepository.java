package com.example.demo.repository;

import com.example.demo.entity.CarritoItem;
import com.example.demo.entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoItemRepository extends MongoRepository<CarritoItem, String> {
    List<CarritoItem> findByUsuario(Usuario usuario);
    Optional<CarritoItem> findByUsuarioAndProductoId(Usuario usuario, String productoId);
    void deleteByUsuario(Usuario usuario);
}
