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
exports.refreshJwt = exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
const User_1 = __importDefault(require("../../models/User"));
exports.verifyJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing auth credential' });
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const user = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        req.user = user;
        return next();
    }
    catch (e) {
        if (e.name === 'TokenExpiredError') {
            console.log('expired token');
            return res.status(498).json({ error: e.message });
        }
        return res.status(401).json({ error: e.message });
    }
});
exports.refreshJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenHeader = req.header('xxx-refresh-token');
    if (!refreshTokenHeader) {
        return res.status(401).json({ error: 'No refresh token supplied' });
    }
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing auth credential' });
    }
    const refreshToken = refreshTokenHeader.split('Token ')[1];
    const authToken = authHeader.split('Bearer ')[1];
    try {
        const user = jsonwebtoken_1.default.verify(authToken, config_1.default.jwt_secret, { ignoreExpiration: true });
        const refreshUser = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
        if (user.email !== refreshUser.email || user.userId !== refreshUser.userId) {
            return res.status(401).json({ error: 'Mismatched auth and refresh tokens!' });
        }
        const persistedUser = yield User_1.default.findByPk(user.userId);
        if (persistedUser !== null) {
            req.user = refreshUser;
            return next();
        }
        res.status(401).json({ error: 'Forbidden' });
    }
    catch (e) {
        if (e.name === "TokenExpiredError") {
            console.log('expired token');
            return res.status(498).json({ error: e.message });
        }
        return res.status(401).json({ error: e.message });
    }
});
