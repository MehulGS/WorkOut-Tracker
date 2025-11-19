const BodyPart = require("../model/BodyPart");
const Exercise = require("../model/Exercise");
const SetLog = require("../model/SetLog");

const createBodyPart = async (req, res) => {
  try {
    const { name } = req.body;

    const bodyPart = new BodyPart({
      userId: req.user && req.user.id ? req.user.id : req.user,
      name
    });

    await bodyPart.save();

    return res.status(201).json(bodyPart);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create body part", error: error.message });
  }
};

const createExercise = async (req, res) => {
  try {
    const { bodyPartId, name } = req.body;

    const exercise = new Exercise({
      userId: req.user && req.user.id ? req.user.id : req.user,
      bodyPart: bodyPartId,
      name
    });

    await exercise.save();

    return res.status(201).json(exercise);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create exercise", error: error.message });
  }
};

const logSet = async (req, res) => {
  try {
    const { exerciseId, weightKg, reps } = req.body;

    const userId = req.user && req.user.id ? req.user.id : req.user;

    const lastSet = await SetLog.find({ userId, exercise: exerciseId })
      .sort({ date: -1, setNumber: -1 })
      .limit(1);

    const setNumber = lastSet.length > 0 ? lastSet[0].setNumber + 1 : 1;

    const setLog = new SetLog({
      userId,
      exercise: exerciseId,
      setNumber,
      weightKg,
      reps
    });

    await setLog.save();

    return res.status(201).json(setLog);
  } catch (error) {
    return res.status(500).json({ message: "Failed to log set", error: error.message });
  }
};

const getExerciseHistory = async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : req.user;
    const { id } = req.params; // exercise id

    const history = await SetLog.find({ userId, exercise: id })
      .sort({ date: 1, setNumber: 1 });

    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch exercise history", error: error.message });
  }
};

module.exports = {
  createBodyPart,
  createExercise,
  logSet,
  getExerciseHistory
};

