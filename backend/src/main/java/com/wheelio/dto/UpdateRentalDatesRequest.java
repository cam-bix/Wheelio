package com.wheelio.dto;

import java.time.OffsetDateTime;

public class UpdateRentalDatesRequest {

    private OffsetDateTime pickupDate;
    private OffsetDateTime returnDate;

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
}
