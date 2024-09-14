# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy both package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install npm dependencies using npm ci for a clean, reproducible build
RUN npm ci

# Copy the rest of the application code to the working directory
COPY src/ ./src

# Copy .env file to the working directory
COPY .env ./

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "src/index.js"]
