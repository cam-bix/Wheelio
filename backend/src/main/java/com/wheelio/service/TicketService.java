package com.wheelio.service;

import com.wheelio.dto.CreateTicketRequest;
import com.wheelio.dto.UpdateTicketStatusRequest;
import com.wheelio.entity.Ticket;
import com.wheelio.entity.TicketPriority;
import com.wheelio.entity.TicketStatus;
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

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
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
        if (request.getCreatedByEmployeeId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Employee ID is required"
            );
        }

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
}
