# Use the official Node.js Alpine image as the base image
FROM node:alpine AS build-stage

# Create a limited user
RUN adduser -D myuser
USER myuser

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files from the backend directory to the container
COPY package*.json ./

# Install the production dependencies in the container and verify the integrity of the installed npm packages
RUN npm ci --only=production --verify-only

# Copy the rest of the app's files from the backend directory to the container
COPY . .

# Build the app
RUN npm run build

# Start a new stage for the final image
FROM node:alpine

# Create a limited user
RUN adduser -D myuser
USER myuser

# Set the working directory in the container
WORKDIR /app

# Copy the built app files from the previous stage
COPY --from=build-stage /app/dist ./dist

# Make the filesystem read-only
RUN chmod -R 555 /app

# Expose the port that the app runs on
EXPOSE 3000

# Add the start command
CMD ["npm", "run", "start"]

