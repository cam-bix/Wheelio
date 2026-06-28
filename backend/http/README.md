## Start the Application

Run:

```
WheelioBackendApplication.java
```

or

```
mvn spring-boot:run
```

The API will be available at:

```
http://localhost:8080
```

---

# HTTP Methods

The backend follows RESTful API conventions.

| Method | Purpose |
|---------|----------|
| GET | Retrieve data |
| POST | Create new data |
| PUT | Update an existing resource |
| PATCH | Partially update a resource |
| DELETE | Remove a resource |

---

# Vehicle Endpoints

Base URL

```
/api/vehicles
```

---

## Get All Vehicles

```
GET /api/vehicles
```

Example Response

```json
[
    {
        "vehicleId": 1,
        "make": "Toyota",
        "model": "Corolla",
        "year": 2022,
        "licensePlate": "ABC1234",
        "dailyRate": 65.00,
        "status": "AVAILABLE"
    }
]
```

---

## Get Vehicle by ID

```
GET /api/vehicles/{id}
```

Example

```
GET /api/vehicles/1
```

---

## Create Vehicle

```
POST /api/vehicles
```

Request Body

```json
{
    "make": "Mazda",
    "model": "CX-5",
    "year": 2020,
    "licensePlate": "MAZ2020",
    "dailyRate": 75.00,
    "status": "AVAILABLE"
}
```

---

## Update Vehicle

```
PUT /api/vehicles/{id}
```

Request Body

```json
{
    "make": "Toyota",
    "model": "Corolla SE",
    "year": 2022,
    "licensePlate": "ABC1234",
    "dailyRate": 65.00,
    "status": "AVAILABLE"
}
```

---

## Delete Vehicle

```
DELETE /api/vehicles/{id}
```

---

# User Endpoints

Base URL

```
/api/users
```

---

## Get All Users

```
GET /api/users
```

---

## Get User by ID

```
GET /api/users/{id}
```

---

## Create User

```
POST /api/users
```

Example

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "passwordHash": "temporary_hash",
    "phone": "555-123-4567",
    "role": "CUSTOMER"
}
```

> **Note:** `passwordHash` is accepted when creating a user but is never returned in API responses.

---

## Update User

```
PUT /api/users/{id}
```

---

## Delete User

```
DELETE /api/users/{id}
```

---

# Rental Endpoints

Base URL

```
/api/rentals
```

---

## Get All Rentals

```
GET /api/rentals
```

Example Response

```json
{
    "rentalId": 4,
    "userId": 4,
    "customerName": "Jayden Hunt",
    "vehicleId": 1,
    "vehicleName": "2022 Toyota Corolla SE",
    "pickupDate": "2026-07-01T13:00:00Z",
    "returnDate": "2026-07-05T13:00:00Z",
    "status": "BOOKED",
    "totalCost": 260.00,
    "createdAt": "2026-06-28T14:37:01Z"
}
```

---

## Get Rental by ID

```
GET /api/rentals/{id}
```

---

## Create Rental

```
POST /api/rentals
```

Request Body

```json
{
    "userId": 4,
    "vehicleId": 1,
    "pickupDate": "2026-07-01T09:00:00-04:00",
    "returnDate": "2026-07-05T09:00:00-04:00"
}
```

### Business Rules

When a rental is created:

- The user must exist.
- The vehicle must exist.
- The vehicle must be AVAILABLE.
- The return date must be after the pickup date.
- The rental cost is calculated automatically.
- The vehicle status changes to RENTED.

---

## Complete Rental

```
PATCH /api/rentals/{id}/complete
```

When completed:

- Rental status becomes COMPLETED.
- Vehicle status becomes AVAILABLE.

---

## Cancel Rental

```
PATCH /api/rentals/{id}/cancel
```

When cancelled:

- Rental status becomes CANCELLED.
- Vehicle status becomes AVAILABLE.

---