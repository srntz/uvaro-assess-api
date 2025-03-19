import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { PassportStrategyConfig } from "../../configs/PassportStrategyConfig";

const AuthRouter = express.Router();

AuthRouter.get(
  "/login",
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
    session: false,
  }),
  (req, res) => {
    res.send({ error: "Failed to authenticate" });
  },
);

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
  (req) => {
    console.log(req.user);
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
    res.send();
  },
);

export { AuthRouter };
