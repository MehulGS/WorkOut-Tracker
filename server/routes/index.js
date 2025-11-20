const express = require("express");
const router = express.Router();
const AuthRoute = require("./authRoutes");
const ExerciseRoute = require("./exerciseRoutes");
const NutritionRoute = require("./nutritionRoutes");

router.use("/auth", AuthRoute);
router.use("/exercise", ExerciseRoute);
router.use("/nutrition", NutritionRoute);

module.exports = router;
