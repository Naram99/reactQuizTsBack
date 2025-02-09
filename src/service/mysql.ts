import mysql, { FieldPacket, QueryResult, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export default class MySQL {
    private _pool;
    private _rows: RowDataPacket[];
    private _fields: FieldPacket[];

    constructor() {
        this._pool = mysql.createPool({
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
    public async queryexec(querystring: string, params: { [index: string]: string | number } = {}) {
        // TODO: query creator

        this._rows = this._fields = [];
        [this._rows, this._fields] = await this._pool.query(querystring, params.search);

        return this._rows;
    }

    /**
     * selectUser
     */
    public async selectUser(username: string): Promise<mysql.RowDataPacket[]> {
        const query = `SELECT u.username, u.password, ul.level 
            FROM users u 
            JOIN user_level ul 
            ON u.level_id = ul.id 
            WHERE username = ?`;

        [this._rows] = await this._pool.query<RowDataPacket[]>(query, [username]);

        return this._rows;
    }

    /**
     * insertUser
     * @param userName string
     * @param password string hashed
     */
    public async insertUser(userName: string, email: string, password: string) {
        // Default user level is 4 (user), can be upgraded in admin menu
        const query = "INSERT INTO users SET username = ?, email = ?, password = ?, level_id = 4";
        await this._pool.query(query, [userName, email, password]);
    }

    /**
     * allRows
     * @returns array with the last executed query data
     */
    public allRows() {
        return this._rows;
    }

    /**
     * lastInsertId
     * @returns the last inserted database row id
     */
    public lastInsertId() {
        return this.queryexec("SELECT LAST_INSERT_ID()");
    }
}
