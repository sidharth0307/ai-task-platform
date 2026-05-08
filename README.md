# Distributed AI Task Processing Platform

An enterprise-grade, decoupled microservice architecture built for asynchronous background processing. 

This platform allows users to submit heavy text-processing tasks via a modern React dashboard. Instead of blocking the Node.js event loop, tasks are pushed to a Redis message broker and processed asynchronously by a dedicated Python worker, providing real-time status updates to the client.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS (Polling for real-time state)
* **Backend API:** Node.js, Express, MongoDB (JWT Auth, Rate Limiting, Helmet)
* **Message Broker:** Redis (Queueing system)
* **Background Worker:** Python (Redis BLPOP for non-polling job execution)
* **Containerization:** Docker (Multi-stage, non-root user builds)

## Architecture Flow
1. User authenticates via React frontend (JWT).
2. User submits a task payload to the Node API.
3. Node API saves the `PENDING` state to MongoDB and pushes a job ticket to the Redis `task_queue`.
4. Python Worker (listening to Redis) instantly pops the job, processes the payload, and updates MongoDB to `SUCCESS`.
5. React frontend dynamically reflects the completed state.

## Local Quick Start (Docker Compose)
To run the entire microservice stack locally without Kubernetes:

```bash
# 1. Clone the repository
git clone <your-app-repo-url>
cd ai-task-platform

# 2. Start the stack
docker-compose up -d --build

# 3. Access the Application
Go to http://localhost:8080 in your browser.