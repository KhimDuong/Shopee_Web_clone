import React from "react";

export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "normal", whiteSpace: "nowrap", margin: 0 }}>
        Payment Method
      </h2>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{
          flex: 0.25,
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "13px"
        }}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="CreditCard">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>
    </div>
  );
}
