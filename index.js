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
      origin: ["http://localhost:4200", "http://localhost:3000"],
      methods: "*",
    })
  );
  dbConnect();
  expressApp(app);
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
};

StartServer();
