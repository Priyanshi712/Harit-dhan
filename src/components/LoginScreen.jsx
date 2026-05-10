// ─── LoginScreen — drop-in replacement for the existing one ───────────────────
// Wires up real API login via AuthContext. Paste this over the existing
// LoginScreen component in HaritDhan_MobileApp_Enhanced.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validators } from "../utils/validation";

export const LoginScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { login, loading, authError, clearError } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const set = (field) => (e) => {
    clearError();
    setErrors((prev) => ({ ...prev, [field]: null }));
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogin = async () => {
    // Client-side validation first
    const newErrors = {};
    const emailErr = validators.email(form.email);
    const pwErr = form.password ? null : "Password is required.";
    if (emailErr) newErrors.email = emailErr;
    if (pwErr) newErrors.password = pwErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(form.email, form.password);
      onNavigate("overview");
    } catch {
      // authError is set inside AuthContext — displayed below
    }
  };

  const inputStyle = (field) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: `1.5px solid ${errors[field] ? C.red : C.gray200}`,
    borderRadius: "10px",
    padding: "11px 14px",
    background: C.inputBg,
  });

  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5)`, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>

      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          ←
        </button>
        <span style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>Harit Dhan</span>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "28px 24px" }}>
        <div style={{ ...S.h2, marginBottom: "4px" }}>Welcome back</div>
        <div style={{ fontSize: "13px", color: C.gray400, marginBottom: "24px" }}>Log in to your climate finance account</div>

        {/* Global API error */}
        {authError && (
          <div style={{ background: dark ? "#2E0A0A" : "#FEE2E2", border: `1px solid ${C.red}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: C.red }}>
            {authError}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Email Address</label>
          <div style={inputStyle("email")}>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set("email")}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }}
            />
          </div>
          {errors.email && <div style={{ fontSize: "11px", color: C.red, marginTop: "4px" }}>{errors.email}</div>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Password</label>
          <div style={inputStyle("password")}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }}
            />
            <button
              onClick={() => setShowPw((s) => !s)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "12px", color: C.gray400 }}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div style={{ fontSize: "11px", color: C.red, marginTop: "4px" }}>{errors.password}</div>}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? "Logging in…" : "Log in →"}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: C.gray500 }}>
          Don't have an account?{" "}
          <span onClick={() => onNavigate("signup")} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Sign up</span>
        </div>
      </div>
    </div>
  );
};
