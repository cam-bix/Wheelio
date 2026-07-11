/**
  Author:   Jayden Hunt & Sebastian Caro
  Date:     27 June 2026
  Desc:     Creates and injects sample data for team testing purposes (Sprint 2).
 */

-- Users
INSERT INTO app_user (first_name, last_name, email, password_hash, phone, role)
VALUES
    ('Admin', 'User', 'admin@wheelio.com', 'placeholder_hash', '555-111-1111', 'ADMIN'),
    ('John', 'Doe', 'john.doe@example.com', 'placeholder_hash', '555-222-2222', 'CUSTOMER'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'placeholder_hash', '555-333-3333', 'CUSTOMER'),
    ('Sarah', 'Miller', 'sarah.miller@wheelio.com', 'placeholder_hash', '555-444-4444', 'EMPLOYEE'),
    ('Mike', 'Johnson', 'mike.johnson@wheelio.com', 'placeholder_hash', '555-555-5555', 'EMPLOYEE');

-- Locations
INSERT INTO location (name, address_line, city, province, postal_code, phone)
VALUES
    ('Waterloo Branch', '123 King Street North', 'Waterloo', 'Ontario', 'N2J 2X1', '519-111-2222'),
    ('Toronto Branch', '456 Front Street West', 'Toronto', 'Ontario', 'M5V 2T6', '416-111-2222'),
    ('Oakville Branch', '789 Trafalgar Road', 'Oakville', 'Ontario', 'L6H 1A1', '905-111-2222');

-- Employees
INSERT INTO employee (user_id, location_id, position, employment_status)
VALUES
    (4, 1, 'CUSTOMER_SERVICE', 'ACTIVE'),
    (5, 2, 'MECHANIC', 'ACTIVE');

-- Vehicles
INSERT INTO vehicle (location_id, make, model, year, license_plate, daily_rate, status)
VALUES
    (1, 'Toyota', 'Corolla', 2022, 'ABC1234', 55.00, 'AVAILABLE'),
    (1, 'Honda', 'Civic', 2021, 'XYZ5678', 60.00, 'AVAILABLE'),
    (2, 'Ford', 'Escape', 2023, 'SUV2023', 85.00, 'AVAILABLE'),
    (3, 'Tesla', 'Model 3', 2022, 'EV3000', 120.00, 'MAINTENANCE'),
    (2, 'Hyundai', 'Elantra', 2020, 'HYU2020', 50.00, 'RENTED'),
    (3, 'Jeep', 'Wrangler', 2022, 'JEEP22', 95.00, 'AVAILABLE');

-- Rentals
INSERT INTO rental (
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
    (2, 1, 1, 1, 1, '2026-07-12 09:00:00-04', '2026-07-15 17:00:00-04', 'BOOKED', 165.00),
    (3, 2, 1, 1, 2, '2026-07-18 10:30:00-04', '2026-07-20 16:00:00-04', 'ACTIVE', 120.00),
    (2, 3, 2, 2, 3, '2026-07-22 08:00:00-04', '2026-07-25 12:00:00-04', 'COMPLETED', 255.00);