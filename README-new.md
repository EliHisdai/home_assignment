# Healthcare Patient Management API

## Description

This is a NestJS-based RESTful API for managing healthcare patient data and their health samples. It provides endpoints for managing patients and their health metrics, with support for analytics and audit tracking.

## Features

- Patient management (CRUD operations)
- Health sample recording and querying
- Analytics for health metrics (average, min, max)
- Request auditing and tracking - counting how many times patient data was requested
- Swagger documentation
- Authentication-ready with guards

# NestJS modules:

- Common
- patients
- Samples
- Audit

## Non feature

- common log service
- common databes service
- constants file
- middleware to log requests
- preatified/linted code

## Outstanding Notes:

- As a NestJS novice, I extensively used copilot to help emmiting the boilerplate code, this can explain the detailed swagger documentation :)
- "heartRateReadings" renamed to "samples", to cater for other measurment types beside heartrate
- Database: to abide the given file format, the DB is file based. This introduced some limitations. In the implementation, the db is memory based and flashed every second to the file. this was done to avoid concurrency issues when dealing with parellel requests. A better implementation is to propertly use a DB like mongo (my preference), or relational.
- moving forward to a real DB, every item should have an Id as a key (including Samples)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash

# system tests
$ npm run test:system
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
Also, root endpoint redirect to the swagger page

```
http://localhost:3000/api
```

## Project Structure

```
src/
  ├── audit/               # Audit logging and tracking
  ├── common/              # Shared utilities, guards, middleware
  ├── patients/            # Patient entity and endpoints
  ├── samples/             # Sample measurements and analytics
  └── main.ts              # Application entry point
```

## Data Model

### Patient

- `patientId`: string - Unique identifier
- `name`: string - Patient full name
- `age`: number - Patient age
- `gender`: string (enum) - Patient gender

### Sample

- `patientId`: string - Reference to Patient
- `timestamp`: string - UTC timestamp
- `heartRate`: number - Heart rate measurement

### Audit Log

- `patientId`: string - Reference to Patient
- `patients`: number - Count of Patient entity requests
- `samples`: number - Count of Sample entity requests
- `timestamp`: string - UTC timestamp of last request

## License

This project is MIT licensed.
