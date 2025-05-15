"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTableStatus,
  updateTableStatus,
  freeTable,
  getTableById,
  getTablesByFloor,
  resetAllTables,
  getAllTables,
  assignOrderToTable,
  markTableAvailable,
} from "../../services/tableService";
import { getOrders, getOrderById } from "../../services/orderService";
import { getFormattedPrice } from "../../admin/services/menuService";
import AdminLayout from "../components/AdminLayout";
import {
  FaChair,
  FaUtensils,
  FaClock,
  FaCheck,
  FaBellSlash,
} from "react-icons/fa";

export default function TableManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState({ mainFloor: [], topFloor: [] });
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeFloor, setActiveFloor] = useState("main");
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    items: [],
  });
  const [tableOrder, setTableOrder] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminUser = localStorage.getItem("adminAuth");
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);

      // Load table status
      const tablesData = getAllTables();
      setTables(tablesData);

      // Load orders
      const ordersData = getOrders();
      const activeOrders = ordersData.filter(
        (order) => order.status !== "completed" && order.status !== "cancelled"
      );
      setOrders(activeOrders);

      loadTables();
    }
    setIsLoading(false);
  }, [router]);

  const loadTables = () => {
    setIsLoading(true);
    const tablesData = getAllTables();
    setTables(tablesData);
    setIsLoading(false);
  };

  // Handle table selection
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setSelectedOrder(null);
    setShowOrderModal(true);
  };

  // Handle floor change
  const handleFloorChange = (floor) => {
    setActiveFloor(floor);
    setSelectedTable(null);
    setShowOrderModal(false);
  };

  // Get table status class
  const getTableStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-blue-500";
      case "completed":
        return "bg-purple-500";
      case "reserved":
        return "bg-purple-500";
      default:
        return "bg-gray-300";
    }
  };

  // Handle making a table available
  const handleFreeTable = (tableId) => {
    if (confirm("Are you sure you want to mark this table as available?")) {
      const success = markTableAvailable(tableId);
      if (success) {
        loadTables();
        setSelectedTable(null);
        setSelectedOrder(null);
      }
    }
  };

  // Get order associated with table
  const getTableOrder = (tableId) => {
    const table =
      tables.mainFloor.find((t) => t.id === tableId) ||
      tables.topFloor.find((t) => t.id === tableId);
    if (!table || !table.orderId) return null;

    return orders.find((order) => order.id === table.orderId) || null;
  };

  // Format order status
  const formatOrderStatus = (status) => {
    switch (status) {
      case "pendingApproval":
        return "Pending";
      case "approved":
        return "Approved";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const handleViewOrder = (orderId) => {
    if (orderId) {
      router.push(`/admin/orders/${orderId}`);
    }
  };

  const handleStatusChange = (tableId, newStatus) => {
    updateTableStatus(tableId, newStatus);
    loadTables();
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleResetAllTables = () => {
    if (confirm("Are you sure you want to reset all tables to available?")) {
      resetAllTables();
      loadTables();
      setSelectedTable(null);
    }
  };

  // Get the current tables based on active floor
  const currentTables =
    activeFloor === "main" ? tables.mainFloor : tables.topFloor;

  // Get status color based on table status
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-blue-500";
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status icon based on table status
  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <FaChair className="text-white" />;
      case "occupied":
        return <FaUtensils className="text-white" />;
      case "reserved":
        return <FaClock className="text-white" />;
      case "preparing":
        return <FaUtensils className="text-white animate-pulse" />;
      case "ready":
        return <FaCheck className="text-white" />;
      default:
        return <FaBellSlash className="text-white" />;
    }
  };

  // Handle order selection for assignment to table
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  // Assign selected order to selected table
  const handleAssignOrder = () => {
    if (!selectedTable || !selectedOrder) return;

    const success = assignOrderToTable(selectedTable.id, selectedOrder.id);
    if (success) {
      // Refresh table data
      const updatedTables = getAllTables();
      setTables(updatedTables);

      // Clear selections
      setSelectedTable(null);
      setSelectedOrder(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Table Management</h1>
          <div className="space-x-4">
            <button
              onClick={handleResetAllTables}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reset All Tables
            </button>
            <button
              onClick={loadTables}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Floor Selector */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 ${
              activeFloor === "main"
                ? "bg-amber-700 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-t-lg mr-2`}
            onClick={() => handleFloorChange("main")}
          >
            Main Floor (7 Tables)
          </button>
          <button
            className={`px-4 py-2 ${
              activeFloor === "top"
                ? "bg-amber-700 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-t-lg`}
            onClick={() => handleFloorChange("top")}
          >
            Top Floor (8 Tables)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Table Layout */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {activeFloor === "main"
                ? "Main Floor Layout"
                : "Top Floor Layout"}
            </h2>

            {isLoading ? (
              <p>Loading tables...</p>
            ) : (
              <div className="relative">
                {/* Main Floor Layout */}
                {activeFloor === "main" && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
                    {tables.mainFloor.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className={`
                          p-4 rounded-lg text-white font-bold
                          ${getTableStatusClass(table.status)}
                          ${
                            selectedTable?.id === table.id
                              ? "ring-4 ring-amber-400"
                              : ""
                          }
                          transition duration-200 transform hover:scale-105
                        `}
                      >
                        <div className="text-xl">{table.id}</div>
                        <div className="text-sm capitalize">{table.status}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Top Floor Layout */}
                {activeFloor === "top" && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
                    {tables.topFloor.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className={`
                          p-4 rounded-lg text-white font-bold
                          ${getTableStatusClass(table.status)}
                          ${
                            selectedTable?.id === table.id
                              ? "ring-4 ring-amber-400"
                              : ""
                          }
                          transition duration-200 transform hover:scale-105
                        `}
                      >
                        <div className="text-xl">{table.id}</div>
                        <div className="text-sm capitalize">{table.status}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table Details */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Table Details</h2>

            {selectedTable ? (
              <div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold">{selectedTable.id}</h3>
                  <p className="capitalize text-sm mb-2">
                    Status:{" "}
                    <span className="font-semibold">
                      {selectedTable.status}
                    </span>
                  </p>
                  <p className="text-sm mb-4">
                    Floor:{" "}
                    <span className="font-semibold capitalize">
                      {selectedTable.floor}
                    </span>
                  </p>

                  {selectedTable.orderId ? (
                    <p className="text-sm">
                      Associated Order:{" "}
                      <span className="font-semibold">
                        {selectedTable.orderId}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm italic">No active order</p>
                  )}
                </div>

                {/* Order details */}
                {selectedOrder && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm mb-1">
                        Status:{" "}
                        <span className="font-semibold capitalize">
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p className="text-sm mb-1">
                        Items:{" "}
                        <span className="font-semibold">
                          {selectedOrder.items.length}
                        </span>
                      </p>
                      <p className="text-sm mb-3">
                        Total:{" "}
                        <span className="font-semibold">
                          ₹{selectedOrder.totalAmount.toFixed(2)}
                        </span>
                      </p>
                      <button
                        onClick={() => handleViewOrder(selectedOrder.id)}
                        className="w-full bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition"
                      >
                        View Full Order
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedTable.id, "available")
                    }
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600`}
                    disabled={selectedTable.status === "available"}
                  >
                    Mark as Available
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Select a table to view details
              </p>
            )}
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Table Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Preparing</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
