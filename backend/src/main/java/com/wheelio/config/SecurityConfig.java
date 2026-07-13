package com.wheelio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/health",
                                "/actuator/health",
                                "/api/vehicles",
                                "/api/vehicles/**",
                                "/api/users",
                                "/api/users/**",
                                "/api/rentals",
                                "/api/rentals/**",
                                "/api/checkout/**"
                        )
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}
