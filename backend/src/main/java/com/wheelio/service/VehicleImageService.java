package com.wheelio.service;

import com.wheelio.entity.Vehicle;
import com.wheelio.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

@Service
public class VehicleImageService {

    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png"
    );

    private final S3Client s3Client;
    private final VehicleRepository vehicleRepository;
    private final String bucketName;

    public VehicleImageService(
            S3Client s3Client,
            VehicleRepository vehicleRepository,
            @Value("${aws.s3.bucket}") String bucketName) {

        this.s3Client = s3Client;
        this.vehicleRepository = vehicleRepository;
        this.bucketName = bucketName;
    }

    public Vehicle uploadImage(Long vehicleId, MultipartFile file) {
        Vehicle vehicle = findVehicle(vehicleId);

        validateImage(file);

        String imageKey = "vehicles/" + vehicleId + "/main";

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(imageKey)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(
                    request,
                    RequestBody.fromInputStream(inputStream, file.getSize())
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not read the uploaded image.",
                    exception
            );
        } catch (S3Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The image could not be uploaded to S3.",
                    exception
            );
        }

        vehicle.setImageKey(imageKey);

        return vehicleRepository.save(vehicle);
    }

    public StoredImage getImage(Long vehicleId) {
        Vehicle vehicle = findVehicle(vehicleId);

        String imageKey = vehicle.getImageKey();

        if (imageKey == null || imageKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "This vehicle does not have an image."
            );
        }

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(imageKey)
                .build();

        try {
            ResponseBytes<GetObjectResponse> response =
                    s3Client.getObjectAsBytes(request);

            String contentType = response.response().contentType();

            if (contentType == null || contentType.isBlank()) {
                contentType = "application/octet-stream";
            }

            return new StoredImage(
                    response.asByteArray(),
                    contentType
            );
        } catch (NoSuchKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "The image was not found in S3.",
                    exception
            );
        } catch (S3Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The image could not be retrieved from S3.",
                    exception
            );
        }
    }

    public Vehicle deleteImage(Long vehicleId) {
        Vehicle vehicle = findVehicle(vehicleId);

        String imageKey = vehicle.getImageKey();

        if (imageKey == null || imageKey.isBlank()) {
            return vehicle;
        }

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(imageKey)
                .build();

        try {
            s3Client.deleteObject(request);
        } catch (S3Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "The image could not be deleted from S3.",
                    exception
            );
        }

        vehicle.setImageKey(null);

        return vehicleRepository.save(vehicle);
    }

    private Vehicle findVehicle(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Vehicle not found."
                ));
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "An image file is required."
            );
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The image cannot be larger than 5 MB."
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !ALLOWED_CONTENT_TYPES.contains(contentType)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only JPEG and PNG images are supported."
            );
        }

        try (InputStream inputStream = file.getInputStream()) {
            if (ImageIO.read(inputStream) == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The uploaded file is not a valid image."
                );
            }
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The uploaded image could not be read.",
                    exception
            );
        }
    }

    public record StoredImage(
            byte[] data,
            String contentType
    ) {
    }
}