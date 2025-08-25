import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance";

const getImg = (x) => x.image_url || x.imageUrl || "";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const load = () =>
    api
      .get("/api/cart")
      .then((res) => {
        setItems(res.data || []);
        setErrMsg("");
      })
      .catch((e) => {
        console.error(e);
        setErrMsg("Failed to load cart.");
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    document.title = "Cart | Shopie";
    load();
  }, []);

  const updateQty = async (productId, qty) => {
    try {
      await api.put(`/api/cart/${productId}`, { quantity: qty });
      await load();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error(e);
      alert("Failed to update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/cart/${productId}`);
      await load();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("DELETE /cart failed", e?.response || e);
      const s = e?.response?.status;
      const m = e?.response?.data?.message || e?.message;
      alert(`Failed to remove item. ${s ? `Status ${s}.` : ""} ${m || ""}`);
    }
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (loading) return <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px" }}>Loading cart…</div>;

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px" }}>
      <h2>Shopping Cart</h2>
      {errMsg && <p style={{ color: "crimson" }}>{errMsg}</p>}

      {items.length === 0 ? (
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
            {items.map((it) => (
              <tr key={it.productId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  {getImg(it) ? (
                    <img src={getImg(it)} alt={it.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} />
                  ) : (
                    <div style={{ width: 50, height: 50, background: "#f3f4f6", borderRadius: 6 }} />
                  )}
                  {it.name}
                </td>
                <td style={{ textAlign: "center" }}>${it.price.toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="number"
                    min="1"
                    value={it.qty}
                    onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                    style={{ width: 60, padding: 4, textAlign: "center" }}
                  />
                </td>
                <td style={{ textAlign: "center" }}>${(it.price * it.qty).toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => removeItem(it.productId)}
                    style={{ background: "#ef4444", color: "#fff", border: 0, padding: "4px 8px", borderRadius: 6, cursor: "pointer" }}
                    aria-label={`Remove ${it.name}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length > 0 && (
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button
            onClick={() => navigate("/order", { state: { cartItems : items } })}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: 0,
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}