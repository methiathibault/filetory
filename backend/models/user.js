const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const user = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    familyName: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    postalAdress: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    connectionToken: {
        type: DataTypes.STRING,
        allowNull: true
    }, roles: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user"
    },
    usedStorage: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    totalStorage: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 21474836480
    }
}, {
    sequelize,
    freezeTableName: true,
});

module.exports = user;