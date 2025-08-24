import { useEffect, useState } from "react";

function getCart() {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(next) {
  localStorage.setItem("cart", JSON.stringify(next));
}

export default function CartPage() {
  const [cart, setCartState] = useState([]);

  useEffect(() => {
    document.title = "Cart | Shopie";
    setCartState(getCart());
  }, []);

  const updateQty = (id, qty) => {
    const updated = cart.map((c) =>
      c.id === id ? { ...c, qty: Math.max(1, qty) } : c
    );
    setCart(updated);
    setCartState(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((c) => c.id !== id);
    setCart(updated);
    setCartState(updated);
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px" }}>
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Product</th>
              <th style={{ textAlign: "center", padding: 8 }}>Price</th>
              <th style={{ textAlign: "center", padding: 8 }}>Quantity</th>
              <th style={{ textAlign: "center", padding: 8 }}>Subtotal</th>
              <th style={{ textAlign: "center", padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  {item.imageUrl || item.image_url ? (
                    <img
                      src={item.imageUrl || item.image_url}
                      alt={item.name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: "#f3f4f6",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 6,
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#999" }}>No img</span>
                    </div>
                  )}
                  {item.name}
                </td>
                <td style={{ textAlign: "center" }}>${item.price.toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    style={{ width: 60, padding: 4, textAlign: "center" }}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  ${(item.price * item.qty).toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: 0,
                      padding: "4px 8px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {cart.length > 0 && (
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}