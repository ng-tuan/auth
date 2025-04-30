# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Copy the .env file
COPY .env .env

# Copy the wait-for-it script
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Make the wait-for-it script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 3000

# Use nodemon for development
CMD ["npm", "run", "dev"]
