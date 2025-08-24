// src/components/Header.jsx
import { isAuthed, clearToken } from "../auth";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";

function getCartCount() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const items = JSON.parse(raw);
    return items.reduce((sum, c) => sum + c.qty, 0);
  } catch {
    return 0;
  }
}

export default function Header() {
  const authed = isAuthed();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(getCartCount());

  const handleLogout = () => {
    clearToken();
    navigate("/", { replace: true });
  };

  // Listen for cart changes across the app
  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    window.addEventListener("storage", syncCart);
    // also update when this component mounts
    syncCart();
    return () => window.removeEventListener("storage", syncCart);
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

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        {authed ? (
          <>
            <Link to="/products" style={{ padding: "6px 10px" }}>
              Products
            </Link>

            {/* Cart with icon + count badge */}
            <Link
              to="/cart"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
              }}
            >
              <FaShoppingCart size={20} />
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