const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  updatePassword
} = require("../controllers/settingsController");


// Get user profile
router.get("/profile", authMiddleware, getProfile);


// Update user profile (name only)
router.put("/profile", authMiddleware, updateProfile);


// Change password
router.put("/password", authMiddleware, updatePassword);


module.exports = router;