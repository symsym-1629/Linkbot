const { Sequelize } = require('sequelize');
const database = require('../database.js');

// initialisation de la table Perso
var Inventory = database.define('inventory', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    rolls: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "2"
    },
    rota1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    rota2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    rota3: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    rota4: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    hamon1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    hamon2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    hamon3: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
});

module.exports = Inventory;