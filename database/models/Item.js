const { Sequelize } = require('sequelize');

const database = require('../database.js');
var Item = database.define('items', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  }
});

module.exports = Item;