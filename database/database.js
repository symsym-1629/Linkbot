const { Sequelize } = require('sequelize');
const Discord = require('discord.js');
require('dotenv/config');

const database = new Sequelize(process.env.SQL_URI, {
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    },    
});

module.exports = database;