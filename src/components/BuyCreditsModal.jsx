// ─── BuyCreditsModal ───────────────────────────────────────────────────────────
// Drop into MarketplaceScreen wherever a "Buy" button is clicked.
// Usage:
//   const [buying, setBuying] = useState(null); // { name, priceINR, credits }
//   {buying && <BuyCreditsModal item={buying} onClose={() => setBuying(null)} C={C} S={S} dark={dark} />}

import { useState } from "react";
import { usePayment } from "../hooks/usePayment";

export const BuyCreditsModal = ({ item, onClose, C, S, dark }) => {
  const { initiatePayment, loading, error } = usePayment();
  const [success, setSuccess] = useState(null);

  const handleBuy = () => {
    initiatePayment({
      amountINR: item.priceINR,
      description: `HaritDhan — ${item.name}`,
      carbonCredits: item.credits || 0,
      type: "credit_purchase",
      onSuccess: (txn) => {
        setSuccess(txn);
      },
      onFailure: (msg) => {
        // error state is already set inside usePayment
        console.error("Payment failed:", msg);
      },
    });
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    >
      {/* Sheet — stop propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ ...S.card, width: "100%", maxWidth: "390px", borderRadius: "20px 20px 0 0", padding: "24px 20px 32px" }}
      >
        {success ? (
          // ── Success state ──────────────────────────────────────────────────
          <>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
              <div style={{ ...S.h2, marginBottom: "6px" }}>Payment successful!</div>
              <div style={{ fontSize: "13px", color: C.gray500, marginBottom: "4px" }}>
                ₹{success.amount} paid · {item.credits} tCO₂ credited
              </div>
              <div style={{ fontSize: "11px", color: C.gray400 }}>Transaction ID: {success.id}</div>
            </div>
            <button onClick={onClose} style={S.btn}>Done</button>
          </>
        ) : (
          // ── Default purchase state ─────────────────────────────────────────
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={S.h3}>Confirm purchase</div>
              <button onClick={onClose} style={{ background: C.gray100, border: "none", borderRadius: "8px", width: 30, height: 30, cursor: "pointer", fontSize: "16px", color: C.gray500 }}>✕</button>
            </div>

            {/* Item summary */}
            <div style={{ background: dark ? "#0F2B12" : "#F4FBF5", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontWeight: "700", color: C.navy, fontSize: "15px", marginBottom: "6px" }}>{item.name}</div>
              {item.description && (
                <div style={{ fontSize: "13px", color: C.gray500, marginBottom: "8px" }}>{item.description}</div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "13px", color: C.gray400 }}>Carbon credits</div>
                <div style={{ fontWeight: "700", color: "#2D7A3A" }}>{item.credits} tCO₂</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                <div style={{ fontSize: "13px", color: C.gray400 }}>Amount</div>
                <div style={{ fontWeight: "800", color: C.navy, fontSize: "18px" }}>₹{item.priceINR?.toLocaleString("en-IN")}</div>
              </div>
            </div>

            {/* Razorpay note */}
            <div style={{ fontSize: "12px", color: C.gray400, textAlign: "center", marginBottom: "16px" }}>
              🔒 Secured by Razorpay · UPI, cards & net banking accepted
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: dark ? "#2E0A0A" : "#FEE2E2", border: `1px solid ${C.red}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: C.red }}>
                {error}
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={loading}
              style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
            >
              {loading ? "Opening payment…" : `Pay ₹${item.priceINR?.toLocaleString("en-IN")}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
