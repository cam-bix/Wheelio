# Wheelio Backend

Spring Boot backend service for Wheelio.

## Requirements

- Java 21
- Maven
- PostgreSQL for local `dev` and deployed `prod` profiles

## Wheelio Database Setup

Wheelio uses PostgreSQL for persistent data storage. Database setup files are located in:

backend/database/

## Files:

schema.sql   - Creates tables, constraints, and indexes
seed.sql     - Adds sample development data
README.md    - Database setup instructions

Run the files in this order:

1. schema.sql
2. seed.sql
   Environment Variables

The backend connects to PostgreSQL using environment variables. Do not commit real database credentials to GitHub.

## Required variables (Environment variables):

DB_HOST=wheelio-db.cxiysoa26mk6.ca-central-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=wheelio
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

The real values should be stored locally in a .env file or in your local run configuration.
Your real .env file should never be committed.

Add this to .gitignore if not already present:

.env

Commit only a safe example file:

.env.example

Example .env.example:

DB_HOST=wheelio-db.cxiysoa26mk6.ca-central-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=wheelio
DB_USERNAME=your-username
DB_PASSWORD=your-password
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

## To connect using pgAdmin:

Host: wheelio-db.cxiysoa26mk6.ca-central-1.rds.amazonaws.com
Port: 5432
Database: wheelio
Username: database username
Password: database password

After connecting to the wheelio database, open Query Tool and run:

schema.sql
seed.sql

## To verify the setup:

SELECT * FROM app_user;
SELECT * FROM employee;
SELECT * FROM vehicle;
SELECT * FROM rental;

Warning, Some development schema files may contain:

DROP TABLE IF EXISTS

Be careful running these against the shared AWS database because they can delete existing data.

## Run Tests

```sh
cd backend
mvn test
```

Tests use the `test` Spring profile and an in-memory H2 database. H2 is not configured for application runtime profiles.
git br
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
