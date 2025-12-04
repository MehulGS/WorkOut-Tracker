const BodyPart = require("../model/BodyPart");
const Exercise = require("../model/Exercise");
const SetLog = require("../model/SetLog");

const createBodyPart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { name, day } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "'name' is required" });
    }

    if (!day || typeof day !== "string") {
      return res.status(400).json({ message: "'day' is required and must be a string" });
    }

    const trimmedDay = day.trim();
    if (!trimmedDay) {
      return res.status(400).json({ message: "'day' cannot be empty" });
    }

    const bodyPart = new BodyPart({
      userId,
      name,
      days: trimmedDay,
    });

    await bodyPart.save();

    return res.status(201).json(bodyPart);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create body part", error: error.message });
  }
};

const createExercise = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { bodyPartId, name } = req.body;

    if (!bodyPartId || !name) {
      return res.status(400).json({ message: "'bodyPartId' and 'name' are required" });
    }

    const exercise = new Exercise({
      userId,
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
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { exerciseId, weightKg, reps } = req.body;

    if (!exerciseId || weightKg == null || reps == null) {
      return res.status(400).json({ message: "'exerciseId', 'weightKg' and 'reps' are required" });
    }

    // Calculate today's date range (00:00:00.000 - 23:59:59.999)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find sets for this user & exercise for today
    const todaySets = await SetLog.find({
      userId,
      exercise: exerciseId,
      gymRoom: { $exists: false },
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ setNumber: 1 });

    if (todaySets.length >= 3) {
      return res.status(400).json({
        message: "Maximum 3 sets per exercise per day reached"
      });
    }

    const setNumber = todaySets.length + 1;

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
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params; // exercise id

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const history = await SetLog.find({ userId, exercise: id, gymRoom: { $exists: false } })
      .sort({ date: -1, setNumber: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "exercise",
        select: "name bodyPart",
        populate: {
          path: "bodyPart",
          select: "name"
        }
      });

    if (!history || history.length === 0) {
      return res.status(200).json({
        exerciseName: null,
        bodyPartName: null,
        setsCount: 0
      });
    }

    const exerciseDoc = history[0].exercise;

    const groupedByDate = {};

    history.forEach((set) => {
      const dateKey = new Date(set.date).toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }

      groupedByDate[dateKey].push({
        setNumber: set.setNumber,
        weightKg: set.weightKg,
        reps: set.reps,
        date: set.date
      });
    });

    const totalWeight = history.reduce((sum, set) => sum + set.weightKg, 0);
    const averageWeightKg = history.length > 0 ? totalWeight / history.length : 0;

    const setsByDate = Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .map((date) => ({
        date,
        sets: groupedByDate[date]
      }));

    return res.status(200).json({
      exerciseName: exerciseDoc?.name || null,
      bodyPartName: exerciseDoc?.bodyPart?.name || null,
      setsCount: history.length,
      averageWeightKg,
      sets: setsByDate
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch exercise history", error: error.message });
  }
};

const getBodyPartsWithExercises = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bodyParts = await BodyPart.find({ userId, gymRoom: { $exists: false } }).sort({ name: 1 });
    const exercises = await Exercise.find({ userId, gymRoom: { $exists: false } })
      .sort({ name: 1 })
      .populate("bodyPart", "name");

    const exercisesByBodyPart = {};

    exercises.forEach((exercise) => {
      const bpId = exercise.bodyPart?._id?.toString();

      if (!bpId) return;

      if (!exercisesByBodyPart[bpId]) {
        exercisesByBodyPart[bpId] = [];
      }

      exercisesByBodyPart[bpId].push({
        _id: exercise._id,
        name: exercise.name
      });
    });

    const result = bodyParts.map((bp) => ({
      _id: bp._id,
      name: bp.name,
      exercises: exercisesByBodyPart[bp._id.toString()] || []
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch body parts and exercises", error: error.message });
  }
};

const getExercisesByBodyPart = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bodyPartId } = req.params;

    if (!bodyPartId) {
      return res.status(400).json({ message: "'bodyPartId' is required" });
    }

    const exercises = await Exercise.find({ userId, bodyPart: bodyPartId, gymRoom: { $exists: false } })
      .sort({ name: 1 });

    return res.status(200).json(exercises);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch exercises", error: error.message });
  }
};

module.exports = {
  createBodyPart,
  createExercise,
  logSet,
  getExerciseHistory,
  getBodyPartsWithExercises,
  getExercisesByBodyPart
};

