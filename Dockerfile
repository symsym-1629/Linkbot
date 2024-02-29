# Base image to use
FROM node:18

# App directory
WORKDIR /linkbot
RUN apt-get update && apt-get install -y python3

# Copy files in the workdir
COPY package.json package-lock.json index.js ./
COPY resources/ ./resources
COPY database/ ./database

# Install the packages
RUN npm install
RUN apt-get remove -y python3

# Command used to start the app
CMD [ "npm", "start" ]
