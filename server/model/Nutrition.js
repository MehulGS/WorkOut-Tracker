
const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    foodName: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    mealType: {
      type: String,
      enum: [
        "breakfast",
        "mid_meal",
        "lunch",
        "evening_snack",
        "dinner",
        "pre_workout",
        "post_workout"
      ],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);

