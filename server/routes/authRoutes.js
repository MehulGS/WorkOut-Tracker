const express = require("express");
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const {
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
} = require("../controller/authController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/weight", auth, addWeight);
router.get("/weight-log", auth, getWeightHistory);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("image"), editProfile);
router.delete("/profile", auth, deleteAccount);

module.exports = router;
