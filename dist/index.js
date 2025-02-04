"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("./src/service/mysql"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    const sql = new mysql_1.default();
    sql.query("SELECT * FROM users");
});
app.post("/api/login", (req, res) => { });
app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
