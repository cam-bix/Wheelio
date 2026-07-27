package com.wheelio.dto;

import com.wheelio.entity.TicketStatus;

public class UpdateTicketStatusRequest {

    private TicketStatus status;

    public UpdateTicketStatusRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}
