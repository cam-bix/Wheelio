/**
  Author:   Jayden Hunt
  Editor:   Aiden Flannery
  Date:     25 July 2026
  Desc:     Creates and injects combined sample data for team testing purposes by explicit id.
 */

BEGIN;

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
    (12, 'Daniel', 'Garcia', 'daniel.garcia@wheelio.com', 'placeholder_hash', '555-888-1005', 'EMPLOYEE'),
    (13, 'Liam', 'Anderson', 'liam.anderson@example.com', 'placeholder_hash', '555-900-0013', 'CUSTOMER'),
    (14, 'Noah', 'Thomas', 'noah.thomas@example.com', 'placeholder_hash', '555-900-0014', 'CUSTOMER'),
    (15, 'Emma', 'Martin', 'emma.martin@example.com', 'placeholder_hash', '555-900-0015', 'CUSTOMER'),
    (16, 'Sophia', 'White', 'sophia.white@example.com', 'placeholder_hash', '555-900-0016', 'CUSTOMER'),
    (17, 'James', 'Harris', 'james.harris@example.com', 'placeholder_hash', '555-900-0017', 'CUSTOMER'),
    (18, 'Benjamin', 'Clark', 'benjamin.clark@example.com', 'placeholder_hash', '555-900-0018', 'CUSTOMER'),
    (19, 'Charlotte', 'Lewis', 'charlotte.lewis@example.com', 'placeholder_hash', '555-900-0019', 'CUSTOMER'),
    (20, 'Amelia', 'Walker', 'amelia.walker@example.com', 'placeholder_hash', '555-900-0020', 'CUSTOMER'),
    (21, 'Lucas', 'Hall', 'lucas.hall@example.com', 'placeholder_hash', '555-900-0021', 'CUSTOMER'),
    (22, 'Mason', 'Allen', 'mason.allen@example.com', 'placeholder_hash', '555-900-0022', 'CUSTOMER'),
    (23, 'Harper', 'Young', 'harper.young@example.com', 'placeholder_hash', '555-900-0023', 'CUSTOMER'),
    (24, 'Evelyn', 'King', 'evelyn.king@example.com', 'placeholder_hash', '555-900-0024', 'CUSTOMER'),
    (25, 'Logan', 'Wright', 'logan.wright@example.com', 'placeholder_hash', '555-900-0025', 'CUSTOMER'),
    (26, 'Elijah', 'Scott', 'elijah.scott@example.com', 'placeholder_hash', '555-900-0026', 'CUSTOMER'),
    (27, 'Abigail', 'Green', 'abigail.green@example.com', 'placeholder_hash', '555-900-0027', 'CUSTOMER'),
    (28, 'Ella', 'Baker', 'ella.baker@example.com', 'placeholder_hash', '555-900-0028', 'CUSTOMER'),
    (29, 'Henry', 'Adams', 'henry.adams@example.com', 'placeholder_hash', '555-900-0029', 'CUSTOMER'),
    (30, 'Sebastian', 'Nelson', 'sebastian.nelson@example.com', 'placeholder_hash', '555-900-0030', 'CUSTOMER'),
    (31, 'Scarlett', 'Hill', 'scarlett.hill@example.com', 'placeholder_hash', '555-900-0031', 'CUSTOMER'),
    (32, 'Avery', 'Campbell', 'avery.campbell@example.com', 'placeholder_hash', '555-900-0032', 'CUSTOMER'),
    (33, 'Jack', 'Mitchell', 'jack.mitchell@example.com', 'placeholder_hash', '555-900-0033', 'CUSTOMER'),
    (34, 'Owen', 'Roberts', 'owen.roberts@example.com', 'placeholder_hash', '555-900-0034', 'CUSTOMER'),
    (35, 'Victoria', 'Carter', 'victoria.carter@example.com', 'placeholder_hash', '555-900-0035', 'CUSTOMER'),
    (36, 'Grace', 'Phillips', 'grace.phillips@example.com', 'placeholder_hash', '555-900-0036', 'CUSTOMER'),
    (37, 'Levi', 'Evans', 'levi.evans@example.com', 'placeholder_hash', '555-900-0037', 'CUSTOMER'),
    (38, 'Samuel', 'Turner', 'samuel.turner@example.com', 'placeholder_hash', '555-900-0038', 'CUSTOMER'),
    (39, 'Chloe', 'Parker', 'chloe.parker@example.com', 'placeholder_hash', '555-900-0039', 'CUSTOMER'),
    (40, 'Lily', 'Collins', 'lily.collins@example.com', 'placeholder_hash', '555-900-0040', 'CUSTOMER'),
    (41, 'Nathan', 'Edwards', 'nathan.edwards@example.com', 'placeholder_hash', '555-900-0041', 'CUSTOMER'),
    (42, 'Zoey', 'Stewart', 'zoey.stewart@example.com', 'placeholder_hash', '555-900-0042', 'CUSTOMER'),
    (43, 'Isaac', 'Sanchez', 'isaac.sanchez@example.com', 'placeholder_hash', '555-900-0043', 'CUSTOMER'),
    (44, 'Hannah', 'Morris', 'hannah.morris@example.com', 'placeholder_hash', '555-900-0044', 'CUSTOMER'),
    (45, 'David', 'Rogers', 'david.rogers@example.com', 'placeholder_hash', '555-900-0045', 'CUSTOMER'),
    (46, 'Aubrey', 'Reed', 'aubrey.reed@example.com', 'placeholder_hash', '555-900-0046', 'CUSTOMER'),
    (47, 'Wyatt', 'Cook', 'wyatt.cook@example.com', 'placeholder_hash', '555-900-0047', 'CUSTOMER'),
    (48, 'Aria', 'Morgan', 'aria.morgan@example.com', 'placeholder_hash', '555-900-0048', 'CUSTOMER'),
    (49, 'Julian', 'Bell', 'julian.bell@example.com', 'placeholder_hash', '555-900-0049', 'CUSTOMER'),
    (50, 'Nora', 'Murphy', 'nora.murphy@example.com', 'placeholder_hash', '555-900-0050', 'CUSTOMER'),
    (51, 'Gabriel', 'Bailey', 'gabriel.bailey@example.com', 'placeholder_hash', '555-900-0051', 'CUSTOMER'),
    (52, 'Layla', 'Rivera', 'layla.rivera@example.com', 'placeholder_hash', '555-900-0052', 'CUSTOMER'),
    (53, 'Dylan', 'Cooper', 'dylan.cooper@example.com', 'placeholder_hash', '555-900-0053', 'CUSTOMER'),
    (54, 'Paisley', 'Richardson', 'paisley.richardson@example.com', 'placeholder_hash', '555-900-0054', 'CUSTOMER'),
    (55, 'Caleb', 'Cox', 'caleb.cox@example.com', 'placeholder_hash', '555-900-0055', 'CUSTOMER'),
    (56, 'Stella', 'Howard', 'stella.howard@example.com', 'placeholder_hash', '555-900-0056', 'CUSTOMER')
