package com.wheelio.controller;

import com.wheelio.service.VehicleImageService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/vehicle-images")
public class PublicVehicleImageController {

    private final VehicleImageService vehicleImageService;

    public PublicVehicleImageController(
            VehicleImageService vehicleImageService) {
        this.vehicleImageService = vehicleImageService;
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<byte[]> getVehicleImage(
            @PathVariable Long vehicleId) {

        VehicleImageService.StoredImage image =
                vehicleImageService.getImage(vehicleId);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(image.contentType())
                )
                .cacheControl(CacheControl.noCache())
                .body(image.data());
    }
}
