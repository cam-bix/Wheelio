/**
  Author:   Jayden Hunt
  Date:     27 June 2026
  Desc:     Wheelio Database Schema for sprint 1
 */

-- Safety check statements (DELETE AFTER CLOUD MIGRATION)
DROP TABLE IF EXISTS app_user CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS rental CASCADE;

-- Users Table
CREATE TABLE app_user (
    user_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicle (
    vehicle_id BIGSERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year SMALLINT NOT NULL CHECK (year >= 1900),
    license_plate VARCHAR(15) NOT NULL UNIQUE,
    daily_rate NUMERIC(10,2) NOT NULL CHECK (daily_rate >= 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'OUT_OF_SERVICE'))
);

-- Rentals Table
CREATE TABLE rental (
    rental_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    pickup_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('BOOKED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    total_cost NUMERIC(10,2) NOT NULL CHECK (total_cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints & Foreign Keys
    CONSTRAINT fk_rental_user
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id),

    CONSTRAINT fk_rental_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicle(vehicle_id),

    CONSTRAINT chk_rental_dates
        CHECK (return_date > pickup_date)
);
