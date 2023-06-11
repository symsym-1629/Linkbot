const { Sequelize } = require('sequelize');

const database = require('../init.js');
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