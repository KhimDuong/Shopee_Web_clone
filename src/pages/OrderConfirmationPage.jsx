import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div
        style={{
            maxWidth: "800px",
            margin: "80px auto",
            textAlign: "center",
            padding: "24px",
        }}
    >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
            Thank you for your order!
        </h1>
        <p style={{ fontSize: "18px", color: "#4B5563", marginBottom: "32px" }}>
            Your order has been successfully placed. You will receive a confirmation
            email shortly.
        </p>

        <div
            style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            }}
        >
            <button
            onClick={() => navigate("/")}
            style={{
                backgroundColor: "#E5E7EB",
                color: "#374151",
                fontWeight: "600",
                padding: "14px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#D1D5DB")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
            >
            Back to Home
            </button>

            <button
            onClick={() => navigate("/orderHistory")}
            style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontWeight: "600",
                padding: "14px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1E40AF")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            >
            View Order History
            </button>
        </div>
    </div>

  );
}
