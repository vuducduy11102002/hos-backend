const express = require("express");
const {
  createPatient,
  getAllPatient,
  getaPatient,
  updatePatient,
  deletePatient,
  softDeletePatient,
  getSoftPatient,
  restorePatient,
} = require("../controller/patientCtrl");
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.post("/create", createPatient);
router.get("/all-patient", getAllPatient);
router.get("/get-softdelete", getSoftPatient);
router.get("/get-a-patient/:id", getaPatient);
router.put("/update-a-patient/:id", updatePatient);
router.delete("/delete-a-patient/:id", deletePatient);
router.post("/soft-delete", softDeletePatient);
router.post("/restore", restorePatient);

module.exports = router;
