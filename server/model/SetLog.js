const mongoose = require("mongoose");

const setLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true
    },
    setNumber: {
      type: Number,
      required: true
    },
    weightKg: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SetLog", setLogSchema);
