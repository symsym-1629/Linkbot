# Linkbot
Linkbot est un bot discord destiné à faciliter le RP jojo's bizzare adventure sur discord. Il permet de gérer des fiches de personnages, les différentes capacités, et bien d'autres choses. Il contient aussi des commandes plus générales afin de faciliter des actions courantes.

Si vous souhaitez utilisez le projet sur un autre serveur discord, n'hésitez pas à me contacter sur discord (@symsym1629), mais cela ne devrait pas poser de problème, la licence est libre.

Vous pouvez aussi contribuer pour ajouter des fonctionnalités ^^

## Comment lancer le bot afin de contribuer

### Méthode 1 : Docker
- récupérez l'image symsym1629/linkbot:develop sur docker
- créez un conteneur avec la configuration adéquate (.env) ainsi qu'une base de données liée dans le stockage (si vous utilisez sqlite) / un conteneur mariadb
- lancez le conteneur

### Méthode 2 : Installation locale
- Téléchargez les fichiers de la branche develop / ouvrez un terminal git et tapez `git clone https://github.com/symsym-1629/Linkbot.git`
- Ouvrez un terminal dans le dossier Linkbot et utilisez la commande `npm install`
- créez un fichier nommé .env (toujours dans le  dossier linkbot) et remplissez-le avec les informations nécessaires (voir exemple de .env)
- lancez le bot avec la commande `node .`

## Exemple de .env

```javascript
token="votre-token-ici"
removebg="une-clé-d'api-remove-bg (optionnel)"
clientId="le clientID du bot"
guildId="l'id du serveur principal"
logChannelId="l'id du channel de logs"
deathChannelId="le salon où annoncer les morts"
validatorId="L'id du rôle des validateurs de fiches"
SQL_URI="sqlite://database.sqlite"
```
