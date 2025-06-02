"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getFormattedPrice } from "../admin/services/menuService";

const OrderBill = ({ order, onPrint }) => {
  const billRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    documentTitle: `Shehjar-Bill-${order.order_id}`,
    onAfterPrint: () => {
      if (onPrint) onPrint();
    },
  });

  // Calculate subtotal
  const subtotalWithGST = order.items.reduce((acc, item) => {
    const itemPriceWithGST = item.selectedVariant
      ? item.variants.find((v) => v.size === item.selectedVariant)?.price ||
        item.price
      : item.price;
    return acc + itemPriceWithGST * item.quantity;
  }, 0);

  // Calculate base price without GST (more precisely)
  const subtotal = parseFloat((subtotalWithGST / 1.05).toFixed(2));

  // Calculate GST - split into CGST and SGST
  const cgstRate = 2.5; // 2.5% CGST
  const sgstRate = 2.5; // 2.5% SGST
  const cgst = parseFloat(((subtotal * cgstRate) / 100).toFixed(2));
  const sgst = parseFloat(((subtotal * sgstRate) / 100).toFixed(2));
  const total = parseFloat((subtotal + cgst + sgst).toFixed(2));

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // Get payment status text
  const getPaymentStatusText = () => {
    if (order.isPaid) return "PAID";

    switch (order.payment_method) {
      case "cash":
        return "CASH PAYMENT";
      case "card":
        return "CARD PAYMENT";
      case "upi":
        return "UPI PAYMENT";
      case "cod":
        return "CASH ON DELIVERY";
      default:
        return "PAYMENT PENDING";
    }
  };

  // Get order type text
  const getOrderTypeText = () => {
    switch (order.order_type) {
      case "dine-in":
        return `Table: ${order.table_number || "N/A"}`;
      case "takeaway":
        return "TAKEAWAY";
      case "delivery":
        return `DELIVERY: ${order.delivery_address || ""}`;
      default:
        return "ORDER";
    }
  };

  return (
    <div>
      {/* Print button */}
      <button
        onClick={handlePrint}
        className="px-3 py-1.5 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-medium flex items-center"
        title="Print standard receipt format"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print Bill
      </button>

      {/* Hidden bill that will be used for printing */}
      <div className="hidden">
        <div
          ref={billRef}
          className="w-80 p-4 font-mono text-sm"
          style={{
            width: "80mm",
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.2",
            background: "#fff",
            color: "#000",
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="font-bold text-lg mb-1">SHEHJAR</div>
            <div>Traditional Restaurant & Bakery</div>
            <div className="my-1">GSTIN: 01ABLFM0344H1ZO</div>
            <div>Phone: 01933-250090</div>
            <div className="border-t border-b border-gray-800 my-2 py-1 font-bold">
              TAX INVOICE
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-4">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span>{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(order.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{formatTime(order.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{getOrderTypeText()}</span>
            </div>
            {order.customer_name && (
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{order.customer_name}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{order.customer_phone}</span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <div className="border-b border-gray-800 mb-2 pb-1 font-bold">
              ITEMS
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left">Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => {
                  const priceWithGST = item.selectedVariant
                    ? item.variants.find((v) => v.size === item.selectedVariant)
                        ?.price || item.price
                    : item.price;

                  // Calculate base price without GST (more precise calculation)
                  const basePrice = parseFloat(
                    (priceWithGST / 1.05).toFixed(2)
                  );
                  const amount = parseFloat(
                    (basePrice * item.quantity).toFixed(2)
                  );

                  return (
                    <tr
                      key={index}
                      className="border-b border-dotted border-gray-400"
                    >
                      <td className="text-left">
                        {item.name}
                        {item.selectedVariant && ` (${item.selectedVariant})`}
                      </td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">₹{basePrice.toFixed(2)}</td>
                      <td className="text-right">₹{amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Order Calculation */}
          <div className="border-t border-gray-300 pt-3 mt-4">
            <div className="flex justify-between pb-1">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>CGST ({cgstRate}%):</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>SGST ({sgstRate}%):</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold border-t border-gray-300">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* GSTIN Info */}
          <div className="text-center text-sm mt-4 border-t border-gray-300 pt-2">
            <div>GSTIN: 01ABLFM0344H1ZO</div>
          </div>

          {/* Payment Status */}
          <div
            style={{
              border: "1px solid #000",
              textAlign: "center",
              padding: "0.25rem 0",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {getPaymentStatusText()}
          </div>

          {/* Footer */}
          <div className="text-center text-xs">
            <div className="mb-2">Thank you for dining with us!</div>
            <div>Visit us again at Shehjar Restaurant.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBill;
