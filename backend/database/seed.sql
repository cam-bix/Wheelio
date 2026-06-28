/**
  Author:   Jayden Hunt
  Date:     27 June 2026
  Desc:     Creates and injects sample data for team testing purposes (Sprint 1).
 */

INSERT INTO app_user (first_name, last_name, email, password_hash, phone, role)
VALUES
    ('Admin', 'User', 'admin@wheelio.com', 'placeholder_hash', '555-111-1111', 'ADMIN'),
    ('John', 'Doe', 'john.doe@example.com', 'placeholder_hash', '555-222-2222', 'CUSTOMER'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'placeholder_hash', '555-333-3333', 'CUSTOMER');

INSERT INTO transaction_log (user_id, rental_id, amount, currency, status)
VALUES
    (2, 1, 165.00, 'CAD', 'APPROVED'),
    (3, 2, 84.55, 'USD', 'PENDING');

INSERT INTO vehicle (make, model, year, license_plate, daily_rate, status)
VALUES
    ('Toyota', 'Corolla', 2022, 'ABC1234', 55.00, 'AVAILABLE'),
    ('Honda', 'Civic', 2021, 'XYZ5678', 60.00, 'AVAILABLE'),
    ('Ford', 'Escape', 2023, 'SUV2023', 85.00, 'AVAILABLE'),
    ('Tesla', 'Model 3', 2022, 'EV3000', 120.00, 'MAINTENANCE');

INSERT INTO rental (user_id, vehicle_id, pickup_date, return_date, status, total_cost)
VALUES
    (2, 1, '2026-07-01 10:00:00-04', '2026-07-04 10:00:00-04', 'BOOKED', 165.00),
    (3, 2, '2026-07-05 09:00:00-04', '2026-07-07 09:00:00-04', 'BOOKED', 120.00);
