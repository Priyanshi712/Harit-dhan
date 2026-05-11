import { useState, useRef } from "react";
import { useAuth } from "./context/AuthContext";

const getColors = (dark) => ({
  blue: "#2D7A3A", blueDark: "#1B5E27", blueLight: dark ? "#1A3D1F" : "#ECFDF0",
  navy: dark ? "#E8F5EA" : "#1A3D1F", navyMid: dark ? "#C8E6CC" : "#234D28",
  gray50: dark ? "#0F1F11" : "#F4FBF5", gray100: dark ? "#1A3020" : "#E8F5EA",
  gray200: dark ? "#2A4A30" : "#C8E6CC", gray400: dark ? "#7BAF82" : "#7BAF82",
  gray500: dark ? "#9DC9A3" : "#5C8A62", gray700: dark ? "#C8E6CC" : "#2E6B35",
  white: dark ? "#162119" : "#FFFFFF", cardBg: dark ? "#1A2E1D" : "#FFFFFF",
  screenBg: dark ? "#0F1F11" : "#F4FBF5", green: "#22C55E",
  greenLight: dark ? "#0F2E1A" : "#DCFCE7", amber: "#F59E0B",
  amberLight: dark ? "#2E1F05" : "#FEF3C7", purple: "#16803C",
  purpleLight: dark ? "#0A2015" : "#D1FAE5", red: "#EF4444",
  inputBg: dark ? "#0F1F11" : "#FFFFFF", topBarBg: dark ? "#162119" : "#FFFFFF",
  navBg: dark ? "#162119" : "#FFFFFF", statusBg: dark ? "#0F1F11" : "transparent",
  shadow: dark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.06)",
});

