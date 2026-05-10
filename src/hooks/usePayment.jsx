import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Dynamically load Razorpay checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const usePayment = () => {
  const { getAuthHeaders, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initiate a Razorpay payment
   * @param {object} options
   * @param {number}  options.amountINR     - Amount in ₹ (e.g. 1244)
   * @param {string}  options.description   - What the user is paying for
   * @param {number}  options.carbonCredits - tCO2 credits being purchased
   * @param {string}  options.type          - "credit_purchase" | "credit_sale"
   * @param {Function} options.onSuccess    - Called with transaction data on success
   * @param {Function} options.onFailure    - Called with error message on failure
   */
  const initiatePayment = useCallback(
    async ({ amountINR, description, carbonCredits = 0, type = "credit_purchase", onSuccess, onFailure }) => {
      setLoading(true);
      setError(null);

      try {
        // 1. Load Razorpay SDK
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Could not load payment gateway. Check your internet connection.");
        }

        // 2. Create order on our backend
        const orderRes = await fetch(`${API_BASE}/payments/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "include",
          body: JSON.stringify({ amountINR, description, carbonCredits, type }),
        });
        const orderData = await orderRes.json();

        if (!orderData.success) {
          throw new Error(orderData.message || "Could not create payment order.");
        }

        // 3. Open Razorpay checkout modal
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Harit Dhan",
          description,
          image: "https://haritdhan.com/logo.png", // replace with your logo URL
          order_id: orderData.orderId,
          prefill: {
            name: user?.fullName || orderData.user?.name,
            email: user?.email || orderData.user?.email,
            contact: user?.phone || orderData.user?.phone,
          },
          notes: { transactionId: orderData.transactionId },
          theme: { color: "#2D7A3A" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              onFailure?.("Payment was cancelled.");
            },
          },

          // 4. On successful payment — verify signature on backend
          handler: async (response) => {
            try {
              const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...getAuthHeaders(),
                },
                credentials: "include",
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  transactionId: orderData.transactionId,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyData.success) {
                throw new Error(verifyData.message || "Payment verification failed.");
              }

              setLoading(false);
              onSuccess?.(verifyData.transaction);
            } catch (err) {
              setLoading(false);
              setError(err.message);
              onFailure?.(err.message);
            }
          },
        };

        const rzp = new window.Razorpay(options);

        // Handle payment errors inside the modal
        rzp.on("payment.failed", (response) => {
          setLoading(false);
          const msg = response.error?.description || "Payment failed.";
          setError(msg);
          onFailure?.(msg);
        });

        rzp.open();
      } catch (err) {
        setLoading(false);
        setError(err.message);
        onFailure?.(err.message);
      }
    },
    [getAuthHeaders, user]
  );

  return { initiatePayment, loading, error, clearError: () => setError(null) };
};
