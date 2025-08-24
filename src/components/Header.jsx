import { isAuthed, clearToken } from "../auth";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosInstance";

export default function Header() {
  const authed = isAuthed();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    clearToken();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadCount = () => {
      api
        .get("/cart")
        .then((res) => {
          const items = res.data || [];
          setCartCount(items.reduce((sum, i) => sum + i.qty, 0));
        })
        .catch(() => setCartCount(0));
    };
    loadCount();

    const onUpdate = () => loadCount();
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

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
      <Link to="/" style={{ fontWeight: 800 }}>
        Shopie
      </Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
        {authed ? (
          <>
            <Link to="/products" style={{ padding: "6px 10px" }}>
              Products
            </Link>

            {/* Cart icon + badge (no external deps) */}
            <Link
              to="/cart"
              style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", textDecoration: "none" }}
              aria-label="Cart"
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
              style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
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