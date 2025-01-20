const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');
const User = require("./user")

const facture = sequelize.define('facture', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateBill: {
        type: DataTypes.DATE,
        allowNull: false
    },
     unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    tva: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    sequelize,
    freezeTableName: true,
});

facture.belongsTo(User,{foreignKey:"factureUserId",onDelete:"cascade"});
User.hasMany(facture, {foreignKey: 'factureUserId',onDelete:"cascade"});

module.exports = facture;

//besoin mail pass valid token valid token role 