const Doctor = require("../models/doctorModel");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const validateMongoDbId = require("../utils/validateMongodbId");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

const createDoctor = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let doctor = new Doctor({
      name: req.body.name,
      image: `${basePath}${fileName}`,
      specialist: req.body.specialist,
    });

    // Save the doctor to the database
    doctor = await doctor.save();
    res.json(doctor);
  } catch (error) {
    throw new Error(error);
  }
});

// All Doctors

const getAllDoctor = asyncHandler(async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate({
        path: "appointments",
        populate: {
          path: "patient", // Populate the "patient" field inside each appointment
        },
      })
      .exec();

    // Sort each doctor's appointments by date, timeSlot, and time
    doctors.forEach((doctor) => {
      doctor.appointments.sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }

        const timeSlotOrder = ["morning", "afternoon", "evening"];
        const timeSlotComparison =
          timeSlotOrder.indexOf(a.timeSlot) - timeSlotOrder.indexOf(b.timeSlot);
        if (timeSlotComparison !== 0) {
          return timeSlotComparison;
        }

        return a.time.localeCompare(b.time);
      });
    });

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getaDoctor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const doctor = await Doctor.findById(req.params.id);

    res.json(doctor);
  } catch (error) {
    throw new Error(error);
  }
});

const updateDoctor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const file = req.file;
    let imagepath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = doctor.image;
    }
    if (!file) return res.status(400).send("No image in the request");

    const updateDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,

      {
        name: req.body.name,
        image: imagepath,
        specialist: req.body.specialist,
      },
      { new: true }
    );
    res.json(updateDoctor);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteDoctor = await Doctor.findByIdAndDelete(id);
    res.json({ deleteDoctor });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createDoctor,
  getAllDoctor,
  getaDoctor,
  updateDoctor,
  deleteDoctor,
  uploadOptions,
};
