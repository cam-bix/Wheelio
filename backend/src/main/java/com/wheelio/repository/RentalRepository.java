package com.wheelio.repository;

import com.wheelio.entity.AppUser;
import com.wheelio.entity.Rental;
import com.wheelio.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUser(AppUser user);
    List<Rental> findByVehicle(Vehicle vehicle);
}