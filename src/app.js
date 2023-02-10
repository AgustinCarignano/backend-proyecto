import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import "./dbConfig.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messagesRouter from "./routes/messages.router.js";
import { MessageManager } from "./dao/mongoManagers/MessageManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//routes
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/messages", messagesRouter);

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

  socket.on("clean", async (obj) => {
    const newMessages = await messageManager.cleanHisotry();
    socketServer.emit("chat", newMessages);
  });
});
