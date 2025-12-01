package com.example.demo.dto;

import java.util.List;

public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private UserData user;

    public static class UserData {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private List<String> roles;

        public UserData() {
        }

        public UserData(String id, String firstName, String lastName, String email, List<String> roles) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.roles = roles;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
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

    public LoginResponse() {
    }

    public LoginResponse(String token, String id, String firstName, String lastName, String email, List<String> roles) {
        this.token = token;
        this.user = new UserData(id, firstName, lastName, email, roles);
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UserData getUser() {
        return user;
    }

    public void setUser(UserData user) {
        this.user = user;
    }
}
