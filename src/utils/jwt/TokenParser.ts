import express from "express";
import { IToken, JWTManager } from "./JWTManager";

/**
 * This class abstracts the conditional processing of access and refresh tokens received from HTTP requests.
 */
export class TokenParser {
  static Parse(
    req: express.Request,
    res: express.Response,
  ): { payload: IToken } {
    const jwtManager = new JWTManager();

    if (!req.cookies.accessToken && !req.cookies.refreshToken) {
      return { payload: null };
    }

    if (!req.cookies.accessToken) {
      const parsedRefreshToken = jwtManager.verify(req.cookies.refreshToken);
      const newAccessToken = jwtManager.sign(
        {
          user_id: parsedRefreshToken.payload.user_id,
          email: parsedRefreshToken.payload.email,
        },
        120000,
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 120000,
      });

      return { payload: parsedRefreshToken.payload };
    }

    const parsedAccessToken = jwtManager.verify(req.cookies.accessToken);

    return { payload: parsedAccessToken.payload };
  }
}
