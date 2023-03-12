import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import "./dbConfig.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messagesRouter from "./routes/messages.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import { MessageManager } from "./dao/mongoManagers/MessageManager.js";

//passport
import passport from "passport";
import "./passport/passport.auth.js";

//Handlebars
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//cookies
app.use(cookieParser("cookieKey"));

//session Mongo
app.use(
  session({
    store: new mongoStore({
      mongoUrl:
        "mongodb+srv://agustinCarignano:agustinCarignanoCluster@ac-cluster.spgonex.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    resave: false,
    saveUninitialized: false,
    secret: "sessionKey",
    cookie: { maxAge: 60000 },
  })
);

//handlebars
// app.engine("handlebars", handlebars.engine());
//Modificacion del motor para que me permita generar las vistas.
app.engine(
  "handlebars",
  handlebars.engine({
    defaulyLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/messages", messagesRouter);
app.use("/users", usersRouter);
app.use("/views", viewsRouter);

app.get("/", (req, res) => {
  res.redirect("/views/login");
});
app.get("/*", (req, res) => {
  res.render("errorUrl");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

//socket server
const socketServer = new Server(httpServer);
const messageManager = new MessageManager();

socketServer.on("connection", async (socket) => {
  console.log(`Cliente conectado. ID: ${socket.id}`);
  socket.emit("bienvenida", {
    message: "Conectado al servidor",
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado. ID: ${socket.id}`);
  });

  socket.on("nuevoIngreso", async (user) => {
    socket.broadcast.emit("nuevoIngreso", user);
    socket.emit("chat", await messageManager.getMessages());
  });

  socket.on("chat", async (msjObj) => {
    const newMessages = await messageManager.savedMessages(msjObj);
    socketServer.emit("chat", newMessages);
  });

  socket.on("clean", async () => {
    const newMessages = await messageManager.cleanHisotry();
    socketServer.emit("chat", newMessages);
  });
});
