# Use a base image with Node.js
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt inside the container
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the necessary port
EXPOSE 3000

# Start your Node.js application
CMD ["npm", "start"]
