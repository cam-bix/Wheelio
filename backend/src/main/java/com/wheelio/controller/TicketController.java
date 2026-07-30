package com.wheelio.controller;

import com.wheelio.dto.CreateCustomerTicketRequest;
import com.wheelio.dto.CreateTicketRequest;
import com.wheelio.dto.UpdateTicketStatusRequest;
import com.wheelio.entity.Ticket;
import com.wheelio.entity.UserRole;
import com.wheelio.service.TicketService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.wheelio.controller.AuthController.AUTHENTICATED_USER_ID;
import static com.wheelio.controller.AuthController.AUTHENTICATED_USER_ROLE;

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
            @RequestBody CreateTicketRequest request,
            HttpSession session
    ) {
        requireStaffSession(session);
        return ticketService.createTicket(request);
    }

    @PostMapping("/customer")
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createCustomerTicket(
            @RequestBody CreateCustomerTicketRequest request,
            HttpSession session
    ) {
        Long customerId = requireCustomerSession(session);

        return ticketService.createCustomerTicket(customerId, request);
    }

    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @RequestBody UpdateTicketStatusRequest request
    ) {
        return ticketService.updateTicketStatus(id, request);
    }

    private Long requireCustomerSession(HttpSession session) {
        Object userId = session.getAttribute(AUTHENTICATED_USER_ID);
        Object role = session.getAttribute(AUTHENTICATED_USER_ROLE);

        if (!(userId instanceof Long customerId)
                || role != UserRole.CUSTOMER) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You must be logged in as a customer to create a support ticket"
            );
        }

        return customerId;
    }

    private void requireStaffSession(HttpSession session) {
        Object userId = session.getAttribute(AUTHENTICATED_USER_ID);
        Object role = session.getAttribute(AUTHENTICATED_USER_ROLE);

        if (!(userId instanceof Long)
                || (role != UserRole.EMPLOYEE && role != UserRole.ADMIN)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You must be logged in as an employee to create this ticket"
            );
        }
    }
}
