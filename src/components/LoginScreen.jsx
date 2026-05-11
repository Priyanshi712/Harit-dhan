import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
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
        <div style={{ fontSize: "24px", fontWeight: "800", color: C.navy, marginBottom: "20px" }}>Welcome back</div>

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
            placeholder="Enter your password"
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

        <button onClick={handleLogin} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Don't have an account?{" "}
          <span onClick={() => onNavigate("signup")} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;