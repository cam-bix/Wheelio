package com.wheelio.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.wheelio.dto.CheckoutSessionResponse;
import com.wheelio.dto.CreateCheckoutSessionRequest;
import com.wheelio.entity.Vehicle;
import com.wheelio.service.VehicleService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final VehicleService vehicleService;

    public CheckoutController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/session")
    public CheckoutSessionResponse createSession(@RequestBody CreateCheckoutSessionRequest request) throws StripeException {
        Vehicle vehicle = vehicleService.getVehicleById(request.getVehicleId());

        BigDecimal totalDollars = vehicle.getDailyRate().multiply(BigDecimal.valueOf(request.getDays()));
        long totalCents = totalDollars.multiply(BigDecimal.valueOf(100)).longValueExact();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/book/" + vehicle.getVehicleId() + "?success=true")
                .setCancelUrl("http://localhost:5173/book/" + vehicle.getVehicleId() + "?canceled=true")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("cad")
                                                .setUnitAmount(totalCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " (" + request.getDays() + " days)")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);

        return new CheckoutSessionResponse(session.getUrl());
    }
}
