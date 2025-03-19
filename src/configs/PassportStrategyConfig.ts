import passport from "passport";
import { Strategy, VerifyWithRequest } from "@node-saml/passport-saml";
import { UserService } from "../services/implementations/UserService";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { User } from "../models/User";
import { UserUpdateDTO } from "../dto/UserUpdateDTO";

export class PassportStrategyConfig {
  private static samlStrategy;

  static configure() {
    PassportStrategyConfig.samlStrategy = new Strategy(
      {
        issuer: process.env.AUTH0_SP_ISSUER,
        entryPoint: process.env.AUTH0_IDP_ENTRYPOINT,
        callbackUrl: process.env.AUTH0_ACS_URL,
        wantAssertionsSigned: false,
        acceptedClockSkewMs: 100000,
        passReqToCallback: true,
        idpCert: process.env.AUTH0_IDP_CERTIFICATE,
        logoutUrl: process.env.AUTH0_LOGOUT_URL,
        logoutCallbackUrl: process.env.AUTH0_SLS_URL,
      },
      // function (req, profile, done) {
      //   const userAttributes = {
      //     id: profile["http://schemas.auth0.com/user_id"],
      //     email:
      //       profile[
      //         "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      //       ],
      //     firstName: profile.first_name,
      //     lastName: profile.last_name,
      //   };
      //
      //   return done(null, userAttributes);
      // },
      PassportStrategyConfig.signonVerify,
      function (req, profile, done) {
        return done(null, profile);
      },
    );

    passport.use(PassportStrategyConfig.samlStrategy);
  }

  private static signonVerify: VerifyWithRequest = async (
    req,
    profile,
    done,
  ) => {
    const userAttributes = {
      id: profile["http://schemas.auth0.com/user_id"],
      email:
        profile[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      firstName: profile.first_name,
      lastName: profile.last_name,
    } as { [key: string]: string };

    const userService = new UserService(new UserRepository());
    const existingUser = await userService.getById(userAttributes.id);

    if (!existingUser) {
      const user = new User(
        userAttributes.firstName,
        userAttributes.lastName,
        userAttributes.email,
        userAttributes.id,
      );

      await userService.addUser(user);
    } else {
      const user = new UserUpdateDTO(
        userAttributes.id,
        userAttributes.firstName,
        userAttributes.lastName,
        userAttributes.email,
      );

      await userService.updateUser(user);
    }

    done(null, userAttributes);
  };

  static getStrategy() {
    return PassportStrategyConfig.samlStrategy;
  }
}
