const express = require("express");
const router = express.Router();
const AuthRoute = require("./authRoutes");
const ExerciseRoute = require("./exerciseRoutes");
const NutritionRoute = require("./nutritionRoutes");
const GymMateRoute = require("./gymMateRoutes");

router.use("/auth", AuthRoute);
router.use("/exercise", ExerciseRoute);
router.use("/nutrition", NutritionRoute);
router.use("/gymmate", GymMateRoute);

module.exports = router;
