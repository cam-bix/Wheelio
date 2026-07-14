package com.wheelio.controller;

import com.wheelio.dto.AuthResponse;
import com.wheelio.dto.LoginRequest;
import com.wheelio.dto.RegisterRequest;
import com.wheelio.dto.VerifyTwoFactorRequest;
import com.wheelio.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/verify-2fa")
    public AuthResponse verifyTwoFactorLogin(@Valid @RequestBody VerifyTwoFactorRequest request) {
        return authService.verifyTwoFactorLogin(request);
    }
}
