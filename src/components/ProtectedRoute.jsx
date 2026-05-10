// ─── ProtectedRoute ────────────────────────────────────────────────────────────
// Wrap this around any screen that requires login.
// Usage in App root:
//   case "overview": return <ProtectedRoute onNavigate={onNavigate}><OverviewScreen .../></ProtectedRoute>

import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, onNavigate }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Checking session — show a minimal loader
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #2D7A3A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <div style={{ fontSize: "14px", color: "#5C8A62" }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in — redirect to login
    onNavigate("login");
    return null;
  }

  return children;
};
