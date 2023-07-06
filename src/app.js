import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import "express-async-errors";
import "./middlewares/passport.middleware.js";
import "./persistence/MongoDB/configMongo.js";
import config from "./config.js";
import { __dirname } from "./utils/path.utils.js";
import { hbs } from "./utils/handlebars.util.js";
//Routes imports -------------------------------------------
import indexRouter from "./routes/index.router.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { logger } from "./utils/winston.js";

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//Views --------------------------------------------------
app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Cookies ------------------------------------------------
const COOKIE_KEY = config.cookieKey;
app.use(cookieParser(COOKIE_KEY));

//Session ------------------------------------------------
const URI = config.uri;
const SESSION_KEY = config.sessionKey;
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    resave: false,
    saveUninitialized: false,
    secret: SESSION_KEY,
    cookie: { maxAge: 86400000 },
  })
);

//Passport ------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

//Cors ----------------------------------------------------
app.use(cors());

//Routes --------------------------------------------------
app.use("/api/carts/", indexRouter.carts);
app.use("/api/products/", indexRouter.products);
app.use("/api/users/", indexRouter.users);
app.use("/api/auth", indexRouter.auth);
// app.use("/api/sessions", indexRouter.session);
app.use("/views", indexRouter.views);

app.use(errorMiddleware);

app.get("/", (_req, res) => {
  res.redirect("/views/login");
});
app.get("/*", (_req, res) => {
  res.render("errorUrl", { errorCode: "404", errorMessage: "Invalid URL" });
});

export const httpServer = app.listen(PORT, () => {
  logger.info(`Escuchando al puerto ${PORT}`);
});

import("./controllers/messages.controller.js");
