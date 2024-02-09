const express = require("express");
const {
  createPredict,
  getPredict,
  createPredictwithPatient,
  getPredictPatientName,
  createPredictFileCsv,
} = require("../controller/predictCtrl");
const router = express.Router();

router.post("/create", createPredict);
router.get("/getPredict", getPredict);
router.get("/getPredictwithPatient", getPredictPatientName);
router.post("/predictwithPatient", createPredictwithPatient);
router.get("/getPredictwithPatient", getPredictPatientName);
router.post("/predictFileCsv", createPredictFileCsv);

module.exports = router;
