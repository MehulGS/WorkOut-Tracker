const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createBodyPart, createExercise, logSet, getExerciseHistory, getBodyPartsWithExercises, getExercisesByBodyPart } = require("../controller/exerciseController");

const router = express.Router();

router.post("/body-part", auth, createBodyPart);
router.post("/", auth, createExercise);
router.post("/set", auth, logSet);
router.get("/:id/history", auth, getExerciseHistory);
router.get("/body-parts/all", auth, getBodyPartsWithExercises);
router.get("/body-part/:bodyPartId/exercises", auth, getExercisesByBodyPart);

module.exports = router;
