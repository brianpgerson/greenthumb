"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
const { db_name, db_dialect, db_username, db_password, db_host } = config_1.default;
const sequelize = new sequelize_1.Sequelize(`${db_dialect}://${db_username}:${db_password}@${db_host}:5432/${db_name}`, {
    define: {
        underscored: true,
        charset: 'utf8',
        timestamps: true
    },
    timezone: 'UTC',
});
const testConnection = (sequelize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
testConnection(sequelize);
exports.default = sequelize;
