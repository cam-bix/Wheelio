package com.wheelio.controller;

import com.wheelio.dto.AuthResponse;
import com.wheelio.dto.RentalResponse;
import com.wheelio.entity.AppUser;
import com.wheelio.entity.RentalStatus;
import com.wheelio.entity.Ticket;
import com.wheelio.entity.TicketPriority;
import com.wheelio.entity.TicketStatus;
import com.wheelio.entity.UserRole;
import com.wheelio.entity.Vehicle;
import com.wheelio.entity.VehicleStatus;
import com.wheelio.service.AppUserService;
import com.wheelio.service.AuthService;
import com.wheelio.service.RentalService;
import com.wheelio.service.TicketService;
import com.wheelio.service.VehicleImageService;
import com.wheelio.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HttpEndpointSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private VehicleImageService vehicleImageService;

    @MockBean
    private AppUserService appUserService;

    @MockBean
    private RentalService rentalService;

    @MockBean
    private AuthService authService;

    @MockBean
    private TicketService ticketService;

    @Test
    void authEndpointsArePublic() throws Exception {
        when(authService.register(any()))
                .thenReturn(new AuthResponse(
                        42L,
                        "Jayden",
                        "Hunt",
                        "jayden@example.com",
                        "5195551234",
                        UserRole.CUSTOMER,
                        "Registration successful"
                ));

        when(authService.login(any()))
                .thenReturn(new AuthResponse(
                        null,
                        null,
                        null,
                        "jayden@example.com",
                        null,
                        null,
                        "Verification code sent",
                        true
                ));

        when(authService.verifyTwoFactorLogin(any()))
                .thenReturn(new AuthResponse(
                        42L,
                        "Jayden",
                        "Hunt",
                        "jayden@example.com",
                        "5195551234",
                        UserRole.CUSTOMER,
                        "Login successful"
                ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Jayden",
                                  "lastName": "Hunt",
                                  "email": "jayden@example.com",
                                  "phone": "5195551234",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName", is("Jayden")));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "jayden@example.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.twoFactorRequired", is(true)));

        mockMvc.perform(post("/api/auth/verify-2fa")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "jayden@example.com",
                                  "code": "123456"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Login successful")))
                .andExpect(request().sessionAttribute(
                        AuthController.AUTHENTICATED_USER_ID,
                        42L
                ))
                .andExpect(request().sessionAttribute(
                        AuthController.AUTHENTICATED_USER_ROLE,
                        UserRole.CUSTOMER
                ));
    }

    @Test
    void customerTicketRequiresAuthenticatedSession() throws Exception {
        String requestBody = """
                {
                  "subject": "Billing question",
                  "description": "Please review my latest charge.",
                  "priority": "NORMAL"
                }
                """;

        mockMvc.perform(post("/api/tickets/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());

        MockHttpSession session = new MockHttpSession();
        session.setAttribute(
                AuthController.AUTHENTICATED_USER_ID,
                42L
        );
        session.setAttribute(
                AuthController.AUTHENTICATED_USER_ROLE,
                UserRole.CUSTOMER
        );

        Ticket ticket = new Ticket();
        ticket.setTicketId(10L);
        ticket.setCustomerId(42L);
        ticket.setSubject("Billing question");
        ticket.setDescription("Please review my latest charge.");
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setPriority(TicketPriority.NORMAL);
        ticket.setCreatedAt(OffsetDateTime.now());

        when(ticketService.createCustomerTicket(eq(42L), any()))
                .thenReturn(ticket);

        mockMvc.perform(post("/api/tickets/customer")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerId", is(42)))
                .andExpect(jsonPath("$.status", is("OPEN")));
    }

    @Test
    void employeeTicketRequiresStaffSession() throws Exception {
        String requestBody = """
                {
                  "createdByEmployeeId": 4,
                  "customerId": 42,
                  "subject": "Customer called",
                  "description": "Customer needs help with a booking.",
                  "priority": "NORMAL"
                }
                """;

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());

        MockHttpSession session = new MockHttpSession();
        session.setAttribute(
                AuthController.AUTHENTICATED_USER_ID,
                8L
        );
        session.setAttribute(
                AuthController.AUTHENTICATED_USER_ROLE,
                UserRole.EMPLOYEE
        );

        Ticket ticket = new Ticket();
        ticket.setTicketId(11L);
        ticket.setCreatedByEmployeeId(4L);
        ticket.setCustomerId(42L);
        ticket.setSubject("Customer called");
        ticket.setDescription("Customer needs help with a booking.");
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setPriority(TicketPriority.NORMAL);
        ticket.setCreatedAt(OffsetDateTime.now());

        when(ticketService.createTicket(any())).thenReturn(ticket);

        mockMvc.perform(post("/api/tickets")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.createdByEmployeeId", is(4)))
                .andExpect(jsonPath("$.customerId", is(42)));
    }

    @Test
    void vehicleReadEndpointsArePublic() throws Exception {
        Vehicle vehicle = vehicle();

        when(vehicleService.getAllVehicles())
                .thenReturn(List.of(vehicle));

        when(vehicleService.getVehicleById(1L))
                .thenReturn(vehicle);

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].licensePlate", is("MAZ2020")));

        mockMvc.perform(get("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make", is("Mazda")))
                .andExpect(jsonPath("$.licensePlate", is("MAZ2020")));
    }

    @Test
    void vehicleImageEndpointIsPublic() throws Exception {
        when(vehicleImageService.getImage(1L))
                .thenReturn(new VehicleImageService.StoredImage(
                        new byte[]{1, 2, 3},
                        MediaType.IMAGE_JPEG_VALUE
                ));

        mockMvc.perform(get("/api/vehicles/1/image"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG))
                .andExpect(content().bytes(new byte[]{1, 2, 3}));
    }

    @Test
    void publicVehicleImageEndpointIsPublic() throws Exception {
        when(vehicleImageService.getImage(1L))
                .thenReturn(new VehicleImageService.StoredImage(
                        new byte[]{4, 5, 6},
                        MediaType.IMAGE_JPEG_VALUE
                ));

        mockMvc.perform(get("/api/public/vehicle-images/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG))
                .andExpect(content().bytes(new byte[]{4, 5, 6}));
    }

    @Test
    void userEndpointsAllowDocumentedRequests() throws Exception {
        AppUser user = user();

        when(appUserService.getAllUsers()).thenReturn(List.of(user));
        when(appUserService.getUserById(1L)).thenReturn(user);
        when(appUserService.createUser(any(AppUser.class))).thenReturn(user);
        when(appUserService.updateUser(eq(1L), any(AppUser.class))).thenReturn(user);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("jayden@example.com")));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Jayden",
                                  "lastName": "Hunt",
                                  "email": "jayden@example.com",
                                  "passwordHash": "temporary_hash",
                                  "phone": "5195551234",
                                  "role": "CUSTOMER"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jayden")));

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Jayden",
                                  "lastName": "Hunt",
                                  "email": "jayden.updated@example.com",
                                  "passwordHash": "temporary_hash",
                                  "phone": "5195559999",
                                  "role": "CUSTOMER"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());
    }

    @Test
    void rentalEndpointsAllowDocumentedRequests() throws Exception {
        RentalResponse rental = rental();

        when(rentalService.getAllRentals()).thenReturn(List.of(rental));
        when(rentalService.getRentalById(1L)).thenReturn(rental);
        when(rentalService.createRental(any())).thenReturn(rental);
        when(rentalService.completeRental(1L)).thenReturn(rental);
        when(rentalService.cancelRental(1L)).thenReturn(rental);
        when(rentalService.updateRentalDates(eq(1L), any())).thenReturn(rental);

        mockMvc.perform(get("/api/rentals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/rentals/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName", is("Jayden Hunt")));

        mockMvc.perform(post("/api/rentals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": 4,
                                  "vehicleId": 1,
                                  "pickupLocationId": 1,
                                  "returnLocationId": 1,
                                  "pickupDate": "2026-07-01T09:00:00-04:00",
                                  "returnDate": "2026-07-05T09:00:00-04:00"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("BOOKED")));

        mockMvc.perform(patch("/api/rentals/1/complete"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/rentals/1/cancel"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/rentals/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "pickupDate": "2026-07-02T11:00:00-04:00",
                                  "returnDate": "2026-07-06T11:00:00-04:00"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanModifyVehicles() throws Exception {
        Vehicle vehicle = vehicle();

        when(vehicleService.createVehicle(any(Vehicle.class)))
                .thenReturn(vehicle);

        when(vehicleService.updateVehicle(
                eq(1L),
                any(Vehicle.class)
        )).thenReturn(vehicle);

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicleJson()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.licensePlate", is("MAZ2020")));

        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicleUpdateJson()))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/vehicles/5"))
                .andExpect(status().isOk());
    }

    @Test
    void anonymousUsersCannotModifyVehicles() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicleJson()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(vehicleUpdateJson()))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(delete("/api/vehicles/5"))
                .andExpect(status().isUnauthorized());
    }

    private Vehicle vehicle() {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(1L);
        vehicle.setMake("Mazda");
        vehicle.setModel("CX-5");
        vehicle.setYear((short) 2020);
        vehicle.setLicensePlate("MAZ2020");
        vehicle.setDailyRate(new BigDecimal("75.00"));
        vehicle.setLocationId(1L);
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicle;
    }

    private AppUser user() {
        AppUser user = new AppUser();
        user.setUserId(1L);
        user.setFirstName("Jayden");
        user.setLastName("Hunt");
        user.setEmail("jayden@example.com");
        user.setPasswordHash("temporary_hash");
        user.setPhone("5195551234");
        user.setRole(UserRole.CUSTOMER);
        user.setCreatedAt(OffsetDateTime.parse("2026-07-01T09:00:00-04:00"));
        return user;
    }

    private RentalResponse rental() {
        return new RentalResponse(
                1L,
                4L,
                "Jayden Hunt",
                1L,
                "2020 Mazda CX-5",
                OffsetDateTime.parse("2026-07-01T09:00:00-04:00"),
                OffsetDateTime.parse("2026-07-05T09:00:00-04:00"),
                RentalStatus.BOOKED,
                new BigDecimal("300.00"),
                OffsetDateTime.parse("2026-07-01T08:00:00-04:00")
        );
    }

    private String vehicleJson() {
        return """
            {
              "locationId": 1,
              "make": "Mazda",
              "model": "CX-5",
              "year": 2020,
              "licensePlate": "MAZ2020",
              "dailyRate": 75.00,
              "status": "AVAILABLE"
            }
            """;
    }

    private String vehicleUpdateJson() {
        return """
                {
                  "locationId": 1,
                  "make": "Toyota",
                  "model": "Corolla SE",
                  "year": 2022,
                  "licensePlate": "ABC1234",
                  "dailyRate": 65.00,
                  "status": "AVAILABLE"
                }
                """;
    }
}
