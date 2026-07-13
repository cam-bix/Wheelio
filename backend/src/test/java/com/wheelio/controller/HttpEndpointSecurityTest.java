package com.wheelio.controller;

import com.wheelio.dto.RentalResponse;
import com.wheelio.entity.AppUser;
import com.wheelio.entity.RentalStatus;
import com.wheelio.entity.UserRole;
import com.wheelio.entity.Vehicle;
import com.wheelio.entity.VehicleStatus;
import com.wheelio.service.AppUserService;
import com.wheelio.service.RentalService;
import com.wheelio.service.VehicleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
    private AppUserService appUserService;

    @MockBean
    private RentalService rentalService;

    @Test
    void vehicleEndpointsAllowDocumentedRequests() throws Exception {
        Vehicle vehicle = vehicle();

        when(vehicleService.getAllVehicles()).thenReturn(List.of(vehicle));
        when(vehicleService.getVehicleById(1L)).thenReturn(vehicle);
        when(vehicleService.createVehicle(any(Vehicle.class))).thenReturn(vehicle);
        when(vehicleService.updateVehicle(eq(1L), any(Vehicle.class))).thenReturn(vehicle);

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(get("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make", is("Mazda")));

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "locationId": 1,
                                  "make": "Mazda",
                                  "model": "CX-5",
                                  "year": 2020,
                                  "licensePlate": "MAZ2020",
                                  "dailyRate": 75.00,
                                  "status": "AVAILABLE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.licensePlate", is("MAZ2020")));

        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "locationId": 1,
                                  "make": "Toyota",
                                  "model": "Corolla SE",
                                  "year": 2022,
                                  "licensePlate": "ABC1234",
                                  "dailyRate": 65.00,
                                  "status": "AVAILABLE"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/vehicles/5"))
                .andExpect(status().isOk());
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
}
