import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import usersService from "../services/users.service.js";
import config from "../config.js";

const Facebook_ClientId = config.facebookClientId;
const Facebook_ClientSecret = config.facebookClientSecret;
const Github_ClientId = config.githubClientId;
const Github_ClientSecret = config.githubClientSecret;
const SECRET_KEY = config.secretOrKey;

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: Facebook_ClientId,
      clientSecret: Facebook_ClientSecret,
      callbackURL: "http://localhost:8080/api/users/facebookCallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, name } = profile._json;
      const user = await usersService.getUserByEmail(id);
      if (!user) {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const newUser = {
          first_name: firstName,
          last_name: lastName || " ",
          email: id,
          password: " ",
        };
        const newUserDB = await usersService.addUser(newUser);
        return done(null, newUserDB);
      }
      done(null, user);
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: Github_ClientId,
      clientSecret: Github_ClientSecret,
      callbackURL: "http://localhost:8080/api/users/githubCallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;
      const user = await usersService.getUserByEmail(email);
      if (!user) {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const newUser = {
          first_name: firstName,
          last_name: lastName || " ",
          email,
          password: " ",
        };
        const newUserDB = await usersService.addUser(newUser);
        return done(null, newUserDB);
      }
      done(null, user);
    }
  )
);

const cookieExtractor = (req) => {
  const token = req?.cookies?.client_token;
  return token;
};

passport.use(
  "current",
  new jwtStrategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    },
    async (jwtPayload, done) => {
      done(null, jwtPayload.user);
    }
  )
);

passport.use(
  "jwt_bearer",
  new jwtStrategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      done(null, jwtPayload.user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (userEmail, done) => {
  const user = await usersService.getUserByEmail(userEmail);
  done(null, user);
});
