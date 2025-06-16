# Base de l'image utilisée
FROM node:18-slim

# Répertoire de l'application
WORKDIR /app/Linkbot

# Installation des dépendances nécessaires
RUN apt-get update && apt-get install -y python3

# Copie des fichiers de packages
COPY package.json package-lock.json ./

# Copie de tous les fichiers de l'application
COPY . .

# Installation des packages
RUN npm install

# Nettoyage des dépendances pour réduire la taille de l'image
RUN apt-get remove -y python3

# Lancer l'application
CMD ["npm", "start"]