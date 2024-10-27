# Use the official Node image as the base
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the project files into the container
COPY . .

# Expose port 8080 for the web server
EXPOSE 8087

# Run the development server
CMD ["npm", "run", "start"]
