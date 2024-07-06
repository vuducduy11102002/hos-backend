// server.js
const express = require("express");
const dbConnect = require("./src/config/dbConnect");
const expressApp = require("./src/expressApp");
const PORT = process.env.PORT || 3000;
require("dotenv").config();
const cors = require("cors");
const path = require("path"); // Import the 'path' module
const StartServer = () => {
  const app = express();
  // Ensure this line in your Express setup
  app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
  app.use(
    cors({
      origin: [
        "http://localhost:4200",
        "http://localhost:3000",
        "http://localhost:4100",
      ],
      methods: "*",
    })
  );
  // Cấu hình để cung cấp header 'Access-Control-Allow-Origin'
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  dbConnect();
  expressApp(app);
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
};

StartServer();
