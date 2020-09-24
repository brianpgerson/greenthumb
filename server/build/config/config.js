"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    db_username: process.env.DB_USERNAME || '',
    db_password: process.env.DB_PASSWORD || '',
    db_name: process.env.DB_NAME || '',
    db_host: process.env.DB_HOST || '',
    db_dialect: process.env.DB_DIALECT || '',
    jwt_secret: process.env.JWT_SECRET || '',
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
};
exports.default = config;
