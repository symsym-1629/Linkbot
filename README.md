# Linkbot
Repo officiel du linkbot (pour tutur)

## Comment lancer le bot afin de contribuer

### Méthode 1 : Docker
- récupérez l'image symsym1629/linkbot:develop sur docker
- créez un conteneur avec la configuration adéquate (.env) ainsi qu'une base de données liée dans le stockage (si vous utilisez sqlite) / un conteneur mariadb
- lancez le conteneur

### Méthode 2 : Installation locale
- Téléchargez les fichiers de la branche develop / ouvrez un terminal git et tapez `git clone https://github.com/symsym-1629/Linkbot.git`
- Ouvrez un terminal dans le dossier Linkbot et utilisez la commande `npm install`
- créez votre fichier .env
- si vous n'avez pas déjà uploadé les commandes dans discord, faites `node scripts/deploy-commands.js`
- lancez le bot avec la commande `node .`

## Exemple de .env

```javascript
token="votre-token-ici"
removebg="une-clé-d'api-remove-bg (optionnel)"
clientId="le clientID du bot"
guildId="l'id du serveur jojo"
logChannelId="l'id du channel de logs"
deathChannelId="le salon où annoncer les morts"
validatorId="L'id du rôle des validateurs de fiches"
SQL_URI="sqlite://database.sqlite"
```
