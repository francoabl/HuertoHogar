package com.example.demo.dto;

import java.util.List;

public class UserInfoResponse {
    private String id;
    private String nombre;
    private String email;
    private List<String> roles;

    public UserInfoResponse() {
    }

    public UserInfoResponse(String id, String nombre, String email, List<String> roles) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.roles = roles;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
