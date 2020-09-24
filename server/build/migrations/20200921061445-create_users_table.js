"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable('users', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                comment: 'Date of creation',
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                comment: 'Date of the last update',
            },
        });
    },
    down: (queryInterface, _) => {
        return queryInterface.dropTable('users');
    }
};
