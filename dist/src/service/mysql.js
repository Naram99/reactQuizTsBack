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
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SQL {
    constructor() {
        this._pool = promise_1.default.createPool({
            host: process.env.DBHOST,
            port: Number(process.env.DBPORT) || 3306,
            user: process.env.DBUSER,
            database: process.env.DBDB,
            password: process.env.DBPW,
        });
        this._retArr = [];
    }
    query(querystring) {
        return __awaiter(this, void 0, void 0, function* () {
            this._retArr = yield this._pool.query(querystring);
            console.log(this._retArr[0]);
        });
    }
}
exports.default = SQL;
