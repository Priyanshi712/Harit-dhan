import { useState, useEffect, useRef } from "react";

// ─── DARK MODE CONTEXT ────────────────────────────────────────────────────────
// Colors are computed dynamically based on dark mode state
const getColors = (dark) => ({
  blue: "#2D7A3A",
  blueDark: "#1B5E27",
  blueLight: dark ? "#1A3D1F" : "#ECFDF0",
  navy: dark ? "#E8F5EA" : "#1A3D1F",
  navyMid: dark ? "#C8E6CC" : "#234D28",
  gray50: dark ? "#0F1F11" : "#F4FBF5",
  gray100: dark ? "#1A3020" : "#E8F5EA",
  gray200: dark ? "#2A4A30" : "#C8E6CC",
  gray400: dark ? "#7BAF82" : "#7BAF82",
  gray500: dark ? "#9DC9A3" : "#5C8A62",
  gray700: dark ? "#C8E6CC" : "#2E6B35",
  white: dark ? "#162119" : "#FFFFFF",
  cardBg: dark ? "#1A2E1D" : "#FFFFFF",
  screenBg: dark ? "#0F1F11" : "#F4FBF5",
  green: "#22C55E",
  greenLight: dark ? "#0F2E1A" : "#DCFCE7",
  amber: "#F59E0B",
  amberLight: dark ? "#2E1F05" : "#FEF3C7",
  purple: "#16803C",
  purpleLight: dark ? "#0A2015" : "#D1FAE5",
  red: "#EF4444",
  inputBg: dark ? "#0F1F11" : "#FFFFFF",
  topBarBg: dark ? "#162119" : "#FFFFFF",
  navBg: dark ? "#162119" : "#FFFFFF",
  statusBg: dark ? "#0F1F11" : "transparent",
  shadow: dark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.06)",
});

const getStyles = (C) => ({
  screen: {
    width: "390px",
    minHeight: "844px",
    background: C.screenBg,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
  },
  card: {
    background: C.cardBg,
    borderRadius: "16px",
    padding: "16px",
    boxShadow: C.shadow,
  },
  btn: {
    background: C.blue,
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  btnOutline: {
    background: "transparent",
    color: C.navy,
    border: `1.5px solid ${C.gray200}`,
    borderRadius: "12px",
    padding: "13px 20px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    color: C.blue,
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  h1: { fontSize: "28px", fontWeight: "800", color: C.navy, lineHeight: 1.15 },
  h2: { fontSize: "22px", fontWeight: "800", color: C.navy, lineHeight: 1.2 },
  h3: { fontSize: "16px", fontWeight: "700", color: C.navy },
  body: { fontSize: "14px", color: C.gray500, lineHeight: 1.5 },
  small: { fontSize: "12px", color: C.gray400 },
});

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", ...props }) => {
  const icons = {
    leaf: <path d="M17 8C8 10 5.9 16.17 3.82 19.67A2 2 0 014 22a1 1 0 001-1 7 7 0 016-7c4 0 6-3 6-7z" />,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    hub: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    carbon: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-8.5-1.5 1.5M5.5 18.5l-1.5 1.5m0-15 1.5 1.5M18.5 18.5l1.5 1.5"/></>,
    market: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    arrowR: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    spark: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>,
    mic: <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    chip: <><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    recycle: <><polyline points="1.5 2 1.5 8 7.5 8"/><polyline points="22.5 22 22.5 16 16.5 16"/><path d="M22 11.5A10 10 0 003.2 7.2L1.5 8M2 12.5a10 10 0 0018.8 4.2l1.7-1.2"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    bar: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    wallet: <><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/></>,
    trend: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></>,
    satellite: <><path d="M13 7L9.8 7a2 2 0 00-1.4.6L5 11m0 0a2 2 0 000 2.8l5.2 5.2A2 2 0 0012 20h.1M5 11l2 2"/><path d="M14 4l-1 1 3 3 1-1a2.12 2.12 0 00-3-3z"/><path d="M8.5 8.5l7 7"/><circle cx="17" cy="17" r="5"/><path d="M17 15v2l1 1"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    droplet: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {icons[name]}
    </svg>
  );
};

// ─── HARIT DHAN LOGO ──────────────────────────────────────────────────────────
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
    <ellipse cx="65" cy="85" rx="10" ry="16" fill="#1B6B2A" transform="rotate(-50 65 85)"/>
    <ellipse cx="135" cy="85" rx="10" ry="16" fill="#1B6B2A" transform="rotate(50 135 85)"/>
    <ellipse cx="100" cy="52" rx="10" ry="17" fill="#1B6B2A"/>
    <ellipse cx="88" cy="55" rx="9" ry="15" fill="#5EC86A" transform="rotate(-20 88 55)"/>
    <ellipse cx="112" cy="55" rx="9" ry="15" fill="#5EC86A" transform="rotate(20 112 55)"/>
    <ellipse cx="72" cy="72" rx="8" ry="13" fill="#5EC86A" transform="rotate(-40 72 72)"/>
    <ellipse cx="128" cy="72" rx="8" ry="13" fill="#5EC86A" transform="rotate(40 128 72)"/>
    <ellipse cx="100" cy="40" rx="8" ry="14" fill="#7ED87A"/>
    <text x="55" y="75" fontSize="14" fill="#1B6B2A" fontWeight="bold" opacity="0.9">₹</text>
    <text x="132" y="75" fontSize="14" fill="#1B6B2A" fontWeight="bold" opacity="0.9">₹</text>
    <text x="94" y="65" fontSize="13" fill="#1B6B2A" fontWeight="bold" opacity="0.85">₹</text>
    <text x="68" y="58" fontSize="11" fill="#2D9140" fontWeight="bold" opacity="0.8">₹</text>
    <text x="118" y="58" fontSize="11" fill="#2D9140" fontWeight="bold" opacity="0.8">₹</text>
  </svg>
);

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ children, color, bg }) => {
  return (
    <span style={{ fontSize: "11px", fontWeight: "700", color, background: bg, borderRadius: "6px", padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
      {children}
    </span>
  );
};

const StatCard = ({ icon, iconBg, value, label, sub, subColor, C }) => (
  <div style={{ background: C.cardBg, borderRadius: "16px", padding: "16px", flex: 1, minWidth: 0, boxShadow: C.shadow }}>
    <div style={{ width: 40, height: 40, borderRadius: "10px", background: iconBg || C.navy, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
      {icon}
    </div>
    <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy, letterSpacing: "-0.5px" }}>{value}</div>
    <div style={{ fontSize: "12px", color: C.gray400, marginTop: "2px" }}>{label}</div>
    {sub && <div style={{ fontSize: "11px", color: subColor || C.green, fontWeight: "600", marginTop: "4px" }}>{sub}</div>}
  </div>
);

const Divider = ({ C }) => <div style={{ height: 1, background: C.gray100, margin: "4px 0" }} />;

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "haritHub", label: "Hub", icon: "hub" },
  { id: "carbonAnalysis", label: "Analysis", icon: "carbon" },
  { id: "marketplace", label: "Market", icon: "market" },
  { id: "monitoring", label: "Monitor", icon: "satellite" },
];

