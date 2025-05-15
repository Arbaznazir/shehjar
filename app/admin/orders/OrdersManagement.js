"use client";

import { useState, useEffect, useRef } from "react";
import OrderBill from "../../components/OrderBill";
import ClassicBill from "../../components/ClassicBill";
import { getFormattedPrice } from "../../admin/services/menuService";

// Sample order data (in a real app, this would come from a database or API)
const SAMPLE_ORDERS = [
  {
    orderId: "SHJ-2023-001",
    timestamp: Date.now() - 3600000, // 1 hour ago
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    orderType: "dine-in",
    tableNumber: "12",
    paymentMethod: "card",
    isPaid: true,
    status: "completed",
    items: [
      {
        id: "item1",
        name: "Butter Chicken",
        price: 350,
        quantity: 1,
      },
      {
        id: "item2",
        name: "Butter Naan",
        price: 40,
        quantity: 3,
      },
      {
        id: "item3",
        name: "Paneer Tikka",
        price: 240,
        quantity: 1,
      },
      {
        id: "item4",
        name: "Schezwan Chicken (DRY/GRAVY)",
        price: 720,
        quantity: 1,
      },
    ],
  },
  {
    orderId: "SHJ-2023-002",
    timestamp: Date.now() - 1800000, // 30 minutes ago
    customerName: "Priya Patel",
    customerPhone: "8765432109",
    orderType: "delivery",
    deliveryAddress: "123 Main St, Srinagar",
    paymentMethod: "cod",
    isPaid: false,
    status: "preparing",
    items: [
      {
        id: "item5",
        name: "Wazwan Special Platter",
        price: 800,
        quantity: 1,
      },
      {
        id: "item6",
        name: "Kashmiri Pulao",
        price: 200,
        quantity: 2,
      },
    ],
  },
  {
    orderId: "SHJ-2023-003",
    timestamp: Date.now() - 1200000, // 20 minutes ago
    customerName: "Arjun Kumar",
    customerPhone: "7654321098",
    orderType: "takeaway",
    paymentMethod: "upi",
    isPaid: true,
    status: "ready",
    items: [
      {
        id: "item8",
        name: "Tandoori Chicken",
        variants: [
          { size: "Half", price: 250 },
          { size: "Full", price: 450 },
        ],
        selectedVariant: "Full",
        quantity: 1,
      },
      {
        id: "item7",
        name: "Garlic Naan",
        price: 60,
        quantity: 2,
      },
    ],
  },
];

