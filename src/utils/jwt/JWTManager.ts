import jwt from "jsonwebtoken";
import * as fs from "node:fs";

/**
 * Structure of token payload
 */
export interface IToken {
  user_id: string;
  email: string;
}

/**
 * This class is an abstraction on top of jwt that ensures clear typing of token payloads
 * and the usage of correct cerfiticates.
 */
export class JWTManager {
  sign(payload: IToken, expiresIn: string | number) {
    return jwt.sign(
      payload,
      fs.readFileSync("./jwt_private_key.pem", "utf-8"),
      {
        algorithm: "RS256",
        expiresIn: expiresIn,
      },
    );
  }

  verify(token: string): {
    payload: IToken;
    expired: boolean;
  } {
    try {
      const payload = jwt.verify(
        token,
        fs.readFileSync("./jwt_public_key.pem", "utf-8"),
      );
      return { payload, expired: false };
    } catch (e) {
      return { payload: null, expired: e.message.includes("jwt expired") };
    }
  }
}
