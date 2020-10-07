"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable('plants', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: new sequelize_1.DataTypes.STRING(128),
            },
            name: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                }
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