ON CONFLICT DO NOTHING;

-- Locations
INSERT INTO location (location_id, name, address_line, city, province, postal_code, phone)
VALUES
    (1, 'Wheelio Waterloo', '75 University Avenue West', 'Waterloo', 'Ontario', 'N2L 3C5', '519-111-0001'),
    (2, 'Wheelio Toronto Downtown', '100 King Street West', 'Toronto', 'Ontario', 'M5X 1A9', '416-222-0002'),
    (3, 'Wheelio London', '300 Richmond Street', 'London', 'Ontario', 'N6B 2H1', '519-333-0003'),
    (4, 'Wheelio Ottawa', '200 Elgin Street', 'Ottawa', 'Ontario', 'K2P 1L5', '613-444-0004')
ON CONFLICT DO NOTHING;

-- Employees
INSERT INTO employee (employee_id, user_id, location_id, "position", employment_status, hire_date)
VALUES
    (1, 8, 1, 'MANAGER', 'ACTIVE', '2025-05-01'),
    (2, 9, 1, 'CUSTOMER_SERVICE', 'ACTIVE', '2025-06-15'),
    (3, 10, 2, 'MANAGER', 'ACTIVE', '2025-04-10'),
    (4, 11, 3, 'MECHANIC', 'ACTIVE', '2025-07-20'),
    (5, 12, 4, 'ADMIN_STAFF', 'ACTIVE', '2025-08-05')
ON CONFLICT DO NOTHING;

