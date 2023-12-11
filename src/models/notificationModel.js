const mongoose = require("mongoose");
const RequestAppointment = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["morning", "afternoon", "evening"], // Các giá trị cho các khung giờ
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

RequestAppointment.virtual("id").get(function () {
  return this._id.toHexString();
});

RequestAppointment.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("RequestAppointment", RequestAppointment);
