import bcrypt from "bcrypt";
import { userData } from "../model/userData.type";
import MySQL from "./mysql";

export default class UserHandler {
    private _mysql: MySQL;

    constructor() {
        this._mysql = new MySQL();
    }

    private checkUserData(data: userData) {
        if (data.userName === "" || data.password === "") return false;
        return true;
    }

    public async handleLogin(data: userData) {}

    public async handleRegister(data: userData) {
        if (this.checkUserData(data)) {
            data.password = await bcrypt.hash(data.password, Number(process.env.SALT) || 10);
            await this._mysql.insertUser(data.userName, data.email, data.password);
        }
    }
}
