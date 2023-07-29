# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files to the working directory
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install PNPM globally
RUN npm install -g pnpm 

# Install the dependencies for the workspace you want to build
RUN pnpm install --filter backend

# Copy the workspace code to the working directory
COPY packages/backend ./packages/backend

RUN pnpm install --filter backend

# Build the workspace
RUN pnpm run build-be

# Expose the port on which the application will run
EXPOSE 3000

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD [ "pnpm", "run", "start-be:prod" ]