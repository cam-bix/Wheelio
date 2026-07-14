package com.wheelio.dto;

import com.wheelio.entity.UserRole;

public class AuthResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role;
    private String message;
    private boolean twoFactorRequired;

    public AuthResponse() {
    }

    public AuthResponse(
            Long userId,
            String firstName,
            String lastName,
            String email,
            String phone,
            UserRole role,
            String message
    ) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.message = message;
    }

    public AuthResponse(
            Long userId,
            String firstName,
            String lastName,
            String email,
            String phone,
            UserRole role,
            String message,
            boolean twoFactorRequired
    ) {
        this(userId, firstName, lastName, email, phone, role, message);
        this.twoFactorRequired = twoFactorRequired;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isTwoFactorRequired() {
        return twoFactorRequired;
    }

    public void setTwoFactorRequired(boolean twoFactorRequired) {
        this.twoFactorRequired = twoFactorRequired;
    }
}
