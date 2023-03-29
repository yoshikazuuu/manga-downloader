# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json into the container at /app
COPY package.json /app

# Install pnpm and any needed packages specified in package.json
RUN npm install -g pnpm && pnpm install --production

# Copy the rest of the application into the container at /app
COPY . /app

# Make port 3069 available to the world outside this container
EXPOSE 3069

# Define the location for the certificates within the container
ENV CERTS_DIR /certs

# Run app.js using nodemon when the container launches
CMD ["pnpm", "run", "deploy"]