-- Vehicles
INSERT INTO vehicle (vehicle_id, location_id, make, model, year, license_plate, daily_rate, status)
VALUES
    (1, 1, 'Toyota', 'Corolla', 2022, 'WAT1234', 55.00, 'RENTED'),
    (2, 1, 'Honda', 'Civic', 2021, 'WAT5678', 60.00, 'AVAILABLE'),
    (3, 1, 'Ford', 'Escape', 2023, 'WAT2023', 85.00, 'AVAILABLE'),
    (4, 1, 'Tesla', 'Model 3', 2022, 'WATEV30', 120.00, 'MAINTENANCE'),
    (5, 2, 'Mazda', 'Mazda3', 2020, 'TOR3001', 58.00, 'AVAILABLE'),
    (6, 2, 'Hyundai', 'Elantra', 2022, 'TOR3002', 57.00, 'RENTED'),
    (7, 2, 'Jeep', 'Compass', 2021, 'TOR3003', 90.00, 'AVAILABLE'),
    (8, 2, 'BMW', 'X3', 2023, 'TOR3004', 145.00, 'AVAILABLE'),
    (9, 3, 'Nissan', 'Altima', 2021, 'LDN4001', 65.00, 'AVAILABLE'),
    (10, 3, 'Chevrolet', 'Malibu', 2020, 'LDN4002', 62.00, 'RENTED'),
    (11, 3, 'Kia', 'Sportage', 2023, 'LDN4003', 88.00, 'AVAILABLE'),
    (12, 3, 'Ford', 'F-150', 2022, 'LDN4004', 135.00, 'OUT_OF_SERVICE'),
    (13, 4, 'Subaru', 'Outback', 2022, 'OTT5001', 92.00, 'OUT_OF_SERVICE'),
    (14, 4, 'Volkswagen', 'Jetta', 2021, 'OTT5002', 63.00, 'AVAILABLE'),
    (15, 4, 'Toyota', 'RAV4', 2023, 'OTT5003', 95.00, 'RENTED'),
    (16, 4, 'Tesla', 'Model Y', 2023, 'OTT5004', 150.00, 'AVAILABLE'),
    (17, 1, 'Toyota', 'Camry', 2023, 'WAT6001', 72.00, 'AVAILABLE'),
    (18, 1, 'Honda', 'Accord', 2022, 'WAT6002', 70.00, 'AVAILABLE'),
    (19, 1, 'Mazda', 'CX-5', 2023, 'WAT6003', 89.00, 'AVAILABLE'),
    (20, 1, 'Hyundai', 'Tucson', 2022, 'WAT6004', 84.00, 'AVAILABLE'),
    (21, 1, 'Kia', 'Soul', 2021, 'WAT6005', 60.00, 'AVAILABLE'),
    (22, 1, 'Ford', 'Explorer', 2023, 'WAT6006', 112.00, 'AVAILABLE'),
    (23, 1, 'Chevrolet', 'Equinox', 2022, 'WAT6007', 86.00, 'AVAILABLE'),
    (24, 1, 'Tesla', 'Model Y', 2024, 'WAT6008', 155.00, 'AVAILABLE'),
    (25, 1, 'Nissan', 'Rogue', 2023, 'WAT6009', 90.00, 'AVAILABLE'),
    (26, 1, 'Jeep', 'Wrangler', 2022, 'WAT6010', 140.00, 'OUT_OF_SERVICE'),
    (27, 1, 'Subaru', 'Forester', 2023, 'WAT6011', 91.00, 'AVAILABLE'),
    (28, 1, 'Volkswagen', 'Taos', 2022, 'WAT6012', 82.00, 'AVAILABLE'),
    (29, 1, 'BMW', '330i', 2024, 'WAT6013', 165.00, 'AVAILABLE'),
    (30, 2, 'Toyota', 'Highlander', 2023, 'TOR6001', 118.00, 'AVAILABLE'),
    (31, 2, 'Honda', 'CR-V', 2024, 'TOR6002', 98.00, 'AVAILABLE'),
    (32, 2, 'Ford', 'Bronco Sport', 2023, 'TOR6003', 108.00, 'AVAILABLE'),
    (33, 2, 'Mazda', 'CX-30', 2022, 'TOR6004', 79.00, 'AVAILABLE'),
    (34, 2, 'Hyundai', 'Santa Fe', 2023, 'TOR6005', 97.00, 'AVAILABLE'),
    (35, 2, 'Kia', 'Seltos', 2024, 'TOR6006', 82.00, 'AVAILABLE'),
    (36, 2, 'Chevrolet', 'Trailblazer', 2022, 'TOR6007', 83.00, 'AVAILABLE'),
    (37, 2, 'Tesla', 'Model 3', 2023, 'TOR6008', 135.00, 'AVAILABLE'),
    (38, 2, 'Nissan', 'Sentra', 2021, 'TOR6009', 58.00, 'AVAILABLE'),
    (39, 2, 'Subaru', 'Crosstrek', 2023, 'TOR6010', 92.00, 'AVAILABLE'),
    (40, 2, 'Volkswagen', 'Atlas', 2024, 'TOR6011', 125.00, 'AVAILABLE'),
    (41, 2, 'BMW', 'X5', 2024, 'TOR6012', 210.00, 'AVAILABLE'),
    (42, 2, 'Ford', 'Mustang', 2023, 'TOR6013', 145.00, 'AVAILABLE'),
    (43, 3, 'Toyota', 'Prius', 2023, 'LDN6001', 78.00, 'AVAILABLE'),
    (44, 3, 'Honda', 'HR-V', 2022, 'LDN6002', 81.00, 'AVAILABLE'),
    (45, 3, 'Ford', 'Edge', 2021, 'LDN6003', 88.00, 'AVAILABLE'),
    (46, 3, 'Mazda', 'Mazda6', 2021, 'LDN6004', 66.00, 'AVAILABLE'),
    (47, 3, 'Hyundai', 'Venue', 2023, 'LDN6005', 69.00, 'AVAILABLE'),
    (48, 3, 'Kia', 'Telluride', 2024, 'LDN6006', 132.00, 'AVAILABLE'),
    (49, 3, 'Chevrolet', 'Traverse', 2023, 'LDN6007', 118.00, 'AVAILABLE'),
    (50, 3, 'Tesla', 'Model X', 2024, 'LDN6008', 230.00, 'AVAILABLE'),
    (51, 3, 'Nissan', 'Kicks', 2022, 'LDN6009', 65.00, 'AVAILABLE'),
    (52, 3, 'Jeep', 'Grand Cherokee', 2023, 'LDN6010', 142.00, 'AVAILABLE'),
    (53, 3, 'Subaru', 'Impreza', 2022, 'LDN6011', 71.00, 'AVAILABLE'),
    (54, 3, 'Volkswagen', 'Golf', 2021, 'LDN6012', 67.00, 'OUT_OF_SERVICE'),
    (55, 4, 'Toyota', 'Venza', 2023, 'OTT6001', 102.00, 'AVAILABLE'),
    (56, 4, 'Honda', 'Pilot', 2024, 'OTT6002', 122.00, 'AVAILABLE'),
    (57, 4, 'Ford', 'Maverick', 2023, 'OTT6003', 104.00, 'AVAILABLE'),
    (58, 4, 'Mazda', 'CX-90', 2024, 'OTT6004', 136.00, 'AVAILABLE'),
    (59, 4, 'Hyundai', 'Kona', 2023, 'OTT6005', 76.00, 'AVAILABLE'),
    (60, 4, 'Kia', 'EV6', 2024, 'OTT6006', 155.00, 'AVAILABLE'),
    (61, 4, 'Chevrolet', 'Tahoe', 2023, 'OTT6007', 175.00, 'AVAILABLE'),
    (62, 4, 'Tesla', 'Cybertruck', 2024, 'OTT6008', 275.00, 'AVAILABLE'),
    (63, 4, 'Nissan', 'Murano', 2022, 'OTT6009', 93.00, 'AVAILABLE'),
    (64, 4, 'Jeep', 'Gladiator', 2023, 'OTT6010', 162.00, 'AVAILABLE'),
    (65, 4, 'BMW', 'i4', 2024, 'OTT6011', 180.00, 'AVAILABLE'),
    (66, 4, 'Volkswagen', 'ID.4', 2023, 'OTT6012', 128.00, 'AVAILABLE')
