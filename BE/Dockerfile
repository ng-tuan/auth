# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Copy the wait-for-it script
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Make the wait-for-it script executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run your application
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "run", "dev"]
