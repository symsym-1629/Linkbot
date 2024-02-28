const { Sequelize } = require('sequelize');
const Discord = require('discord.js');
require('dotenv/config');

const database = new Sequelize(process.env.SQL_URI);

module.exports = database;