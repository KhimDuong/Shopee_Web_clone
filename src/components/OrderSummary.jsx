import React from "react";

export default function OrderSummary({ cartItems }) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const subtotalFixed = subtotal.toFixed(2);
  const shipping = subtotal > 0 ? 5 : 0;
  const total = (subtotal + shipping).toFixed(2);


  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "normal", marginBottom: "12px" }}>
        Order Summary
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #bfbfbfff" }}>
            <th style={{ padding: "8px 0" }}>Item</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Quantity</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #cececeff" }}>
              <td style={{ padding: "8px 0" }}>{item.name}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{item.qty}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>
                ${item.price * item.qty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "12px", fontSize: "16px", textAlign: "right" }}>
        Subtotal: ${subtotalFixed}
      </div>
      <div style={{ fontSize: "16px", textAlign: "right" }}>
        Shipping: ${shipping}
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "4px",
          textAlign: "right"
        }}
      >
        Total: ${total}
      </div>

    </div>
  );
}
