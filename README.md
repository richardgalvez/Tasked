# Tasked

Task management made simple.

## Deployment (Locally via Docker Compose)

Install git, Docker, and Docker Compose to your machine. Clone this repository then change directory to root of the project.

Linux (Ubuntu), macOS:

```bash
docker compose up --build -d
```

Linux ():

```bash
docker-compose up --build -d
```

The application should be available as follows:

localhost:8000 - FastAPI Backend (localhost:8000/docs for Swagger UI)

localhost:5432 / postgres:5342 - Postgres DB

localhost:5173 - React Frontend
