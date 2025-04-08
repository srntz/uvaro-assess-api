import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { PassportStrategyConfig } from "../../configs/PassportStrategyConfig";
import cookieParser from "cookie-parser";
import { JWTManager } from "../../utils/jwtManager/JWTManager";

const AuthRouter = express.Router();

AuthRouter.get("/login", (req, res, next) => {
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

AuthRouter.get("/logout", (req, res) => {
  if (!req.cookies.refreshToken) {
    res.redirect("/login");
    return;
  }

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
