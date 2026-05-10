# HaritDhan — Security & Payment Integration Guide

## What was built

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server with Helmet, CORS, rate limiting |
| `backend/models/User.js` | Mongoose user schema with bcrypt hashing |
| `backend/models/Transaction.js` | Payment transaction records |
| `backend/middleware/auth.js` | JWT verification middleware |
| `backend/routes/auth.js` | Register, login, logout, refresh, /me |
| `backend/routes/payments.js` | Razorpay order creation, verification, webhook |
| `frontend/src/context/AuthContext.jsx` | Global auth state for React |
| `frontend/src/hooks/usePayment.jsx` | Razorpay checkout hook |
| `frontend/src/utils/validation.js` | Form validation rules + password strength |
| `frontend/src/components/LoginScreen.jsx` | Login with real API + validation |
| `frontend/src/components/SignupScreen.jsx` | Signup with real API + validation |
| `frontend/src/components/BuyCreditsModal.jsx` | Razorpay payment modal |
| `frontend/src/components/ProtectedRoute.jsx` | Route guard for authenticated screens |

---

## Step 1 — Prerequisites

- Node.js 18+ installed
- A free MongoDB cluster: https://cloud.mongodb.com (takes 5 min to set up)
- A free Razorpay account: https://dashboard.razorpay.com

---

## Step 2 — Backend setup

```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
```

Open `.env` and set:

```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/haritdhan
JWT_SECRET=generate_a_64_char_random_string_here
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
FRONTEND_URL=http://localhost:3000
```

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Start the backend:**
```bash
npm run dev        # development (auto-restart with nodemon)
npm start          # production
```

Backend runs at: http://localhost:5000
Test it: http://localhost:5000/api/health

---

## Step 3 — Frontend integration

### 3a. Wrap your app with AuthProvider

In your `index.js` or wherever your React app mounts:

```jsx
import { AuthProvider } from "./context/AuthContext";

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### 3b. Set API URL

In your `.env` (React):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3c. Replace LoginScreen and SignupScreen

In `HaritDhan_MobileApp_Enhanced.jsx`, import and use the new components:

```jsx
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
```

### 3d. Protect your app screens

In the `renderPage()` switch statement, wrap app screens:

```jsx
case "overview":
  return (
    <ProtectedRoute onNavigate={handleNavigate}>
      <OverviewScreen {...sharedProps} />
    </ProtectedRoute>
  );
case "marketplace":
  return (
    <ProtectedRoute onNavigate={handleNavigate}>
      <MarketplaceScreen {...sharedProps} />
    </ProtectedRoute>
  );
// ... same for haritHub, carbonAnalysis, monitoring
```

### 3e. Add the Buy button to MarketplaceScreen

```jsx
import { useState } from "react";
import { BuyCreditsModal } from "./components/BuyCreditsModal";

// Inside MarketplaceScreen component:
const [buyingItem, setBuyingItem] = useState(null);

// On your credit listing card, replace the existing button with:
<button
  onClick={() => setBuyingItem({
    name: "Premium Carbon Credits — Punjab Cluster",
    description: "MRV-verified credits from wheat farms",
    credits: 50,
    priceINR: 62213,  // ₹1,244.26 × 50
  })}
  style={S.btn}
>
  Buy Credits
</button>

// At the bottom of the JSX return:
{buyingItem && (
  <BuyCreditsModal
    item={buyingItem}
    onClose={() => setBuyingItem(null)}
    C={C}
    S={S}
    dark={dark}
  />
)}
```

### 3f. Show logged-in user's name

Replace the hardcoded `"PRIYANSHI"` in OverviewScreen:

```jsx
import { useAuth } from "./context/AuthContext";

const OverviewScreen = ({ ... }) => {
  const { user, logout } = useAuth();
  // Then use: user?.fullName instead of "PRIYANSHI"
  // And: user?.carbonCredits instead of hardcoded "124 tCO₂"
};
```

---

## Step 4 — Razorpay setup

1. Go to https://dashboard.razorpay.com/app/keys
2. Create test API keys (starts with `rzp_test_`)
3. Add them to your backend `.env`
4. For webhooks (optional but recommended):
   - Go to Dashboard → Webhooks → Add New Webhook
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.created`
   - Add a webhook secret to your `.env` as `RAZORPAY_WEBHOOK_SECRET`

**To go live:** Replace `rzp_test_` keys with `rzp_live_` keys. No code changes needed.

---

## API Endpoints reference

```
POST   /api/auth/register      → Register new user
POST   /api/auth/login         → Login, returns JWT
GET    /api/auth/me            → Get current user (auth required)
POST   /api/auth/logout        → Logout (auth required)
POST   /api/auth/refresh       → Refresh access token

POST   /api/payments/create-order  → Create Razorpay order (auth required)
POST   /api/payments/verify        → Verify payment signature (auth required)
GET    /api/payments/history       → Get transaction history (auth required)
POST   /api/payments/webhook       → Razorpay webhook (no auth, signature verified)
```

---

## Security checklist

- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] JWT stored in httpOnly cookie (XSS-safe)
- [x] All API routes protected with JWT middleware
- [x] Rate limiting on auth endpoints (10 req / 15 min)
- [x] Global rate limiting (200 req / 15 min)
- [x] Helmet security headers (CSP, X-Frame-Options, etc.)
- [x] CORS restricted to frontend origin only
- [x] Input validation on all forms (client + server)
- [x] Password strength enforced (uppercase, number, symbol)
- [x] Razorpay signature verified on backend (prevents fake payments)
- [x] Email enumeration prevented (generic error messages)
- [x] Payload size limited to 10kb
- [x] Sensitive fields (password, refreshToken) never returned in API responses
- [ ] TODO: Add email verification on signup (send OTP or magic link)
- [ ] TODO: HTTPS with Let's Encrypt in production
- [ ] TODO: Add 2FA (TOTP) for Corporate accounts
