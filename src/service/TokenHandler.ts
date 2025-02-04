import jwt from "jsonwebtoken";

export default class TokenHandler {
    private _token: string = "";
    private _verified: jwt.JwtPayload | string = "";
    private _secretKey: jwt.Secret;

    constructor() {
        this._secretKey = process.env.SECRETKEY || "qX3&uN6oeVJ^@8XinLECyw";
    }

    /**
     * createToken
     * @param user login user data from the database
     * @returns string - the signed token
     */
    createToken(user: { username: string; level: string; password: string }): string {
        this._token = jwt.sign({ username: user.username, level: user.level }, this._secretKey, { expiresIn: "1h" });

        return this._token;
    }

    /**
     * verify
     * @param token string - the token which arrives from frontend
     * @returns payload | string - the decoded token, or empty string
     */
    verify(token: string): jwt.JwtPayload | string {
        this._verified = jwt.verify(token, this._secretKey);

        return this._verified;
    }
}
