import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import SQL from "./src/service/mysql";
import TokenHandler from "./src/service/tokenHandler";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

const sql: SQL = new SQL();
const th: TokenHandler = new TokenHandler();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    sql.queryexec("SELECT * FROM users", {});
});

app.post("/api/login", async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const users: any = await sql.queryexec(
            `SELECT u.username, u.password, ul.level 
            FROM users u 
            JOIN user_level ul 
            ON u.level_id = ul.id 
            WHERE username = ?`,
            { search: data.userName }
        );

        if (!users || users.length !== 1) {
            //return res.status(401).json({ error: "Invalid login data" });
            throw new Error("Login error");
        }

        const user = users[0];

        const pwmatch: boolean = await bcrypt.compare(data.password, user.password);

        if (!pwmatch) {
            //return res.status(401).json({ error: "Invalid login data" });
            throw new Error("Login error");
        }

        const token: string = th.createToken(user);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.ENVIROMENT === "",
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/checkAuth", (req: Request, res: Response) => {
    try {
        const token: string = req.cookies.authToken;

        if (!token) {
            throw new Error("Not authorized");
        }

        const check = th.verify(token);
        res.json({ check });
    } catch (error) {
        res.status(401).json({ message: error });
    }
});

app.post("/api/register", (req: Request, res: Response) => {
    const data = req.body;
});

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
