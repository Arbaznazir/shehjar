"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import OrderBill from "../../components/OrderBill";
import ClassicBill from "../../components/ClassicBill";
import { getFormattedPrice } from "../services/menuService"; // adjusted import path

// SWR fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

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
  // 1. Fetch real orders every 5 seconds
  const { data: orders = [], mutate } = useSWR("/api/orders", fetcher, {
    refreshInterval: 5000,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [printingOrder, setPrintingOrder] = useState(null);
  const printAreaRef = useRef(null);

  // 2. Inline update helpers
  const handleStatusChange = async (orderId, newStatus) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    mutate();
  };

  const handlePaymentStatusChange = async (orderId, isPaid) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid }),
    });
    mutate();
  };

  // 3. Filtering
  const getFilteredOrders = () =>
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // 4. Utility functions (unchanged)
  const calculateOrderTotal = (order) =>
    order.items.reduce((sum, item) => {
      const price =
        item.selectedVariant && item.variants
          ? item.variants.find((v) => v.size === item.selectedVariant)?.price ||
            item.price
          : item.price;
      return sum + price * item.quantity;
    }, 0);

  const formatDate = (ts) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const getStatusBadgeColor = (s) =>
    ({
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }[s] || "bg-gray-100 text-gray-800");

  const getPaymentBadgeColor = (paid) =>
    paid ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800";

  // 5. Print helper (unchanged)
  const printBill = (order) => {
    const w = window.open("", "PRINT", "height=600,width=300");
    w.document.write(`<!DOCTYPE html><html>…</html>`); // your existing template
    w.document.close();
  };

  return (
    <div className="w-full">
      {/* Print styles */}
      <style jsx global>{`
        /* your @media print CSS */
      `}</style>

      {/* Print preview */}
      {printingOrder && (
        <div className="print-bill" ref={printAreaRef}>
          {/* … */}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
        Orders Management
      </h1>

      {/* Filters */}
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
        {ORDER_STATUS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === s.value
                ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden border border-gray-800">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">…</thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {getFilteredOrders().map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-800">
                  <td className="px-4 py-4 text-gray-300">{order.order_id}</td>
                  <td className="px-4 py-4 text-gray-400">
                    {formatDate(order.timestamp)}
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {order.customer_name}
                    <div className="text-xs text-gray-500">
                      {order.customer_phone}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {order.order_type}
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    ₹{calculateOrderTotal(order).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                      className={`text-xs rounded-full px-2 py-1 font-semibold ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {ORDER_STATUS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full font-semibold ${getPaymentBadgeColor(
                          order.is_paid
                        )}`}
                      >
                        {order.is_paid ? "Paid" : "Unpaid"}
                      </span>
                      <select
                        value={order.is_paid ? "paid" : "unpaid"}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.order_id,
                            e.target.value === "paid"
                          )
                        }
                        className="text-xs border rounded px-1 bg-gray-800 text-white border-gray-700"
                      >
                        <option value="unpaid">Mark Unpaid</option>
                        <option value="paid">Mark Paid</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => setSelectedOrder(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view… same idea, use getFilteredOrders() etc. */}
      </div>

      {/* Details Modal… */}
      {selectedOrder && (
        <div>…your existing modal code, using selectedOrder…</div>
      )}
    </div>
  );
}
