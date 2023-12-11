const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    specialist: {
      type: String,
      required: true,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

doctorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

doctorSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Doctor", doctorSchema);
