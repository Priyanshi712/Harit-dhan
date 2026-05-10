const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v) => /^\+91[6-9]\d{9}$/.test(v),
        message: "Enter a valid Indian phone number (+91XXXXXXXXXX)",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ["Farmer", "Corporate"],
      default: "Farmer",
    },
    // Farmer-specific fields
    farmSizeAcres: { type: Number, min: 0 },
    cropType: { type: String },
    state: { type: String },
    district: { type: String },
    // Corporate-specific fields
    companyName: { type: String },
    industrySector: { type: String },
    // Common
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    dateOfBirth: { type: Date },
    preferredLanguage: { type: String, default: "English" },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    // Wallet / credits
    carbonCredits: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 }, // in INR paise (smallest unit)
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Sanitize user object returned to client (remove sensitive fields)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
