/**
  Author:   Jayden Hunt & Sebastian Caro
  Date:     27 June 2026
  Desc:     Wheelio Database Schema for sprint 2
 */

-- Safety check statements (DELETE AFTER CLOUD MIGRATION)
DROP TABLE IF EXISTS rental CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

-- Users Table
CREATE TABLE app_user (
    user_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER'
        CHECK (role IN ('CUSTOMER', 'ADMIN', 'EMPLOYEE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_first_name_not_blank
        CHECK (TRIM(first_name) <> ''),

    CONSTRAINT chk_user_last_name_not_blank
        CHECK (TRIM(last_name) <> ''),

    CONSTRAINT chk_user_email_format
        CHECK (email LIKE '%_@_%._%')
);

-- Employees Table
CREATE TABLE employee (
    employee_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE,
    location_id BIGINT NOT NULL,
    position VARCHAR(50) NOT NULL
        CHECK (position IN ('MANAGER', 'CUSTOMER_SERVICE', 'MECHANIC', 'ADMIN_STAFF')),
    employment_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (employment_status IN ('ACTIVE', 'ON_LEAVE', 'TERMINATED')),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_user
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_employee_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON DELETE RESTRICT

    CONSTRAINT chk_employee_first_name_not_blank
        CHECK (TRIM(first_name) <> ''),

    CONSTRAINT chk_employee_last_name_not_blank
        CHECK (TRIM(last_name) <> ''),

    CONSTRAINT chk_employee_email_format
        CHECK (email LIKE '%_@_%._%')
);

-- Locations Table
CREATE TABLE location (
    location_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address_line VARCHAR(150) NOT NULL,
    city VARCHAR(80) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_location_name_not_blank
        CHECK (TRIM(name) <> ''),

    CONSTRAINT chk_location_address_not_blank
        CHECK (TRIM(address_line) <> ''),

    CONSTRAINT chk_location_city_not_blank
        CHECK (TRIM(city) <> '')
);

-- Vehicles Table
CREATE TABLE vehicle (
    vehicle_id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year SMALLINT NOT NULL CHECK (year BETWEEN 1900 AND 2035),
    license_plate VARCHAR(15) NOT NULL UNIQUE,
    daily_rate NUMERIC(10,2) NOT NULL CHECK (daily_rate > 0),
    status VARCHAR(50) NOT NULL
        CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE')),

    CONSTRAINT fk_vehicle_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON DELETE RESTRICT

    CONSTRAINT chk_vehicle_make_not_blank
        CHECK (TRIM(make) <> ''),

    CONSTRAINT chk_vehicle_model_not_blank
        CHECK (TRIM(model) <> ''),

    CONSTRAINT chk_vehicle_license_plate_not_blank
        CHECK (TRIM(license_plate) <> '')
);

-- Rentals Table
CREATE TABLE rental (
    rental_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    employee_id BIGINT,
    pickup_location_id BIGINT NOT NULL,
    return_location_id BIGINT NOT NULL,
    pickup_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'BOOKED'
        CHECK (status IN ('BOOKED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    total_cost NUMERIC(10,2) NOT NULL CHECK (total_cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints & Foreign Keys
    CONSTRAINT fk_rental_user
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_rental_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicle(vehicle_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_rental_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee(employee_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_rental_pickup_location
        FOREIGN KEY (pickup_location_id)
        REFERENCES location(location_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_rental_return_location
        FOREIGN KEY (return_location_id)
        REFERENCES location(location_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_rental_dates
        CHECK (return_date > pickup_date)
);

-- Indexes for faster searching/filtering
CREATE INDEX idx_vehicle_status ON vehicle(status);
CREATE INDEX idx_rental_user_id ON rental(user_id);
CREATE INDEX idx_rental_vehicle_id ON rental(vehicle_id);
CREATE INDEX idx_rental_employee_id ON rental(employee_id);
CREATE INDEX idx_rental_status ON rental(status);
CREATE INDEX idx_employee_position ON employee(position);
CREATE INDEX idx_employee_status ON employee(employment_status);
CREATE INDEX idx_vehicle_location_id ON vehicle(location_id);
CREATE INDEX idx_rental_pickup_location_id ON rental(pickup_location_id);
CREATE INDEX idx_rental_return_location_id ON rental(return_location_id);