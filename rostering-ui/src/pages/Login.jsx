import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const S = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e5ef",
    borderRadius: 14,
    padding: "40px 36px",
    width: 360,
    boxShadow: "0 4px 24px rgba(0,0,0,.07)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: "#3b6ef8",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: { fontSize: 16, fontWeight: 700, letterSpacing: -0.4, color: "#1a1e2e" },
  logoSub: { fontSize: 11, color: "#9299b0", letterSpacing: 0.3 },
  heading: { fontSize: 20, fontWeight: 700, color: "#1a1e2e", marginBottom: 4, letterSpacing: -0.4 },
  subheading: { fontSize: 13, color: "#9299b0", marginBottom: 28 },
  label: { fontSize: 11, fontWeight: 700, color: "#9299b0", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    background: "#f0f2f7",
    border: "1px solid #d0d4e4",
    borderRadius: 7,
    padding: "10px 13px",
    fontSize: 13,
    color: "#1a1e2e",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s",
  },
  inputFocus: {
    borderColor: "#3b6ef8",
    background: "#f8f9ff",
  },
  fieldGroup: { marginBottom: 20 },
  btn: {
    width: "100%",
    padding: "11px",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    background: "#3b6ef8",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: 0.2,
    transition: "opacity .15s",
    marginTop: 4,
  },
  error: {
    background: "#fff0f0",
    border: "1px solid #fdd",
    borderRadius: 7,
    padding: "10px 13px",
    fontSize: 12,
    color: "#b02020",
    marginBottom: 16,
  },
  hint: { fontSize: 11, color: "#9299b0", textAlign: "center", marginTop: 20 },
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/login?username=${encodeURIComponent(username.trim())}`);
      const { access_token, role, user_id, name, gender } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", name);
      localStorage.setItem("gender", gender || "");

      window.location.href = role === "admin" ? "/admin" : "/employee";
    } catch {
      setError("Name not found. Please check with your admin.");
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
              <path d="M2 4h12v1.5H2zm0 3h12v1.5H2zm0 3h8v1.5H2z" />
            </svg>
          </div>
          <div>
            <div style={S.logoText}>RosterOS</div>
            <div style={S.logoSub}>Staff Scheduling</div>
          </div>
        </div>

        <div style={S.heading}>Welcome back</div>
        <div style={S.subheading}>Sign in to view your schedule</div>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Your Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Jones"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
              autoFocus
            />
          </div>
          <button type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div style={S.hint}>Enter your full name as registered by the admin</div>
      </div>
    </div>
  );
}
