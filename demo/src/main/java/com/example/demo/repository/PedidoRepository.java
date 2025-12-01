package com.example.demo.repository;

import com.example.demo.entity.Pedido;
import com.example.demo.entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends MongoRepository<Pedido, String> {
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByUsuarioAndEstado(Usuario usuario, String estado);
}
