const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// ─── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many attempts. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Token helpers ─────────────────────────────────────────────────────────────
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET + "_refresh", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Store refresh token in DB (hashed ideally, simplified here)
  User.findByIdAndUpdate(user._id, { refreshToken }).exec();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      success: true,
      accessToken, // also send in body for React Native / mobile clients
      user: user.toSafeObject(),
    });
};

// ─── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register", authLimiter, async (req, res) => {
  try {
    const {
      fullName, email, phone, password, role,
      farmSizeAcres, cropType, state, district,
      companyName, industrySector,
      gender, dateOfBirth, preferredLanguage,
    } = req.body;

    // Check required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required.",
      });
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&#).",
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: role || "Farmer",
      farmSizeAcres,
      cropType,
      state,
      district,
      companyName,
      industrySector,
      gender,
      dateOfBirth,
      preferredLanguage,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Fetch user with password (select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      // Generic message to prevent email enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// ─── GET /api/auth/me — get current logged-in user ───────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post("/logout", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie("accessToken");
  res.json({ success: true, message: "Logged out successfully." });
});

// ─── POST /api/auth/refresh — get new access token via refresh token ──────────
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No refresh token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET + "_refresh");
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid refresh token." });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(401).json({ success: false, message: "Session expired. Please log in again." });
  }
});

module.exports = router;
