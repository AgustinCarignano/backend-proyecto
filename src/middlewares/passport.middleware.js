import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import usersService from "../services/users.service.js";
import config from "../config.js";
import usersMongo from "../persistence/DAOs/usersDAO/usersMongo.js";
import { compareHashedData, hashData } from "../utils/bcrypt.utils.js";
import UserResDTO from "../persistence/DTOs/usersDTO/usersRes.dto.js";

const Facebook_ClientId = config.facebookClientId;
const Facebook_ClientSecret = config.facebookClientSecret;
const Github_ClientId = config.githubClientId;
const Github_ClientSecret = config.githubClientSecret;
const SECRET_KEY = config.secretOrKey;

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: Github_ClientId,
      clientSecret: Github_ClientSecret,
      callbackURL: "http://localhost:8080/api/auth/githubCallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;
      const user = await usersService.getUserByEmail(email);
      if (!user) {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const newUser = {
          firstName,
          lastName: lastName || " ",
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

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { firstName, lastName, age } = req.body;
      if (!email || !password || !firstName || !lastName || !age) {
        CustomError.generateError(ErrorEnums.MISSING_VALUES);
      }
      const user = await usersService.getUserByEmail(email);
      if (user) return done(null, false);
      const hashedPassword = hashData(password);
      const newUser = await usersService.addUser({
        ...req.body,
        password: hashedPassword,
      });
      return done(null, newUser);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userDB = await usersMongo.getUserByEmail(email);
        if (!userDB) return done(null, false);
        const isValidPass = await compareHashedData(password, userDB.password);
        if (!isValidPass) return done(null, false);
        const user = new UserResDTO(userDB);
        return done(null, user);
      } catch (error) {
        throw new Error(error.message);
      }
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