const BottomNav = ({ active, onChange, C }) => (
  <div style={{
    position: "sticky", bottom: 0, left: 0, right: 0,
    background: C.navBg,
    borderTop: `1px solid ${C.gray200}`,
    display: "flex",
    zIndex: 100,
    paddingBottom: "env(safe-area-inset-bottom, 8px)",
  }}>
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onChange(item.id)} style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer",
        color: active === item.id ? "#2D7A3A" : C.gray400, gap: "3px", transition: "color 0.2s",
      }}>
        <Icon name={item.icon} size={20} color={active === item.id ? "#2D7A3A" : C.gray400} />
        <span style={{ fontSize: "10px", fontWeight: active === item.id ? "700" : "500" }}>{item.label}</span>
      </button>
    ))}
  </div>
);

// ─── TOP BAR with Back & Home Buttons ─────────────────────────────────────────
const TopBar = ({ title, subtitle, right, onBack, onHome, C }) => (
  <div style={{ background: C.topBarBg, borderBottom: `1px solid ${C.gray100}`, padding: "10px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Icon name="arrowL" size={16} color={C.navy} />
        </button>
      )}
      <HaritDhanLogo size={36} />
      <div>
        <div style={{ fontSize: "10px", fontWeight: "600", color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>{subtitle}</div>
        <div style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>{title}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {onHome && (
        <button onClick={onHome} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="home" size={16} color={C.navy} />
        </button>
      )}
      {right}
    </div>
  </div>
);

// ─── DARK MODE TOGGLE BUTTON ──────────────────────────────────────────────────
const DarkModeToggle = ({ dark, onToggle, C }) => (
  <button onClick={onToggle} style={{
    background: dark ? "#2A4A30" : "#E8F5EA",
    border: "none",
    borderRadius: "20px",
    width: 50,
    height: 28,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.3s",
    flexShrink: 0,
  }}>
    <div style={{
      position: "absolute",
      top: 3,
      left: dark ? 24 : 3,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: dark ? "#2D7A3A" : "#FFFFFF",
      boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      transition: "left 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Icon name={dark ? "moon" : "sun"} size={12} color={dark ? "#A7F3C0" : "#F59E0B"} />
    </div>
  </button>
);

// ─── SCREEN: LANDING ──────────────────────────────────────────────────────────
const LandingScreen = ({ onNavigate, dark, onToggleDark, C, S }) => {
  const [price] = useState("₹1,244.26");
  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11 0%, #162119 60%, #0A2015 100%)` : `linear-gradient(160deg, #ECFDF0 0%, #F4FBF5 60%, #D1FAE5 100%)`, minHeight: "100%" }}>
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
        <div style={{ background: `linear-gradient(135deg, ${C.navy === "#E8F5EA" ? "#0A1F10" : "#1A3D1F"}, #2D7A3A)`, borderRadius: "16px", padding: "16px 20px", marginBottom: "20px", textAlign: "left", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.15 }}><HaritDhanLogo size={90} /></div>
          <div style={{ fontSize: "22px", marginBottom: "4px" }}>🙏</div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#FFFFFF", marginBottom: "4px" }}>नमस्ते!</div>
          <div style={{ fontSize: "14px", color: "#A7F3C0", fontWeight: "500" }}>Welcome to Harit Dhan — India's AI-native climate finance platform for farmers & enterprises.</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: C.cardBg, border: `1px solid ${C.gray200}`, borderRadius: "20px", padding: "6px 14px", marginBottom: "20px" }}>
          <Icon name="spark" size={13} color="#2D7A3A" />
          <span style={{ fontSize: "11px", fontWeight: "700", color: C.gray500, letterSpacing: "0.08em" }}>AI-NATIVE CLIMATE INFRA · INDIA-FIRST</span>
        </div>
        <h1 style={{ ...S.h1, fontSize: "32px", marginBottom: "8px" }}>Build verifiable<br />climate impact with</h1>
        <h1 style={{ fontSize: "32px", fontWeight: "800", background: `linear-gradient(135deg, #2D7A3A, #22C55E)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2, marginBottom: "16px" }}>regenerative<br />intelligence</h1>
        <p style={{ ...S.body, maxWidth: "300px", margin: "0 auto 28px", textAlign: "center" }}>Farmers, satellites, blockchain-backed provenance, and enterprise ESG—orchestrated through one auditable measurement layer.</p>
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          <button onClick={() => onNavigate("signup")} style={{ ...S.btn, borderRadius: "12px" }}>Get started →</button>
          <button onClick={() => onNavigate("overview")} style={{ ...S.btnOutline, borderRadius: "12px" }}>Explore platform →</button>
        </div>
      </div>

      <div style={{ margin: "0 16px 24px" }}>
        <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="trend" size={16} color={C.green} />
            <span style={{ fontSize: "13px", color: C.gray500 }}>Live indicative carbon price</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "17px", fontWeight: "800", color: C.navy }}>{price}<span style={{ fontSize: "11px", color: C.gray400 }}>/tCO₂</span></span>
            <Badge color={C.green} bg={C.greenLight}>↗ +3.2%*</Badge>
          </div>
        </div>
        <div style={{ ...S.small, textAlign: "center", marginTop: "6px" }}>*Illustrative market movement for demo purposes.</div>
      </div>

      <div style={{ display: "flex", gap: "12px", padding: "0 16px 24px" }}>
        <StatCard icon={<Icon name="user" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="50,000+" label="Farmers onboarded" C={C} />
        <StatCard icon={<Icon name="bar" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="2.5M" label="Tonnes CO₂ modeled" C={C} />
        <StatCard icon={<Icon name="award" size={18} color="#FFFFFF" />} iconBg="#2D7A3A" value="₹125Cr" label="Projected payouts" C={C} />
      </div>

      <div style={{ padding: "16px 16px", background: dark ? C.gray100 : "#FFFFFF", margin: "0" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "#2D7A3A", textTransform: "uppercase", marginBottom: "4px" }}>Verified Value Chain</div>
        <div style={{ ...S.h2, marginBottom: "4px", marginTop: "4px" }}>From farm plots to filings</div>
        <div style={{ display: "flex", overflowX: "auto", gap: "12px", paddingBottom: "16px", marginTop: "12px" }}>
          {[
            { icon: "leaf", label: "Farmer", desc: "Practice adoption captured in-field" },
            { icon: "recycle", label: "Biomass", desc: "Waste pathways & circularity loops" },
            { icon: "award", label: "Credits", desc: "MRV-ready issuance scaffolding" },
            { icon: "chip", label: "Blockchain", desc: "Immutable lineage for each claim" },
            { icon: "bar", label: "Corporate", desc: "BRSR + ESG roll-up views" },
          ].map((item, i) => (
            <div key={i} style={{ ...S.card, minWidth: "140px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#2D7A3A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Icon name={item.icon} size={20} color="#FFFFFF" />
              </div>
              <div style={{ ...S.h3, fontSize: "14px", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ ...S.small, lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 16px", background: C.screenBg }}>
        <div style={{ ...S.h2, textAlign: "center", marginBottom: "6px" }}>Impact that compounds</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
          {[
            { icon: "leaf", title: "Regenerative yield", desc: "Soil health trajectories surfaced next to payouts so clusters stay financed and resilient." },
            { icon: "target", title: "Enterprise clarity", desc: "Operational carbon math mapped to disclosures your compliance team actually recognizes." },
            { icon: "award", title: "Traceable trust", desc: "AI-assisted MRV + chain-of-custody events give each credit its own dossier." },
          ].map((item, i) => (
            <div key={i} style={S.card}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: C.navy === "#E8F5EA" ? "#0F2B12" : "#1A3D1F", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <Icon name={item.icon} size={18} color="#FFFFFF" />
              </div>
              <div style={S.h3}>{item.title}</div>
              <div style={{ ...S.body, marginTop: "4px" }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate("signup")} style={{ ...S.btn, marginTop: "20px" }}>Continue to your workspace →</button>
      </div>

      <div style={{ padding: "24px 16px", background: dark ? "#0A1F10" : "#1A3D1F" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <HaritDhanLogo size={40} />
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#FFFFFF" }}>Harit Dhan</span>
        </div>
        <p style={{ fontSize: "13px", color: "#7BAF82", lineHeight: 1.5, marginBottom: "16px" }}>Verifiable climate outcomes, AI-assisted MRV, and enterprise-grade carbon workflows—built for India's growers and compliant supply chains.</p>
        <div style={{ textAlign: "center", fontSize: "12px", color: "#5C8A62", paddingTop: "12px", borderTop: `1px solid #2A4A30` }}>© 2026 Harit Dhan · Climate Intelligence Platform</div>
      </div>
    </div>
  );
};

// ─── SCREEN: LOGIN ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const [role, setRole] = useState("Farmer");
  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5)`, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="arrowL" size={18} color={C.navy} />
        </button>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
      </div>

      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ margin: "0 auto 10px", display: "flex", justifyContent: "center" }}><HaritDhanLogo size={72} /></div>
        <div style={{ fontSize: "24px", fontWeight: "800", color: C.navy }}>Harit Dhan</div>
        <div style={{ fontSize: "13px", color: C.gray400, marginTop: "4px" }}>Enterprise climate finance workspace</div>
      </div>

      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "28px 24px" }}>
        <div style={{ ...S.h2, marginBottom: "20px" }}>Welcome back</div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Email</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "12px 14px", background: C.inputBg }}>
            <Icon name="mail" size={16} color={C.gray400} />
            <input placeholder="Enter your email" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "12px 14px", background: C.inputBg }}>
            <Icon name="lock" size={16} color={C.gray400} />
            <input type="password" placeholder="Enter your password" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Role</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {["Farmer", "Corporate"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: `1.5px solid ${role === r ? "#2D7A3A" : C.gray200}`,
                background: role === r ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg,
                color: role === r ? "#2D7A3A" : C.gray500,
                fontWeight: "600", fontSize: "14px", cursor: "pointer"
              }}>{r}</button>
            ))}
          </div>
        </div>

        <button onClick={() => onNavigate("overview")} style={S.btn}>Log in</button>
        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Don't have an account?{" "}
          <span onClick={() => onNavigate("signup")} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: SIGNUP (Enhanced with all user fields) ────────────────────────────
const SignupScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const [role, setRole] = useState("Farmer");
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(1);

  const InputRow = ({ label, icon, placeholder, type = "text" }) => (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "11px 14px", background: C.inputBg }}>
        <Icon name={icon} size={16} color={C.gray400} />
        <input type={type} placeholder={placeholder} style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5)`, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 40px" }}>

      {/* Header row */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="arrowL" size={18} color={C.navy} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HaritDhanLogo size={32} />
          <span style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>Harit Dhan</span>
        </div>
        <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[1, 2].map(s => (
          <div key={s} style={{ height: 4, width: s === step ? 32 : 20, borderRadius: "2px", background: s <= step ? "#2D7A3A" : C.gray200, transition: "all 0.3s" }} />
        ))}
      </div>

      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "24px 20px" }}>
        {step === 1 ? (
          <>
            <div style={{ ...S.h2, marginBottom: "4px" }}>Create account</div>
            <div style={{ fontSize: "13px", color: C.gray400, marginBottom: "20px" }}>Step 1 of 2 · Personal Info</div>

            <InputRow label="Full Name *" icon="user" placeholder="Enter your full name" />
            <InputRow label="Email Address *" icon="mail" placeholder="Enter your email" type="email" />
            <InputRow label="Phone Number *" icon="phone" placeholder="+91 XXXXX XXXXX" type="tel" />
            <InputRow label="Password *" icon="lock" placeholder="Create a password" type="password" />

            {/* Date of Birth */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Date of Birth *</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "11px 14px", background: C.inputBg }}>
                <Icon name="calendar" size={16} color={C.gray400} />
                <input type="date" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
              </div>
            </div>

            {/* Age (auto or manual) */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Age *</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", border: `1.5px solid ${C.gray200}`, borderRadius: "10px", padding: "11px 14px", background: C.inputBg }}>
                <Icon name="user" size={16} color={C.gray400} />
                <input type="number" min="18" max="99" placeholder="Your age (min. 18)" style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
              </div>
            </div>

            {/* Gender */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Gender *</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Male", "Female", "Other", "Prefer not to say"].map(g => (
                  <button key={g} onClick={() => setGender(g)} style={{
                    padding: "8px 14px", borderRadius: "10px",
                    border: `1.5px solid ${gender === g ? "#2D7A3A" : C.gray200}`,
                    background: gender === g ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg,
                    color: gender === g ? "#2D7A3A" : C.gray500,
                    fontWeight: "600", fontSize: "13px", cursor: "pointer",
                  }}>{g}</button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} style={S.btn}>Continue →</button>
          </>
        ) : (
          <>
            <div style={{ ...S.h2, marginBottom: "4px" }}>Almost there!</div>
            <div style={{ fontSize: "13px", color: C.gray400, marginBottom: "20px" }}>Step 2 of 2 · Your Role & Location</div>

            {/* Role */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Role *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {["Farmer", "Corporate"].map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    flex: 1, padding: "10px", borderRadius: "10px",
                    border: `1.5px solid ${role === r ? "#2D7A3A" : C.gray200}`,
                    background: role === r ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg,
                    color: role === r ? "#2D7A3A" : C.gray500,
                    fontWeight: "600", fontSize: "14px", cursor: "pointer"
                  }}>{r}</button>
                ))}
              </div>
            </div>

            <InputRow label="State / Province *" icon="flag" placeholder="e.g. Maharashtra, Punjab" />
            <InputRow label="District" icon="map" placeholder="Your district name" />

            {role === "Farmer" && (
              <>
                <InputRow label="Farm Size (in acres)" icon="leaf" placeholder="e.g. 5" type="number" />
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Primary Crop Type</label>
                  <div style={{ border: `1.5px solid ${C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                    <select style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                      <option value="">Select crop type</option>
                      <option>Wheat</option><option>Rice / Paddy</option><option>Sugarcane</option>
                      <option>Cotton</option><option>Soybean</option><option>Maize</option>
                      <option>Vegetables</option><option>Fruits / Horticulture</option><option>Pulses</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {role === "Corporate" && (
              <>
                <InputRow label="Company Name" icon="hub" placeholder="Your organisation" />
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Industry Sector</label>
                  <div style={{ border: `1.5px solid ${C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                    <select style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                      <option value="">Select sector</option>
                      <option>Manufacturing</option><option>FMCG / Agriculture</option>
                      <option>Energy</option><option>Finance / Banking</option>
                      <option>IT / Technology</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Preferred Language */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Preferred Language</label>
              <div style={{ border: `1.5px solid ${C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                <select style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                  <option>हिंदी (Hindi)</option>
                  <option>English</option>
                  <option>मराठी (Marathi)</option>
                  <option>বাংলা (Bengali)</option>
                  <option>తెలుగు (Telugu)</option>
                  <option>ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "18px", padding: "12px", background: dark ? "#0F2B12" : "#ECFDF0", borderRadius: "10px", border: `1px solid ${dark ? "#2A4A30" : "#A7F3C0"}` }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Icon name="shield" size={14} color="#2D7A3A" style={{ marginTop: 2 }} />
                <span style={{ fontSize: "12px", color: C.gray500, lineHeight: 1.5 }}>Your information is encrypted and used only to personalise your carbon credit journey.</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setStep(1)} style={{ ...S.btnOutline, flex: 0.5 }}>← Back</button>
              <button onClick={() => onNavigate("overview")} style={{ ...S.btn, flex: 1 }}>Create Account ✓</button>
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: C.gray500 }}>
          Already have an account?{" "}
          <span onClick={onBack} style={{ color: "#2D7A3A", fontWeight: "600", cursor: "pointer" }}>Log in</span>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: OVERVIEW (Farmer Dashboard) ─────────────────────────────────────
const OverviewScreen = ({ onNavigate, dark, onToggleDark, C, S }) => {
  const [lang, setLang] = useState("हिंदी (Hindi)");
  return (
    <div>
      <TopBar title="किसान डैशबोर्ड" subtitle="Harit Dhan OS · Field & earnings intelligence"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
            <div style={{ fontSize: "13px", fontWeight: "600", color: C.gray500, display: "flex", alignItems: "center", gap: "6px" }}><Icon name="user" size={14} color={C.gray400} />PRIYANSHI</div>
          </div>
        }
        C={C}
      />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ ...S.card, background: dark ? `linear-gradient(135deg, #1A2E1D, #0F2B12)` : `linear-gradient(135deg, #F8FAFC, #EFF6FF)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Badge color="#2D7A3A" bg={dark ? "#0F2B12" : "#ECFDF0"}><Icon name="spark" size={11} color="#2D7A3A" /> AI Farmer Sustainability Console</Badge>
          </div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy, marginBottom: "6px" }}>Carbon income, farm health, and AI guidance in one workspace.</div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "#2D7A3A", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Language / भाषा</label>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1.5px solid ${C.gray200}`, fontSize: "14px", color: C.navy, background: C.inputBg, outline: "none" }}>
              {["हिंदी (Hindi)", "English", "मराठी (Marathi)", "বাংলা (Bengali)"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button style={{ ...S.btn, fontSize: "14px" }}><Icon name="mic" size={16} color="#FFFFFF" /> Voice Assistant</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "AI Soil Analysis", value: "Healthy", desc: "Nitrogen and soil carbon trend improving for Plot B and C.", icon: "leaf", color: C.green },
            { label: "AI Carbon Prediction", value: "132 tCO₂", desc: "Projected season-end credits if current practices continue.", icon: "trend" },
            { label: "AI Climate Risk", value: "Moderate", desc: "Heat stress likely next 10 days; adjust irrigation scheduling.", icon: "info", color: C.amber },
            { label: "AI Compliance", value: "92%", desc: "Farmer records verified for marketplace-grade carbon audit.", icon: "shield", color: C.green },
          ].map((item, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: C.gray400, fontWeight: "600" }}>{item.label}</span>
                <Badge color={C.green} bg={C.greenLight}><Icon name="check" size={9} color={C.green} /> AI ✓</Badge>
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy, marginBottom: "4px" }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: C.gray400, lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Carbon Credits Earned", value: "124 tCO₂", sub: "+18% this quarter", icon: "leaf" },
            { label: "Carbon Earnings", value: "₹25,100", sub: "+102% since Jan", icon: "wallet" },
            { label: "Farm Health Score", value: "84/100", sub: "Soil + water resilience strong", icon: "leaf" },
            { label: "Sustainability Grade", value: "A-", sub: "3 investor-ready reports", icon: "shield" },
          ].map((item, i) => (
            <div key={i} style={{ ...S.card, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", color: C.gray500, fontWeight: "600" }}>{item.label}</span>
                <div style={{ width: 30, height: 30, borderRadius: "8px", background: "#2D7A3A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={14} color="#FFFFFF" />
                </div>
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: C.navy }}>{item.value}</div>
              <div style={{ fontSize: "11px", color: C.green, fontWeight: "600", marginTop: "2px" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ ...S.h3, marginBottom: "4px" }}>Carbon Credits & Earnings Trend</div>
          <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "12px" }}>Last 6 months verified performance</div>
          <svg width="100%" height="120" viewBox="0 0 300 120">
            <defs>
              <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D7A3A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2D7A3A" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d="M0 100 C30 90, 60 80, 100 65 C140 50, 180 40, 220 25 C250 15, 280 8, 300 4 L300 120 L0 120 Z" fill="url(#chartGrad2)" />
            <path d="M0 100 C30 90, 60 80, 100 65 C140 50, 180 40, 220 25 C250 15, 280 8, 300 4" fill="none" stroke="#2D7A3A" strokeWidth="2.5" strokeLinecap="round" />
            {["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => (
              <text key={m} x={i * 60} y={118} fontSize="10" fill={C.gray400}>{m}</text>
            ))}
          </svg>
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Icon name="spark" size={16} color="#2D7A3A" />
            <span style={S.h3}>AI Recommendations</span>
          </div>
          {[
            "Use biochar on Plot B to improve soil carbon by ~0.3% next cycle.",
            "Shift irrigation window to 6-8 AM to reduce water evaporation losses.",
            "Seed cover crop after wheat harvest for +12% expected carbon credits.",
            "Bundle residue bales this week; projected extra payout: ₹3,400.",
          ].map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.gray100}` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D7A3A", marginTop: "6px", flexShrink: 0 }} />
              <div style={{ ...S.body, fontSize: "13px" }}>{rec}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.h3}>Recent Transactions</div>
          <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "12px" }}>Latest carbon credit sales</div>
          {[
            { id: "TXN-9821", date: "06 May 2026", co2: "12.5 tCO2", amount: "₹15,750", status: "Settled", statusColor: C.green, statusBg: C.greenLight },
            { id: "TXN-9764", date: "28 Apr 2026", co2: "8.0 tCO2", amount: "₹9,960", status: "Settled", statusColor: C.green, statusBg: C.greenLight },
            { id: "TXN-9688", date: "16 Apr 2026", co2: "6.2 tCO2", amount: "₹7,440", status: "Processing", statusColor: C.amber, statusBg: C.amberLight },
          ].map((txn, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: "700", fontSize: "14px", color: C.navy }}>{txn.id}</span>
                <Badge color={txn.statusColor} bg={txn.statusBg}>{txn.status}</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: "12px", color: C.gray400 }}>{txn.date}</div><div style={{ fontSize: "12px", color: C.gray400 }}>{txn.co2}</div></div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy }}>{txn.amount}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, background: dark ? "#0F2B12" : "#ECFDF0", border: `1px solid ${dark ? "#2A4A30" : "#BFDBFE"}` }}>
          <Badge color="#2D7A3A" bg={C.cardBg}><Icon name="check" size={10} color="#2D7A3A" /> Investor Demo Snapshot Ready</Badge>
          <div style={{ ...S.h3, marginTop: "10px", marginBottom: "4px" }}>Your farm is climate-finance ready</div>
          <div style={{ ...S.body, marginBottom: "14px" }}>Export this sustainability profile for carbon buyers, lenders, and ESG reporting teams.</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ ...S.btnOutline, fontSize: "13px", padding: "10px" }}><Icon name="download" size={14} color={C.navy} /> Download</button>
            <button style={{ ...S.btnOutline, fontSize: "13px", padding: "10px" }}><Icon name="share" size={14} color={C.navy} /> Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: HARIT HUB ────────────────────────────────────────────────────────
const HaritHubScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Financial & sustainability cockpit" subtitle="Harit Hub"
      onHome={() => onNavigate("overview")}
      right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />}
      C={C}
    />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ ...S.body, marginBottom: "4px" }}>Earnings, verified payouts, carbon portfolio signals, and governance-ready records in one calm operating view.</div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ ...S.btnOutline, flex: 1, fontSize: "13px" }}>Marketplace ↗</button>
        <button style={{ ...S.btn, flex: 1, fontSize: "13px" }}><Icon name="spark" size={14} color="#FFFFFF" /> Run AI Carbon Analysis</button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { label: "Available balance", value: "₹42,180", sub: "+12.4% vs last cycle", icon: "wallet" },
          { label: "Carbon portfolio", value: "138.4 tCO₂", sub: "Issuance-ready lots", icon: "leaf" },
          { label: "ESG-linked allocs", value: "₹8.2 L", sub: "Corporate programs", icon: "trend" },
        ].map((item, i) => (
          <div key={i} style={{ ...S.card, flex: 1, padding: "12px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <Icon name={item.icon} size={14} color="#2D7A3A" />
              <Badge color={C.green} bg={C.greenLight}>LIVE</Badge>
            </div>
            <div style={{ fontSize: "11px", color: C.gray400, marginBottom: "4px" }}>{item.label}</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: C.navy }}>{item.value}</div>
            <div style={{ fontSize: "11px", color: C.green, fontWeight: "600" }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <div style={S.h3}>Verified payouts & settlements</div>
          <Icon name="wallet" size={16} color={C.gray400} />
        </div>
        <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "14px" }}>Bank-grade reconciliation signals paired with credit lineage.</div>
        {[
          { label: "Apr payout settled", date: "28 Apr 2026", amount: "₹18,240", status: "Paid", sc: C.green, sb: C.greenLight },
          { label: "May carbon accrual", date: "12 May 2026", amount: "₹21,400", status: "Scheduled", sc: "#2D7A3A", sb: dark ? "#1A3D1F" : "#ECFDF0" },
          { label: "Cover crop bonus", date: "08 May 2026", amount: "₹4,120", status: "Verified", sc: "#16803C", sb: dark ? "#0A2015" : "#D1FAE5" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: C.navy }}>{item.label}</div>
              <div style={{ fontSize: "12px", color: C.gray400 }}>{item.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "700", color: C.navy }}>{item.amount}</div>
              <Badge color={item.sc} bg={item.sb}>{item.status}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Icon name="shield" size={16} color="#2D7A3A" />
          <span style={S.h3}>Trust ledger</span>
        </div>
        {["Carbon lots reconciled against satellite baselines.", "Buyer settlements mirrored with registry snapshots.", "Human-readable audit trail exports for CFO review."].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <Icon name="check" size={14} color="#2D7A3A" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ ...S.body, fontSize: "13px" }}>{item}</span>
          </div>
        ))}
        <div style={{ marginTop: "12px", padding: "12px", background: dark ? "#0F2B12" : "#ECFDF0", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#2D7A3A", letterSpacing: "0.06em", marginBottom: "4px" }}>CARBON PORTFOLIO</div>
          <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy }}>₹14.8 L <span style={{ fontSize: "13px", color: C.gray400, fontWeight: "400" }}>realized + pipeline</span></div>
        </div>
      </div>
    </div>
  </div>
);

