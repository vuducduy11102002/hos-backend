const express = require("express");
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config();
const cookiesParser = require("cookie-parser");
const patientRouter = require("./routes/patientRoute");
const doctorRouter = require("./routes/doctorRoute");
const appointmentRouter = require("./routes/appointmentRoute");
const notificationRouter = require("./routes/notificationRoute");
const morgan = require("morgan");
const cors = require("cors");

module.exports = (app) => {
  const api = process.env.API_URL;
  app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookiesParser());

  app.use(`${api}/user`, authRouter);
  app.use(`${api}/patient`, patientRouter);
  app.use(`${api}/doctor`, doctorRouter);
  app.use(`${api}/appointment`, appointmentRouter);
  app.use(`${api}/notification`, notificationRouter);
  app.use(notFound);
  app.use(errorHandler);
};