const express = require("express");
const {
  createPredict,
  getPredict,
  createPredictwithPatient,
  getPredictPatientName,
  createPredictFileCsv,
} = require("../controller/predictCtrl");
const router = express.Router();sss

router.post("/create", createPredict);
router.get("/getPredict", getPredict);
router.post("/predictwithPatient", createPredictwithPatient);
router.get("/getPredictwithPatient", getPredictPatientName);
router.post("/predictFileCsv", createPredictFileCsv);

module.exports = router;
