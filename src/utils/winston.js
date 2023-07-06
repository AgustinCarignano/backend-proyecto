import winston from "winston";
import config from "../config.js";

const logsLevels = {
  names: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "bold white redBG",
    error: "bold red",
    warning: "bold yellow",
    info: "underline italic green",
    http: "italic blue",
    debug: "italic cyan",
  },
};

const minLevel = config.node_env === "dev" ? "debug" : "info";

export const logger = winston.createLogger({
  levels: logsLevels.names,
  transports: [
    new winston.transports.Console({
      level: minLevel,
      format: winston.format.combine(
        winston.format.colorize({ colors: logsLevels.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

if (config.node_env !== "dev") {
  logger.add(
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.splat(),
        winston.format.prettyPrint()
      ),
    })
  );
}
