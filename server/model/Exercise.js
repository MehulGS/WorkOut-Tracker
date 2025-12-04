const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gymRoom: { type: mongoose.Schema.Types.ObjectId, ref: "GymRoom", required: false },
  bodyPart: { type: mongoose.Schema.Types.ObjectId, ref: "BodyPart", required: true },
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Exercise", exerciseSchema);
