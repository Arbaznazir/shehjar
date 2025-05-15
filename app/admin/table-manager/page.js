"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { DataTable, SectionTitle } from "../components/DashboardCharts";
import {
  DashboardCard,
  ChartCard,
  StatsGrid,
} from "../components/DashboardCard";
import {
  getAllTables,
  getActiveOrders,
  updateOrderPayment,
  updateTableStatus,
  updateTableCapacity,
} from "../services/tableService";
import TableFloorPlan from "./TableFloorPlan";

export default function TableManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeFloor, setActiveFloor] = useState("mainFloor"); // "mainFloor" or "topFloor"
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tableDetails, setTableDetails] = useState(null);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [newCapacity, setNewCapacity] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminUser = localStorage.getItem("adminAuth");
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);

      // Fetch tables and orders from our service
      const allTables = getAllTables();
      setTables(allTables);

      const orders = getActiveOrders();
      setActiveOrders(orders);
    }
    setIsLoading(false);
  }, [router]);

  // Refresh data
  const refreshData = () => {
    const allTables = getAllTables();
    const orders = getActiveOrders();

    setTables(allTables);
    setActiveOrders(orders);

    if (selectedTable) {
      const updatedTable = allTables.find((t) => t.id === selectedTable);
      setTableDetails(updatedTable);
    }
  };

  useEffect(() => {
    refreshData();

    // Refresh data every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle table click
  const handleTableClick = (table) => {
    setSelectedTable(table.id);
    setTableDetails(table);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (selectedTable && tableDetails) {
      updateTableStatus(selectedTable, newStatus);
      refreshData();
    }
  };

  // Handle marking order as paid
  const handlePayment = (orderId) => {
    if (!orderId || !paymentMethod) return;

    updateOrderPayment(orderId, "completed", paymentMethod);
    refreshData();
    setShowOrderDetails(false);
    setSelectedTable(null);
    setSelectedOrder(null);
  };

  // Handle editing table capacity
  const handleEditCapacity = () => {
    if (isEditingCapacity) {
      // If already editing, cancel
      setIsEditingCapacity(false);
      setNewCapacity("");
    } else {
      // Start editing with current capacity
      setNewCapacity(tableDetails.capacity);
      setIsEditingCapacity(true);
    }
  };

  // Handle saving capacity changes
  const handleSaveCapacity = () => {
    if (!selectedTable || !newCapacity) return;

    // Validate input
    const capacityValue = parseInt(newCapacity, 10);
    if (isNaN(capacityValue) || capacityValue < 1 || capacityValue > 20) {
      alert("Please enter a valid capacity between 1 and 20");
      return;
    }

    // Update capacity
    updateTableCapacity(selectedTable, capacityValue);
    setIsEditingCapacity(false);
    refreshData();
  };

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      occupied: tables.filter((t) => t.status === "occupied").length,
      available: tables.filter((t) => t.status === "available").length,
      reserved: tables.filter((t) => t.status === "reserved").length,
      total: tables.length,
    };
    return counts;
  };

  const stats = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[rgba(182,155,76,0.3)] border-t-[rgba(234,219,102,1)]"></div>
          <div className="mt-4 text-[rgba(234,219,102,1)] text-lg font-semibold">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white pt-16 md:pt-20">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Table Management
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.3)] rounded mt-2"></div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={refreshData}
              className="px-3 py-1.5 bg-gray-800 text-[rgba(234,219,102,1)] border border-[rgba(182,155,76,0.5)] rounded-md shadow-md hover:bg-gray-700 hover:shadow-lg hover:shadow-[rgba(234,219,102,0.2)] transition-all"
            >
              Refresh Data
            </button>
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 bg-black/60 text-gray-300 rounded-md shadow-sm hover:bg-black/80 hover:text-white transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/80 rounded-lg p-5 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 font-medium">Total Tables</span>
              <div className="p-2 rounded-full bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[rgba(234,219,102,1)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>

          <div className="bg-emerald-900/70 rounded-lg p-5 border border-emerald-800/50 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-300 font-medium">Available</span>
              <div className="p-2 rounded-full bg-emerald-800/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.available}
            </div>
          </div>

          <div className="bg-red-900/70 rounded-lg p-5 border border-red-800/50 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-300 font-medium">Occupied</span>
              <div className="p-2 rounded-full bg-red-800/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292V12H5.999A7 7 0 0112 4.354z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292V12h6a7 7 0 01-6-7.646z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.occupied}
            </div>
          </div>

          <div className="bg-blue-900/70 rounded-lg p-5 border border-blue-800/50 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-300 font-medium">Reserved</span>
              <div className="p-2 rounded-full bg-blue-800/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.reserved}
            </div>
          </div>
        </div>

        {/* Floor Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                activeFloor === "mainFloor"
                  ? "bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black font-bold"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveFloor("mainFloor")}
            >
              Main Floor
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                activeFloor === "topFloor"
                  ? "bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black font-bold"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveFloor("topFloor")}
            >
              Top Floor
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Floor Plan */}
          <div className="lg:col-span-2">
            <TableFloorPlan
              tables={tables}
              activeFloor={activeFloor}
              onTableClick={handleTableClick}
              selectedTable={selectedTable}
              activeOrders={activeOrders}
            />
          </div>

          {/* Table Details / Order Management */}
          <div className="bg-black/90 p-6 rounded-lg shadow-md h-fit border border-[rgba(182,155,76,0.3)]">
            {tableDetails ? (
              <div>
                <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                  Table Details
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-semibold text-gray-300">Table:</span>
                    <span className="text-white">{tableDetails.name}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-semibold text-gray-300">
                      Capacity:
                    </span>
                    {isEditingCapacity ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={newCapacity}
                          onChange={(e) => setNewCapacity(e.target.value)}
                          className="w-16 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-right"
                        />
                        <div className="flex space-x-1">
                          <button
                            onClick={handleSaveCapacity}
                            className="p-1 bg-emerald-800 text-emerald-200 rounded hover:bg-emerald-700 transition-colors"
                            title="Save"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleEditCapacity}
                            className="p-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                            title="Cancel"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
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
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-white">
                          {tableDetails.capacity} persons
                        </span>
                        <button
                          onClick={handleEditCapacity}
                          className="p-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 hover:text-[rgba(234,219,102,1)] transition-colors"
                          title="Edit Capacity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-semibold text-gray-300">
                      Section:
                    </span>
                    <span className="text-white">{tableDetails.section}</span>
                  </div>

                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="font-semibold text-gray-300">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tableDetails.status === "available"
                          ? "bg-emerald-900/60 text-emerald-400"
                          : tableDetails.status === "occupied"
                          ? "bg-red-900/60 text-red-400"
                          : tableDetails.status === "reserved"
                          ? "bg-blue-900/60 text-blue-400"
                          : tableDetails.status === "preparing"
                          ? "bg-amber-900/60 text-amber-400"
                          : "bg-purple-900/60 text-purple-400"
                      }`}
                    >
                      {tableDetails.status}
                    </span>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-gray-300">
                    Change Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-md text-sm hover:opacity-90 transition-all"
                      onClick={() => handleStatusChange("available")}
                      disabled={tableDetails.status === "available"}
                    >
                      Available
                    </button>
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-md text-sm hover:opacity-90 transition-all"
                      onClick={() => handleStatusChange("occupied")}
                      disabled={tableDetails.status === "occupied"}
                    >
                      Occupied
                    </button>
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-md text-sm hover:opacity-90 transition-all"
                      onClick={() => handleStatusChange("reserved")}
                      disabled={tableDetails.status === "reserved"}
                    >
                      Reserved
                    </button>
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-md text-sm hover:opacity-90 transition-all"
                      onClick={() => handleStatusChange("preparing")}
                      disabled={tableDetails.status === "preparing"}
                    >
                      Preparing
                    </button>
                    <button
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-md text-sm hover:opacity-90 transition-all"
                      onClick={() => handleStatusChange("ready")}
                      disabled={tableDetails.status === "ready"}
                    >
                      Ready
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder && (
                  <div className="border-t border-gray-800 pt-4">
                    <h3 className="font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                      Order Details
                    </h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Order ID:</span>
                        <span className="font-mono text-white">
                          {selectedOrder.id.substring(0, 8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className="capitalize text-white">
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Items:</span>
                        <span className="text-white">
                          {selectedOrder.items.length}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-300">Total:</span>
                        <span className="text-[rgba(234,219,102,1)]">
                          ₹{selectedOrder.total?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="border-t border-gray-800 pt-4">
                      <h3 className="font-semibold mb-2 text-gray-300">
                        Process Payment
                      </h3>
                      <div className="flex flex-col space-y-4">
                        <select
                          className="p-2 bg-gray-900 border border-gray-800 rounded-md text-white"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="upi">UPI</option>
                          <option value="wallet">Digital Wallet</option>
                        </select>

                        <button
                          className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black font-semibold rounded-md hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all shadow-md"
                          onClick={() => handlePayment(selectedOrder.id)}
                        >
                          Complete Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 mb-2">
                  Select a table to view details
                </p>
                <p className="text-gray-500 text-sm">
                  Click on any table from the floor plan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
