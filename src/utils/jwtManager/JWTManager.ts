import jwt from "jsonwebtoken";
import * as fs from "node:fs";

export class JWTManager {
  sign(payload: object, expiresIn: string | number) {
    return jwt.sign(
      payload,
      fs.readFileSync("./jwt_private_key.pem", "utf-8"),
      {
        algorithm: "RS256",
        expiresIn: expiresIn,
      },
    );
  }

  verify(token: string) {
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
