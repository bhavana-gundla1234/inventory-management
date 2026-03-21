const User = require("../models/User");
const bcrypt = require("bcryptjs");


// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });

  }
};



// Update user profile
exports.updateProfile = async (req, res) => {
  try {

    const { name, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name) user.name = name;

    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long"
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });

  }
};



// Change password
exports.updatePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update password"
    });

  }
};