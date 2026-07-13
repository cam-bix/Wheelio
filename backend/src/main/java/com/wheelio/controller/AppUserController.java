package com.wheelio.controller;

import com.wheelio.dto.RentalResponse;
import com.wheelio.entity.AppUser;
import com.wheelio.service.AppUserService;
import org.springframework.web.bind.annotation.*;
import com.wheelio.service.RentalService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService appUserService;
    private final RentalService rentalService;

    public AppUserController(AppUserService appUserService, RentalService rentalService) {
        this.appUserService = appUserService;
        this.rentalService = rentalService;
    }

    @GetMapping
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }

    @GetMapping("/{id}")
    public AppUser getUserById(@PathVariable Long id) {
        return appUserService.getUserById(id);
    }

    @PostMapping
    public AppUser createUser(@RequestBody AppUser user) {
        return appUserService.createUser(user);
    }

    @PutMapping("/{id}")
    public AppUser updateUser(@PathVariable Long id, @RequestBody AppUser user) {
        return appUserService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        appUserService.deleteUser(id);
    }

    @GetMapping("/{id}/rentals/active")
    public List<RentalResponse> getActiveRentalsForUser(@PathVariable Long id) {
        return rentalService.getActiveRentalsForUser(id);
    }
}