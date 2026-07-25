/**
  Author:   Jayden Hunt
  Date:     27 June 2026
  Desc:     Creates and injects sample data for team testing purposes (Sprint 1).
 */

-- App Users
INSERT INTO app_user (user_id, first_name, last_name, email, password_hash, phone, role)
VALUES
    (1, 'Admin', 'User', 'admin@wheelio.com', 'placeholder_hash', '555-111-1111', 'ADMIN'),

    (2, 'John', 'Doe', 'john.doe@example.com', 'placeholder_hash', '555-222-2222', 'CUSTOMER'),
    (3, 'Jane', 'Smith', 'jane.smith@example.com', 'placeholder_hash', '555-333-3333', 'CUSTOMER'),
    (4, 'Jayden', 'Hunt', 'jayden.hunt@example.com', 'placeholder_hash', '555-444-4444', 'CUSTOMER'),
    (5, 'Emily', 'Brown', 'emily.brown@example.com', 'placeholder_hash', '555-555-5555', 'CUSTOMER'),
    (6, 'Michael', 'Johnson', 'michael.johnson@example.com', 'placeholder_hash', '555-666-6666', 'CUSTOMER'),
    (7, 'Sarah', 'Wilson', 'sarah.wilson@example.com', 'placeholder_hash', '555-777-7777', 'CUSTOMER'),

    (8, 'Alex', 'Manager', 'alex.manager@wheelio.com', 'placeholder_hash', '555-888-1001', 'EMPLOYEE'),
    (9, 'Priya', 'Patel', 'priya.patel@wheelio.com', 'placeholder_hash', '555-888-1002', 'EMPLOYEE'),
    (10, 'Marcus', 'Chen', 'marcus.chen@wheelio.com', 'placeholder_hash', '555-888-1003', 'EMPLOYEE'),
    (11, 'Olivia', 'Taylor', 'olivia.taylor@wheelio.com', 'placeholder_hash', '555-888-1004', 'EMPLOYEE'),
    (12, 'Daniel', 'Garcia', 'daniel.garcia@wheelio.com', 'placeholder_hash', '555-888-1005', 'EMPLOYEE');

-- Locations
INSERT INTO location (location_id, name, address_line, city, province, postal_code, phone)
VALUES
    (1, 'Wheelio Waterloo', '75 University Avenue West', 'Waterloo', 'Ontario', 'N2L 3C5', '519-111-0001'),
    (2, 'Wheelio Toronto Downtown', '100 King Street West', 'Toronto', 'Ontario', 'M5X 1A9', '416-222-0002'),
    (3, 'Wheelio London', '300 Richmond Street', 'London', 'Ontario', 'N6B 2H1', '519-333-0003'),
    (4, 'Wheelio Ottawa', '200 Elgin Street', 'Ottawa', 'Ontario', 'K2P 1L5', '613-444-0004');

-- Employees
INSERT INTO employee (employee_id, user_id, location_id, position, employment_status, hire_date)
VALUES
    (1, 8, 1, 'MANAGER', 'ACTIVE', '2025-05-01'),
    (2, 9, 1, 'CUSTOMER_SERVICE', 'ACTIVE', '2025-06-15'),
    (3, 10, 2, 'MANAGER', 'ACTIVE', '2025-04-10'),
    (4, 11, 3, 'MECHANIC', 'ACTIVE', '2025-07-20'),
    (5, 12, 4, 'ADMIN_STAFF', 'ACTIVE', '2025-08-05');

