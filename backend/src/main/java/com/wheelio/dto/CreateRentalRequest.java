package com.wheelio.dto;

import java.time.OffsetDateTime;

public class CreateRentalRequest {

    private Long userId;
    private Long vehicleId;
    private Long pickupLocationId;
    private Long returnLocationId;
    private OffsetDateTime pickupDate;
    private OffsetDateTime returnDate;

    public Long getUserId() {
        return userId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public Long getPickupLocationId() {
        return pickupLocationId;
    }

    public Long getReturnLocationId() {
        return returnLocationId;
    }

    public OffsetDateTime getPickupDate() {
        return pickupDate;
    }

    public OffsetDateTime getReturnDate() {
        return returnDate;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setPickupLocationId(Long pickupLocationId) {
        this.pickupLocationId = pickupLocationId;
    }

    public void setReturnLocationId(Long returnLocationId) {
        this.returnLocationId = returnLocationId;
    }

    public void setPickupDate(OffsetDateTime pickupDate) {
        this.pickupDate = pickupDate;
    }

    public void setReturnDate(OffsetDateTime returnDate) {
        this.returnDate = returnDate;
    }
}
