package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "pedidos")
public class Pedido {
    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    private List<PedidoItem> items = new ArrayList<>();

    private BigDecimal total;

    private LocalDateTime fecha;

    private String estado; // PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO
    
    // Información de pago Transbank
    private String metodoPago; // "Webpay Plus", "Efectivo", etc.
    private String numeroOrden; // buyOrder de Transbank
    private String codigoAutorizacion; // authorizationCode de Transbank
    private String codigoRespuesta; // responseCode de Transbank
    private LocalDateTime fechaPago;
    private String detallesTarjeta; // Últimos 4 dígitos de la tarjeta
    private String tipoTarjeta; // "CREDIT", "DEBIT"
    private Integer cuotas; // Número de cuotas

    public Pedido() {
        this.fecha = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    public Pedido(Usuario usuario, BigDecimal total) {
        this();
        this.usuario = usuario;
        this.total = total;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<PedidoItem> getItems() {
        return items;
    }

    public void setItems(List<PedidoItem> items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public String getCodigoAutorizacion() {
        return codigoAutorizacion;
    }

    public void setCodigoAutorizacion(String codigoAutorizacion) {
        this.codigoAutorizacion = codigoAutorizacion;
    }

    public String getCodigoRespuesta() {
        return codigoRespuesta;
    }

    public void setCodigoRespuesta(String codigoRespuesta) {
        this.codigoRespuesta = codigoRespuesta;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getDetallesTarjeta() {
        return detallesTarjeta;
    }

    public void setDetallesTarjeta(String detallesTarjeta) {
        this.detallesTarjeta = detallesTarjeta;
    }

    public String getTipoTarjeta() {
        return tipoTarjeta;
    }

    public void setTipoTarjeta(String tipoTarjeta) {
        this.tipoTarjeta = tipoTarjeta;
    }

    public Integer getCuotas() {
        return cuotas;
    }

    public void setCuotas(Integer cuotas) {
        this.cuotas = cuotas;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                "id=" + id +
                ", total=" + total +
                ", fecha=" + fecha +
                ", estado='" + estado + '\'' +
                '}';
    }
}
