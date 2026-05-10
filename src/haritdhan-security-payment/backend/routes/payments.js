const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { protect } = require("../middleware/auth");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/payments/create-order ──────────────────────────────────────────
// Called by frontend when user clicks "Buy Credits" or initiates a payment
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amountINR, type, description, carbonCredits } = req.body;

    if (!amountINR || amountINR < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least ₹1",
      });
    }

    const amountPaise = Math.round(amountINR * 100); // Razorpay needs paise

    // Create order on Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `hd_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        type: type || "credit_purchase",
        description: description || "HaritDhan Carbon Credits",
      },
    });

    // Save transaction record in DB (status: "created")
    const transaction = await Transaction.create({
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      type: type || "credit_purchase",
      description: description || "Carbon Credit Purchase",
      carbonCredits: carbonCredits || 0,
      amountPaise,
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountPaise,
      currency: "INR",
      transactionId: transaction._id,
      // Send key to frontend so it can open the checkout modal
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
      },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      success: false,
      message: "Could not create payment order. Please try again.",
    });
  }
});

// ─── POST /api/payments/verify ────────────────────────────────────────────────
// Called by frontend after Razorpay checkout succeeds
// Verifies the payment signature (CRITICAL security step)
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data.",
      });
    }

    // ── Signature verification (Razorpay's recommended method) ──────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      // Mark transaction as failed
      await Transaction.findByIdAndUpdate(transactionId, { status: "failed" });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      });
    }

    // ── Payment is genuine — update records ──────────────────────────────────
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "paid",
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    // Credit carbon credits to user's account
    if (transaction.carbonCredits > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          carbonCredits: transaction.carbonCredits,
          walletBalance: transaction.amountPaise,
        },
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully!",
      transaction: {
        id: transaction._id,
        amount: transaction.amountPaise / 100,
        status: transaction.status,
        paidAt: transaction.paidAt,
      },
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification error. Please contact support.",
    });
  }
});

// ─── GET /api/payments/history ────────────────────────────────────────────────
router.get("/history", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not fetch transaction history." });
  }
});

// ─── POST /api/payments/webhook ───────────────────────────────────────────────
// Razorpay webhook — for server-side event handling (payment.captured, etc.)
// Add this URL in your Razorpay Dashboard → Webhooks
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (expectedSig !== webhookSignature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature." });
    }

    const event = JSON.parse(req.body);
    console.log("Razorpay webhook event:", event.event);

    // Handle relevant events
    switch (event.event) {
      case "payment.captured":
        // Payment confirmed — you could send a receipt email here
        break;
      case "payment.failed":
        // Update transaction status to failed
        Transaction.findOneAndUpdate(
          { razorpayOrderId: event.payload.payment.entity.order_id },
          { status: "failed" }
        ).exec();
        break;
      case "refund.created":
        Transaction.findOneAndUpdate(
          { razorpayPaymentId: event.payload.refund.entity.payment_id },
          { status: "refunded" }
        ).exec();
        break;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
