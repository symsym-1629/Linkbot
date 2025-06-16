# Linkbot
[![Version](https://img.shields.io/badge/version-2.6.0a-blue.svg)](https://github.com/symsym-1629/Linkbot)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Linkbot est un bot Discord destiné à faciliter le RP jojo's bizzare adventure sur discord. Il permet de gérer des fiches de personnages, les différentes capacités, et bien d'autres choses. Il contient aussi des commandes plus générales afin de faciliter des actions courantes.

## 🌟 Fonctionnalités Principales

- 🎭 **Gestion des Personnages**
  - Création et modification de fiches de personnages
  - Système de validation des fiches
  - Gestion des morts de personnages
- 🎵 **Système Musical**
  - Lecture de musique depuis YouTube
  - File d'attente de lecture
  - Contrôles de lecture (pause, skip, etc.)
- 📊 **Système de Logs**
  - Suivi des actions importantes
  - Annonces automatiques
  - Historique des modifications

## 🚀 Installation

### Prérequis
- Node.js v18.16.0 ou supérieur
- npm (généralement inclus avec Node.js)
- Un token Discord Bot
- (Optionnel) Une clé API Remove.bg

### Méthode 1 : Docker
```bash
# Récupérer l'image
docker pull symsym1629/linkbot:develop

# Créer et lancer le conteneur
docker run -d \
  --name linkbot \
  -v /chemin/vers/donnees:/app/database \
  --env-file .env \
  symsym1629/linkbot:develop
```
```bash
# Vous pouvez aussi utiliser le fichier docker-compose.yml pour créer votre image et lancer le conteneur
docker-compose up -d --build
# Dans ce cas, vous devez créer un fichier un volume pour les logs nommmé linkbotDebug
```
### Méthode 2 : Installation Locale
```bash
# Cloner le repository
git clone https://github.com/symsym-1629/Linkbot.git
cd Linkbot

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer le fichier .env avec vos informations

# Lancer le bot
npm start
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet avec les variables telles que 
définies dans le fichier `.env.example` et comme suit :

```env
token="votre-token-ici"
removebg="une-clé-d'api-remove-bg (optionnel)"
clientId="le clientID du bot"
guildId="l'id du serveur principal"
logChannelId="l'id du channel de logs"
deathChannelId="le salon où annoncer les morts"
validatorId="L'id du rôle des validateurs de fiches"
SQL_URI="sqlite://database.sqlite"
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de Code
- Utilisez ESLint pour la qualité du code
- Suivez les conventions de nommage existantes
- Ajoutez des commentaires pour le code complexe
- Testez vos modifications avant de soumettre

## 📝 Roadmap

- [ ] Système de combat automatisé
- [ ] Intégration avec d'autres APIs (ex: génération d'images)
- [ ] Interface web pour la gestion des fiches
- [ ] Système de quêtes et d'événements
- [ ] Amélioration du système de logs

## 📞 Support

Pour toute question ou suggestion :
- Ouvrez une issue sur GitHub
- Contactez @symsym1629 sur Discord

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
