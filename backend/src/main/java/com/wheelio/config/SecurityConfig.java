package com.wheelio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
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

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/api/**",
                configuration
        );

        return source;
    }

    @Bean
    @Profile("dev")
    UserDetailsService developmentUser(
            @Value("${DEV_SECURITY_USERNAME:wheelio-admin}") String username,
            @Value("${DEV_SECURITY_PASSWORD}") String rawPassword,
            PasswordEncoder passwordEncoder) {

        UserDetails admin = User.withUsername(username)
                .password(passwordEncoder.encode(rawPassword))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }
}