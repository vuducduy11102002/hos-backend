const express = require("express");
const {
  sendNotification,
  getNotifications,
} = require("../controller/notificationCtrl");
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.get("/get-all", getNotifications);
router.post("/create", sendNotification);

module.exports = router;
