const BodyPart = require("../model/BodyPart");
const Exercise = require("../model/Exercise");
const SetLog = require("../model/SetLog");
const GymRoom = require("../model/GymRoom");

const ensureRoomMember = async (roomId, userId) => {
  const room = await GymRoom.findById(roomId).select("owner members");
  if (!room) return null;

  const isMember =
    room.owner.toString() === userId.toString() ||
    room.members.some((m) => m.toString() === userId.toString());

  if (!isMember) return null;
  return room;
};

const createGroupBodyPart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!roomId) return res.status(400).json({ message: "roomId is required" });

    const room = await ensureRoomMember(roomId, userId);
    if (!room) return res.status(403).json({ message: "Not a member of this group" });

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { name, days } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "'name' is required" });
    }

    if (!days || typeof days !== "string") {
      return res
        .status(400)
        .json({ message: "'days' is required and must be a string" });
    }

    const trimmedDays = days.trim();
    if (!trimmedDays) {
      return res
        .status(400)
        .json({ message: "'days' cannot be empty" });
    }

    const bodyPart = new BodyPart({
      userId,
      gymRoom: roomId,
      name,
      days: trimmedDays,
    });

    await bodyPart.save();

    return res.status(201).json(bodyPart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create group body part", error: error.message });
  }
};

const createGroupExercise = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!roomId) return res.status(400).json({ message: "roomId is required" });

    const room = await ensureRoomMember(roomId, userId);
    if (!room) return res.status(403).json({ message: "Not a member of this group" });

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { bodyPartId, name } = req.body;

    if (!bodyPartId || !name) {
      return res
        .status(400)
        .json({ message: "'bodyPartId' and 'name' are required" });
    }

    const bodyPart = await BodyPart.findOne({ _id: bodyPartId, gymRoom: roomId });
    if (!bodyPart) {
      return res
        .status(400)
        .json({ message: "Body part does not belong to this group" });
    }

    const exercise = new Exercise({
      userId,
      gymRoom: roomId,
      bodyPart: bodyPartId,
      name,
    });

    await exercise.save();

    return res.status(201).json(exercise);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create group exercise", error: error.message });
  }
};

const logGroupSet = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!roomId) return res.status(400).json({ message: "roomId is required" });

    const room = await ensureRoomMember(roomId, userId);
    if (!room) return res.status(403).json({ message: "Not a member of this group" });

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { exerciseId, weightKg, reps } = req.body;

    if (!exerciseId || weightKg == null || reps == null) {
      return res.status(400).json({
        message: "'exerciseId', 'weightKg' and 'reps' are required",
      });
    }

    const exercise = await Exercise.findOne({ _id: exerciseId, gymRoom: roomId });
    if (!exercise) {
      return res
        .status(400)
        .json({ message: "Exercise does not belong to this group" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySets = await SetLog.find({
      userId,
      exercise: exerciseId,
      gymRoom: roomId,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ setNumber: 1 });

    if (todaySets.length >= 3) {
      return res.status(400).json({
        message: "Maximum 3 sets per exercise per day reached",
      });
    }

    const setNumber = todaySets.length + 1;

    const setLog = new SetLog({
      userId,
      exercise: exerciseId,
      gymRoom: roomId,
      setNumber,
      weightKg,
      reps,
    });

    await setLog.save();

    return res.status(201).json(setLog);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to log group set", error: error.message });
  }
};

const getGroupBodyPartsWithExercises = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!roomId) return res.status(400).json({ message: "roomId is required" });

    const room = await ensureRoomMember(roomId, userId);
    if (!room) return res.status(403).json({ message: "Not a member of this group" });

    const bodyParts = await BodyPart.find({ gymRoom: roomId }).sort({ name: 1 });
    const exercises = await Exercise.find({ gymRoom: roomId })
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
        name: exercise.name,
      });
    });

    const result = bodyParts.map((bp) => ({
      _id: bp._id,
      name: bp.name,
      days: bp.days,
      exercises: exercisesByBodyPart[bp._id.toString()] || [],
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch group body parts and exercises",
      error: error.message,
    });
  }
};

const getGroupExerciseOverview = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId, exerciseId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!roomId || !exerciseId)
      return res
        .status(400)
        .json({ message: "roomId and exerciseId are required" });

    const room = await ensureRoomMember(roomId, userId);
    if (!room) return res.status(403).json({ message: "Not a member of this group" });

    const exercise = await Exercise.findOne({ _id: exerciseId, gymRoom: roomId })
      .populate("bodyPart", "name")
      .lean();

    if (!exercise) {
      return res
        .status(404)
        .json({ message: "Exercise not found in this group" });
    }

    const logs = await SetLog.find({ gymRoom: roomId, exercise: exerciseId })
      .sort({ date: -1, setNumber: -1 })
      .populate("userId", "name email image")
      .lean();

    const byUser = {};

    logs.forEach((log) => {
      const u = log.userId;
      if (!u) return;
      const uid = u._id.toString();
      if (!byUser[uid]) {
        byUser[uid] = {
          user: u,
          totalSets: 0,
          totalWeight: 0,
          latestSet: null,
        };
      }

      byUser[uid].totalSets += 1;
      byUser[uid].totalWeight += log.weightKg;
      if (!byUser[uid].latestSet) {
        byUser[uid].latestSet = {
          weightKg: log.weightKg,
          reps: log.reps,
          date: log.date,
          setNumber: log.setNumber,
        };
      }
    });

    const users = Object.values(byUser);

    return res.status(200).json({
      exercise: {
        _id: exercise._id,
        name: exercise.name,
        bodyPartName: exercise.bodyPart?.name || null,
      },
      participants: users,
      lastSets: logs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch group exercise overview",
      error: error.message,
    });
  }
};

const deleteGroupExercise = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId, exerciseId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!roomId || !exerciseId) {
      return res
        .status(400)
        .json({ message: "roomId and exerciseId are required" });
    }

    const room = await GymRoom.findById(roomId).select("owner");

    if (!room) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (room.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only owner can delete exercise" });
    }

    const exercise = await Exercise.findOneAndDelete({
      _id: exerciseId,
      gymRoom: roomId,
    });

    if (!exercise) {
      return res
        .status(404)
        .json({ message: "Exercise not found in this group" });
    }

    await SetLog.deleteMany({ exercise: exerciseId, gymRoom: roomId });

    return res
      .status(200)
      .json({ message: "Exercise and its logs deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete group exercise",
      error: error.message,
    });
  }
};

module.exports = {
  createGroupBodyPart,
  createGroupExercise,
  logGroupSet,
  getGroupBodyPartsWithExercises,
  getGroupExerciseOverview,
  deleteGroupExercise,
};
