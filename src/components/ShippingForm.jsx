import { useState } from "react";

export default function ShippingForm({ setShippingAddress }) {
  const [address, setAddress] = useState("");

  const handleChange = (e) => {
    setAddress(e.target.value);
    setShippingAddress({ address: e.target.value });
  };

  return (
    <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "normal", whiteSpace: "nowrap", margin: 0 }}>
        Shipping Address
      </h2>
      <input
        type="text"
        placeholder="Enter your shipping address"
        value={address}
        onChange={handleChange}
        style={{
          flex: 1,
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "13px"
        }}
      />
    </div>
  );
}
