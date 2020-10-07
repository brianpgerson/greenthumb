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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
const jwt_middleware_1 = require("../middleware/auth/jwt-middleware");
const user_service_1 = require("../services/user-service");
const configureRouter = (router) => {
    router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const alreadyExists = yield user_service_1.findUserByEmail(email);
        if (alreadyExists) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        if (!email || !password) {
            return res.status(400).json({ error: 'Must include email and password in signup request' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        var userRequest = { email, password: hashedPassword };
        const user = yield user_service_1.createUser(userRequest);
        if (!user) {
            return res.status(500).json({ error: 'Unable to create user' });
        }
        const liu = { email: user.email, userId: user.id };
        const accessToken = jsonwebtoken_1.default.sign(liu, config_1.default.jwt_secret, { expiresIn: '7s' });
        const refreshToken = jsonwebtoken_1.default.sign(liu, config_1.default.jwt_refresh_secret, { expiresIn: '30d' });
        return res.json({ accessToken, refreshToken });
    }));
    router.post('/login', passport_1.default.authenticate('local', {
        session: false
    }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = req;
        if (user === undefined) {
            return res.status(400).json({ error: 'No credentials supplied in login request' });
        }
        const liu = { email: user.email, userId: user.id };
        const accessToken = jsonwebtoken_1.default.sign(liu, config_1.default.jwt_secret, { expiresIn: '7s' });
        const refreshToken = jsonwebtoken_1.default.sign(liu, config_1.default.jwt_refresh_secret, { expiresIn: '30d' });
        return res.json({ accessToken, refreshToken });
    }));
    router.post('/verify', jwt_middleware_1.verifyJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('verified: ', req.user);
        return res.status(200).json({ valid: true });
    }));
    router.post('/refresh', jwt_middleware_1.refreshJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = req;
        console.log('user refresh', user);
        if (user === undefined) {
            return res.status(401).json({ error: 'Missing user.' });
        }
        const liu = { email: user.email, userId: user.id };
        const accessToken = jsonwebtoken_1.default.sign(liu, config_1.default.jwt_secret, { expiresIn: '1d' });
        return res.json({ accessToken });
    }));
    return router;
};
exports.default = configureRouter;
