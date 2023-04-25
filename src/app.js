import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import "./middlewares/passport.middleware.js";
import "./persistence/MongoDB/configMongo.js";
import config from "./config.js";
import { __dirname } from "./utils/path.utils.js";
//Routes imports -------------------------------------------
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
//import usersRouter from "./routes/users.router.js";
import authRouter from "./routes/auth.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//Views --------------------------------------------------
app.engine("handlebars", handlebars.engine());
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
app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
//app.use("/api/users/", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/views", viewsRouter);

app.get("/", (_req, res) => {
  res.redirect("/views/login");
});
app.get("/*", (_req, res) => {
  res.render("errorUrl", { errorCode: "404", errorMessage: "Invalid URL" });
});

export const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

import("./controllers/messages.controller.js");
