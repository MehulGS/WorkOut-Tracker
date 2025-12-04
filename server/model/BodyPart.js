const mongoose = require("mongoose");

const bodyPartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gymRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymRoom",
      required: false,
    },
    days: {
      type: String,
      default: "",
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BodyPart", bodyPartSchema);
