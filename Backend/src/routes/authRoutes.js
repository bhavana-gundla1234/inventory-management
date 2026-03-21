const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getMe
} = require("../controllers/authController");


// Create account
router.post("/signup", signup);


// Login user
router.post("/login", login);


// Get current user
router.get("/me", authMiddleware, getMe);


// Send OTP to email
router.post("/forgot-password", forgotPassword);


// Verify OTP
router.post("/verify-otp", verifyOTP);


// Reset password
router.post("/reset-password", resetPassword);


module.exports = router;