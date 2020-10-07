"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.test = exports.local = exports.development = void 0;
const config_1 = __importDefault(require("./config"));
const { db_name, db_username, db_dialect, db_password, db_host } = config_1.default;
const dbConfig = {
    dialect: db_dialect,
    database: db_name,
    username: db_username,
    password: db_password,
    host: db_host,
    port: 5432,
    define: {
        underscored: true,
        charset: 'utf8',
        timestamps: true,
    },
    timezone: 'UTC',
};
exports.development = dbConfig;
exports.local = dbConfig;
exports.test = dbConfig;
exports.production = dbConfig;
exports.default = dbConfig;
