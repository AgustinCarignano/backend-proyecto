import { Server } from "socket.io";
import { httpServer } from "../app.js";
import messageService from "../services/messages.service.js";
import { logger } from "../utils/winston.js";

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  logger.info(`Cliente conectado. ID: ${socket.id}`);
  socket.emit("bienvenida", {
    message: "Conectado al servidor",
  });

  socket.on("disconnect", () => {
    logger.info(`Cliente desconectado. ID: ${socket.id}`);
  });

  socket.on("nuevoIngreso", async (user) => {
    socket.broadcast.emit("nuevoIngreso", user);
    const messages = await messageService.getMessages();
    socket.emit("chat", messages);
  });

  socket.on("chat", async (msjObj) => {
    const newMessages = await messageService.saveMessage(msjObj);
    socketServer.emit("chat", newMessages);
  });

  socket.on("clean", async () => {
    const newMessages = await messageService.cleanHistory();
    socketServer.emit("chat", newMessages);
  });
});
