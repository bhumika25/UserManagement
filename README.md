# Project Overview and Setup Instructions
1.Backend stack:
- Fastify for building APIs
- PostgreSQL as the database
- Prisma as the ORM
- Docker for containerization
2. Prerequisites:
-Ensure Docker Desktop is installed on your system
3. Start the application:
- Navigate to the user-profile-service directory (where docker-compose.yml is located)

Run:
- docker-compose up --build

Access the application:
- Open http://localhost:3000/ in your browser

4. Run unit tests:
-Unit tests are written using Vitest
Ensure Docker is running, then execute:
npm run test

5. API documentation:
Swagger docs available at:
http://localhost:3000/docs

6. Linting and formatting:

ESLint is installed:
npm run eslint

Prettier is installed:
npm run format

Logging:
Logging is handled using Pino, a high-performance Node.js logger

Install dependencies:
To run tests, ESLint, or Prettier locally, first install dependencies:
npm install

# API Endpoints Overview

Retrieve a single profile-
URL: GET /profiles/:id -
Purpose: Fetch a specific user profile by ID

Retrieve all profiles-
URL: GET /profiles -
Purpose: List all user profiles in the system

Create a new profile-
URL: POST /profiles -
Purpose: Create a new profile entry in the database

Update an existing profile-
URL: PUT /profiles/:id -
Purpose: Fully update a profile by its ID

PUT is used for updates assuming the entire profile object is sent.If partial updates become common, consider supporting PATCH
Logging with Pino is Chosen for performance. It handles high-throughput environments well with JSON-structured logs.