// ─── SCREEN: CARBON ANALYSIS ──────────────────────────────────────────────────
const CarbonAnalysisScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Carbon Analysis" subtitle="AI-Powered MRV"
      onHome={() => onNavigate("overview")}
      right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />}
      C={C}
    />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ ...S.card, background: dark ? `linear-gradient(135deg, #1A2E1D, #0A1F10)` : `linear-gradient(135deg, #F8FAFC, #EFF6FF)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={S.h3}>Analysis Pipeline</span>
          <Badge color={C.green} bg={C.greenLight}>Ready</Badge>
        </div>
        {[
          { n: 1, title: "Data collection", desc: "IoT sensors, satellite, and farmer-reported inputs", done: true },
          { n: 2, title: "AI verification", desc: "Cross-validation of emissions and sequestration data", done: true },
          { n: 3, title: "MRV report generation", desc: "Certification-aligned emissions statement", done: false },
          { n: 4, title: "Blockchain anchoring", desc: "Immutable hash for each verified credit", done: false },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.gray100}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "8px", background: step.done ? "#2D7A3A" : C.gray100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {step.done ? <Icon name="check" size={16} color="#FFFFFF" /> : <span style={{ fontSize: "13px", fontWeight: "700", color: C.gray400 }}>{step.n}</span>}
            </div>
            <div>
              <div style={{ ...S.h3, fontSize: "14px" }}>{step.title}</div>
              <div style={{ ...S.body, fontSize: "13px", marginTop: "2px" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "AI Soil Analysis", value: "SOC +0.24%", desc: "Improvement detected in 41 farm grids." },
          { label: "AI Carbon Prediction", value: "5.4k tCO₂", desc: "Expected monthly sequestration." },
          { label: "AI Climate Risk", value: "Low-Moderate", desc: "Rainfall volatility high in Punjab belt." },
          { label: "AI Verified Scans", value: "99.7%", desc: "Cross-validated with ground-truth plots." },
        ].map((item, i) => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: C.gray400, fontWeight: "600" }}>{item.label}</span>
              <Badge color="#2D7A3A" bg={dark ? "#1A3D1F" : "#ECFDF0"}>AI ✓</Badge>
            </div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: C.navy, marginBottom: "4px" }}>{item.value}</div>
            <div style={{ fontSize: "11px", color: C.gray400, lineHeight: 1.4 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ ...S.h3, marginBottom: "12px" }}>Sustainability Metrics</div>
        {[
          { label: "Soil Organic Carbon", val: 2.6, max: 2.8, pct: 93 },
          { label: "Water Efficiency", val: 78, max: 80, pct: 97.5, unit: "%" },
          { label: "Residue Recycling", val: 92, max: 95, pct: 97, unit: "%" },
          { label: "No-Till Coverage", val: 64, max: 70, pct: 91, unit: "%" },
        ].map((m, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", color: C.navy, fontWeight: "500" }}>{m.label}</span>
              <span style={{ fontSize: "12px", color: C.gray400 }}>{m.val}{m.unit || ""} / {m.max}{m.unit || ""}</span>
            </div>
            <div style={{ height: 6, background: C.gray100, borderRadius: "3px" }}>
              <div style={{ height: "100%", width: `${m.pct}%`, background: `linear-gradient(90deg, #2D7A3A, #60A5FA)`, borderRadius: "3px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── SCREEN: MARKETPLACE ──────────────────────────────────────────────────────
const MarketplaceScreen = ({ onNavigate, dark, onToggleDark, C, S }) => (
  <div>
    <TopBar title="Live Carbon Marketplace" subtitle="Markets & Intelligence"
      onHome={() => onNavigate("overview")}
      right={<DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />}
      C={C}
    />
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={S.body}>Trade verified carbon credits from regenerative farmers across India</div>

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={S.h3}>Trending Districts</div>
          <Icon name="globe" size={16} color={C.gray400} />
        </div>
        {[["Mysore", "2,140 tCO2", "+8.2%"], ["Nashik", "1,760 tCO2", "+6.5%"], ["Coimbatore", "1,220 tCO2", "+5.1%"]].map(([name, co2, pct], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div>
              <div style={{ fontWeight: "600", color: C.navy, fontSize: "14px" }}>{name}</div>
              <div style={{ fontSize: "12px", color: C.gray400 }}>{co2}</div>
            </div>
            <Badge color={C.green} bg={C.greenLight}>↗ {pct}</Badge>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ ...S.h3, marginBottom: "12px" }}>Recently Sold</div>
        {[
          { id: "BLK-98AF", loc: "Ludhiana", co2: "180 tCO2 @ ₹1,210", time: "2m ago" },
          { id: "BLK-74DD", loc: "Nashik", co2: "240 tCO2 @ ₹1,258", time: "6m ago" },
          { id: "BLK-41KP", loc: "Mysore", co2: "310 tCO2 @ ₹1,322", time: "11m ago" },
        ].map((txn, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: C.navy }}>{txn.id}</div>
              <div style={{ fontSize: "12px", color: C.gray500 }}>{txn.loc}</div>
              <div style={{ fontSize: "12px", color: C.gray400 }}>{txn.co2}</div>
            </div>
            <div style={{ fontSize: "12px", color: C.gray400 }}>{txn.time}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={S.h3}>Live Activity Feed</div>
          <Badge color={C.green} bg={C.greenLight}><span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} /> Live</Badge>
        </div>
        {[
          "Corporate buyer from Mumbai placed bid on Agroforestry lot CC003.",
          "AI verification completed for Rajasthan Dryland Collective.",
          "Supply tightened in Karnataka cluster; spreads widened by 1.4%.",
          "Two new SDG 13 aligned listings added from Tamil Nadu.",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.gray100}` : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, marginTop: "6px", flexShrink: 0 }} />
            <span style={{ ...S.body, fontSize: "13px" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── SCREEN: MONITORING ────────────────────────────────────────────────────────
const MonitoringScreen = ({ onNavigate, dark, onToggleDark, C, S }) => {
  const [activeTab, setActiveTab] = useState("Carbon Sequestration");
  return (
    <div>
      <div style={{ background: C.topBarBg, borderBottom: `1px solid ${C.gray100}`, padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => onNavigate("overview")} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="home" size={16} color={C.navy} />
          </button>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Satellite Monitoring</div>
            <div style={{ fontSize: "12px", color: C.gray500 }}>Real-time MRV powered by satellite imagery</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <DarkModeToggle dark={dark} onToggle={onToggleDark} C={C} />
          <button style={{ ...S.btn, width: "auto", padding: "8px 12px", fontSize: "12px" }}><Icon name="satellite" size={13} color="#FFFFFF" /> Scan</button>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "Farms Monitored", value: "50,247", sub: "↗ +1,240" },
            { label: "AI Scans Today", value: "1,847", sub: "↗ +342" },
            { label: "Verification Rate", value: "99.7%", sub: "↗ +0.2%" },
            { label: "Avg. Carbon Score", value: "92.4", sub: "↗ +3.1" },
          ].map((m, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "4px" }}>{m.label}</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: C.navy }}>{m.value}</div>
              <div style={{ fontSize: "12px", color: C.green, fontWeight: "600" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={S.h3}>Live Satellite Feed</div>
          </div>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "12px" }}>
            {["Carbon Sequestration", "NDVI (Vegetation)", "Soil Health", "Water Retention"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "4px 10px", borderRadius: "6px", border: "none", whiteSpace: "nowrap",
                background: activeTab === tab ? (dark ? "#2D7A3A" : "#1A3D1F") : C.gray100,
                color: activeTab === tab ? "#FFFFFF" : C.gray500,
                fontSize: "11px", fontWeight: "600", cursor: "pointer"
              }}>{tab}</button>
            ))}
          </div>
          <div style={{ background: dark ? `radial-gradient(ellipse at 50% 60%, #2D7A3A44, #0F1F11 70%)` : `radial-gradient(ellipse at 50% 60%, #2D7A3A55, #ECFDF0 70%)`, borderRadius: "10px", height: "180px", position: "relative", marginBottom: "12px" }}>
            <div style={{ position: "absolute", top: "8px", left: "8px", background: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", color: C.navy, fontFamily: "monospace" }}>LAT: 20.5937° N | LON: 78.9629° E</div>
            {[[40, 40], [55, 60], [35, 65]].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 24, height: 24, borderRadius: "50% 50% 50% 0", background: "#2D7A3A", transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, background: "#FFFFFF", borderRadius: "50%", transform: "rotate(45deg)" }} />
              </div>
            ))}
            <div style={{ position: "absolute", bottom: "8px", right: "8px", background: dark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.95)", padding: "6px 10px", borderRadius: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: C.navy }}>Active: {activeTab}</span>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={{ ...S.h3, marginBottom: "12px" }}>Recent Scans</div>
          {[
            { name: "रामेश्वर पाटिल Collective", loc: "Nashik, Maharashtra", acres: 450, score: "94/100", time: "2 min ago", done: true },
            { name: "Punjab Organic Co-op", loc: "Ludhiana, Punjab", acres: 688, score: "89/100", time: "8 min ago", loading: true },
            { name: "Karnataka Agroforestry", loc: "Mysore, Karnataka", acres: 928, score: "97/100", time: "15 min ago", done: true },
          ].map((scan, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.gray100}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: "600", color: C.navy, fontSize: "14px" }}>{scan.name}</div>
                {scan.done && <Icon name="check" size={16} color="#2D7A3A" />}
                {scan.loading && <div style={{ width: 16, height: 16, border: `2px solid #2D7A3A`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />}
              </div>
              <div style={{ fontSize: "12px", color: C.gray400, marginBottom: "6px" }}>📍 {scan.loc}</div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div><span style={{ fontSize: "12px", color: C.gray400 }}>Acres </span><span style={{ fontSize: "12px", color: C.navy, fontWeight: "600" }}>{scan.acres}</span></div>
                <div><span style={{ fontSize: "12px", color: C.gray400 }}>Score </span><span style={{ fontSize: "12px", color: "#2D7A3A", fontWeight: "700" }}>{scan.score}</span></div>
                <div style={{ marginLeft: "auto", fontSize: "12px", color: C.gray400 }}>{scan.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={S.h3}>Live MRV Feed</div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
          </div>
          {[
            { time: "10:42:15", text: "Carbon verification complete – 450 acres", color: "#2D7A3A" },
            { time: "10:41:58", text: "Satellite pass initiated – Sentinel-2", color: C.gray500 },
            { time: "10:41:22", text: "NDVI analysis updated – 920 acres", color: C.green },
            { time: "10:40:47", text: "Blockchain hash recorded: 0x4a8c...", color: "#16803C" },
            { time: "10:40:18", text: "Soil moisture data received", color: C.gray500 },
          ].map((feed, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${C.gray100}` : "none" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: C.gray400, flexShrink: 0 }}>{feed.time}</span>
              <span style={{ fontSize: "12px", color: feed.color, fontWeight: "500" }}>{feed.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [activeTab, setActiveTab] = useState("overview");
  const [dark, setDark] = useState(false);
  const scrollRef = useRef(null);

  const C = getColors(dark);
  const S = getStyles(C);

  const isApp = !["landing", "login", "signup"].includes(page);

  // History stack for back button
  const [history, setHistory] = useState(["landing"]);

  const handleNavChange = (tab) => {
    setActiveTab(tab);
    setPage(tab);
    setHistory(prev => [...prev, tab]);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleNavigate = (p) => {
    setPage(p);
    setHistory(prev => [...prev, p]);
    if (!["landing", "login", "signup"].includes(p)) setActiveTab(p);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prev = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setPage(prev);
      if (!["landing", "login", "signup"].includes(prev)) setActiveTab(prev);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const handleHome = () => handleNavigate("overview");

  const sharedProps = { onNavigate: handleNavigate, dark, onToggleDark: () => setDark(d => !d), C, S };

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: dark ? "#050F07" : "#1A3D1F", padding: "20px 0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "background 0.3s" }}>
      <div style={{ width: "390px", minHeight: "844px", background: C.screenBg, borderRadius: "40px", overflow: "hidden", boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 12px ${dark ? "#0A1F10" : "#0F2B12"}, 0 0 0 14px ${dark ? "#1A3D1F" : "#234D28"}`, display: "flex", flexDirection: "column", position: "relative", transition: "background 0.3s" }}>

        {/* Status bar */}
        <div style={{ height: "44px", background: isApp ? C.topBarBg : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, zIndex: 50, transition: "background 0.3s" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: C.navy }}>9:41</span>
          <div style={{ width: "120px", height: "28px", background: dark ? "#0A1F10" : "#1A3D1F", borderRadius: "20px" }} />
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
              {[4, 6, 8, 10].map((h, i) => <div key={i} style={{ width: 3, height: h, background: C.navy, borderRadius: "1px", opacity: 0.8 }} />)}
            </div>
            <Icon name="globe" size={12} color={C.navy} />
            <div style={{ fontSize: "13px", fontWeight: "700", color: C.navy }}>100%</div>
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {renderPage()}
        </div>

        {/* Bottom nav for app screens */}
        {isApp && <BottomNav active={activeTab} onChange={handleNavChange} C={C} />}

        {/* Home indicator */}
        <div style={{ height: "20px", background: isApp ? C.topBarBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 130, height: 5, background: C.navy, borderRadius: "3px", opacity: 0.25 }} />
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        input::placeholder { color: #7BAF82; opacity: 0.7; }
        select option { background: #162119; color: #E8F5EA; }
      `}</style>
    </div>
  );
}