// Order status options
const ORDER_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready for Pickup/Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [printingOrder, setPrintingOrder] = useState(null);
  const printAreaRef = useRef(null);

  // In a real application, fetch orders from API
  useEffect(() => {
    // This would be replaced with an API call
    setOrders(SAMPLE_ORDERS);
  }, []);

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Handle payment status change
  const handlePaymentStatusChange = (orderId, isPaid) => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, isPaid } : order
      )
    );
  };

  // Get filtered orders
  const getFilteredOrders = () => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    const subtotal = order.items.reduce((total, item) => {
      const itemPrice =
        item.selectedVariant && item.variants
          ? item.variants.find((v) => v.size === item.selectedVariant)?.price ||
            item.price
          : item.price;
      return total + itemPrice * item.quantity;
    }, 0);

    // We're returning the menu price directly since it already includes GST
    return subtotal;
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentBadgeColor = (isPaid) => {
    return isPaid
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";
  };

  // Print function
  const printBill = (order) => {
    const printWindow = window.open("", "PRINT", "height=600,width=300");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${order.orderId}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: 80mm 297mm;
            margin: 0;
          }
          
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0;
            width: 80mm;
            color: black;
            background-color: white;
            font-size: 12px;
            line-height: 1.2;
          }
          
          .receipt {
            width: 76mm;
            margin: 0 auto;
            padding: 2mm;
          }
          
          .header {
            text-align: center;
            margin-bottom: 5mm;
          }
          
          .company-name {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 2mm;
          }
          
          .info-line {
            margin-bottom: 1mm;
          }
          
          .divider {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            padding: 2mm 0;
            margin: 3mm 0;
            font-weight: bold;
            text-align: center;
            font-size: 14px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            padding: 1mm 0;
            text-align: left;
          }
          
          th {
            font-weight: bold;
          }
          
          .right {
            text-align: right;
          }
          
          .item-table {
            margin: 3mm 0;
          }
          
          .item-header {
            border-bottom: 1px solid black;
            font-weight: bold;
            padding-bottom: 1mm;
            margin-bottom: 2mm;
          }
          
          .item-row td {
            padding-bottom: 1mm;
          }
          
          .total-section {
            margin-top: 3mm;
            border-top: 1px dashed black;
            padding-top: 2mm;
          }
          
          .total-row {
            font-weight: bold;
            border-top: 1px solid black;
            margin-top: 1mm;
            padding-top: 1mm;
          }
          
          .payment-status {
            border: 1px solid black;
            text-align: center;
            padding: 2mm 0;
            margin: 3mm 0;
            font-weight: bold;
            font-size: 14px;
          }
          
          .footer {
            text-align: center;
            margin-top: 5mm;
            font-size: 12px;
          }
          
          .footer p {
            margin: 1mm 0;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">SHEHJAR</div>
            <div class="info-line">Traditional Restaurant & Bakery</div>
            <div class="info-line">GSTIN: 01ABLFM0344H1ZO</div>
            <div class="info-line">Phone: 01933-250090</div>
          </div>
          
          <div class="divider">TAX INVOICE</div>
          
          <table>
            <tr>
              <td>Order #:</td>
              <td class="right">${order.orderId}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td class="right">${new Date(
                order.timestamp
              ).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Time:</td>
              <td class="right">${new Date(order.timestamp).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}</td>
            </tr>
            <tr>
              <td>Type:</td>
              <td class="right">
                ${
                  order.orderType === "dine-in"
                    ? `Table: ${order.tableNumber || "N/A"}`
                    : order.orderType === "takeaway"
                    ? "TAKEAWAY"
                    : "DELIVERY"
                }
              </td>
            </tr>
            ${
              order.customerName
                ? `
            <tr>
              <td>Customer:</td>
              <td class="right">${order.customerName}</td>
            </tr>`
                : ""
            }
            ${
              order.customerPhone
                ? `
            <tr>
              <td>Phone:</td>
              <td class="right">${order.customerPhone}</td>
            </tr>`
                : ""
            }
          </table>
          
          <div class="item-header">ITEMS</div>
          
          <table class="item-table">
            <tr>
              <th style="width: 50%">Item</th>
              <th class="right" style="width: 15%">Qty</th>
              <th class="right" style="width: 15%">Price</th>
              <th class="right" style="width: 20%">Amt</th>
            </tr>
            
            ${order.items
              .map((item) => {
                const priceWithGST = item.selectedVariant
                  ? item.variants?.find((v) => v.size === item.selectedVariant)
                      ?.price || item.price
                  : item.price;

                // Calculate base price without GST
                const basePrice = parseFloat((priceWithGST / 1.05).toFixed(2));
                const amount = parseFloat(
                  (basePrice * item.quantity).toFixed(2)
                );

                return `
              <tr class="item-row">
                <td>${item.name}${
                  item.selectedVariant ? ` (${item.selectedVariant})` : ""
                }</td>
                <td class="right">${item.quantity}</td>
                <td class="right">${basePrice}</td>
                <td class="right">${amount}</td>
              </tr>`;
              })
              .join("")}
          </table>
          
          ${(() => {
            // Calculate subtotal of base prices
            const subtotalWithGST = order.items.reduce((acc, item) => {
              const itemPriceWithGST = item.selectedVariant
                ? item.variants?.find((v) => v.size === item.selectedVariant)
                    ?.price || item.price
                : item.price;
              return acc + itemPriceWithGST * item.quantity;
            }, 0);

            // Calculate base price without GST
            const subtotal = parseFloat((subtotalWithGST / 1.05).toFixed(2));

            // Calculate GST
            const gstRate = 2.5; // 2.5% CGST and 2.5% SGST
            const cgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
            const sgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
            const total = parseFloat((subtotal + cgst + sgst).toFixed(2));

            return `
            <div class="total-section">
              <table>
                <tr>
                  <td>Subtotal:</td>
                  <td class="right">₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>CGST (${gstRate}%):</td>
                  <td class="right">₹${cgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>SGST (${gstRate}%):</td>
                  <td class="right">₹${sgst.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>Total:</td>
                  <td class="right">₹${total.toFixed(2)}</td>
                </tr>
              </table>
            </div>`;
          })()}
          
          <div class="payment-status">
            ${
              order.isPaid
                ? "PAID"
                : order.paymentMethod === "cod"
                ? "CASH ON DELIVERY"
                : "PAYMENT PENDING"
            }
          </div>
          
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Visit us again at Shehjar Restaurant.</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 500);
          }
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="w-full">
      {/* Global print styles */}
      <style jsx global>{`
        @media print {
          body * {
            display: none;
          }
          .print-bill,
          .print-bill * {
            display: block !important;
            visibility: visible !important;
          }
          .print-bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
          }
          @page {
            size: 80mm 297mm;
            margin: 0;
          }
        }
      `}</style>

      {printingOrder ? (
        <div className="print-bill" ref={printAreaRef}>
          <div
            style={{
              width: "58mm",
              margin: "0 auto",
              fontFamily: "monospace",
              fontSize: "8pt",
              lineHeight: "1.1",
              color: "#000",
              padding: "2mm",
              backgroundColor: "white",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2mm" }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  marginBottom: "1mm",
                }}
              >
                SHEHJAR
              </div>
              <div style={{ fontSize: "7pt" }}>
                Traditional Restaurant & Bakery
              </div>
              <div style={{ margin: "1mm 0", fontSize: "7pt" }}>
                GSTIN: 01ABLFM0344H1ZO
              </div>
              <div style={{ fontSize: "7pt" }}>Phone: 01933-250090</div>
              <div
                style={{
                  borderTop: "1px solid #000",
                  borderBottom: "1px solid #000",
                  margin: "2mm 0",
                  padding: "1mm 0",
                  fontWeight: "bold",
                  fontSize: "8pt",
                }}
              >
                TAX INVOICE
              </div>
            </div>

            {/* Order Info */}
            <div style={{ marginBottom: "2mm", fontSize: "7pt" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Order #:</span>
                <span>{printingOrder.orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Date:</span>
                <span>
                  {new Date(printingOrder.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Time:</span>
                <span>
                  {new Date(printingOrder.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Type:</span>
                <span>
                  {printingOrder.orderType === "dine-in" &&
                    `Table: ${printingOrder.tableNumber || "N/A"}`}
                  {printingOrder.orderType === "takeaway" && "TAKEAWAY"}
                  {printingOrder.orderType === "delivery" && `DELIVERY`}
                </span>
              </div>
              {printingOrder.customerName && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Customer:</span>
                  <span>{printingOrder.customerName}</span>
                </div>
              )}
              {printingOrder.customerPhone && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Phone:</span>
                  <span>{printingOrder.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: "2mm" }}>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  marginBottom: "1mm",
                  paddingBottom: "1mm",
                  fontWeight: "bold",
                  fontSize: "8pt",
                }}
              >
                ITEMS
              </div>
              <table
                style={{
                  width: "100%",
                  fontSize: "7pt",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #000" }}>
                    <th style={{ textAlign: "left", width: "50%" }}>Item</th>
                    <th style={{ textAlign: "right", width: "10%" }}>Qty</th>
                    <th style={{ textAlign: "right", width: "20%" }}>Price</th>
                    <th style={{ textAlign: "right", width: "20%" }}>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {printingOrder.items.map((item, index) => {
                    const priceWithGST = item.selectedVariant
                      ? item.variants.find(
                          (v) => v.size === item.selectedVariant
                        )?.price || item.price
                      : item.price;

                    // Calculate base price without GST
                    const basePrice = parseFloat(
                      (priceWithGST / 1.05).toFixed(2)
                    );
                    const amount = parseFloat(
                      (basePrice * item.quantity).toFixed(2)
                    );

                    return (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px dotted #666" }}
                      >
                        <td
                          style={{
                            textAlign: "left",
                            fontSize: "7pt",
                            paddingTop: "1mm",
                            paddingBottom: "1mm",
                          }}
                        >
                          {item.name}
                          {item.selectedVariant && ` (${item.selectedVariant})`}
                        </td>
                        <td style={{ textAlign: "right", fontSize: "7pt" }}>
                          {item.quantity}
                        </td>
                        <td style={{ textAlign: "right", fontSize: "7pt" }}>
                          {basePrice}
                        </td>
                        <td style={{ textAlign: "right", fontSize: "7pt" }}>
                          {amount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculation */}
            {(() => {
              // Calculate subtotal of base prices
              const subtotalWithGST = printingOrder.items.reduce(
                (acc, item) => {
                  const itemPriceWithGST = item.selectedVariant
                    ? item.variants.find((v) => v.size === item.selectedVariant)
                        ?.price || item.price
                    : item.price;
                  return acc + itemPriceWithGST * item.quantity;
                },
                0
              );

              // Calculate base price without GST
              const subtotal = parseFloat((subtotalWithGST / 1.05).toFixed(2));

              // Calculate GST
              const gstRate = 2.5; // 2.5% CGST and 2.5% SGST
              const cgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
              const sgst = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
              const total = parseFloat((subtotal + cgst + sgst).toFixed(2));

              return (
                <div style={{ marginBottom: "2mm", fontSize: "7pt" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>CGST ({gstRate}%):</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>SGST ({gstRate}%):</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      borderTop: "1px solid #000",
                      marginTop: "1mm",
                      paddingTop: "1mm",
                      fontSize: "8pt",
                    }}
                  >
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Payment Status */}
            <div
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "1mm 0",
                marginBottom: "2mm",
                fontWeight: "bold",
                fontSize: "8pt",
              }}
            >
              {printingOrder.isPaid
                ? "PAID"
                : printingOrder.paymentMethod === "cod"
                ? "CASH ON DELIVERY"
                : "PAYMENT PENDING"}
            </div>

            {/* GSTIN Info */}
            <div
              style={{
                marginBottom: "2mm",
                fontSize: "7pt",
                textAlign: "center",
              }}
            >
              <div>GSTIN: 01ABLFM0344H1ZO</div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", fontSize: "7pt" }}>
              <div style={{ marginBottom: "1mm" }}>
                Thank you for dining with us!
              </div>
              <div>Visit us again at Shehjar Restaurant.</div>
            </div>
          </div>
        </div>
      ) : null}

      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
        Orders Management
      </h1>

      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "all"
              ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          All Orders
        </button>
        {ORDER_STATUS.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === status.value
                ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Responsive Orders Table */}
      <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden border border-gray-800">
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block">
          <table className="w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {getFilteredOrders().map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(order.timestamp)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.customerName}
                    <div className="text-xs text-gray-500">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.orderType === "dine-in" &&
                      `Dine-in (Table ${order.tableNumber})`}
                    {order.orderType === "takeaway" && "Takeaway"}
                    {order.orderType === "delivery" && "Delivery"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    ₹{calculateOrderTotal(order).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className={`text-xs rounded-full px-2 py-1 font-semibold ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {ORDER_STATUS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full font-semibold ${getPaymentBadgeColor(
                          order.isPaid
                        )}`}
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                      <select
                        value={order.isPaid ? "paid" : "unpaid"}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.orderId,
                            e.target.value === "paid"
                          )
                        }
                        className="text-xs border rounded px-1 bg-gray-800 text-white border-gray-700"
                      >
                        <option value="unpaid">Mark Unpaid</option>
                        <option value="paid">Mark Paid</option>
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.paymentMethod}
                    </div>

                    {/* Direct print button in payment column */}
                    <button
                      onClick={() => printBill(order)}
                      className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-bold flex items-center justify-center"
                    >
                      🖨️ PRINT BILL
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[rgba(234,219,102,1)] hover:text-[rgba(234,219,102,0.8)] px-2 py-1 border border-[rgba(234,219,102,0.5)] rounded flex items-center justify-center w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Shown only on Mobile */}
        <div className="md:hidden">
          {getFilteredOrders().map((order) => (
            <div key={order.orderId} className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    {order.orderId}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formatDate(order.timestamp)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {ORDER_STATUS.find((s) => s.value === order.status)?.label ||
                    order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Customer</p>
                  <p className="text-gray-300">{order.customerName}</p>
                  <p className="text-gray-400 text-xs">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Order Type</p>
                  <p className="text-gray-300">
                    {order.orderType === "dine-in" &&
                      `Table ${order.tableNumber}`}
                    {order.orderType === "takeaway" && "Takeaway"}
                    {order.orderType === "delivery" && "Delivery"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Total</p>
                  <p className="text-gray-300">
                    ₹{calculateOrderTotal(order).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payment</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full font-semibold ${getPaymentBadgeColor(
                        order.isPaid
                      )}`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({order.paymentMethod})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.orderId, e.target.value)
                  }
                  className="w-full text-xs border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                >
                  {ORDER_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={order.isPaid ? "paid" : "unpaid"}
                  onChange={(e) =>
                    handlePaymentStatusChange(
                      order.orderId,
                      e.target.value === "paid"
                    )
                  }
                  className="w-full text-xs border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                >
                  <option value="unpaid">Mark Unpaid</option>
                  <option value="paid">Mark Paid</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => printBill(order)}
                    className="px-3 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all text-sm font-bold flex items-center justify-center"
                  >
                    🖨️ PRINT
                  </button>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 text-[rgba(234,219,102,1)] hover:text-[rgba(234,219,102,0.8)] border border-[rgba(234,219,102,0.5)] rounded flex items-center justify-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                  Order #{selectedOrder.orderId}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => printBill(selectedOrder)}
                    className="px-3 py-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded text-sm font-bold"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Customer Information
                  </h3>
                  <p className="mt-1 text-sm text-white">
                    {selectedOrder.customerName}
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {selectedOrder.customerPhone}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Order Information
                  </h3>
                  <p className="mt-1 text-sm text-white">
                    {formatDate(selectedOrder.timestamp)}
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {selectedOrder.orderType === "dine-in" &&
                      `Dine-in (Table ${selectedOrder.tableNumber})`}
                    {selectedOrder.orderType === "takeaway" && "Takeaway"}
                    {selectedOrder.orderType === "delivery" &&
                      `Delivery: ${selectedOrder.deliveryAddress}`}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400">
                  Order Items
                </h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedOrder.items.map((item, index) => {
                        const price =
                          item.selectedVariant && item.variants
                            ? item.variants.find(
                                (v) => v.size === item.selectedVariant
                              )?.price || item.price
                            : item.price;

                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-white">
                              {item.name}
                              {item.selectedVariant &&
                                ` (${item.selectedVariant})`}
                            </td>
                            <td className="px-4 py-2 text-sm text-white">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm text-white">
                              ₹{price}
                            </td>
                            <td className="px-4 py-2 text-sm text-white">
                              ₹{(price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-400">Subtotal</span>
                  <span className="text-white">
                    ₹
                    {selectedOrder.items
                      .reduce((total, item) => {
                        const price =
                          item.selectedVariant && item.variants
                            ? item.variants.find(
                                (v) => v.size === item.selectedVariant
                              )?.price || item.price
                            : item.price;
                        return total + price * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-medium text-gray-400">GST (5%)</span>
                  <span className="text-white">
                    ₹
                    {(
                      selectedOrder.items.reduce((total, item) => {
                        const price =
                          item.selectedVariant && item.variants
                            ? item.variants.find(
                                (v) => v.size === item.selectedVariant
                              )?.price || item.price
                            : item.price;
                        return total + price * item.quantity;
                      }, 0) * 0.05
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-3 font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">
                    ₹{calculateOrderTotal(selectedOrder).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.orderId, e.target.value)
                    }
                    className="text-xs border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                  >
                    {ORDER_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedOrder.isPaid ? "paid" : "unpaid"}
                    onChange={(e) =>
                      handlePaymentStatusChange(
                        selectedOrder.orderId,
                        e.target.value === "paid"
                      )
                    }
                    className="text-xs border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                  >
                    <option value="unpaid">Mark Unpaid</option>
                    <option value="paid">Mark Paid</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black rounded hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
