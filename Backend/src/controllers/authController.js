const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");


// Signup
exports.signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Account created successfully",
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Signup failed"
    });

  }
};




// Login
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("email , password", email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login failed"
    });

  }
};




// Forgot Password → Send OTP
exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // const html = `
    //   <h2>Password Reset OTP</h2>
    //   <p>Your OTP is:</p>
    //   <h1>${otp}</h1>
    //   <p>This OTP expires in 10 minutes.</p>
    // `;

    // await sendMail(email, "Password Reset OTP", html);

    res.json({
      success: true,
      message: "OTP sent to email",
      otp: otp
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });

  }
};




// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });

  }
};




// Reset Password
exports.resetPassword = async (req, res) => {
  try {

    const { email, newPassword } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Password reset failed"
    });

  }
};
// Get current user profile
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
};
