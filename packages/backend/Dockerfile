# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD [ "npm", "run", "start-be:prod" ]