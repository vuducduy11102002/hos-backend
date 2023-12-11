const express = require("express");
const {
  createDoctor,
  getAllDoctor,
  getaDoctor,
  updateDoctor,
  deleteDoctor,
  uploadOptions,
} = require("../controller/doctorCtrl");
const router = express.Router();

router.post("/create", uploadOptions.single("image"), createDoctor);
router.get("/all-doctor", getAllDoctor);
router.get("/get-a-doctor/:id", getaDoctor);
router.put("/update-a-doctor/:id", uploadOptions.single("image"), updateDoctor);
router.delete("/delete-a-doctor/:id", deleteDoctor);
module.exports = router;
