const express = require("express");
const {
  createpointment,
  getAllpointment,
  updatepointment,
  deletepoitment,
  getDatepointment,
} = require("../controller/appoitmentCtrl");
const router = express.Router();

router.post("/create", createpointment);
router.get("/get-all", getAllpointment);
router.put("/update-a-pointment/:id", updatepointment);
router.delete("/delete-a-pointment/:id", deletepoitment);
router.get("/get-a-datepoitment", getDatepointment);

module.exports = router;
