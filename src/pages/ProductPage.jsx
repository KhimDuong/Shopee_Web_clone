// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", imageUrl: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Products | Shopie";

    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/"); // no token → back to login
      return;
    }

    axios
      .get(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/"); // invalid/expired token → back to login
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;

    setError("");
    // basic validation
    if (!newItem.name?.trim() || !newItem.price) {
      setError("Please enter product name and price.");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }

    setCreating(true);
    try {
      // Adjust endpoint/payload to match your backend if needed
      const payload = {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        ...(newItem.imageUrl?.trim() ? { imageUrl: newItem.imageUrl.trim() } : {}),
      };

      const res = await axios.post(`${API_BASE}/products`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If API returns the created product, prepend it; otherwise refetch
      const created = res?.data;
      if (created && created.id) {
        setProducts((prev) => [created, ...prev]);
      } else {
        // fallback: refetch
        const list = await axios.get(`${API_BASE}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(list.data);
      }

      // Reset form
      setNewItem({ name: "", price: "", imageUrl: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create item. Please check your connection or try again.");
      // Optional: redirect on 401/403
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        navigate("/");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginBottom: 20, marginTop: 0 }}>Product list</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{
            padding: "10px 12px",
            background: showForm ? "#111827" : "#FF4D4F",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showForm ? "Close" : "Add new item"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            background: "#fff",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "block" }}>
              <span>Name</span>
              <input
                name="name"
                value={newItem.name}
                onChange={handleChange}
                placeholder="Product name"
                required
                style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
              />
            </label>
            <label style={{ display: "block" }}>
              <span>Price (₫)</span>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                value={newItem.price}
                onChange={handleChange}
                placeholder="100000"
                required
                style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            <span>Image URL (optional)</span>
            <input
              name="imageUrl"
              value={newItem.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
          </label>

          {error && (
            <div role="alert" aria-live="polite" style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 12px",
                background: "#e5e7eb",
                color: "#111827",
                border: 0,
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              style={{
                padding: "10px 12px",
                background: creating ? "#bbb" : "#10b981",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                cursor: creating ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      )}

      {loading && <p>Loading products…</p>}

      {!loading && products.length === 0 && (
        <p style={{ color: "#6b7280" }}>No products found.</p>
      )}

      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {products.map((p) => (
          <li
            key={p.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "box-shadow 0.2s",
            }}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            )}

            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: "4px 0", fontSize: 16 }}>{p.name}</h3>
              <p style={{ fontWeight: 600, color: "#FF4D4F", margin: 0 }}>
                {Number(p.price).toLocaleString("en-US")} ₫
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}