import { logger } from "../utils/winston.js";

export function errorMiddleware(error, _req, res, _next) {
  logger.error(error.message);
  if (!error.cause) {
    return res.status(500).json({
      status: "Process error",
      message: error.message,
      cause: error.cause || "Unknown",
    });
  } else {
    const [status, cause] = error.cause.split("-");
    res.status(parseInt(status)).json({
      status: error.name,
      message: error.message,
      cause,
    });
  }
}