-- Vehicles
INSERT INTO vehicle (vehicle_id, location_id, make, model, year, license_plate, daily_rate, status)
VALUES
    -- Waterloo vehicles
    (1, 1, 'Toyota', 'Corolla', 2022, 'WAT1234', 55.00, 'RENTED'),
    (2, 1, 'Honda', 'Civic', 2021, 'WAT5678', 60.00, 'AVAILABLE'),
    (3, 1, 'Ford', 'Escape', 2023, 'WAT2023', 85.00, 'AVAILABLE'),
    (4, 1, 'Tesla', 'Model 3', 2022, 'WATEV30', 120.00, 'MAINTENANCE'),

    -- Toronto vehicles
    (5, 2, 'Mazda', 'Mazda3', 2020, 'TOR3001', 58.00, 'AVAILABLE'),
    (6, 2, 'Hyundai', 'Elantra', 2022, 'TOR3002', 57.00, 'RENTED'),
    (7, 2, 'Jeep', 'Compass', 2021, 'TOR3003', 90.00, 'AVAILABLE'),
    (8, 2, 'BMW', 'X3', 2023, 'TOR3004', 145.00, 'AVAILABLE'),

    -- London vehicles
    (9, 3, 'Nissan', 'Altima', 2021, 'LDN4001', 65.00, 'AVAILABLE'),
    (10, 3, 'Chevrolet', 'Malibu', 2020, 'LDN4002', 62.00, 'RENTED'),
    (11, 3, 'Kia', 'Sportage', 2023, 'LDN4003', 88.00, 'AVAILABLE'),
    (12, 3, 'Ford', 'F-150', 2022, 'LDN4004', 135.00, 'OUT_OF_SERVICE'),

    -- Ottawa vehicles
    (13, 4, 'Subaru', 'Outback', 2022, 'OTT5001', 92.00, 'AVAILABLE'),
    (14, 4, 'Volkswagen', 'Jetta', 2021, 'OTT5002', 63.00, 'AVAILABLE'),
    (15, 4, 'Toyota', 'RAV4', 2023, 'OTT5003', 95.00, 'RENTED'),
    (16, 4, 'Tesla', 'Model Y', 2023, 'OTT5004', 150.00, 'AVAILABLE');

-- Rentals
INSERT INTO rental (
    rental_id,
    user_id,
    vehicle_id,
    employee_id,
    pickup_location_id,
    return_location_id,
    pickup_date,
    return_date,
    status,
    total_cost
)
VALUES
    -- Active/booked rentals
    (1, 2, 1, 2, 1, 1, '2026-07-01 10:00:00-04', '2026-07-04 10:00:00-04', 'BOOKED', 165.00),
    (2, 3, 6, 3, 2, 2, '2026-07-02 09:00:00-04', '2026-07-06 09:00:00-04', 'ACTIVE', 228.00),
    (3, 4, 10, 4, 3, 3, '2026-07-05 12:00:00-04', '2026-07-08 12:00:00-04', 'BOOKED', 186.00),
    (4, 5, 15, 5, 4, 4, '2026-07-10 08:30:00-04', '2026-07-12 08:30:00-04', 'BOOKED', 190.00),

    -- Completed rentals
    (5, 6, 2, 1, 1, 1, '2026-06-10 10:00:00-04', '2026-06-12 10:00:00-04', 'COMPLETED', 120.00),
    (6, 7, 5, 3, 2, 3, '2026-06-15 11:00:00-04', '2026-06-18 11:00:00-04', 'COMPLETED', 174.00),
    (7, 2, 13, 5, 4, 2, '2026-06-20 09:00:00-04', '2026-06-23 09:00:00-04', 'COMPLETED', 276.00),

    -- Cancelled rentals
    (8, 3, 9, NULL, 3, 3, '2026-07-15 13:00:00-04', '2026-07-18 13:00:00-04', 'CANCELLED', 195.00),
    (9, 4, 14, NULL, 4, 4, '2026-07-20 10:00:00-04', '2026-07-22 10:00:00-04', 'CANCELLED', 126.00),

    -- Cross-location return example
    (10, 5, 8, 3, 2, 1, '2026-07-25 09:30:00-04', '2026-07-28 09:30:00-04', 'BOOKED', 435.00);

-- Email 2FA Codes
-- These are placeholder records for testing only.
-- In real use, code_hash should store a secure hash, not a plain code.
INSERT INTO email_2fa_codes (id, user_id, code_hash, expires_at, used, attempt_count)
VALUES
    (1, 1, 'placeholder_2fa_hash_admin', '2026-07-27 12:00:00', FALSE, 0),
    (2, 2, 'placeholder_2fa_hash_john', '2026-07-27 12:15:00', FALSE, 1),
    (3, 3, 'placeholder_2fa_hash_jane_used', '2026-07-20 09:00:00', TRUE, 2);

-- Reset sequences after explicit ID inserts
SELECT setval(pg_get_serial_sequence('app_user', 'user_id'), (SELECT MAX(user_id) FROM app_user));
SELECT setval(pg_get_serial_sequence('location', 'location_id'), (SELECT MAX(location_id) FROM location));
SELECT setval(pg_get_serial_sequence('employee', 'employee_id'), (SELECT MAX(employee_id) FROM employee));
SELECT setval(pg_get_serial_sequence('vehicle', 'vehicle_id'), (SELECT MAX(vehicle_id) FROM vehicle));
SELECT setval(pg_get_serial_sequence('rental', 'rental_id'), (SELECT MAX(rental_id) FROM rental));
SELECT setval(pg_get_serial_sequence('email_2fa_codes', 'id'), (SELECT MAX(id) FROM email_2fa_codes));
