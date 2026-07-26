package com.wheelio.controller;

import com.wheelio.entity.Vehicle;
import com.wheelio.service.VehicleImageService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleImageController {

    private final VehicleImageService vehicleImageService;

    public VehicleImageController(
            VehicleImageService vehicleImageService) {
        this.vehicleImageService = vehicleImageService;
    }

    @PostMapping(
            value = "/{vehicleId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Vehicle> uploadVehicleImage(
            @PathVariable Long vehicleId,
            @RequestParam("file") MultipartFile file) {

        Vehicle vehicle =
                vehicleImageService.uploadImage(vehicleId, file);

        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/{vehicleId}/image")
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

    @DeleteMapping("/{vehicleId}/image")
    public ResponseEntity<Vehicle> deleteVehicleImage(
            @PathVariable Long vehicleId) {

        Vehicle vehicle =
                vehicleImageService.deleteImage(vehicleId);

        return ResponseEntity.ok(vehicle);
    }
}