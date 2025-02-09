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
class MySQL {
    constructor() {
        this._pool = promise_1.default.createPool({
            host: process.env.DBHOST,
            port: Number(process.env.DBPORT) || 3306,
            user: process.env.DBUSER,
            database: process.env.DBDB,
            password: process.env.DBPW,
        });
        this._rows = [];
        this._fields = [];
    }
    /**
     * query
     * Executes a MySQL query with the given parameters
     * @param querystring string MySQL query
     * @param params optional object with data for the query
     * @returns array with the matching data
     */
    queryexec(querystring_1) {
        return __awaiter(this, arguments, void 0, function* (querystring, params = {}) {
            // TODO: query creator
            this._rows = this._fields = [];
            [this._rows, this._fields] = yield this._pool.query(querystring, params.search);
            return this._rows;
        });
    }
    /**
     * insertUser
     * @param userName string
     * @param password string hashed
     */
    insertUser(userName, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Default user level is 4 (user), can be upgraded in admin menu
            const query = "INSERT INTO users SET username = ?, email = ?, password = ?, level_id = 4";
            yield this._pool.query(query, [userName, email, password]);
        });
    }
    /**
     * allRows
     * @returns array with the last executed query data
     */
    allRows() {
        return this._rows;
    }
    /**
     * lastInsertId
     * @returns the last inserted database row id
     */
    lastInsertId() {
        return this.queryexec("SELECT LAST_INSERT_ID()");
    }
}
exports.default = MySQL;
