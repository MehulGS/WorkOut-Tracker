const express = require("express");
const router = express.Router();
const AuthRoute = require("./authRoutes");
const ExerciseRoute = require("./exerciseRoutes");

router.use("/auth", AuthRoute);
router.use("/exercise", ExerciseRoute);

module.exports = router;
