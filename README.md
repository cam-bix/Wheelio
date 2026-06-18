# Wheelio

Wheelio is organized as a full-stack project with a React Vite frontend, an empty backend placeholder, and project documentation.

## Project Structure

```text
Wheelio/
  frontend/   React Vite application
  backend/    Backend placeholder
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

GitHub Actions runs on every push and pull request. The workflow installs frontend dependencies with `npm ci` and builds the React app.
test branch protections