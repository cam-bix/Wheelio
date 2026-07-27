package com.wheelio.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "created_by_employee_id", nullable = false)
    private Long createdByEmployeeId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "rental_id")
    private Long rentalId;

    @Column(name = "subject", nullable = false, length = 150)
    private String subject;

    @Column(name = "description", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private TicketPriority priority;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    public Ticket() {
    }

    public Long getTicketId() {
        return ticketId;
    }

    public Long getCreatedByEmployeeId() {
        return createdByEmployeeId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getRentalId() {
        return rentalId;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public void setCreatedByEmployeeId(Long createdByEmployeeId) {
        this.createdByEmployeeId = createdByEmployeeId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setRentalId(Long rentalId) {
        this.rentalId = rentalId;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
