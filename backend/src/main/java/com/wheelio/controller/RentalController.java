package com.wheelio.controller;

import com.wheelio.dto.CreateRentalRequest;
import com.wheelio.dto.RentalResponse;
import com.wheelio.dto.UpdateRentalDatesRequest;
import com.wheelio.service.RentalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public List<RentalResponse> getAllRentals() {
        return rentalService.getAllRentals();
    }

    @GetMapping("/{id}")
    public RentalResponse getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id);
    }

    @PostMapping
    public RentalResponse createRental(@RequestBody CreateRentalRequest request) {
        return rentalService.createRental(request);
    }

    @PatchMapping("/{id}/complete")
    public RentalResponse completeRental(@PathVariable Long id) {
        return rentalService.completeRental(id);
    }

    @PatchMapping("/{id}/cancel")
    public RentalResponse cancelRental(@PathVariable Long id) {
        return rentalService.cancelRental(id);
    }

    @PatchMapping("/{id}")
    public RentalResponse updateRentalDates(
            @PathVariable Long id,
            @RequestBody UpdateRentalDatesRequest request
    ) {
        return rentalService.updateRentalDates(id, request);
    }
}
