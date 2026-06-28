package com.wheelio.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "rental")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_id")
    private Long rentalId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "pickup_date", nullable = false)
    private OffsetDateTime pickupDate;

    @Column(name = "return_date", nullable = false)
    private OffsetDateTime returnDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private RentalStatus status;

    @Column(name = "total_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    // Public Constructor
    public Rental() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    // getters and setters
    public Long getRentalId() {
        return rentalId;
    }

    public AppUser getUser() {
        return user;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public OffsetDateTime getPickupDate() {
        return pickupDate;
    }

    public OffsetDateTime getReturnDate() {
        return returnDate;
    }

    public RentalStatus getStatus() {
        return status;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public void setPickupDate(OffsetDateTime pickupDate) {
        this.pickupDate = pickupDate;
    }

    public void setReturnDate(OffsetDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public void setStatus(RentalStatus status) {
        this.status = status;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}