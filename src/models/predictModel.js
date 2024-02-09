const mongoose = require("mongoose");

const predictSchema = new mongoose.Schema({
  patientName: String,
  id: String,
  csvPath: String,
  predictions: {
    type: Object, // Adjust the type based on your actual data structure
  },
  out_come: {
    type: Array, // Adjust the type based on your actual data structure
  },

  createdAt: { type: Date, default: Date.now },
});

predictSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Predict", predictSchema);
