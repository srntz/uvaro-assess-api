import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { PassportStrategyConfig } from "../../configs/PassportStrategyConfig";
import cookieParser from "cookie-parser";
import { JWTManager } from "../../utils/jwt/JWTManager";

const AuthRouter = express.Router();

/*
 * This endpoint initializes the login flow
 */
AuthRouter.get("/login", (req, res, next) => {
  /*
   * Referer can be passed from the client and defines the redirect URL which the API redirects to after a flow has been completed.
   * If the client did not explicitly specify the referer, it will default to the referer present in request headers.
   *
   * It is stored in cookies to persist the state between redirects and different endpoints
   * (referer is accessed from the last step in the authentication flow which is either /acs or /sls)
   */
  res.clearCookie("referer");
  if (req.query.referer) {
    res.cookie("referer", req.query.referer, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
  } else {
    res.cookie("referer", req.headers.referer, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
  }
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  })(req, res, next);
});

/*
 * This endpoint initializes the logout flow
 */
AuthRouter.get("/logout", (req, res) => {
  if (!req.cookies.refreshToken) {
    res.redirect("/login");
    return;
  }

  /*
   * Referer can be passed from the client and defines the redirect URL which the API redirects to after a flow has been completed.
   * If the client did not explicitly specify the referer, it will default to the referer present in request headers.
   *
   * It is stored in cookies to persist the state between redirects and different endpoints
   * (referer is accessed from the last step in the authentication flow which is either /acs or /sls)
   */
  res.clearCookie("referer");
  if (req.query.referer) {
    res.cookie("referer", req.query.referer, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
  } else {
    res.cookie("referer", req.headers.referer, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
  }

  const validatedToken = new JWTManager().verify(req.cookies.refreshToken);

  PassportStrategyConfig.getStrategy().logout(
    {
      user: {
        nameID: validatedToken.payload.user_id,
        nameIDFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      },
    },
    (err, logoutUrl) => {
      if (!err) {
        res.redirect(logoutUrl);
      } else {
        console.log(err);
      }
    },
  );
});

/*
 * The Assertion Consumer Service of the SAML flow.
 * It receives signed tokens from the passport strategy callback and sets cookies respectively.
 */
AuthRouter.post(
  "/acs",
  bodyParser.urlencoded({ extended: false }),
  cookieParser(),
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    res.cookie("accessToken", req.user["accessToken"], {
      maxAge: 120000,
      httpOnly: true,
    });

    res.cookie("refreshToken", req.user["refreshToken"], {
      maxAge: 86400000,
      httpOnly: true,
    });

    if (req.cookies.referer) {
      const redirectUrl = decodeURIComponent(req.cookies.referer);
      res.clearCookie("referer");
      res.redirect(redirectUrl);
    } else {
      res.send();
    }
  },
);

/**
 * The Single Logout Service of the SAML flow.
 * It resets cookies after the user has signed out.
 */
AuthRouter.post(
  "/sls",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    if (req.cookies.referer) {
      const redirectUrl = decodeURIComponent(req.cookies.referer);
      res.clearCookie("referer");
      res.redirect(redirectUrl);
    } else {
      res.send();
    }
  },
);

export { AuthRouter };
