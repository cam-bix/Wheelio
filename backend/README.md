# Wheelio Backend

Spring Boot backend service for Wheelio.

## Requirements

- Java 21
- Maven
- PostgreSQL for local `dev` and deployed `prod` profiles

## Environment Variables

Copy `.env.example` into your local environment manager and provide real values:

```sh
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wheelio
DB_USERNAME=wheelio
DB_PASSWORD=change-me
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
```

Database credentials are loaded from environment variables. Do not commit real secrets.

## Run Locally

Start PostgreSQL, export the required variables, then run:

```sh
cd backend
mvn spring-boot:run
```

The backend starts at `http://localhost:8080` by default. The application health endpoint is:

```text
GET http://localhost:8080/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Run Tests

```sh
cd backend
mvn test
```

Tests use the `test` Spring profile and an in-memory H2 database. H2 is not configured for application runtime profiles.

## Project Structure

```text
backend/
  src/main/java/com/wheelio/
    config/       Application configuration package
    controller/   HTTP controllers
    dto/          API data transfer objects
    entity/       Reserved for future persistence models
    repository/   Reserved for future Spring Data repositories
    service/      Application services
    WheelioBackendApplication.java
  src/main/resources/
    application.properties
    application-dev.properties
    application-test.properties
    application-prod.properties
  src/test/java/com/wheelio/
```

The current backend setup is schema-neutral. It intentionally does not define production entities, tables, migrations, or business models.
