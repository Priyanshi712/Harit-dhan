const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Razorpay IDs
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // What was purchased
    type: {
      type: String,
      enum: ["credit_purchase", "credit_sale", "subscription"],
      required: true,
    },
    description: { type: String },
    carbonCredits: { type: Number, default: 0 }, // tCO2 involved

    // Amount in paise (₹1 = 100 paise)
    amountPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    paidAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
