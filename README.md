# Wheelio

Wheelio is organized as a full-stack project with a React Vite frontend, a Spring Boot backend, and project documentation.

## Project Structure

```text
Wheelio/
  frontend/   React Vite application
  backend/    Spring Boot backend application
  docs/       Project documentation
```

## Frontend

```sh
cd frontend
npm install
npm run dev
```

To build the frontend:

```sh
cd frontend
npm run build
```

## CI

GitHub Actions runs on pull requests and pushes to `main`. The workflow validates the frontend with npm and the backend with Maven.
