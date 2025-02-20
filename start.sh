#!/bin/bash
# Build the Docker image for the Node.js application
docker build -t my-node-app .

# Stop and remove any running containers
docker-compose down

# Run Docker Compose to build and start the services
docker-compose up --build