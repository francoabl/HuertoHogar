package com.example.demo.entity;

import org.springframework.data.mongodb.core.mapping.DBRef;
import java.math.BigDecimal;

public class PedidoItem {
    @DBRef
    private Producto producto;

    private Integer cantidad;

    private BigDecimal precioUnitario;

    public PedidoItem() {
    }

    public PedidoItem(Producto producto, Integer cantidad, BigDecimal precioUnitario) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return precioUnitario.multiply(new BigDecimal(cantidad));
    }

    @Override
    public String toString() {
        return "PedidoItem{" +
                "cantidad=" + cantidad +
                ", precioUnitario=" + precioUnitario +
                '}';
    }
}
