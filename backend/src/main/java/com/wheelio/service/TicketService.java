package com.wheelio.service;

import com.wheelio.dto.CreateTicketRequest;
import com.wheelio.dto.CreateCustomerTicketRequest;
import com.wheelio.dto.UpdateTicketStatusRequest;
import com.wheelio.entity.Rental;
import com.wheelio.entity.Ticket;
import com.wheelio.entity.TicketPriority;
import com.wheelio.entity.TicketStatus;
import com.wheelio.repository.AppUserRepository;
import com.wheelio.repository.RentalRepository;
import com.wheelio.repository.TicketRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;
    private final RentalRepository rentalRepository;

    public TicketService(
            TicketRepository ticketRepository,
            AppUserRepository appUserRepository,
            RentalRepository rentalRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.appUserRepository = appUserRepository;
        this.rentalRepository = rentalRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    private Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ticket not found"
                ));
    }

    @Transactional
    public Ticket createTicket(CreateTicketRequest request) {
        if (request.getCustomerId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Customer ID is required"
            );
        }

        validateCustomerAndRental(
                request.getCustomerId(),
                request.getRentalId()
        );

        if (request.getSubject() == null || request.getSubject().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subject is required"
            );
        }

        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Description is required"
            );
        }

        if (request.getSubject().trim().length() > 150) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subject cannot exceed 150 characters"
            );
        }

        Ticket ticket = new Ticket();

        ticket.setCreatedByEmployeeId(request.getCreatedByEmployeeId());
        ticket.setCustomerId(request.getCustomerId());
        ticket.setRentalId(request.getRentalId());
        ticket.setSubject(request.getSubject().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setPriority(
                request.getPriority() == null
                        ? TicketPriority.NORMAL
                        : request.getPriority()
        );
        ticket.setCreatedAt(OffsetDateTime.now());

        return ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket createCustomerTicket(
            Long customerId,
            CreateCustomerTicketRequest request
    ) {
        Long employeeId = ticketRepository.findRandomActiveEmployeeId()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "No active employee is available to receive this ticket"
                ));

        CreateTicketRequest ticketRequest = new CreateTicketRequest();
        ticketRequest.setCreatedByEmployeeId(employeeId);
        ticketRequest.setCustomerId(customerId);
        ticketRequest.setRentalId(request.getRentalId());
        ticketRequest.setSubject(request.getSubject());
        ticketRequest.setDescription(request.getDescription());
        ticketRequest.setPriority(request.getPriority());
        return createTicket(ticketRequest);
    }

    @Transactional
    public Ticket updateTicketStatus(
            Long id,
            UpdateTicketStatusRequest request
    ) {
        if (request.getStatus() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status is required"
            );
        }

        Ticket ticket = getTicketById(id);
        ticket.setStatus(request.getStatus());

        return ticketRepository.save(ticket);
    }

    private void validateCustomerAndRental(
            Long customerId,
            Long rentalId
    ) {
        if (!appUserRepository.existsById(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Customer not found"
            );
        }

        if (rentalId == null) {
            return;
        }

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Rental not found"
                ));

        if (!rental.getUser().getUserId().equals(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Rental does not belong to this customer"
            );
        }
    }
}
