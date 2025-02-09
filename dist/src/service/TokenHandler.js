"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenHandler {
    constructor() {
        this._token = "";
        this._verified = "";
        this._secretKey = process.env.SECRETKEY || "qX3&uN6oeVJ^@8XinLECyw";
    }
    /**
     * createToken
     * @param user login user data from the database
     * @returns string - the signed token
     */
    createToken(user) {
        this._token = jsonwebtoken_1.default.sign({ username: user.username, level: user.level }, this._secretKey, { expiresIn: "1h" });
        return this._token;
    }
    /**
     * verify
     * @param token string - the token which arrives from frontend
     * @returns payload | string - the decoded token, or empty string
     */
    verify(token) {
        this._verified = jsonwebtoken_1.default.verify(token, this._secretKey);
        return this._verified;
    }
}
exports.default = TokenHandler;
