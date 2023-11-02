# Base image to use
FROM node:18-alpine

# App directory
WORKDIR /linkbot

# Copy files in the workdir
COPY package.json package-lock.json index.js ./
COPY commands/ ./commands
COPY database/ ./database

# Install the packages
RUN npm install --python="/opt/hostedtoolcache/Python/3.11.6/x64"

# Command used to start the app
CMD [ "npm", "dockerStart" ]