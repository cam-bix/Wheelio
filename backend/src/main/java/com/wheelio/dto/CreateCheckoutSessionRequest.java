package com.wheelio.dto;

import jakarta.validation.constraints.NotNull;

public class CreateCheckoutSessionRequest {

    @NotNull
    private Long vehicleId;

    @NotNull
    private Integer days;

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }
}
