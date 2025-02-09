import bcrypt from "bcrypt";
import { userData } from "../model/userData.type";
import MySQL from "./MySQL";
import { errorData } from "../model/errorData.type";
import { RowDataPacket } from "mysql2";

export default class UserHandler {
    private _mysql: MySQL;
    private _users: RowDataPacket[] = [];

    constructor() {
        this._mysql = new MySQL();
    }

    private async checkUserData(data: userData): Promise<errorData> {
        const retData: errorData = {
            error: false,
            code: 200,
            message: "ok",
        };

        try {
            if (data.userName === "" || data.password === "" || data.email === "")
                throw new Error("One of the required fields is empty");

            this._users = await this._mysql.selectUser(data.userName);
            if (this._users.length > 0) throw new Error("Username already exists");
        } catch (error) {
            retData.error = true;
            retData.code = 401;
            retData.message = error;
        }

        return retData;
    }

    /**
     * handleLogin TODO: Rethink the whole functionality
     * @param data userData
     * @returns errorData | userData
     */
    public async handleLogin(data: userData): Promise<userData | errorData> {
        const errorData: errorData = {
            error: false,
            code: 200,
            message: "ok",
        };
        const users = await this._mysql.selectUser(data.userName);

        if (!users || users.length !== 1) {
            errorData.error = true;
            errorData.code = 401;
            errorData.message = "Wrong login data";
        }

        const user = users[0];
        const pwmatch: boolean = await bcrypt.compare(data.password, user.password);

        if (!pwmatch) {
            throw new Error("password");
        }

        return errorData;
    }

    public async handleRegister(data: userData): Promise<errorData> {
        const checkData = await this.checkUserData(data);
        if (!checkData.error) {
            data.password = await bcrypt.hash(data.password, Number(process.env.SALT) || 10);
            await this._mysql.insertUser(data.userName, data.email, data.password);
        }

        return checkData;
    }
}
