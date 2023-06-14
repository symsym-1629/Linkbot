const { Sequelize } = require('sequelize');

const database = require('../init.js');
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
  ficheurl: Sequelize.STRING,
  hasoverheaven: Sequelize.BOOLEAN,
  hasrequiem: Sequelize.BOOLEAN,
  standname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  standstats: {
    type: Sequelize.STRING,
    allowNull: true
  },
  imagelink: {
    type: Sequelize.STRING,
    allowNull: true
  },
  userid: Sequelize.BIGINT
});

module.exports = Perso;