ON CONFLICT DO NOTHING;

-- Rentals
INSERT INTO rental (rental_id, user_id, vehicle_id, employee_id, pickup_location_id, return_location_id, pickup_date, return_date, status, total_cost)
VALUES
    (1, 2, 1, 2, 1, 1, '2026-07-01 10:00:00-04', '2026-07-04 10:00:00-04', 'BOOKED', 165.00),
    (2, 3, 6, 3, 2, 2, '2026-07-02 09:00:00-04', '2026-07-06 09:00:00-04', 'ACTIVE', 228.00),
    (3, 4, 10, 4, 3, 3, '2026-07-05 12:00:00-04', '2026-07-08 12:00:00-04', 'BOOKED', 186.00),
    (4, 5, 15, 5, 4, 4, '2026-07-10 08:30:00-04', '2026-07-12 08:30:00-04', 'BOOKED', 190.00),
    (5, 6, 2, 1, 1, 1, '2026-06-10 10:00:00-04', '2026-06-12 10:00:00-04', 'COMPLETED', 120.00),
    (6, 7, 5, 3, 2, 3, '2026-06-15 11:00:00-04', '2026-06-18 11:00:00-04', 'COMPLETED', 174.00),
    (7, 2, 13, 5, 4, 2, '2026-06-20 09:00:00-04', '2026-06-23 09:00:00-04', 'COMPLETED', 276.00),
    (8, 3, 9, 1, 3, 3, '2026-07-15 13:00:00-04', '2026-07-18 13:00:00-04', 'CANCELLED', 195.00),
    (9, 4, 14, 1, 4, 4, '2026-07-20 10:00:00-04', '2026-07-22 10:00:00-04', 'CANCELLED', 126.00),
    (10, 5, 8, 3, 2, 1, '2026-07-25 09:30:00-04', '2026-07-28 09:30:00-04', 'BOOKED', 435.00),
    (11, 13, 17, 1, 1, 1, '2026-05-01 14:00:00+00', '2026-05-03 14:00:00+00', 'COMPLETED', 144.00),
    (12, 14, 18, 2, 1, 1, '2026-05-03 13:00:00+00', '2026-05-06 13:00:00+00', 'COMPLETED', 210.00),
    (13, 15, 19, 3, 1, 1, '2026-05-05 15:00:00+00', '2026-05-09 15:00:00+00', 'COMPLETED', 356.00),
    (14, 16, 20, 4, 1, 2, '2026-05-07 12:00:00+00', '2026-05-12 12:00:00+00', 'COMPLETED', 420.00),
    (15, 17, 21, 5, 1, 1, '2026-05-10 16:00:00+00', '2026-05-12 16:00:00+00', 'COMPLETED', 120.00),
    (16, 18, 22, 1, 1, 1, '2026-05-12 14:30:00+00', '2026-05-15 14:30:00+00', 'COMPLETED', 336.00),
    (17, 19, 23, 2, 1, 3, '2026-05-14 13:00:00+00', '2026-05-18 13:00:00+00', 'COMPLETED', 344.00),
    (18, 20, 24, 3, 1, 1, '2026-05-17 15:30:00+00', '2026-05-19 15:30:00+00', 'COMPLETED', 310.00),
    (19, 21, 25, 4, 1, 2, '2026-05-19 12:00:00+00', '2026-05-24 12:00:00+00', 'COMPLETED', 450.00),
    (20, 22, 26, 5, 1, 1, '2026-05-21 14:00:00+00', '2026-05-24 14:00:00+00', 'COMPLETED', 420.00),
    (21, 23, 27, 1, 1, 1, '2026-05-23 13:30:00+00', '2026-05-27 13:30:00+00', 'COMPLETED', 364.00),
    (22, 24, 28, 2, 1, 4, '2026-05-26 16:00:00+00', '2026-05-28 16:00:00+00', 'COMPLETED', 164.00),
    (23, 25, 29, 3, 1, 1, '2026-05-28 14:00:00+00', '2026-05-31 14:00:00+00', 'COMPLETED', 495.00),
    (24, 26, 30, 4, 2, 2, '2026-06-01 13:00:00+00', '2026-06-06 13:00:00+00', 'COMPLETED', 590.00),
    (25, 27, 31, 5, 2, 2, '2026-06-03 15:00:00+00', '2026-06-05 15:00:00+00', 'COMPLETED', 196.00),
    (26, 28, 32, 1, 2, 1, '2026-06-05 12:30:00+00', '2026-06-09 12:30:00+00', 'COMPLETED', 432.00),
    (27, 29, 33, 2, 2, 2, '2026-06-07 14:00:00+00', '2026-06-10 14:00:00+00', 'COMPLETED', 237.00),
    (28, 30, 34, 3, 2, 3, '2026-06-09 16:00:00+00', '2026-06-11 16:00:00+00', 'COMPLETED', 194.00),
    (29, 31, 35, 4, 2, 2, '2026-06-11 13:00:00+00', '2026-06-16 13:00:00+00', 'COMPLETED', 410.00),
    (30, 32, 36, 5, 2, 2, '2026-06-13 15:30:00+00', '2026-06-17 15:30:00+00', 'COMPLETED', 332.00),
    (31, 33, 37, 1, 2, 4, '2026-06-15 12:00:00+00', '2026-06-18 12:00:00+00', 'COMPLETED', 405.00),
    (32, 34, 38, 2, 2, 2, '2026-06-17 14:00:00+00', '2026-06-19 14:00:00+00', 'COMPLETED', 116.00),
    (33, 35, 39, 3, 2, 1, '2026-06-19 13:30:00+00', '2026-06-23 13:30:00+00', 'COMPLETED', 368.00),
    (34, 36, 40, 4, 2, 2, '2026-06-21 16:00:00+00', '2026-06-26 16:00:00+00', 'COMPLETED', 625.00),
    (35, 37, 41, 5, 2, 2, '2026-06-24 14:00:00+00', '2026-06-27 14:00:00+00', 'COMPLETED', 630.00),
    (36, 38, 42, 1, 2, 3, '2026-06-26 13:00:00+00', '2026-06-28 13:00:00+00', 'COMPLETED', 290.00),
    (37, 39, 43, 2, 3, 3, '2026-06-28 15:00:00+00', '2026-07-03 15:00:00+00', 'COMPLETED', 390.00),
    (38, 40, 44, 3, 3, 3, '2026-06-30 12:00:00+00', '2026-07-04 12:00:00+00', 'COMPLETED', 324.00),
    (39, 41, 45, 4, 3, 2, '2026-07-02 14:30:00+00', '2026-07-05 14:30:00+00', 'COMPLETED', 264.00),
    (40, 42, 46, 5, 3, 3, '2026-07-04 13:00:00+00', '2026-07-06 13:00:00+00', 'COMPLETED', 132.00),
    (41, 43, 47, 1, 3, 4, '2026-07-05 16:00:00+00', '2026-07-09 16:00:00+00', 'COMPLETED', 276.00),
    (42, 44, 48, 2, 3, 3, '2026-07-07 14:00:00+00', '2026-07-10 14:00:00+00', 'COMPLETED', 396.00),
    (43, 45, 49, 3, 3, 3, '2026-07-08 12:30:00+00', '2026-07-13 12:30:00+00', 'COMPLETED', 590.00),
    (44, 46, 50, 4, 3, 1, '2026-07-10 15:00:00+00', '2026-07-12 15:00:00+00', 'COMPLETED', 460.00),
    (45, 47, 51, 5, 3, 3, '2026-07-11 13:00:00+00', '2026-07-15 13:00:00+00', 'COMPLETED', 260.00),
    (46, 48, 52, 1, 3, 2, '2026-07-13 14:30:00+00', '2026-07-16 14:30:00+00', 'COMPLETED', 426.00),
    (47, 49, 53, 2, 3, 3, '2026-07-15 12:00:00+00', '2026-07-17 12:00:00+00', 'COMPLETED', 142.00),
    (48, 50, 54, 3, 3, 4, '2026-07-16 15:00:00+00', '2026-07-21 15:00:00+00', 'COMPLETED', 335.00),
    (49, 51, 55, 4, 4, 4, '2026-07-17 13:00:00+00', '2026-07-21 13:00:00+00', 'COMPLETED', 408.00),
    (50, 52, 56, 5, 4, 4, '2026-07-19 14:00:00+00', '2026-07-22 14:00:00+00', 'COMPLETED', 366.00),
    (51, 53, 57, 1, 4, 4, '2026-07-24 14:00:00+00', '2026-07-27 14:00:00+00', 'BOOKED', 312.00),
    (52, 54, 58, 2, 4, 4, '2026-07-27 13:00:00+00', '2026-07-31 13:00:00+00', 'BOOKED', 544.00),
    (53, 55, 59, 3, 4, 3, '2026-07-30 15:00:00+00', '2026-08-01 15:00:00+00', 'BOOKED', 152.00),
    (54, 56, 60, 4, 4, 4, '2026-08-02 12:00:00+00', '2026-08-07 12:00:00+00', 'BOOKED', 775.00),
    (55, 2, 61, 5, 4, 4, '2026-08-05 14:30:00+00', '2026-08-08 14:30:00+00', 'BOOKED', 525.00),
    (56, 3, 62, 1, 4, 1, '2026-08-08 13:00:00+00', '2026-08-10 13:00:00+00', 'BOOKED', 550.00),
    (57, 4, 63, 2, 4, 4, '2026-08-10 16:00:00+00', '2026-08-14 16:00:00+00', 'BOOKED', 372.00),
    (58, 5, 64, 3, 4, 2, '2026-08-13 14:00:00+00', '2026-08-16 14:00:00+00', 'BOOKED', 486.00),
    (59, 6, 65, 4, 4, 4, '2026-08-16 12:30:00+00', '2026-08-21 12:30:00+00', 'BOOKED', 900.00),
    (60, 7, 66, 5, 4, 3, '2026-08-20 15:00:00+00', '2026-08-22 15:00:00+00', 'BOOKED', 256.00),
    (61, 13, 17, 1, 1, 1, '2026-01-05 14:00:00+00', '2026-01-08 14:00:00+00', 'COMPLETED', 216.00),
    (62, 24, 17, 2, 1, 2, '2026-02-10 13:00:00+00', '2026-02-15 13:00:00+00', 'COMPLETED', 360.00),
    (63, 35, 17, 3, 1, 1, '2026-04-01 15:00:00+00', '2026-04-03 15:00:00+00', 'COMPLETED', 144.00),
    (64, 14, 18, 2, 1, 1, '2026-01-08 12:00:00+00', '2026-01-12 12:00:00+00', 'COMPLETED', 280.00),
    (65, 25, 18, 3, 1, 3, '2026-02-18 14:30:00+00', '2026-02-21 14:30:00+00', 'COMPLETED', 210.00),
    (66, 36, 18, 4, 1, 1, '2026-04-06 13:00:00+00', '2026-04-12 13:00:00+00', 'COMPLETED', 420.00),
    (67, 15, 19, 3, 1, 1, '2026-01-12 16:00:00+00', '2026-01-14 16:00:00+00', 'COMPLETED', 178.00),
    (68, 26, 19, 4, 1, 4, '2026-02-23 13:00:00+00', '2026-02-27 13:00:00+00', 'COMPLETED', 356.00),
    (69, 37, 19, 5, 1, 1, '2026-04-14 14:00:00+00', '2026-04-17 14:00:00+00', 'COMPLETED', 267.00),
    (70, 16, 20, 4, 1, 2, '2026-01-16 14:00:00+00', '2026-01-21 14:00:00+00', 'COMPLETED', 420.00),
    (71, 27, 20, 5, 1, 1, '2026-03-02 12:30:00+00', '2026-03-04 12:30:00+00', 'COMPLETED', 168.00),
    (72, 38, 20, 1, 1, 3, '2026-04-20 15:00:00+00', '2026-04-24 15:00:00+00', 'COMPLETED', 336.00),
    (73, 17, 21, 5, 1, 1, '2026-01-22 13:00:00+00', '2026-01-25 13:00:00+00', 'COMPLETED', 180.00),
    (74, 28, 21, 1, 1, 2, '2026-03-06 14:00:00+00', '2026-03-12 14:00:00+00', 'COMPLETED', 360.00),
    (75, 39, 21, 2, 1, 1, '2026-04-27 16:00:00+00', '2026-04-29 16:00:00+00', 'COMPLETED', 120.00),
    (76, 18, 30, 1, 2, 2, '2026-01-06 13:00:00+00', '2026-01-10 13:00:00+00', 'COMPLETED', 472.00),
    (77, 29, 30, 2, 2, 1, '2026-02-12 15:00:00+00', '2026-02-15 15:00:00+00', 'COMPLETED', 354.00),
    (78, 40, 30, 3, 2, 2, '2026-04-02 12:00:00+00', '2026-04-07 12:00:00+00', 'COMPLETED', 590.00),
    (79, 19, 31, 2, 2, 2, '2026-01-13 14:00:00+00', '2026-01-15 14:00:00+00', 'COMPLETED', 196.00),
    (80, 30, 31, 3, 2, 3, '2026-02-20 13:30:00+00', '2026-02-25 13:30:00+00', 'COMPLETED', 490.00),
    (81, 41, 31, 4, 2, 2, '2026-04-10 15:00:00+00', '2026-04-14 15:00:00+00', 'COMPLETED', 392.00),
    (82, 20, 32, 3, 2, 1, '2026-01-19 12:30:00+00', '2026-01-22 12:30:00+00', 'COMPLETED', 324.00),
    (83, 31, 32, 4, 2, 2, '2026-03-03 14:00:00+00', '2026-03-05 14:00:00+00', 'COMPLETED', 216.00),
    (84, 42, 32, 5, 2, 4, '2026-04-16 13:00:00+00', '2026-04-22 13:00:00+00', 'COMPLETED', 648.00),
    (85, 21, 33, 4, 2, 2, '2026-01-24 15:00:00+00', '2026-01-29 15:00:00+00', 'COMPLETED', 395.00),
    (86, 32, 33, 5, 2, 1, '2026-03-09 13:00:00+00', '2026-03-13 13:00:00+00', 'COMPLETED', 316.00),
    (87, 43, 33, 1, 2, 2, '2026-04-25 14:00:00+00', '2026-04-27 14:00:00+00', 'COMPLETED', 158.00),
    (88, 22, 34, 5, 2, 3, '2026-01-30 13:00:00+00', '2026-02-01 13:00:00+00', 'COMPLETED', 194.00),
    (89, 33, 34, 1, 2, 2, '2026-03-16 14:30:00+00', '2026-03-19 14:30:00+00', 'COMPLETED', 291.00),
    (90, 44, 34, 2, 2, 4, '2026-04-28 12:00:00+00', '2026-05-03 12:00:00+00', 'COMPLETED', 485.00)
