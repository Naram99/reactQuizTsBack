import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import TokenHandler from "./src/service/TokenHandler";
import UserHandler from "./src/service/UserHandler";
import MySQL from "./src/service/MySQL";
import { userData } from "./src/model/userData.type";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

const sql: MySQL = new MySQL();
const th: TokenHandler = new TokenHandler();
const uh: UserHandler = new UserHandler();

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
        console.log(token);
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

app.get("/logout", (req: Request, res: Response) => {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: process.env.ENVIROMENT === "",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
});

app.post("/api/register", async (req: Request, res: Response) => {
    const data = req.body;
    const uhData: userData = {
        userName: data.userName,
        email: data.email,
        password: data.password,
    };

    await uh.handleRegister(uhData);
});

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
