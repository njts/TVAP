# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm ci --only=production

# Copy the rest of the app's files to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Add the start command
CMD ["npm", "run", "start"]
