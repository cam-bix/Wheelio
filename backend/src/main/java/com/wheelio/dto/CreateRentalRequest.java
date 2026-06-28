package com.wheelio.dto;

import java.time.OffsetDateTime;

public class CreateRentalRequest {

    private Long userId;
    private Long vehicleId;
    private OffsetDateTime pickupDate;
    private OffsetDateTime returnDate;

    public Long getUserId() {
        return userId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public OffsetDateTime getPickupDate() {
        return pickupDate;
    }

    public OffsetDateTime getReturnDate() {
        return returnDate;
    }
}