const getStyles = (C) => ({
  card: { background: C.cardBg, borderRadius: "16px", padding: "16px", boxShadow: C.shadow },
  btn: { background: C.blue, color: "#FFFFFF", border: "none", borderRadius: "12px", padding: "14px 20px", fontWeight: "600", fontSize: "15px", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  btnOutline: { background: "transparent", color: C.navy, border: `1.5px solid ${C.gray200}`, borderRadius: "12px", padding: "13px 20px", fontWeight: "600", fontSize: "15px", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  h1: { fontSize: "28px", fontWeight: "800", color: C.navy, lineHeight: 1.15 },
  h2: { fontSize: "22px", fontWeight: "800", color: C.navy, lineHeight: 1.2 },
  h3: { fontSize: "16px", fontWeight: "700", color: C.navy },
  body: { fontSize: "14px", color: C.gray500, lineHeight: 1.5 },
  small: { fontSize: "12px", color: C.gray400 },
});

const Icon = ({ name, size = 18, color = "currentColor", ...props }) => {
  const icons = {
    leaf: <path d="M17 8C8 10 5.9 16.17 3.82 19.67A2 2 0 014 22a1 1 0 001-1 7 7 0 016-7c4 0 6-3 6-7z" />,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    hub: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    carbon: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-8.5-1.5 1.5M5.5 18.5l-1.5 1.5m0-15 1.5 1.5M18.5 18.5l1.5 1.5"/></>,
    market: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    satellite: <><path d="M13 7L9.8 7a2 2 0 00-1.4.6L5 11m0 0a2 2 0 000 2.8l5.2 5.2A2 2 0 0012 20h.1M5 11l2 2"/><path d="M14 4l-1 1 3 3 1-1a2.12 2.12 0 00-3-3z"/><path d="M8.5 8.5l7 7"/><circle cx="17" cy="17" r="5"/><path d="M17 15v2l1 1"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    spark: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>,
    mic: <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    chip: <><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></>,
    recycle: <><polyline points="1.5 2 1.5 8 7.5 8"/><polyline points="22.5 22 22.5 16 16.5 16"/><path d="M22 11.5A10 10 0 003.2 7.2L1.5 8M2 12.5a10 10 0 0018.8 4.2l1.7-1.2"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    bar: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    wallet: <><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/></>,
    trend: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>,</>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {icons[name]}
    </svg>
  );
};

const HaritDhanLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 140 Q100 175 170 140" fill="none" stroke="#1B6B2A" strokeWidth="7" strokeLinecap="round"/>
    <path d="M30 148 Q100 183 170 148" fill="none" stroke="#2D9140" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
    <ellipse cx="100" cy="130" rx="10" ry="22" fill="#3AAA50"/>
    <path d="M100 115 Q72 105 58 118" fill="none" stroke="#3AAA50" strokeWidth="8" strokeLinecap="round"/>
    <path d="M100 115 Q128 105 142 118" fill="none" stroke="#3AAA50" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="100" cy="95" r="11" fill="#3AAA50"/>
    <ellipse cx="78" cy="68" rx="11" ry="18" fill="#1B6B2A" transform="rotate(-30 78 68)"/>
    <ellipse cx="122" cy="68" rx="11" ry="18" fill="#1B6B2A" transform="rotate(30 122 68)"/>
    <ellipse cx="100" cy="52" rx="10" ry="17" fill="#1B6B2A"/>
    <ellipse cx="88" cy="55" rx="9" ry="15" fill="#5EC86A" transform="rotate(-20 88 55)"/>
    <ellipse cx="112" cy="55" rx="9" ry="15" fill="#5EC86A" transform="rotate(20 112 55)"/>
    <ellipse cx="100" cy="40" rx="8" ry="14" fill="#7ED87A"/>
    <text x="94" y="65" fontSize="13" fill="#1B6B2A" fontWeight="bold" opacity="0.85">₹</text>
  </svg>
);

const Badge = ({ children, color, bg }) => (
  <span style={{ fontSize: "11px", fontWeight: "700", color, background: bg, borderRadius: "6px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
    {children}
  </span>
);

const StatCard = ({ icon, iconBg, value, label, sub, subColor, C }) => (
  <div style={{ background: C.cardBg, borderRadius: "16px", padding: "16px", flex: 1, minWidth: 0, boxShadow: C.shadow }}>
    <div style={{ width: 40, height: 40, borderRadius: "10px", background: iconBg || C.navy, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>{icon}</div>
    <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy }}>{value}</div>
    <div style={{ fontSize: "12px", color: C.gray400, marginTop: "2px" }}>{label}</div>
    {sub && <div style={{ fontSize: "11px", color: subColor || C.green, fontWeight: "600", marginTop: "4px" }}>{sub}</div>}
  </div>
);

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "haritHub", label: "Hub", icon: "hub" },
  { id: "carbonAnalysis", label: "Analysis", icon: "carbon" },
  { id: "marketplace", label: "Market", icon: "market" },
  { id: "monitoring", label: "Monitor", icon: "satellite" },
];

const BottomNav = ({ active, onChange, C }) => (
  <div style={{ position: "sticky", bottom: 0, background: C.navBg, borderTop: `1px solid ${C.gray200}`, display: "flex", zIndex: 100 }}>
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onChange(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer", color: active === item.id ? "#2D7A3A" : C.gray400, gap: "3px" }}>
        <Icon name={item.icon} size={20} color={active === item.id ? "#2D7A3A" : C.gray400} />
        <span style={{ fontSize: "10px", fontWeight: active === item.id ? "700" : "500" }}>{item.label}</span>
      </button>
    ))}
  </div>
);

