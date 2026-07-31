package com.wheelio.service;

import com.wheelio.dto.CreateCustomerTicketRequest;
import com.wheelio.dto.CreateTicketRequest;
import com.wheelio.entity.AppUser;
import com.wheelio.entity.Rental;
import com.wheelio.entity.Ticket;
import com.wheelio.entity.TicketPriority;
import com.wheelio.repository.AppUserRepository;
import com.wheelio.repository.RentalRepository;
import com.wheelio.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private RentalRepository rentalRepository;

    private TicketService ticketService;

    @BeforeEach
    void setUp() {
        ticketService = new TicketService(
                ticketRepository,
                appUserRepository,
                rentalRepository
        );
    }

    @Test
    void customerIdIsRequired() {
        CreateTicketRequest request = new CreateTicketRequest();
        request.setSubject("Question");
        request.setDescription("Please help.");

        assertThatThrownBy(() -> ticketService.createTicket(request))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode())
                                .isEqualTo(HttpStatus.BAD_REQUEST)
                );
    }

    @Test
    void customerTicketUsesAuthenticatedCustomerId() {
        CreateCustomerTicketRequest request =
                new CreateCustomerTicketRequest();
        request.setSubject("Billing question");
        request.setDescription("Please review my charge.");
        request.setPriority(TicketPriority.NORMAL);

        when(appUserRepository.existsById(42L)).thenReturn(true);
        when(ticketRepository.findRandomActiveEmployeeId())
                .thenReturn(Optional.of(3L));
        when(ticketRepository.save(any(Ticket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Ticket ticket = ticketService.createCustomerTicket(42L, request);

        assertThat(ticket.getCustomerId()).isEqualTo(42L);
        assertThat(ticket.getCreatedByEmployeeId()).isEqualTo(3L);
    }

    @Test
    void customerTicketRequiresAnActiveEmployee() {
        CreateCustomerTicketRequest request =
                new CreateCustomerTicketRequest();
        request.setSubject("Billing question");
        request.setDescription("Please review my charge.");

        when(ticketRepository.findRandomActiveEmployeeId())
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> ticketService.createCustomerTicket(42L, request)
        ).isInstanceOfSatisfying(
                ResponseStatusException.class,
                exception -> assertThat(exception.getStatusCode())
                        .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE)
        );
    }

    @Test
    void rentalMustBelongToCustomer() {
        CreateCustomerTicketRequest request =
                new CreateCustomerTicketRequest();
        request.setRentalId(7L);
        request.setSubject("Rental question");
        request.setDescription("Please review this rental.");

        AppUser otherCustomer = new AppUser();
        otherCustomer.setUserId(99L);

        Rental rental = new Rental();
        rental.setUser(otherCustomer);

        when(ticketRepository.findRandomActiveEmployeeId())
                .thenReturn(Optional.of(3L));
        when(appUserRepository.existsById(42L)).thenReturn(true);
        when(rentalRepository.findById(7L))
                .thenReturn(Optional.of(rental));

        assertThatThrownBy(
                () -> ticketService.createCustomerTicket(42L, request)
        ).isInstanceOfSatisfying(
                ResponseStatusException.class,
                exception -> assertThat(exception.getStatusCode())
                        .isEqualTo(HttpStatus.BAD_REQUEST)
        );
    }
}
