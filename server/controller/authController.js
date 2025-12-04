const User = require("../model/User");
const GymRoom = require("../model/GymRoom");
const WeightLog = require("../model/WeightLog");
const Nutrition = require("../model/Nutrition");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP CONNECTED!");
  }
}); 

const register = async (req, res) => {
  try {
    const { name, email, password, gender, dateOfBirth, age, height, weight, gymTiming } = req.body;

    if (!name || !email || !password || !gender || !dateOfBirth || !age || !height || !weight || !gymTiming) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Convert height from cm to meters for BMI calculation
    const heightInMeters = Number(height) / 100;
    // Calculate BMI with 1 decimal place precision
    const bmi = (Number(weight) / (heightInMeters * heightInMeters)).toFixed(1);

    let imageUrl = null;

    if (req.file && req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "gym-tracker/users",
      });
      imageUrl = uploadResult.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      age: parseInt(age, 10),
      height,
      weight: parseFloat(weight),
      BMI: parseFloat(bmi),
      gymTiming,
    });

    const gymRoom = await GymRoom.findOne({ pendingInvites: email.toLowerCase() });

    if (gymRoom) {
      const isAlreadyMember = gymRoom.members.some(
        (m) => m.toString() === user._id.toString()
      );

      if (!isAlreadyMember) {
        gymRoom.members.push(user._id);
      }

      gymRoom.pendingInvites = gymRoom.pendingInvites.filter(
        (invitedEmail) => invitedEmail.toLowerCase() !== email.toLowerCase()
      );

      await gymRoom.save();
    }

    await WeightLog.create({
      user: user._id,
      weight: parseFloat(weight),
      BMI: parseFloat(bmi),
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        gender: user.gender,
        height: user.height,
        age:user.age,
        weight: user.weight,
        BMI: user.BMI,
        gymTiming: user.gymTiming,
        createdAt: user.createdAt,
        dateOfBirth:user.dateOfBirth
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id,profileImage:user.image,name:user.name },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        BMI: user.BMI,
        gymTiming: user.gymTiming,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = ("" + Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = expires;
    await user.save();

    const html = `
      <div style="margin:0;padding:0;background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#ffffff;padding:24px 0;">
          <tr>
            <td align="center" style="padding:0 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:480px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
                <tr>
                  <td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
                    <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">Reset your Gym Tracker password</h1>
                    <p style="margin:8px 0 0;font-size:13px;color:#4b5563;">
                      Use the one-time code below to reset your password. This code is valid for <strong>10 minutes</strong>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <p style="margin:0 0 12px;font-size:13px;color:#374151;">Your verification code</p>
                    <div style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#111827;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.3em;text-align:center;">
                      <span style="letter-spacing:0.3em;">${otp}</span>
                    </div>
                    <p style="margin:16px 0 0;font-size:11px;color:#6b7280;">
                      If you did not request a password reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "Your password reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
      html,
    });
    transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP ERROR:", err);
  } else {
    console.log("SMTP CONNECTED!");
  }
});


    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email, resetOtp: otp });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP and new password are required" });
    }

    const user = await User.findOne({ email, resetOtp: otp });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const addWeight = async (req, res) => {
  try {
    const { weight } = req.body;

    if (!weight) {
      return res.status(400).json({ error: "Weight is required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const heightInMeters = Number(user.height) / 100;
    const bmi = Number(weight) / (heightInMeters * heightInMeters);

    user.weight = weight;
    user.BMI = bmi;
    await user.save();

    await WeightLog.create({
      user: user._id,
      weight: parseFloat(weight),
      BMI: parseFloat(bmi),
    });

    return res.status(201).json({
      message: "Weight added successfully",
      weight: user.weight,
      BMI: Number(bmi.toFixed(2)),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getWeightHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const logs = await WeightLog.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!logs.length) {
      return res.status(200).json({ logs: [], trend: null });
    }

    const first = await WeightLog.findOne({ user: req.user.userId }).sort({ createdAt: 1 });
    const last = await WeightLog.findOne({ user: req.user.userId }).sort({ createdAt: -1 });

    const trendValue = last.weight - first.weight;
    let trendDirection = "stable";
    if (trendValue > 0) trendDirection = "up";
    if (trendValue < 0) trendDirection = "down";

    const chartData = logs.map((log) => ({
      date: log.createdAt,
      weight: log.weight,
      BMI: Number(log.BMI.toFixed(2)),
    }));

    return res.status(200).json({
      logs: chartData,
      trend: {
        value: trendValue,
        direction: trendDirection,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const latestWeight = user.weight;
    const latestBMI = user.BMI;

    const nutritions = await Nutrition.find({ userId }).sort({ createdAt: 1 });

    const totalsByDate = {};

    nutritions.forEach((n) => {
      if (!n.time) return;

      const istDateStr = new Date(n.time).toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      if (!totalsByDate[istDateStr]) {
        totalsByDate[istDateStr] = 0;
      }

      totalsByDate[istDateStr] += n.calories || 0;
    });

    const calorieDates = Object.keys(totalsByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const dailyCalorieIntake = calorieDates.map((date) => ({
      date,
      totalCalories: totalsByDate[date],
    }));

    const totalCaloriesAllDays = calorieDates.reduce(
      (sum, date) => sum + totalsByDate[date],
      0
    );

    const averageDailyCalories =
      calorieDates.length > 0
        ? totalCaloriesAllDays / calorieDates.length
        : 0;

    const weightLogs = await WeightLog.find({ user: userId }).sort({
      createdAt: 1,
    });

    let weightTrend = null;
    let weightChart = [];

    if (weightLogs.length) {
      const first = weightLogs[0];
      const last = weightLogs[weightLogs.length - 1];

      const trendValue = last.weight - first.weight;
      let trendDirection = "stable";
      if (trendValue > 0) trendDirection = "up";
      if (trendValue < 0) trendDirection = "down";

      weightTrend = {
        value: trendValue,
        direction: trendDirection,
      };

      weightChart = weightLogs.map((log) => ({
        date: log.createdAt,
        weight: log.weight,
        BMI: Number(log.BMI.toFixed(2)),
      }));
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      gender:user.gender,
      height: user.height,
      image: user.image,
      weight: latestWeight,
      BMI: Number(Number(latestBMI).toFixed(2)),
      gymTiming: user.gymTiming,
      averageDailyCalories,
      dailyCalorieIntake,
      weightTrend,
      weightChart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { name, height, gender, gymTiming } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (height) {
      user.height = height;
    }

    if (gender) {
      user.gender = gender;
    }

    if (gymTiming) {
      user.gymTiming = gymTiming;
    }

    if (req.file && req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "gym-tracker/users",
      });
      user.image = uploadResult.secure_url;
    }

    if (user.height && user.weight) {
      const heightInMeters = Number(user.height) / 100;
      const bmi = Number(user.weight) / (heightInMeters * heightInMeters);
      user.BMI = bmi;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        BMI: user.BMI,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await WeightLog.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  addWeight,
  getWeightHistory,
  getProfile,
  editProfile,
  deleteAccount,
};
