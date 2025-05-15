"use client";

import React from "react";

// Main TableFloorPlan component
const TableFloorPlan = ({
  tables,
  activeFloor = "mainFloor",
  onTableClick,
  selectedTable = null,
  activeOrders = [],
}) => {
  // Filter tables based on the active floor
  const floorTables = tables.filter((table) => table.location === activeFloor);

  // Get color based on table status
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-emerald-700 to-emerald-600";
      case "occupied":
        return "bg-gradient-to-r from-red-700 to-red-600";
      case "reserved":
        return "bg-gradient-to-r from-blue-700 to-blue-600";
      case "preparing":
        return "bg-gradient-to-r from-amber-700 to-amber-600";
      case "ready":
        return "bg-gradient-to-r from-purple-700 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-700 to-gray-600";
    }
  };

  // Get order for a table
  const getTableOrder = (tableId) => {
    return activeOrders.find((order) => order.table === tableId);
  };

  return (
    <div className="bg-black/90 rounded-lg p-6 mb-8 border border-[rgba(182,155,76,0.3)] shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
        {activeFloor === "mainFloor" ? "Main Floor" : "Top Floor"} Layout
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {floorTables.map((table) => {
          const order = getTableOrder(table.id);
          const isSelected = selectedTable === table.id;

          return (
            <div
              key={table.id}
              className={`dish-card transition-all rounded-md overflow-hidden shadow-md hover:shadow-[rgba(234,219,102,0.2)] transform hover:scale-[1.02] transition-all duration-300 ${
                isSelected ? "ring-2 ring-[rgba(234,219,102,1)] shadow-lg" : ""
              }`}
              onClick={() => onTableClick(table)}
            >
              <div className={`${getStatusColor(table.status)} p-3 text-white`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{table.name}</span>
                </div>
                <div className="text-xs mt-1 capitalize">{table.status}</div>
              </div>

              <div className="p-3 bg-gray-900 border-t border-gray-800">
                {order ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-400">
                        Order ID:
                      </span>
                      <span className="font-mono text-white">
                        {order.id.substring(0, 8)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-400">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          order.status === "pending"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : order.status === "preparing"
                            ? "bg-blue-900/50 text-blue-400"
                            : order.status === "served"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-400">Items:</span>
                      <span className="text-white">
                        {order.items?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-[rgba(234,219,102,1)]">
                        ₹{order.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm text-center py-2">
                    No active order
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-emerald-600 mr-2"></div>
          <span className="text-sm text-gray-300">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
          <span className="text-sm text-gray-300">Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          <span className="text-sm text-gray-300">Reserved</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-amber-600 mr-2"></div>
          <span className="text-sm text-gray-300">Preparing</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
          <span className="text-sm text-gray-300">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default TableFloorPlan;
