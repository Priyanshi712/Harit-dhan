// ─── Validation helpers ────────────────────────────────────────────────────────
// Keeps validation logic in one place, usable across Login and Signup screens.

export const validators = {
  fullName: (v) => {
    if (!v?.trim()) return "Full name is required.";
    if (v.trim().length < 2) return "Name must be at least 2 characters.";
    if (v.trim().length > 80) return "Name is too long.";
    return null;
  },

  email: (v) => {
    if (!v?.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(v.trim())) return "Enter a valid email address.";
    return null;
  },

  phone: (v) => {
    if (!v?.trim()) return "Phone number is required.";
    // Accepts +91XXXXXXXXXX or 10 digit number
    const cleaned = v.replace(/\s/g, "");
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleaned)) return "Enter a valid Indian mobile number.";
    return null;
  },

  password: (v) => {
    if (!v) return "Password is required.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(v)) return "Include at least one lowercase letter.";
    if (!/\d/.test(v)) return "Include at least one number.";
    if (!/[@$!%*?&#]/.test(v)) return "Include at least one special character (@$!%*?&#).";
    return null;
  },

  confirmPassword: (v, password) => {
    if (!v) return "Please confirm your password.";
    if (v !== password) return "Passwords do not match.";
    return null;
  },

  required: (label) => (v) => {
    if (!v?.trim()) return `${label} is required.`;
    return null;
  },

  farmSize: (v) => {
    if (v && (isNaN(v) || Number(v) < 0)) return "Enter a valid farm size.";
    return null;
  },

  dateOfBirth: (v) => {
    if (!v) return "Date of birth is required.";
    const dob = new Date(v);
    const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) return "You must be at least 18 years old.";
    if (age > 100) return "Please enter a valid date.";
    return null;
  },
};

// Validate a whole form object — returns { isValid, errors }
export const validateForm = (fields, rules) => {
  const errors = {};
  for (const [key, validate] of Object.entries(rules)) {
    const err = validate(fields[key], fields);
    if (err) errors[key] = err;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Password strength meter (0–4)
export const passwordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "#E5E7EB" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&#]/.test(password)) score++;
  const levels = [
    { label: "Weak", color: "#EF4444" },
    { label: "Fair", color: "#F59E0B" },
    { label: "Good", color: "#22C55E" },
    { label: "Strong", color: "#16A34A" },
  ];
  return { score, ...levels[score - 1] || { label: "", color: "#E5E7EB" } };
};