ON CONFLICT DO NOTHING;

-- Email 2FA Codes
INSERT INTO email_2fa_codes (id, user_id, code_hash, expires_at, used, attempt_count)
VALUES
    (1, 1, 'placeholder_2fa_hash_admin', '2026-07-27 12:00:00', FALSE, 0),
    (2, 2, 'placeholder_2fa_hash_john', '2026-07-27 12:15:00', FALSE, 1),
    (3, 3, 'placeholder_2fa_hash_jane_used', '2026-07-20 09:00:00', TRUE, 2)
ON CONFLICT DO NOTHING;

INSERT INTO ticket (ticket_id, created_by_employee_id, customer_id, rental_id, subject, description, status, priority)
VALUES
    (1, 4, 4, 3, 'Rental broken down on highway', 'During the rental''s use on the highway 401,  customer reports pulling over after witnessing fumes from under the hood', 'OPEN', 'HIGH'),
    (3, 5, 2, 7, 'Vomit on centre console', 'Toddler vomited over centre console while parked at Square One shopping centre.', 'IN_PROGRESS', 'LOW')
ON CONFLICT DO NOTHING;

-- Reset sequences after explicit ID inserts
SELECT setval(pg_get_serial_sequence('app_user', 'user_id'), (SELECT MAX(user_id) FROM app_user));
SELECT setval(pg_get_serial_sequence('location', 'location_id'), (SELECT MAX(location_id) FROM location));
SELECT setval(pg_get_serial_sequence('employee', 'employee_id'), (SELECT MAX(employee_id) FROM employee));
SELECT setval(pg_get_serial_sequence('vehicle', 'vehicle_id'), (SELECT MAX(vehicle_id) FROM vehicle));
SELECT setval(pg_get_serial_sequence('rental', 'rental_id'), (SELECT MAX(rental_id) FROM rental));
SELECT setval(pg_get_serial_sequence('email_2fa_codes', 'id'), (SELECT MAX(id) FROM email_2fa_codes));
SELECT setval(pg_get_serial_sequence('ticket', 'ticket_id'), (SELECT MAX(ticket_id) FROM ticket));

COMMIT;
