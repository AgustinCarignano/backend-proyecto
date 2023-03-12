import passport from "passport";
import { Strategy as LocalStartegy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { UserManager } from "../dao/mongoManagers/UserManager.js";
import { hashPassword, comparePasswords } from "../utils.js";

const userManager = new UserManager();

//Estrategia local para regsitro de nuevo ususario
passport.use(
  "localRegister",
  new LocalStartegy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await userManager.getUserByEmail(email);
      if (user) return done(null, false);
      const hashedPassword = hashPassword(password);
      const newUser = await userManager.addUser({
        ...req.body,
        password: hashedPassword,
      });
      done(null, newUser);
    }
  )
);

//Estrategia local para login de un usuario registrado de forma local
passport.use(
  "localLogin",
  new LocalStartegy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await userManager.getUserByEmail(email);
      if (!user) return done(null, false);
      const isPassword = await comparePasswords(password, user.password);
      if (!isPassword) return done(null, false);
      return done(null, user);
    }
  )
);

//Esrategia para el registro y login con Github
passport.use(
  "githubRegister",
  new GithubStrategy(
    {
      clientID: "Iv1.a37cfc70f27ab281",
      clientSecret: "e94d577434e91dda1e82c26be9da6da9cc26aaf3",
      callbackURL: "http://localhost:8080/users/github",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json;
      const user = await userManager.getUserByEmail(email);
      if (!user) {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const newUser = {
          first_name: firstName,
          last_name: lastName || " ",
          email,
          password: " ",
        };
        const newUserDB = await userManager.addUser(newUser);
        return done(null, newUserDB);
      }
      done(null, user);
    }
  )
);

//Estrategia para el registro y login con facebook
passport.use(
  "facebookRegister",
  new FacebookStrategy(
    {
      clientID: "929291268248610",
      clientSecret: "959655c03ae566df30006015bc146f81",
      callbackURL: "http://localhost:8080/users/facebook",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, name } = profile._json;
      const user = await userManager.getUserByEmail(id);
      if (!user) {
        const firstName = name.split(" ")[0];
        const lastName = name.split(" ")[1];
        const newUser = {
          first_name: firstName,
          last_name: lastName || " ",
          email: id,
          password: " ",
        };
        const newUserDB = await userManager.addUser(newUser);
        return done(null, newUserDB);
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await userManager.getUserById(id);
  done(null, user);
});
