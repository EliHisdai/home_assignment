# Home Assignment - Healthcare API

This NestJS + Express project provides a REST API for managing patients and their health samples. It provides functionality for CRUD operations for patients, creating and filtering samples, as well as analytics capabilities.

## Features

- Patient management (CRUD operations)
- Health sample recording and querying
- Analytics for health metrics (average, min, max)
- Request auditing and tracking - counting how many times patient data was requested
- Swagger documentation
- Authentication-ready with guards

## Non feature

- common log service
- common databes service
- Exception filter
- constants file
- middleware to log requests
- code fully typed - no "any"s
- preatified/linted
- system tests (tests the assignment's functional requierments)

# NestJS modules:

- Common
- Audit
- patients
- Samples
- App

## Outstanding Notes:

- "heartRateReadings" renamed to "samples", to cater for other measurment types beside heartrate
- Database: to abide the given file format, the DB is file based. This introduced some limitations. In the implementation, the db is memory based and flashed every second to the file. this was done to avoid concurrency issues when dealing with parellel requests. A better implementation is to propertly use a DB like mongo (my preference), or relational.
- moving forward to a real DB, every item should have an Id as a key (including Samples)
- the requests counter imcrements every time a patient detail is accessed (patients collection), or every time a patient sample is accessed (samples collection). note, that when requesting patient with id that not exist - it will be recorded as well
- I have decided to include system tests. I prefer to avoid unit-tests that provide less value with major overhead
- env file supported should be added
- side note: As a NestJS novice, I extensively used copilot to learn and emit the boilerplate code, this can explain, for example, the detailed swagger documentation.
  I did notice the comment that it shouldn't be a production grade code... however, carried away by excitement for the help provided by copilot, I allowed myself to include additianal features, like paging, swagger and Exception filter. It was a great learning experiance :-)
- Though using copilot, I have verified 100% of the emitted codebase and made handful of adjusments and tests to get the desired results

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Running the application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

The API is fully documented using Swagger. After starting the application, visit:

http://localhost:3000/api

## Testing

npm run test:system

# Run e2e tests

npm run test:e2e

```

## Project Structure

The project follows a modular approach with the following structure:

- `src/patients` - Patient entity module
- `src/samples` - Sample entity module
- `src/audit` - Audit tracking module
- `src/common` - Shared utilities and services


```
