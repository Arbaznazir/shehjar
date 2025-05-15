"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getFormattedPrice } from "../admin/services/menuService";

const ClassicBill = ({ order, onPrint }) => {
  const billRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    documentTitle: `Shehjar-Classic-Bill-${order.orderId}`,
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

  // Calculate the total
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

  // Get KOT number (Kitchen Order Ticket)
  const getKOTNumber = () => {
    // Generate a random KOT number for demonstration
    return `SHJ${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`;
  };

  return (
    <div>
      {/* Print button */}
      <button
        onClick={handlePrint}
        className="px-3 py-1.5 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-medium flex items-center"
        title="Print classic receipt format"
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Classic Bill
      </button>

      {/* Hidden bill that will be used for printing */}
      <div className="hidden">
        <div
          ref={billRef}
          className="w-80 p-2 font-mono text-sm"
          style={{
            width: "80mm",
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.1",
            color: "#000",
            background: "#fff",
            padding: "8px",
          }}
        >
          {/* Header with Thank You */}
          <div
            className="text-center mb-1"
            style={{ background: "#000", color: "#eadB66", padding: "6px 0" }}
          >
            <div className="font-bold" style={{ letterSpacing: "1px" }}>
              Thank You
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="text-center mb-4 mt-2">
            <div className="font-bold mb-1">SHEHJAR PVT. LTD.</div>
            <div>G-23, 24, 25, Central Plaza Mall,</div>
            <div>Sec 53, Golf Course Road,</div>
            <div>Srinagar</div>
            <div>Ph: 01933-250090</div>
            <div>GSTIN: 01ABLFM0344H1ZO</div>
            <div>TIN: 06291846140</div>
          </div>

          {/* Bill Header */}
          <div className="mb-2">
            <div className="font-bold">RESTAURANT</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Bill: {order.orderId}</div>
              <div>Time: {formatTime(order.timestamp)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Date: {formatDate(order.timestamp)}</div>
              <div>
                Table: {order.tableNumber || "N/A"}{" "}
                {order.orderType === "takeaway" ? "T/A" : ""}
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div
            style={{ borderBottom: "1px dashed #000", margin: "4px 0" }}
          ></div>

          {/* Column Headers */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "4px 0",
            }}
          >
            <div style={{ width: "50%" }}>Item Name</div>
            <div style={{ width: "15%", textAlign: "center" }}>Qty.</div>
            <div style={{ width: "15%", textAlign: "right" }}>Rate</div>
            <div style={{ width: "20%", textAlign: "right" }}>Amount</div>
          </div>

          {/* Separator Line */}
          <div
            style={{ borderBottom: "1px dashed #000", margin: "4px 0" }}
          ></div>

          {/* Order Items */}
          {order.items.map((item, index) => {
            const priceWithGST = item.selectedVariant
              ? item.variants.find((v) => v.size === item.selectedVariant)
                  ?.price || item.price
              : item.price;

            // Calculate base price without GST (more precisely)
            const basePrice = parseFloat((priceWithGST / 1.05).toFixed(2));
            const amount = parseFloat((basePrice * item.quantity).toFixed(2));

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "8px 0",
                }}
              >
                <div style={{ width: "50%" }}>
                  {item.name}
                  {item.selectedVariant && ` ${item.selectedVariant}`}
                </div>
                <div style={{ width: "15%", textAlign: "center" }}>
                  {item.quantity}
                </div>
                <div style={{ width: "15%", textAlign: "right" }}>
                  {basePrice.toFixed(2)}
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  {amount.toFixed(2)}
                </div>
              </div>
            );
          })}

          {/* Separator Line */}
          <div
            style={{ borderBottom: "1px dashed #000", margin: "4px 0" }}
          ></div>

          {/* Calculations */}
          <div className="text-right pr-2">
            <div className="flex justify-between border-t border-dashed border-gray-400 pt-2 mt-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST ({cgstRate}%):</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({sgstRate}%):</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-400 pt-2 mt-1 font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Add GSTIN */}
          <div className="text-center text-xs mb-2">
            <p>GSTIN: 01ABLFM0344H1ZO</p>
          </div>

          {/* KOT Number */}
          <div style={{ margin: "8px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>KOT No.: {getKOTNumber()}</div>
            </div>
          </div>

          {/* Payment Status - shown at the bottom of the receipt */}
          {!order.isPaid && (
            <div className="text-center mt-4" style={{ fontWeight: "bold" }}>
              {order.paymentMethod === "cod"
                ? "CASH ON DELIVERY"
                : order.paymentMethod === "card"
                ? "CARD PAYMENT PENDING"
                : order.paymentMethod === "upi"
                ? "UPI PAYMENT PENDING"
                : order.paymentMethod === "post-service"
                ? "PAYMENT AFTER SERVICE"
                : "PAYMENT PENDING"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicBill;
