
const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createNutrition, getNutritions, updateNutrition, deleteNutrition, getDailyCalorieSummary } = require("../controller/nutritionController");

const router = express.Router();

router.post("/", auth, createNutrition);
router.get("/", auth, getNutritions);
router.put("/:id", auth, updateNutrition);
router.delete("/:id", auth, deleteNutrition);
router.get("/summary/daily", auth, getDailyCalorieSummary);

module.exports = router;

