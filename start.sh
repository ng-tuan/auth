#!/bin/bash

# Define the image name
IMAGE_NAME="auth-app"

# Build the Docker image for the Node.js application
docker build -t $IMAGE_NAME .

# Stop and remove any running containers
docker-compose down

# Run Docker Compose to build and start the services
docker-compose up --build