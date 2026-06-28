package com.wheelio.service;

import com.wheelio.entity.AppUser;
import com.wheelio.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUserById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AppUser createUser(AppUser user) {
        return appUserRepository.save(user);
    }

    public AppUser updateUser(Long id, AppUser updatedUser) {
        AppUser user = getUserById(id);

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPasswordHash(updatedUser.getPasswordHash());
        user.setPhone(updatedUser.getPhone());
        user.setRole(updatedUser.getRole());

        return appUserRepository.save(user);
    }

    public void deleteUser(Long id) {
        AppUser user = getUserById(id);
        appUserRepository.delete(user);
    }
}