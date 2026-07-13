package com.wheelio.service;

import com.wheelio.dto.CreateRentalRequest;
import com.wheelio.dto.RentalResponse;
import com.wheelio.entity.*;
import com.wheelio.repository.AppUserRepository;
import com.wheelio.repository.RentalRepository;
import com.wheelio.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final AppUserRepository appUserRepository;
    private final VehicleRepository vehicleRepository;

    public RentalService(
            RentalRepository rentalRepository,
            AppUserRepository appUserRepository,
            VehicleRepository vehicleRepository
    ) {
        this.rentalRepository = rentalRepository;
        this.appUserRepository = appUserRepository;
        this.vehicleRepository = vehicleRepository;
    }

    private Rental getRentalEntityById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    private RentalResponse toResponse(Rental rental) {
        return new RentalResponse(
                rental.getRentalId(),
                rental.getUser().getUserId(),
                rental.getUser().getFirstName() + " " + rental.getUser().getLastName(),
                rental.getVehicle().getVehicleId(),
                rental.getVehicle().getYear() + " "
                        + rental.getVehicle().getMake() + " "
                        + rental.getVehicle().getModel(),
                rental.getPickupDate(),
                rental.getReturnDate(),
                rental.getStatus(),
                rental.getTotalCost(),
                rental.getCreatedAt()
        );
    }

    public List<RentalResponse> getAllRentals() {
        return rentalRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RentalResponse> getActiveRentalsForUser(Long userId) {
        return rentalRepository
                .findByUserUserIdAndStatusOrderByPickupDateAsc(userId, RentalStatus.BOOKED)                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RentalResponse getRentalById(Long id) {
        Rental rental = getRentalEntityById(id);
        return toResponse(rental);
    }

    @Transactional
    public RentalResponse createRental(CreateRentalRequest request) {
        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vehicle is not available");
        }

        if (request.getPickupLocationId() == null || request.getReturnLocationId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pickup and return locations are required"
            );
        }

        if (!request.getReturnDate().isAfter(request.getPickupDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Return date must be after pickup date");
        }

        long days = Math.max(1, Duration.between(
                request.getPickupDate(),
                request.getReturnDate()
        ).toDays());

        BigDecimal totalCost = vehicle.getDailyRate()
                .multiply(BigDecimal.valueOf(days));

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setVehicle(vehicle);
        rental.setPickupLocationId(request.getPickupLocationId());
        rental.setReturnLocationId(request.getReturnLocationId());
        rental.setPickupDate(request.getPickupDate());
        rental.setReturnDate(request.getReturnDate());
        rental.setStatus(RentalStatus.BOOKED);
        rental.setTotalCost(totalCost);

        vehicle.setStatus(VehicleStatus.RENTED);
        vehicleRepository.save(vehicle);

        Rental savedRental = rentalRepository.save(rental);
        return toResponse(savedRental);
    }

    @Transactional
    public RentalResponse completeRental(Long id) {
        Rental rental = getRentalEntityById(id);

        rental.setStatus(RentalStatus.COMPLETED);

        Vehicle vehicle = rental.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        Rental savedRental = rentalRepository.save(rental);
        return toResponse(savedRental);
    }

    @Transactional
    public RentalResponse cancelRental(Long id) {
        Rental rental = getRentalEntityById(id);

        rental.setStatus(RentalStatus.CANCELLED);

        Vehicle vehicle = rental.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        Rental savedRental = rentalRepository.save(rental);
        return toResponse(savedRental);
    }
}
