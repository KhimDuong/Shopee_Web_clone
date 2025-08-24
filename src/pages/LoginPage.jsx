import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Simple brand logo (shopping bag + S)
function Brand({ size = 28, label = "Shopie" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF4D4F" />
            <stop offset="1" stopColor="#FF7A45" />
          </linearGradient>
        </defs>
        <path fill="url(#g)" d="M8 18a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V18z" />
        <path fill="url(#g)" d="M12 18c0-6 5-10 12-10s12 4 12 10h-4c0-3.9-3.6-6-8-6s-8 2.1-8 6h-4z" />
        <path fill="#fff" d="M27.8 31.9c0 1.7-1.5 3-4 3-1.7 0-3.6-.6-5-1.6l1.5-2.8c1.1.8 2.4 1.3 3.6 1.3 1 0 1.5-.3 1.5-.8 0-1.7-6-1-6-5.2 0-2.2 1.9-3.9 4.9-3.9 1.6 0 3.3.5 4.6 1.3l-1.3 2.8c-1-.6-2.2-1-3.2-1-1 0-1.6.4-1.6.9 0 1.7 6 1.1 6 5.6z"/>
      </svg>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>{label}</span>
    </div>
  );
}

// Google "G" icon
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 31.5 29.3 35 24 35 16.8 35 11 29.2 11 22s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.7 3.2 29.7 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c12.2 0 22-9.8 22-22 0-1.1-.1-2.1-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.2 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.7 7.2 29.7 5 24 5c-7.8 0-14.4 4.4-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.3l-6.3-5.2C29 36.4 26.6 37 24 37c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C8.5 40.5 15.8 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.9-4.8 6.5-8.3 6.5-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C11.5 37.5 17.8 42 26 42c12.2 0 22-9.8 22-22 0-1.1-.1-2.1-.4-3.5z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Log in | Shopie";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      const token = res?.data?.token;
      if (!token) throw new Error("Missing token");
      localStorage.setItem("jwt", token);
      navigate("/products");
    } catch (err) {
      setError("Incorrect username/password or connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <Brand />
      </header>

      <h2 style={{ marginBottom: 8 }}>Log in</h2>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 16 }}>
        Welcome back! Enter your account to continue shopping.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: "block", marginTop: 8 }}>
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Please enter your username"
            autoComplete="username"
            required
            style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </label>

        {error && (
          <div role="alert" aria-live="polite" style={{ color: "crimson", marginTop: 10 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "10px 12px",
            background: submitting ? "#bbb" : "#FF4D4F",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {submitting ? "Signing in…" : "Log in"}
        </button>
      </form>

      <div style={{ margin: "14px 0", textAlign: "center" }}>
        <span style={{ color: "#9ca3af" }}>— or —</span>
      </div>

      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          padding: "10px 12px",
          backgroundColor: "#fff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontWeight: 600,
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p style={{ marginTop: 12 }}>
        Don’t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}