# Base image to use
FROM node:18-alpine

# App directory
WORKDIR /linkbot

# Copy files in the workdir
COPY package.json package-lock.json index.js ./
COPY commands/ ./commands

# Install the packages (yarn is already in the node image, don't need to install it)
RUN npm install

# Command used to start the app
CMD [ "node", "dockerStart" ]