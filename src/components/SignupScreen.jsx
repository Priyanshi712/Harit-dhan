import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SignupScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      onNavigate("overview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5)`, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>

      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "28px 24px" }}>
        <div style={{ fontSize: "24px", fontWeight: "800", color: C.navy, marginBottom: "20px" }}>Create account</div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", fontSize: "14px", color: C.navy, background: C.inputBg, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", fontSize: "14px", color: C.navy, background: C.inputBg, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", fontSize: "14px", color: C.navy, background: C.inputBg, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #EF4444", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#EF4444" }}>
            {error}
          </div>
        )}

        <button onClick={handleSignup} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating account..." : "Create Account ✓"}
        </button>

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Already have an account?{" "}
          <span onClick={onBack} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Log in</span>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;