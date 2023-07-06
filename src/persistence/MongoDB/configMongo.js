import mongoose from "mongoose";
import config from "../../config.js";
import { logger } from "../../utils/winston.js";

const URI = config.uri;

try {
  mongoose.connect(URI);
  logger.info("Conectado a la base de datos");
} catch (error) {
  logger.error(error);
}
