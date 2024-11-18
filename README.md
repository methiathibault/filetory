# Full Stack Application with Express, Sequelize, PostgreSQL, and React

This project is a full-stack web application that uses Express for the backend, Sequelize for ORM, PostgreSQL as the database, and React with Vite for the frontend.

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js

### Setup

1. Clone the repository:

```sh
git clone git@github.com:methiathibault/filetory.git
cd filetory
```

2. Install dependencies:
Frontend
```sh
cd frontend
npm install
```
Backend
```sh
cd backend
npm install
```

3. Create a `.env` file in the backend directory based on `env.back`

4. Build and start the services using Docker Compose:
```sh
docker compose up --build
```

5. Generate the database (do this only for the first time):
```sh
docker compose exec api node database/config.js
```

### Accessing the Application
- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:5173`
