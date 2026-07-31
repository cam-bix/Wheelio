# Wheelio

Wheelio is a full-stack vehicle rental application with a React/Vite frontend, a Spring Boot backend, and a PostgreSQL database hosted on AWS RDS.

## Features

- Customer signup, login, and email-based 2FA
- Vehicle browsing, booking, rental modification, and cancellation
- Stripe checkout integration for rental payments
- Customer settings and rental history views
- Employee dashboards for bookings, inventory, calendar, statistics, and support tickets
- Vehicle image upload and retrieval through AWS S3-backed backend endpoints

## Requirements

- Docker Desktop installed and running
- AWS RDS database username and password provided by us

## Run with Docker Compose

Docker Compose starts the React frontend, Spring Boot backend, and Mailpit for local 2FA email testing.

Create a root `.env` file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set the database credentials:

```env
DB_USERNAME=your-rds-username
DB_PASSWORD=your-rds-password
```

Start the app:

```powershell
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- Backend health check: http://localhost:8080/api/health
- Mailpit 2FA inbox: http://localhost:8025

When logging in, the backend sends the 2FA code to Mailpit instead of a real email inbox. Open Mailpit, copy the code from the latest email, and enter it in Wheelio.

Stop the app:

```powershell
docker compose down
```

## Environment Notes

Docker Compose reads `.env` from the project root, not from `backend/.env`. Do not commit `.env`; commit only `.env.example`.

Wheelio includes Stripe checkout integration. Docker Compose provides a placeholder Stripe key so the app can start without extra setup. To test checkout, replace the placeholder in `.env` with a valid Stripe test secret key:

```env
STRIPE_SECRET_KEY=sk_test_...
```

## Manual Development Setup

Backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Project Structure

```text
Wheelio/
  frontend/   React Vite application
  backend/    Spring Boot backend application
  docs/       Project documentation
```

## CI

GitHub Actions runs on pull requests and pushes to `main`. The workflow validates the frontend with npm and the backend with Maven.
