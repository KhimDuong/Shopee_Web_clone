import { isAuthed, clearToken } from "../auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosInstance";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authed, setAuthed] = useState(isAuthed());
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    clearToken();
    try { localStorage.setItem("logout_at", String(Date.now())); } catch {}
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const syncAuth = () => setAuthed(isAuthed());
    syncAuth();

    const onAuthChanged = () => syncAuth();
    const onStorage = (e) => {
      if (e.key === "jwt" || e.key === "logout_at") syncAuth();
    };
    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, [location.pathname]);

  useEffect(() => {
    const loadCount = () => {
      if (!authed) {
        setCartCount(0);
        return;
      }
      api
        .get("/api/cart", { headers: { "X-Skip-Auth-Redirect": "1" } })
        .then((res) => {
          const items = res.data || [];
          const total = items.reduce(
            (sum, i) => sum + (Number(i.quantity ?? i.qty) || 0),
            0
          );
          setCartCount(Number.isFinite(total) ? total : 0);
        })
        .catch(() => setCartCount(0));
    };

    loadCount();

    const onUpdate = () => loadCount();
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, [authed]);

  return (
    <header
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* ✅ Use favicon.ico instead of text */}
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/favicon.ico"   // favicon.ico in public/ folder
          alt="Shopie logo"
          style={{ width: 28, height: 28 }}
        />
      </Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
        {authed ? (
          <>
            <Link
              to="/products"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                textDecoration: "none",
              }}
              aria-label="Products"
              title="Products"
            >
              <span style={{ fontSize: 18 }}>🛍️</span>
            </Link>

            <Link
              to="/cart"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                textDecoration: "none",
              }}
              aria-label="Cart"
              title="Cart"
            >
              <span style={{ fontSize: 18 }}>🛒</span>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: 11,
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                background: "#ef4444",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={{ padding: "6px 10px" }}>
              Log in
            </Link>
            <Link to="/register" style={{ padding: "6px 10px" }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}