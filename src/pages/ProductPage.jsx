import { useEffect, useMemo, useState } from "react";
import api from "../axiosInstance";

// Prefer snake_case from backend but accept camelCase too (future-proof)
const getImg = (p) => p.image_url || p.imageUrl || "";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Add-new-item form state
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    image_url: "",
    description: "",
  });

  // Lightweight toast message when adding to cart
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    document.title = "Products | Shopie";
    api
      .get("/api/products/public")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingList(false));
  }, []);

  const totalItems = useMemo(() => products.length, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;

    setFormError("");
    const name = newItem.name.trim();
    const priceNum = Number(newItem.price);
    const image = newItem.image_url.trim();
    const description = newItem.description.trim();

    if (!name || !priceNum || Number.isNaN(priceNum)) {
      setFormError("Please enter a valid name and price.");
      return;
    }

    setCreating(true);
    try {
      // Send snake_case because your backend exposes getImage_url()
      const payload = {
        name,
        price: priceNum,
        image_url: image || null,
        description: description || null,
      };

      // ✅ MUST use /api/products
      const res = await api.post("/api/products", payload);
      const created = res?.data;

      if (created && created.id) {
        setProducts((prev) => [created, ...prev]);
      } else {
        const list = await api.get("/api/products");
        setProducts(list.data || []);
      }

      setNewItem({ name: "", price: "", image_url: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setFormError("Failed to create item. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleAddToCart = async (p) => {
    try {
      await api.post("/api/cart", { productId: p.id, quantity: 1 });
      setAddMsg(`Added "${p.name}" to cart`);
      clearTimeout(handleAddToCart._t);
      handleAddToCart._t = setTimeout(() => setAddMsg(""), 1600);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      const status = e?.response?.status || "network";
      const msg = e?.response?.data?.message || e?.message || "Unknown error";
      console.error("Add to cart failed:", status, msg);
      alert(`Failed to add to cart (${status}): ${msg}`);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 16px" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Product list</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            {loadingList ? "Loading…" : `${totalItems} items`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {addMsg && (
            <span
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                border: "1px solid #a7f3d0",
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {addMsg}
            </span>
          )}
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
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <label>
              <span>Name</span>
              <input
                name="name"
                value={newItem.name}
                onChange={handleChange}
                placeholder="Product name"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 6,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                }}
              />
            </label>

            <label>
              <span>Price (USD)</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={handleChange}
                placeholder="99.99"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 6,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                }}
              />
            </label>
          </div>

          <label style={{ display: "block", marginTop: 12 }}>
            <span>Image URL (PNG/JPG/WebP)</span>
            <input
              name="image_url"
              value={newItem.image_url}
              onChange={handleChange}
              placeholder="https://example.com/product.png"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: 6,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            <span>Description</span>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleChange}
              placeholder="A short description of the product"
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: 6,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                resize: "vertical",
              }}
            />
          </label>

          {formError && (
            <div
              role="alert"
              aria-live="polite"
              style={{ color: "crimson", marginTop: 10 }}
            >
              {formError}
            </div>
          )}

          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
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

      {/* Grid */}
      {loadingList && <p>Loading products…</p>}
      {!loadingList && products.length === 0 && (
        <p style={{ color: "#6b7280" }}>No products found.</p>
      )}

      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
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
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {getImg(p) ? (
              <img
                src={getImg(p)}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderBottom: "1px solid #f3f4f6",
                }}
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 180,
                  background: "#f3f4f6",
                  display: "grid",
                  placeItems: "center",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ color: "#9ca3af" }}>No image</span>
              </div>
            )}

            <div style={{ padding: 12, flexGrow: 1 }}>
              <h3 style={{ margin: "4px 0", fontSize: 16 }}>{p.name}</h3>
              {p.description && (
                <p
                  style={{
                    margin: "4px 0 8px 0",
                    fontSize: 14,
                    color: "#6b7280",
                    minHeight: 36,
                  }}
                >
                  {p.description}
                </p>
              )}
              <p
                style={{
                  fontWeight: 700,
                  color: "#16a34a",
                  margin: 0,
                  fontSize: 15,
                }}
              >
                $
                {Number(p.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div
              style={{
                padding: 12,
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <button
                onClick={() => handleAddToCart(p)}
                style={{
                  padding: "8px 10px",
                  background: "#FF4D4F",
                  color: "#fff",
                  border: 0,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add to cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}