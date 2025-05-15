"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getFormattedPrice } from "../admin/services/menuService";
import Image from "next/image";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, getFormattedCartTotal, clearCart } =
    useCart();

  const [step, setStep] = useState(1); // 1: Customer Info, 2: Payment Option, 3: Order Confirmation
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    specialInstructions: "",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("payAfterDelivery");
  const [isInRestaurant, setIsInRestaurant] = useState(false);

  // Validate if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      router.push("/menu");
    }
  }, [cartItems, orderSuccess, router]);

  // Handle customer info changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmitCustomerInfo = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    setLoading(true);

    // Create order object
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      customerInfo,
      items: cartItems,
      total: getCartTotal(),
      paymentMethod,
      isInRestaurant,
      status:
        paymentMethod === "payFirst" ? "pendingPayment" : "pendingApproval",
      createdAt: new Date().toISOString(),
    };

    try {
      // In a real app, you would send this to your backend
      console.log("Submitting order:", order);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store order in localStorage for now (in real app, this would be in database)
      const existingOrders = JSON.parse(
        localStorage.getItem("shehjarOrders") || "[]"
      );
      const updatedOrders = [...existingOrders, order];
      localStorage.setItem("shehjarOrders", JSON.stringify(updatedOrders));

      // Update admin notifications (in real app, this would be a real-time notification)
      const existingNotifications = JSON.parse(
        localStorage.getItem("adminNotifications") || "[]"
      );
      const newNotification = {
        id: Date.now(),
        type: "newOrder",
        orderId: order.id,
        message: `New order #${order.id} received`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem(
        "adminNotifications",
        JSON.stringify([...existingNotifications, newNotification])
      );

      // Order successful
      setOrderId(order.id);
      setOrderSuccess(true);
      clearCart();
      setStep(3);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to menu
  const handleBackToMenu = () => {
    router.push("/menu");
  };

  if (orderSuccess && step === 3) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto py-24 px-4">
          <div className="max-w-lg mx-auto bg-gray-900 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                Order Successfully Placed!
              </h2>
              <p className="text-gray-400 mb-6">
                Your order #{orderId} has been received and{" "}
                {paymentMethod === "payFirst"
                  ? "is being processed."
                  : "is waiting for restaurant confirmation."}
              </p>

              {paymentMethod !== "payFirst" && (
                <div className="bg-yellow-900/30 border border-yellow-800 rounded-md p-4 mb-6">
                  <p className="text-yellow-500 text-sm">
                    Please note that your order will be prepared once the
                    restaurant confirms it.
                    {isInRestaurant
                      ? " You can pay for your order after your meal."
                      : " You will pay for your order upon delivery."}
                  </p>
                </div>
              )}

              <button
                onClick={handleBackToMenu}
                className="px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Checkout
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-6"></div>
          </div>

          {/* Checkout Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-16 md:w-32 ${
                  step >= 2
                    ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"
                    : "bg-gray-800"
                }`}
              ></div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                2
              </div>
              <div
                className={`h-1 w-16 md:w-32 ${
                  step >= 3
                    ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"
                    : "bg-gray-800"
                }`}
              ></div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 px-2">
              <span className={step >= 1 ? "text-[rgba(234,219,102,1)]" : ""}>
                Customer Info
              </span>
              <span className={step >= 2 ? "text-[rgba(234,219,102,1)]" : ""}>
                Payment Method
              </span>
              <span className={step >= 3 ? "text-[rgba(234,219,102,1)]" : ""}>
                Confirmation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Checkout Form and Steps */}
            <div className="md:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                {step === 1 && (
                  <form onSubmit={handleSubmitCustomerInfo}>
                    <h2 className="text-xl font-bold mb-4">
                      Customer Information
                    </h2>

                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">
                        Delivery Address (Optional for in-restaurant orders)
                      </label>
                      <textarea
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-400 text-sm mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        name="specialInstructions"
                        value={customerInfo.specialInstructions}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                        placeholder="Any allergies, special requests, etc."
                      ></textarea>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleBackToMenu}
                        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                      >
                        Back to Menu
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-md font-medium"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                    <div className="mb-6">
                      <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">
                          Are you dining in the restaurant?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={isInRestaurant}
                              onChange={() => setIsInRestaurant(true)}
                              className="mr-2"
                            />
                            <span>Yes, I'm at the restaurant</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={!isInRestaurant}
                              onChange={() => setIsInRestaurant(false)}
                              className="mr-2"
                            />
                            <span>No, it's a delivery order</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div
                          onClick={() =>
                            handlePaymentMethodChange("payAfterDelivery")
                          }
                          className={`border ${
                            paymentMethod === "payAfterDelivery"
                              ? "border-[rgba(234,219,102,1)] bg-gray-800"
                              : "border-gray-700 bg-gray-900"
                          } rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={paymentMethod === "payAfterDelivery"}
                              onChange={() => {}}
                              className="mr-3"
                            />
                            <div>
                              <h3 className="font-medium">
                                {isInRestaurant
                                  ? "Pay After Feast"
                                  : "Cash on Delivery"}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {isInRestaurant
                                  ? "Enjoy your meal and pay when you're done"
                                  : "Pay when your order arrives at your doorstep"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePaymentMethodChange("payFirst")}
                          className={`border ${
                            paymentMethod === "payFirst"
                              ? "border-[rgba(234,219,102,1)] bg-gray-800"
                              : "border-gray-700 bg-gray-900"
                          } rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={paymentMethod === "payFirst"}
                              onChange={() => {}}
                              className="mr-3"
                            />
                            <div>
                              <h3 className="font-medium">Pay Now</h3>
                              <p className="text-sm text-gray-400">
                                Pay securely online via our payment gateway
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-md font-medium flex items-center"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => {
                    // Get price based on variant or regular price
                    let itemPrice = item.price;
                    let itemName = item.name;

                    if (item.selectedVariant && item.variants) {
                      const variant = item.variants.find(
                        (v) => v.size === item.selectedVariant
                      );
                      if (variant) {
                        itemPrice = variant.price;
                        itemName = `${item.name} (${item.selectedVariant})`;
                      }
                    }

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex justify-between"
                      >
                        <div className="flex-1">
                          <span className="text-gray-300">
                            {item.quantity} x {itemName}
                          </span>
                        </div>
                        <div className="text-white">
                          {getFormattedPrice(itemPrice * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-800 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">
                      {getFormattedCartTotal()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                      {getFormattedCartTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
