const express = require("express");
const {
  createPredict,
  getPredict,
  createPredictwithPatient,
  getPredictPatientName,
  createPredictFileCsv,
  getFileCsv,
  getCsvContent,
} = require("../controller/predictCtrl");
const router = express.Router();

router.post("/create", createPredict);
router.get("/getPredict", getPredict);
router.post("/predictwithPatient", createPredictwithPatient);
router.get("/getPredictwithPatient", getPredictPatientName);
router.post("/predictFileCsv", createPredictFileCsv);
router.get("/getFileCsv", getFileCsv);
router.get("/getCsvContent/:fileName", getCsvContent);
module.exports = router;
