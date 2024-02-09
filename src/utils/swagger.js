import { Express, Resquest, Responne } from "express";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import log from "./logger";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital Backend REST API Docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["/src/expressApp.js"],
};
