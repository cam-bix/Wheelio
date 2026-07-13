package com.wheelio.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "make", nullable = false, length = 50)
    private String make;

    @Column(name = "model", nullable = false, length = 50)
    private String model;

    @Column(name = "year", nullable = false)
    private Short year;

    @Column(name = "license_plate", nullable = false, unique = true, length = 15)
    private String licensePlate;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "location_id", nullable = false)
    private Long locationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private VehicleStatus status;

    // Public Constructor
    public Vehicle() {
    }

    // getters and setters
    public Long getVehicleId() {
        return vehicleId;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public Short getYear() {
        return year;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public BigDecimal getDailyRate() {
        return dailyRate;
    }

    public Long getLocationId() {
        return locationId;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(Short year) {
        this.year = year;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public void setDailyRate(BigDecimal dailyRate) {
        this.dailyRate = dailyRate;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }
}
