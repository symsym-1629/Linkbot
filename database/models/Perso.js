const { Sequelize } = require('sequelize');
const database = require('../database.js');

// initialisation de la table Perso
var Perso = database.define('persos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  race: Sequelize.STRING,
  affiliation: Sequelize.STRING,
  rotationlevel: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  hamonlevel: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  vampirismelevel: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  cplevel: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  ficheurl: Sequelize.STRING,
  hasoverheaven: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  hasrequiem: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  standname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  standstats: {
    type: Sequelize.STRING,
    allowNull: true
  },
  actname: Sequelize.STRING,
  hasacts: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  imagelink: {
    type: Sequelize.STRING,
    allowNull: true
  },
  userid: Sequelize.STRING,
  dead: Sequelize.BOOLEAN
});

module.exports = Perso;