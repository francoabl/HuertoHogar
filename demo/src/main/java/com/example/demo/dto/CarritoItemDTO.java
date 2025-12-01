package com.example.demo.dto;

import com.example.demo.entity.CarritoItem;
import java.math.BigDecimal;

public class CarritoItemDTO {
    private String id;
    private String nombre;
    private BigDecimal precio;
    private String imagenUrl;
    private String categoria;
    private Integer quantity;
    private BigDecimal subtotal;

    public CarritoItemDTO() {
    }

    public CarritoItemDTO(CarritoItem item) {
        if (item != null && item.getProducto() != null) {
            this.id = item.getProducto().getId();
            this.nombre = item.getProducto().getNombre();
            this.precio = item.getProducto().getPrecio();
            this.imagenUrl = item.getProducto().getImagenUrl();
            this.categoria = item.getProducto().getCategoria();
            this.quantity = item.getCantidad();
            this.subtotal = item.getSubtotal();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