const DarkModeToggle = ({ dark, onToggle, C }) => (
  <button onClick={onToggle} style={{ background: dark ? "#2A4A30" : "#E8F5EA", border: "none", borderRadius: "20px", width: 50, height: 28, cursor: "pointer", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 3, left: dark ? 24 : 3, width: 22, height: 22, borderRadius: "50%", background: dark ? "#2D7A3A" : "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.25)", transition: "left 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={dark ? "moon" : "sun"} size={12} color={dark ? "#A7F3C0" : "#F59E0B"} />
    </div>
  </button>
);

const TopBar = ({ title, subtitle, right, onBack, onHome, C }) => (
  <div style={{ background: C.topBarBg, borderBottom: `1px solid ${C.gray100}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {onBack && <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="arrowL" size={16} color={C.navy} /></button>}
      <HaritDhanLogo size={36} />
      <div>
        <div style={{ fontSize: "10px", fontWeight: "600", color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>{subtitle}</div>
        <div style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>{title}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {onHome && <button onClick={onHome} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="home" size={16} color={C.navy} /></button>}
      {right}
    </div>
  </div>
);

// ─── LANDING ──────────────────────────────────────────────────────────────────
const LandingScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119, #0A2015)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5, #D1FAE5)`, minHeight: "100%" }}>
    <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <HaritDhanLogo size={42} />
        <div>
          <div style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>Harit Dhan</div>
          <div style={{ fontSize: "10px", fontWeight: "600", color: C.gray400, letterSpacing: "0.06em" }}>CLIMATE INTELLIGENCE</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
        <button onClick={() => onNavigate("login")} style={{ ...S.btn, width: "auto", padding: "8px 16px", fontSize: "13px", borderRadius: "10px" }}>Sign in</button>
      </div>
    </div>

    <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
      <div style={{ background: `linear-gradient(135deg, #1A3D1F, #2D7A3A)`, borderRadius: "16px", padding: "16px 20px", marginBottom: "20px", textAlign: "left" }}>
        <div style={{ fontSize: "22px", marginBottom: "4px" }}>🙏</div>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#FFFFFF", marginBottom: "4px" }}>नमस्ते!</div>
        <div style={{ fontSize: "14px", color: "#A7F3C0" }}>Welcome to Harit Dhan — India's AI-native climate finance platform.</div>
      </div>
      <h1 style={{ ...S.h1, fontSize: "32px", marginBottom: "8px" }}>Build verifiable<br />climate impact with</h1>
      <h1 style={{ fontSize: "32px", fontWeight: "800", background: `linear-gradient(135deg, #2D7A3A, #22C55E)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2, marginBottom: "20px" }}>regenerative<br />intelligence</h1>
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
        <button onClick={() => onNavigate("signup")} style={{ ...S.btn }}>Get started →</button>
        <button onClick={() => onNavigate("overview")} style={{ ...S.btnOutline }}>Explore →</button>
      </div>
    </div>

    <div style={{ display: "flex", gap: "12px", padding: "0 16px 24px" }}>
      <StatCard icon={<Icon name="user" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="50,000+" label="Farmers onboarded" C={C} />
      <StatCard icon={<Icon name="bar" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="2.5M" label="Tonnes CO₂" C={C} />
      <StatCard icon={<Icon name="award" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="₹125Cr" label="Payouts" C={C} />
    </div>

    <div style={{ padding: "24px 16px", background: dark ? "#0A1F10" : "#1A3D1F" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <HaritDhanLogo size={40} />
        <span style={{ fontSize: "18px", fontWeight: "800", color: "#FFFFFF" }}>Harit Dhan</span>
      </div>
      <div style={{ textAlign: "center", fontSize: "12px", color: "#5C8A62", paddingTop: "12px", borderTop: `1px solid #2A4A30` }}>© 2026 Harit Dhan · Climate Intelligence Platform</div>
    </div>
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const LoginScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
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
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="arrowL" size={18} color={C.navy} />
        </button>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
      </div>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <HaritDhanLogo size={72} />
        <div style={{ fontSize: "24px", fontWeight: "800", color: C.navy, marginTop: "8px" }}>Harit Dhan</div>
        <div style={{ fontSize: "13px", color: C.gray400, marginTop: "4px" }}>Climate finance workspace</div>
      </div>
      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "28px 24px" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy, marginBottom: "20px" }}>Welcome back</div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Email</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "12px 14px", background: C.inputBg }}>
            <Icon name="mail" size={16} color={C.gray400} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "12px 14px", background: C.inputBg }}>
            <Icon name="lock" size={16} color={C.gray400} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
          </div>
        </div>
        {error && <div style={{ background: "#FEE2E2", border: "1px solid #EF4444", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#EF4444" }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>{loading ? "Logging in..." : "Log in"}</button>
        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Don't have an account?{" "}
          <span onClick={() => onNavigate("signup")} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
const SignupScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Farmer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(""); setLoading(true);
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
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="arrowL" size={18} color={C.navy} />
        </button>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
      </div>
      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "28px 24px" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy, marginBottom: "20px" }}>Create account</div>
        {[
          { label: "Full Name", value: fullName, setValue: setFullName, placeholder: "Enter your full name", type: "text", icon: "user" },
          { label: "Email", value: email, setValue: setEmail, placeholder: "Enter your email", type: "email", icon: "mail" },
          { label: "Password", value: password, setValue: setPassword, placeholder: "Create a password", type: "password", icon: "lock" },
        ].map(({ label, value, setValue, placeholder, type, icon }) => (
          <div key={label} style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "12px 14px", background: C.inputBg }}>
              <Icon name={icon} size={16} color={C.gray400} />
              <input type={type} value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
            </div>
          </div>
        ))}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Role</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {["Farmer", "Corporate"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1.5px solid ${role === r ? "#2D7A3A" : C.gray200}`, background: role === r ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg, color: role === r ? "#2D7A3A" : C.gray500, fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>{r}</button>
            ))}
          </div>
        </div>
        {error && <div style={{ background: "#FEE2E2", border: "1px solid #EF4444", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#EF4444" }}>{error}</div>}
        <button onClick={handleSignup} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>{loading ? "Creating account..." : "Create Account ✓"}</button>
        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Already have an account?{" "}
          <span onClick={onBack} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Log in</span>
        </div>
      </div>
    </div>
  );
};

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
const OverviewScreen = ({ onNavigate, dark, onToggleDark, C, S, user }) => {
  const [lang, setLang] = useState("हिंदी (Hindi)");
  const displayName = user?.email?.split("@")[0]?.toUpperCase() || "USER";

  return (
    <div>
      <TopBar title="किसान डैशबोर्ड" subtitle="Harit Dhan OS"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
            <div style={{ fontSize: "13px", fontWeight: "600", color: C.gray500, display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name="user" size={14} color={C.gray400} />{displayName}
            </div>
          </div>
        }
        C={C}
      />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ ...S.card }}>
          <Badge color="#2D7A3A" bg={dark ? "#0F2B12" : "#ECFDF0"}><Icon name="spark" size={11} color="#2D7A3A" /> AI Farmer Console</Badge>
          <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy, margin: "10px 0 6px" }}>Carbon income, farm health, and AI guidance.</div>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${C.gray200}`, fontSize: "14px", color: C.navy, background: C.inputBg, outline: "none", marginBottom: "10px" }}>
            {["हिंदी (Hindi)", "English", "मराठी (Marathi)", "বাংলা (Bengali)"].map(l => <option key={l}>{l}</option>)}
          </select>
          <button style={{ ...S.btn, fontSize: "14px" }}><Icon name="mic" size={16} color="#FFFFFF" /> Voice Assistant</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Carbon Credits", value: "124 tCO₂", sub: "+18% this quarter" },
            { label: "Carbon Earnings", value: "₹25,100", sub: "+102% since Jan" },
            { label: "Farm Health", value: "84/100", sub: "Strong resilience" },
            { label: "AI Compliance", value: "92%", sub: "Audit ready" },
          ].map((item, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontSize: "11px", color: C.gray400, fontWeight: "600", marginBottom: "6px" }}>{item.label}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: C.green, fontWeight: "600", marginTop: "2px" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ fontSize: "16px", fontWeight: "700", color: C.navy, marginBottom: "12px" }}>Recent Transactions</div>
          {[
            { id: "TXN-9821", date: "06 May 2026", amount: "₹15,750", status: "Settled" },
            { id: "TXN-9764", date: "28 Apr 2026", amount: "₹9,960", status: "Settled" },
            { id: "TXN-9688", date: "16 Apr 2026", amount: "₹7,440", status: "Processing" },
          ].map((txn, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: C.navy }}>{txn.id}</div>
                <div style={{ fontSize: "12px", color: C.gray400 }}>{txn.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy }}>{txn.amount}</div>
                <Badge color={txn.status === "Settled" ? C.green : C.amber} bg={txn.status === "Settled" ? C.greenLight : C.amberLight}>{txn.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── HARIT HUB ────────────────────────────────────────────────────────────────
const HaritHubScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Financial Cockpit" subtitle="Harit Hub" onHome={() => onNavigate("overview")} right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />} C={C} />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { label: "Balance", value: "₹42,180", icon: "wallet" },
          { label: "Portfolio", value: "138 tCO₂", icon: "leaf" },
          { label: "ESG Allocs", value: "₹8.2L", icon: "trend" },
        ].map((item, i) => (
          <div key={i} style={{ ...S.card, flex: 1, padding: "12px 10px" }}>
            <Icon name={item.icon} size={14} color="#2D7A3A" />
            <div style={{ fontSize: "11px", color: C.gray400, margin: "6px 0 4px" }}>{item.label}</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: C.navy }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ fontSize: "16px", fontWeight: "700", color: C.navy, marginBottom: "12px" }}>Verified Payouts</div>
        {[
          { label: "Apr payout", date: "28 Apr 2026", amount: "₹18,240", status: "Paid" },
          { label: "May accrual", date: "12 May 2026", amount: "₹21,400", status: "Scheduled" },
          { label: "Crop bonus", date: "08 May 2026", amount: "₹4,120", status: "Verified" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: C.navy }}>{item.label}</div>
              <div style={{ fontSize: "12px", color: C.gray400 }}>{item.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "700", color: C.navy }}>{item.amount}</div>
              <Badge color="#2D7A3A" bg={dark ? "#1A3D1F" : "#ECFDF0"}>{item.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── CARBON ANALYSIS ──────────────────────────────────────────────────────────
const CarbonAnalysisScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Carbon Analysis" subtitle="AI-Powered MRV" onHome={() => onNavigate("overview")} right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />} C={C} />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Soil Analysis", value: "SOC +0.24%" },
          { label: "Carbon Predict", value: "5.4k tCO₂" },
          { label: "Climate Risk", value: "Low-Moderate" },
          { label: "Verified Scans", value: "99.7%" },
        ].map((item, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontSize: "11px", color: C.gray400, fontWeight: "600", marginBottom: "6px" }}>{item.label}</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: C.navy }}>{item.value}</div>
            <Badge color="#2D7A3A" bg={dark ? "#1A3D1F" : "#ECFDF0"}>AI ✓</Badge>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ fontSize: "16px", fontWeight: "700", color: C.navy, marginBottom: "12px" }}>Sustainability Metrics</div>
        {[
          { label: "Soil Organic Carbon", pct: 93 },
          { label: "Water Efficiency", pct: 97 },
          { label: "Residue Recycling", pct: 97 },
          { label: "No-Till Coverage", pct: 91 },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", color: C.navy }}>{m.label}</span>
              <span style={{ fontSize: "12px", color: C.gray400 }}>{m.pct}%</span>
            </div>
            <div style={{ height: 6, background: C.gray100, borderRadius: "3px" }}>
              <div style={{ height: "100%", width: `${m.pct}%`, background: `linear-gradient(90deg, #2D7A3A, #22C55E)`, borderRadius: "3px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
const MarketplaceScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Carbon Marketplace" subtitle="Live Markets" onHome={() => onNavigate("overview")} right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />} C={C} />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Market Cap", value: "₹425 Cr", sub: "↗ +12.3%" },
          { label: "24h Volume", value: "12,450 tCO₂", sub: "↗ +8.7%" },
          { label: "Avg Price", value: "₹1,247", sub: "↗ +5.1%" },
          { label: "Active Listings", value: "1,247", sub: "↗ +8.2%" },
        ].map((m, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "4px" }}>{m.label}</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy }}>{m.value}</div>
            <div style={{ fontSize: "12px", color: C.green, fontWeight: "600" }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{ fontSize: "16px", fontWeight: "700", color: C.navy, marginBottom: "12px" }}>Recently Sold</div>
        {[
          { id: "BLK-98AF", loc: "Ludhiana", co2: "180 tCO2 @ ₹1,210", time: "2m ago" },
          { id: "BLK-74DD", loc: "Nashik", co2: "240 tCO2 @ ₹1,258", time: "6m ago" },
          { id: "BLK-41KP", loc: "Mysore", co2: "310 tCO2 @ ₹1,322", time: "11m ago" },
        ].map((txn, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: C.navy }}>{txn.id}</div>
              <div style={{ fontSize: "12px", color: C.gray500 }}>{txn.loc} · {txn.co2}</div>
            </div>
            <div style={{ fontSize: "12px", color: C.gray400 }}>{txn.time}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MONITORING ───────────────────────────────────────────────────────────────
const MonitoringScreen = ({ onNavigate, dark, onToggleDark, C, S }) => {
  const [activeTab, setActiveTab] = useState("Carbon");
  return (
    <div>
      <TopBar title="Satellite Monitoring" subtitle="AI MRV" onHome={() => onNavigate("overview")} right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />} C={C} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Farms Monitored", value: "50,247" },
            { label: "AI Scans Today", value: "1,847" },
            { label: "Verification Rate", value: "99.7%" },
            { label: "Avg Carbon Score", value: "92.4" },
          ].map((m, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "4px" }}>{m.label}</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {["Carbon", "NDVI", "Soil", "Water"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "4px 10px", borderRadius: "6px", border: "none", background: activeTab === tab ? "#2D7A3A" : C.gray100, color: activeTab === tab ? "#FFFFFF" : C.gray500, fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>{tab}</button>
            ))}
          </div>
          <div style={{ background: dark ? `radial-gradient(ellipse, #2D7A3A44, #0F1F11 70%)` : `radial-gradient(ellipse, #2D7A3A33, #ECFDF0 70%)`, borderRadius: "10px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: C.navy }}>Live: {activeTab} View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("landing");
  const [activeTab, setActiveTab] = useState("overview");
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState(["landing"]);
  const scrollRef = useRef(null);

  const C = getColors(dark);
  const S = getStyles(C);
  const isApp = !["landing", "login", "signup"].includes(page);

  const handleNavigate = (p) => {
    setPage(p);
    setHistory(prev => [...prev, p]);
    if (!["landing", "login", "signup"].includes(p)) setActiveTab(p);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleNavChange = (tab) => {
    setActiveTab(tab);
    setPage(tab);
    setHistory(prev => [...prev, tab]);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const sharedProps = { onNavigate: handleNavigate, dark, onToggleDark: () => setDark(d => !d), C, S, user };

  const renderPage = () => {
    switch (page) {
      case "landing": return <LandingScreen {...sharedProps} />;
      case "login": return <LoginScreen {...sharedProps} onBack={() => handleNavigate("landing")} />;
      case "signup": return <SignupScreen {...sharedProps} onBack={() => handleNavigate("login")} />;
      case "overview": return <OverviewScreen {...sharedProps} />;
      case "haritHub": return <HaritHubScreen {...sharedProps} />;
      case "carbonAnalysis": return <CarbonAnalysisScreen {...sharedProps} />;
      case "marketplace": return <MarketplaceScreen {...sharedProps} />;
      case "monitoring": return <MonitoringScreen {...sharedProps} />;
      default: return <OverviewScreen {...sharedProps} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.screenBg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", minHeight: "100vh", background: C.screenBg, display: "flex", flexDirection: "column" }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {renderPage()}
        </div>
        {isApp && <BottomNav active={activeTab} onChange={handleNavChange} C={C} />}
      </div>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        input::placeholder { color: #7BAF82; opacity: 0.7; }
      `}</style>
    </div>
  );
}
