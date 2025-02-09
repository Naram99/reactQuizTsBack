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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const TokenHandler_1 = __importDefault(require("./src/service/TokenHandler"));
const UserHandler_1 = __importDefault(require("./src/service/UserHandler"));
const MySQL_1 = __importDefault(require("./src/service/MySQL"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const sql = new MySQL_1.default();
const th = new TokenHandler_1.default();
const uh = new UserHandler_1.default();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    sql.queryexec("SELECT * FROM users", {});
});
app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const users = yield sql.queryexec(`SELECT u.username, u.password, ul.level 
            FROM users u 
            JOIN user_level ul 
            ON u.level_id = ul.id 
            WHERE username = ?`, { search: data.userName });
        if (!users || users.length !== 1) {
            //return res.status(401).json({ error: "Invalid login data" });
            throw new Error("Login error");
        }
        const user = users[0];
        const pwmatch = yield bcrypt_1.default.compare(data.password, user.password);
        if (!pwmatch) {
            //return res.status(401).json({ error: "Invalid login data" });
            throw new Error("Login error");
        }
        const token = th.createToken(user);
        console.log(token);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.ENVIROMENT === "",
            sameSite: "strict",
            maxAge: 3600000,
        });
        res.json({ message: "Login successful" });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
app.get("/api/checkAuth", (req, res) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            throw new Error("Not authorized");
        }
        const check = th.verify(token);
        res.json({ check });
    }
    catch (error) {
        res.status(401).json({ message: error });
    }
});
app.get("/logout", (req, res) => {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: process.env.ENVIROMENT === "",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
});
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const uhData = {
        userName: data.userName,
        email: data.email,
        password: data.password,
    };
    yield uh.handleRegister(uhData);
}));
app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
