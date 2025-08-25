import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";
import ShippingForm from "../components/ShippingForm";
import PaymentMethod from "../components/PaymentMethod";
import api from "../axiosInstance";

export default function OrderPage() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Order | Shopie";
    if (!location.state?.cartItems) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    }
  }, [location.state]);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderDate: new Date().toISOString(),
        detailsJson: JSON.stringify({
          items: cartItems,
          shippingAddress,
          paymentMethod,
        }),
      };

      const response = await api.post("/api/orders", orderData);

      if (response.status === 200 || response.status === 201) {
        clearCart();
        navigate("/orderConfirmation");
      } else {
        alert("Order failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete(`/api/cart`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (e) {
      console.error("DELETE /cart failed", e?.response || e);
      const s = e?.response?.status;
      const m = e?.response?.data?.message || e?.message;
      alert(`Failed to clear cart. ${s ? `Status ${s}.` : ""} ${m || ""}`);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 16px" }}>
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

      <ShippingForm setShippingAddress={setShippingAddress} />

      <hr className="my-6 border-gray-300" />

      <PaymentMethod
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <hr className="my-6 border-gray-300" />

      <OrderSummary cartItems={cartItems} />

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          onClick={handlePlaceOrder}
          style={{
            backgroundColor: "orange",
            color: "white",
            padding: "14px 28px",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
            border: "none"
          }}
        >
          Place Order
        </button>
      </div>

    </div>
  );
}
