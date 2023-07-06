import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./utils/path.utils.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce - CoderHouse Backend Course",
      version: "1.0.0",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

export const swaggerSetup = swaggerJSDoc(options);
