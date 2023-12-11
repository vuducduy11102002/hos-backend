const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  // appoitment description
  app_desc: {
    type: String,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  timeSlot: {
    type: String,
    enum: ["morning", "afternoon", "evening"], // Các giá trị cho các khung giờ
    required: true,
  },
});

appointmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

appointmentSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
