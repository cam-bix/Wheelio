package com.wheelio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth

                        // Only employees and admins can modify vehicle images
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/vehicles/*/image"
                        )
                        .hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/vehicles/*/image"
                        )
                        .hasAnyRole("ADMIN", "EMPLOYEE")

                        // Vehicle information and images can be viewed publicly
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/vehicles",
                                "/api/vehicles/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/verify-2fa",
                                "/api/health",
                                "/actuator/health",
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