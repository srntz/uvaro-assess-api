import express from "express";
import bodyParser from "body-parser";
import passport, { strategies } from "passport";
import { PassportStrategyConfig } from "../../configs/PassportStrategyConfig";

const AuthRouter = express.Router();

AuthRouter.get("/login", (req, res, next) => {
  if (req.query.referer) {
    res.cookie("referer", req.query.referer);
  } else {
    res.cookie("referer", req.headers.referer);
  }
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  })(req, res, next);
});

AuthRouter.get("/logout", (req, res) => {
  PassportStrategyConfig.getStrategy().logout(
    {
      user: {
        nameID: "auth0|67d9cf4415f8d0e0c825de27",
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

AuthRouter.post(
  "/acs",
  bodyParser.urlencoded({ extended: false }),
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

    res.send();
  },
);

export { AuthRouter };
