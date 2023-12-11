const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    PatientName: {
      type: String,
      required: true,
    },
    CareRequired: {
      type: String,
      required: true,
    },
    BloodGroup: {
      type: String,
      required: true,
    },
    Height: {
      type: String,
      required: true,
    },
    Allergies: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    Weight: {
      type: String,
      required: true,
    },
    EmploymentStatus: {
      type: String,
      required: true,
    },
    Admission: {
      type: String,
      required: true,
    },
    BodyTemperature: {
      type: String,
      required: true,
    },
    Employer: {
      type: String,
      required: true,
    },
    Dob: {
      type: String,
      required: true,
    },
    BloodPressure: {
      type: String,
      required: true,
    },
    Occupation: {
      type: String,
      required: true,
    },
    Diagnosis: {
      type: String,
      required: true,
    },
    Religion: {
      type: String,
      required: true,
    },
    ChronicCondition: {
      type: String,
      required: true,
    },
    Nationality: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

patientSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Patient", patientSchema);
