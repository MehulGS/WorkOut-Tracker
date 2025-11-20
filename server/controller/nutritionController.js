
const Nutrition = require("../model/Nutrition");

const createNutrition = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { foodName, calories, quantity, time, mealType } = req.body;

    if (!foodName || calories == null || quantity == null || !time || !mealType) {
      return res.status(400).json({ message: "'foodName', 'calories', 'quantity', 'time' and 'mealType' are required" });
    }

    const nutrition = new Nutrition({
      userId,
      foodName,
      calories,
      quantity,
      time,
      mealType
    });

    await nutrition.save();

    return res.status(201).json(nutrition);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create nutrition entry", error: error.message });
  }
};

const getNutritions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const nutritions = await Nutrition.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formatted = nutritions.map((n) => {
      const timeIST = n.time
        ? new Date(n.time).toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          })
        : null;

      return {
        ...n.toObject(),
        timeIST
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch nutrition entries", error: error.message });
  }
};

const updateNutrition = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "'id' is required" });
    }

    const { foodName, calories, quantity, time, mealType } = req.body || {};

    const update = {};

    if (foodName !== undefined) update.foodName = foodName;
    if (calories !== undefined) update.calories = calories;
    if (quantity !== undefined) update.quantity = quantity;
    if (time !== undefined) update.time = time;
    if (mealType !== undefined) update.mealType = mealType;

    const nutrition = await Nutrition.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      { new: true }
    );

    if (!nutrition) {
      return res.status(404).json({ message: "Nutrition entry not found" });
    }

    return res.status(200).json(nutrition);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update nutrition entry", error: error.message });
  }
};

const deleteNutrition = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "'id' is required" });
    }

    const deleted = await Nutrition.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Nutrition entry not found" });
    }

    return res.status(200).json({ message: "Nutrition entry deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete nutrition entry", error: error.message });
  }
};

const getDailyCalorieSummary = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const nutritions = await Nutrition.find({ userId }).sort({ time: 1 });

    const totalsByDate = {};

    nutritions.forEach((n) => {
      if (!n.time) return;

      const istDateStr = new Date(n.time).toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });

      if (!totalsByDate[istDateStr]) {
        totalsByDate[istDateStr] = 0;
      }

      totalsByDate[istDateStr] += n.calories || 0;
    });

    const summary = Object.keys(totalsByDate)
      .sort()
      .map((date) => ({
        date,
        totalCalories: totalsByDate[date]
      }));

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch daily calorie summary", error: error.message });
  }
};

module.exports = {
  createNutrition,
  getNutritions,
  updateNutrition,
  deleteNutrition,
  getDailyCalorieSummary
};

