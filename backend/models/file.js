const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');
const User = require("./user")

const file = sequelize.define('file', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    freezeTableName: true,
});

file.belongsTo(User, { foreignKey: "userId", onDelete: "cascade" });
User.hasMany(file, { foreignKey: 'userId', onDelete: "cascade" });

module.exports = file;