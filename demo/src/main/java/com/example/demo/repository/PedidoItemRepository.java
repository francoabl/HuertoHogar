package com.example.demo.repository;

// PedidoItem ya no necesita repositorio en MongoDB porque está embebido en Pedido
// Este repositorio se mantiene por compatibilidad pero no se usa

import org.springframework.stereotype.Repository;

@Repository
public interface PedidoItemRepository {
}
