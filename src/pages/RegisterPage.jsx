import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

function Brand({ size = 28, label = "Shopie" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF4D4F" />
            <stop offset="1" stopColor="#FF7A45" />
          </linearGradient>
        </defs>
        <path fill="url(#g2)" d="M8 18a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V18z" />
        <path fill="url(#g2)" d="M12 18c0-6 5-10 12-10s12 4 12 10h-4c0-3.9-3.6-6-8-6s-8 2.1-8 6h-4z" />
        <path fill="#fff" d="M27.8 31.9c0 1.7-1.5 3-4 3-1.7 0-3.6-.6-5-1.6l1.5-2.8c1.1.8 2.4 1.3 3.6 1.3 1 0 1.5-.3 1.5-.8 0-1.7-6-1-6-5.2 0-2.2 1.9-3.9 4.9-3.9 1.6 0 3.3.5 4.6 1.3l-1.3 2.8c-1-.6-2.2-1-3.2-1-1 0-1.6.4-1.6.9 0 1.7 6 1.1 6 5.6z"/>
      </svg>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>{label}</span>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Create account | Shopie";
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/api/auth/register`, formData);
      navigate("/");
    } catch (err) {
      setError("Sign up failed. The username might already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <Brand />
      </header>

      <h2 style={{ marginBottom: 8 }}>Create your account</h2>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 16 }}>
        Join Shopie to save orders, get vouchers, and check out faster.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: "block", marginTop: 8 }}>
          <span>Username</span>
          <input
            type="text"
            name="username"
            placeholder="yourname"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
            style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
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
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;