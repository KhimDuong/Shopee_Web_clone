import React, { useState, useEffect } from "react";
import api from "../axiosInstance";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  const parseJSONSafe = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      console.error("Failed to parse JSON:", data);
      return [];
    }
  };

  const load = () =>
    api
      .get("/api/orders")
      .then((res) => {
        console.log("API Response:", res.data);
        setOrders(Array.isArray(res.data) ? res.data : []);
        setErrMsg("");
      })
      .catch((e) => {
        console.error(e);
        setErrMsg("Failed to load orders.");
      });

  useEffect(() => {
    document.title = "History | Shopie";
    load();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>My Orders</h1>

      {errMsg && (
        <p style={{ color: "red", fontSize: "16px", marginBottom: "12px" }}>
          {errMsg}
        </p>
      )}

      {orders.length === 0 ? (
        <p style={{ fontSize: "16px" }}>You have no previous orders.</p>
      ) : (
        orders.map((order) => {
          const details = parseJSONSafe(order.detailsJson);
          console.log("Parsed Order Details:", details);
          const items = details.items || [];
          console.log("Order Items:", items);
          return (
            <div
              key={order.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                Order #{order.id}
              </h2>
              <p style={{ margin: "4px 0" }}>
                <strong>Date:</strong> {order.oderDate || "N/A"}
              </p>

              {Array.isArray(items) && items.length > 0 ? (
                <table
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      <th style={{ padding: "8px 4px" }}>Item</th>
                      <th style={{ padding: "8px 4px" }}>Qty</th>
                      <th style={{ padding: "8px 4px" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px 4px" }}>{item.name}</td>
                        <td style={{ padding: "8px 4px" }}>{item.qty}</td>
                        <td style={{ padding: "8px 4px" }}>${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ marginTop: "12px", fontStyle: "italic" }}>
                  No items found in this order.
                </p>
              )}

              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginTop: "12px",
                }}
              >
                Total: $
                {items
                  .reduce((sum, item) => sum + item.price * item.qty, 0)
                  .toFixed(2)}
            </div>
          </div>
          )
        })
      )}
    </div>
  );
}
