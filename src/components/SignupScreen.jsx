// ─── SignupScreen — drop-in replacement ───────────────────────────────────────
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { validators, validateForm, passwordStrength } from "../utils/validation";

export const SignupScreen = ({ onNavigate, onBack, dark, onToggleDark, C, S }) => {
  const { register, loading, authError, clearError } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    dateOfBirth: "", gender: "",
    role: "Farmer", state: "", district: "",
    farmSizeAcres: "", cropType: "",
    companyName: "", industrySector: "",
    preferredLanguage: "English",
  });

  const set = (field) => (e) => {
    clearError();
    setErrors((prev) => ({ ...prev, [field]: null }));
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const setDirect = (field, value) => {
    clearError();
    setErrors((prev) => ({ ...prev, [field]: null }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const pwStrength = passwordStrength(form.password);

  // Step 1 validation
  const validateStep1 = () => {
    const { isValid, errors: errs } = validateForm(form, {
      fullName: validators.fullName,
      email: validators.email,
      phone: validators.phone,
      password: validators.password,
      dateOfBirth: validators.dateOfBirth,
      gender: validators.required("Gender"),
    });
    setErrors(errs);
    return isValid;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const rules = {
      state: validators.required("State"),
    };
    if (form.role === "Farmer") {
      rules.cropType = validators.required("Crop type");
    }
    if (form.role === "Corporate") {
      rules.companyName = validators.required("Company name");
      rules.industrySector = validators.required("Industry sector");
    }
    const { isValid, errors: errs } = validateForm(form, rules);
    setErrors(errs);
    return isValid;
  };

  const handleStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    try {
      await register({
        ...form,
        phone: form.phone.startsWith("+91") ? form.phone : `+91${form.phone}`,
        farmSizeAcres: form.farmSizeAcres ? Number(form.farmSizeAcres) : undefined,
      });
      onNavigate("overview");
    } catch {
      // authError shown below
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

  const FieldError = ({ field }) =>
    errors[field] ? <div style={{ fontSize: "11px", color: C.red, marginTop: "4px" }}>{errors[field]}</div> : null;

  const InputRow = ({ label, field, type = "text", placeholder }) => (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>{label}</label>
      <div style={inputStyle(field)}>
        <input
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={set(field)}
          style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }}
        />
      </div>
      <FieldError field={field} />
    </div>
  );

  return (
    <div style={{ background: dark ? `linear-gradient(160deg, #0F1F11, #162119)` : `linear-gradient(160deg, #ECFDF0, #F4FBF5)`, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 40px" }}>

      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: C.gray100, border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>←</button>
        <span style={{ fontSize: "16px", fontWeight: "800", color: C.navy }}>Harit Dhan</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[1, 2].map((s) => (
          <div key={s} style={{ height: 4, width: s === step ? 32 : 20, borderRadius: "2px", background: s <= step ? "#2D7A3A" : C.gray200, transition: "all 0.3s" }} />
        ))}
      </div>

      <div style={{ ...S.card, width: "100%", maxWidth: "360px", padding: "24px 20px" }}>

        {authError && (
          <div style={{ background: dark ? "#2E0A0A" : "#FEE2E2", border: `1px solid ${C.red}`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: C.red }}>
            {authError}
          </div>
        )}

        {step === 1 ? (
          <>
            <div style={{ ...S.h2, marginBottom: "4px" }}>Create account</div>
            <div style={{ fontSize: "13px", color: C.gray400, marginBottom: "20px" }}>Step 1 of 2 · Personal info</div>

            <InputRow label="Full Name *" field="fullName" placeholder="Enter your full name" />
            <InputRow label="Email Address *" field="email" type="email" placeholder="your@email.com" />
            <InputRow label="Phone Number *" field="phone" type="tel" placeholder="+91 XXXXX XXXXX" />

            {/* Password with strength meter */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Password *</label>
              <div style={inputStyle("password")}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 chars, uppercase, number, symbol"
                  value={form.password}
                  onChange={set("password")}
                  style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }}
                />
                <button onClick={() => setShowPw((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "12px", color: C.gray400 }}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: "2px", background: i <= pwStrength.score ? pwStrength.color : C.gray200, transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: pwStrength.color, fontWeight: "600" }}>{pwStrength.label}</div>
                </div>
              )}
              <FieldError field="password" />
            </div>

            {/* Date of Birth */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Date of Birth *</label>
              <div style={inputStyle("dateOfBirth")}>
                <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} style={{ border: "none", outline: "none", fontSize: "14px", color: C.navy, flex: 1, background: "transparent" }} />
              </div>
              <FieldError field="dateOfBirth" />
            </div>

            {/* Gender */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Gender *</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                  <button key={g} onClick={() => setDirect("gender", g)} style={{ padding: "8px 14px", borderRadius: "10px", border: `1.5px solid ${form.gender === g ? "#2D7A3A" : C.gray200}`, background: form.gender === g ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg, color: form.gender === g ? "#2D7A3A" : C.gray500, fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                    {g}
                  </button>
                ))}
              </div>
              <FieldError field="gender" />
            </div>

            <button onClick={handleStep1} style={S.btn}>Continue →</button>
          </>
        ) : (
          <>
            <div style={{ ...S.h2, marginBottom: "4px" }}>Almost there!</div>
            <div style={{ fontSize: "13px", color: C.gray400, marginBottom: "20px" }}>Step 2 of 2 · Role & location</div>

            {/* Role */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "8px" }}>Role *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {["Farmer", "Corporate"].map((r) => (
                  <button key={r} onClick={() => setDirect("role", r)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `1.5px solid ${form.role === r ? "#2D7A3A" : C.gray200}`, background: form.role === r ? (dark ? "#1A3D1F" : "#ECFDF0") : C.cardBg, color: form.role === r ? "#2D7A3A" : C.gray500, fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <InputRow label="State *" field="state" placeholder="e.g. Maharashtra, Punjab" />
            <InputRow label="District" field="district" placeholder="Your district" />

            {form.role === "Farmer" && (
              <>
                <InputRow label="Farm Size (acres)" field="farmSizeAcres" type="number" placeholder="e.g. 5" />
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Primary Crop Type *</label>
                  <div style={{ border: `1.5px solid ${errors.cropType ? C.red : C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                    <select value={form.cropType} onChange={set("cropType")} style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                      <option value="">Select crop type</option>
                      {["Wheat", "Rice / Paddy", "Sugarcane", "Cotton", "Soybean", "Maize", "Vegetables", "Fruits / Horticulture", "Pulses"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <FieldError field="cropType" />
                </div>
              </>
            )}

            {form.role === "Corporate" && (
              <>
                <InputRow label="Company Name *" field="companyName" placeholder="Your organisation" />
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Industry Sector *</label>
                  <div style={{ border: `1.5px solid ${errors.industrySector ? C.red : C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                    <select value={form.industrySector} onChange={set("industrySector")} style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                      <option value="">Select sector</option>
                      {["Manufacturing", "FMCG / Agriculture", "Energy", "Finance / Banking", "IT / Technology", "Other"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <FieldError field="industrySector" />
                </div>
              </>
            )}

            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: C.gray700, fontWeight: "600", display: "block", marginBottom: "6px" }}>Preferred Language</label>
              <div style={{ border: `1.5px solid ${C.gray200}`, borderRadius: "10px", overflow: "hidden", background: C.inputBg }}>
                <select value={form.preferredLanguage} onChange={set("preferredLanguage")} style={{ width: "100%", padding: "12px 14px", border: "none", outline: "none", fontSize: "14px", color: C.navy, background: "transparent", cursor: "pointer" }}>
                  {["English", "हिंदी (Hindi)", "मराठी (Marathi)", "বাংলা (Bengali)", "తెలుగు (Telugu)", "ਪੰਜਾਬੀ (Punjabi)"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "18px", padding: "12px", background: dark ? "#0F2B12" : "#ECFDF0", borderRadius: "10px", border: `1px solid ${dark ? "#2A4A30" : "#A7F3C0"}` }}>
              <span style={{ fontSize: "12px", color: C.gray500, lineHeight: 1.5 }}>🔒 Your information is encrypted and used only to personalise your carbon credit journey.</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setStep(1)} style={{ ...S.btnOutline, flex: 0.5 }}>← Back</button>
              <button onClick={handleSubmit} disabled={loading} style={{ ...S.btn, flex: 1, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}>
                {loading ? "Creating account…" : "Create Account ✓"}
              </button>
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
