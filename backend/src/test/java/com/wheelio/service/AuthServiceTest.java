package com.wheelio.service;

import com.wheelio.dto.AuthResponse;
import com.wheelio.dto.LoginRequest;
import com.wheelio.dto.RegisterRequest;
import com.wheelio.entity.AppUser;
import com.wheelio.entity.UserRole;
import com.wheelio.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private EmailTwoFactorService emailTwoFactorService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void registerHashesPasswordAndCreatesCustomer() {
        AuthService authService = new AuthService(appUserRepository, passwordEncoder, emailTwoFactorService);

        RegisterRequest request = new RegisterRequest();
        request.setFirstName(" Sam ");
        request.setLastName(" Driver ");
        request.setEmail("SAM@Example.com ");
        request.setPassword("password123");
        request.setPhone(" 555-1234 ");

        when(appUserRepository.findByEmail("sam@example.com")).thenReturn(Optional.empty());
        when(appUserRepository.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            user.setUserId(42L);
            return user;
        });

        AuthResponse response = authService.register(request);

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(userCaptor.capture());
        AppUser savedUser = userCaptor.getValue();

        assertThat(savedUser.getFirstName()).isEqualTo("Sam");
        assertThat(savedUser.getLastName()).isEqualTo("Driver");
        assertThat(savedUser.getEmail()).isEqualTo("sam@example.com");
        assertThat(savedUser.getPhone()).isEqualTo("555-1234");
        assertThat(savedUser.getRole()).isEqualTo(UserRole.CUSTOMER);
        assertThat(savedUser.getPasswordHash()).isNotEqualTo("password123");
        assertThat(passwordEncoder.matches("password123", savedUser.getPasswordHash())).isTrue();
        assertThat(response.getUserId()).isEqualTo(42L);
        assertThat(response.getMessage()).isEqualTo("Registration successful");
    }

    @Test
    void registerRejectsDuplicateEmail() {
        AuthService authService = new AuthService(appUserRepository, passwordEncoder, emailTwoFactorService);

        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Sam");
        request.setLastName("Driver");
        request.setEmail("sam@example.com");
        request.setPassword("password123");

        when(appUserRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(new AppUser()));

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("409 CONFLICT");
    }

    @Test
    void loginSendsVerificationCodeWhenPasswordMatches() {
        AuthService authService = new AuthService(appUserRepository, passwordEncoder, emailTwoFactorService);

        AppUser user = new AppUser();
        user.setUserId(7L);
        user.setFirstName("Sam");
        user.setLastName("Driver");
        user.setEmail("sam@example.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setRole(UserRole.CUSTOMER);

        LoginRequest request = new LoginRequest();
        request.setEmail("SAM@example.com");
        request.setPassword("password123");

        when(appUserRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(request);

        verify(emailTwoFactorService).sendLoginCode(user);
        assertThat(response.isTwoFactorRequired()).isTrue();
        assertThat(response.getUserId()).isNull();
        assertThat(response.getEmail()).isEqualTo("sam@example.com");
        assertThat(response.getMessage()).isEqualTo("Verification code sent");
    }

    @Test
    void loginRejectsInvalidPassword() {
        AuthService authService = new AuthService(appUserRepository, passwordEncoder, emailTwoFactorService);

        AppUser user = new AppUser();
        user.setEmail("sam@example.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));

        LoginRequest request = new LoginRequest();
        request.setEmail("sam@example.com");
        request.setPassword("wrong-password");

        when(appUserRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("401 UNAUTHORIZED");
    }

    @Test
    void verifyTwoFactorLoginReturnsUserWhenCodeMatches() {
        AuthService authService = new AuthService(appUserRepository, passwordEncoder, emailTwoFactorService);

        AppUser user = new AppUser();
        user.setUserId(7L);
        user.setFirstName("Sam");
        user.setLastName("Driver");
        user.setEmail("sam@example.com");
        user.setRole(UserRole.CUSTOMER);

        com.wheelio.dto.VerifyTwoFactorRequest request = new com.wheelio.dto.VerifyTwoFactorRequest();
        request.setEmail("SAM@example.com");
        request.setCode("123456");

        when(appUserRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.verifyTwoFactorLogin(request);

        verify(emailTwoFactorService).verifyLoginCode(user, "123456");
        assertThat(response.getUserId()).isEqualTo(7L);
        assertThat(response.getEmail()).isEqualTo("sam@example.com");
        assertThat(response.getMessage()).isEqualTo("Login successful");
        assertThat(response.isTwoFactorRequired()).isFalse();
    }
}
