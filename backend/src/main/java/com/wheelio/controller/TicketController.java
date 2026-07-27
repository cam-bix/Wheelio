package com.wheelio.controller;

import com.wheelio.dto.CreateTicketRequest;
import com.wheelio.dto.UpdateTicketStatusRequest;
import com.wheelio.entity.Ticket;
import com.wheelio.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createTicket(
            @RequestBody CreateTicketRequest request
    ) {
        return ticketService.createTicket(request);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @RequestBody UpdateTicketStatusRequest request
    ) {
        return ticketService.updateTicketStatus(id, request);
    }
}
