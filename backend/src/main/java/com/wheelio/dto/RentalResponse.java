package com.wheelio.dto;

import com.wheelio.entity.RentalStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class RentalResponse {

    private Long rentalId;

    private Long userId;
    private String customerName;

    private Long vehicleId;
    private String vehicleName;

    private OffsetDateTime pickupDate;
    private OffsetDateTime returnDate;

    private RentalStatus status;
    private BigDecimal totalCost;
    private OffsetDateTime createdAt;

    public RentalResponse() {
    }

    public RentalResponse(
            Long rentalId,
            Long userId,
            String customerName,
            Long vehicleId,
            String vehicleName,
            OffsetDateTime pickupDate,
            OffsetDateTime returnDate,
            RentalStatus status,
            BigDecimal totalCost,
            OffsetDateTime createdAt
    ) {
        this.rentalId = rentalId;
        this.userId = userId;
        this.customerName = customerName;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.pickupDate = pickupDate;
        this.returnDate = returnDate;
        this.status = status;
        this.totalCost = totalCost;
        this.createdAt = createdAt;
    }

    public Long getRentalId() {
        return rentalId;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public OffsetDateTime getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(OffsetDateTime pickupDate) {
        this.pickupDate = pickupDate;
    }

    public OffsetDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(OffsetDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public RentalStatus getStatus() {
        return status;
    }

    public void setStatus(RentalStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}