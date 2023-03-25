# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json into the container at /app
COPY package.json /app

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application into the container at /app
COPY . /app

# Make port 3069 available to the world outside this container
EXPOSE 3069

# Define environment variable
ENV NODE_ENV production

# Run app.js using nodemon when the container launches
CMD ["npm", "run", "deploy"]
