const { Sequelize } = require('sequelize');
require('dotenv/config');

const database = new Sequelize(process.env.SQL_URI);

module.exports = database;
