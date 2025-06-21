"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { getFormattedPrice } from "../services/menuService";
import {
  getOrderHistory,
  clearOrderHistory,
  searchOrderHistory,
  getOrderStatistics,
  createReorderItems,
  getOrderTemplates,
  saveOrderAsTemplate,
  deleteOrderTemplate,
  updateTemplateUsage,
  getPopularTemplates,
  searchOrderTemplates,
  getOrderFrequencyAnalysis,
} from "../services/orderHistoryService";

const OrderHistory = ({ isOpen, onClose }) => {
  const { addToCart, cartItems, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState("history"); // history, templates, analytics
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderTemplates, setOrderTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [frequencyAnalysis, setFrequencyAnalysis] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadOrderHistory();
    loadOrderTemplates();
    loadStatistics();
    loadFrequencyAnalysis();
  }, []);

  // Filter orders and templates when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredOrders(searchOrderHistory(searchTerm));
      setFilteredTemplates(searchOrderTemplates(searchTerm));
    } else {
      setFilteredOrders(orderHistory);
      setFilteredTemplates(orderTemplates);
    }
  }, [searchTerm, orderHistory, orderTemplates]);

  const loadOrderHistory = () => {
    const history = getOrderHistory();
    setOrderHistory(history);
    setFilteredOrders(history);
  };

  const loadOrderTemplates = () => {
    const templates = getOrderTemplates();
    setOrderTemplates(templates);
    setFilteredTemplates(templates);
  };

  const loadStatistics = () => {
    const stats = getOrderStatistics();
    setStatistics(stats);
  };

  const loadFrequencyAnalysis = () => {
    const analysis = getOrderFrequencyAnalysis();
    setFrequencyAnalysis(analysis);
  };

  const handleReorder = (order) => {
    const reorderItems = createReorderItems(order);

    // Clear current cart and add all items from the order
    clearCart();
    reorderItems.forEach((item) => {
      addToCart(item, item.quantity, item.selectedVariant);
    });

    onClose();
  };

  const handleUseTemplate = (template) => {
    updateTemplateUsage(template.id);

    // Clear current cart and add all items from the template
    clearCart();
    template.items.forEach((item) => {
      addToCart(item, item.quantity, item.selectedVariant);
    });

    loadOrderTemplates(); // Refresh to show updated usage
    onClose();
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    const currentOrder = {
      items: cartItems,
      total: cartItems.reduce((sum, item) => {
        const price =
          item.selectedVariant && item.variants
            ? item.variants.find((v) => v.size === item.selectedVariant)
                ?.price || item.price
            : item.price;
        return sum + price * item.quantity;
      }, 0),
    };

    const template = saveOrderAsTemplate(
      currentOrder,
      templateName,
      templateDescription
    );
    if (template) {
      loadOrderTemplates();
      setShowTemplateModal(false);
      setTemplateName("");
      setTemplateDescription("");
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteOrderTemplate(templateId);
      loadOrderTemplates();
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all order history? This cannot be undone."
      )
    ) {
      clearOrderHistory();
      loadOrderHistory();
      loadStatistics();
      loadFrequencyAnalysis();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-[rgba(234,219,102,1)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Order History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "text-[rgba(234,219,102,1)] border-b-2 border-[rgba(234,219,102,1)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Past Orders ({orderHistory.length})
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "templates"
                ? "text-[rgba(234,219,102,1)] border-b-2 border-[rgba(234,219,102,1)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Templates ({orderTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "analytics"
                ? "text-[rgba(234,219,102,1)] border-b-2 border-[rgba(234,219,102,1)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Search Bar */}
        {(activeTab === "history" || activeTab === "templates") && (
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[rgba(234,219,102,1)]"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "history" && (
            <div>
              {/* Action Buttons */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  {cartItems.length > 0 && (
                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      Save as Template
                    </button>
                  )}
                </div>
                {orderHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {/* Order History List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No orders match your search criteria"
                      : "Your order history will appear here after you place orders"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-white">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatDate(order.completedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">
                            {getFormattedPrice(order.total)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleReorder(order)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg hover:opacity-90 transition-all font-medium"
                      >
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "templates" && (
            <div>
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    No Templates Found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No templates match your search criteria"
                      : "Save your favorite orders as templates for quick reordering"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-white">
                            {template.name}
                          </h3>
                          {template.description && (
                            <p className="text-sm text-gray-400 mt-1">
                              {template.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between text-sm text-gray-400 mb-3">
                        <span>{template.totalItems} items</span>
                        <span>
                          {getFormattedPrice(template.estimatedTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Used {template.useCount} times</span>
                        <span>Created {formatDate(template.createdAt)}</span>
                      </div>

                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && statistics && (
            <div className="space-y-6">
              {/* Order Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(234,219,102,1)]">
                      {statistics.totalOrders}
                    </div>
                    <div className="text-sm text-gray-400">Total Orders</div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {getFormattedPrice(statistics.totalSpent)}
                    </div>
                    <div className="text-sm text-gray-400">Total Spent</div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {getFormattedPrice(statistics.averageOrderValue)}
                    </div>
                    <div className="text-sm text-gray-400">Avg Order Value</div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {statistics.favoriteCategory || "N/A"}
                    </div>
                    <div className="text-sm text-gray-400">
                      Favorite Category
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequency Analysis */}
              {frequencyAnalysis && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Order Frequency
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">
                        {frequencyAnalysis.averageOrdersPerWeek.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Orders per Week
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-400">
                        {frequencyAnalysis.averageOrdersPerMonth.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Orders per Month
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-300">
                        {frequencyAnalysis.peakOrderDay
                          ? new Date(
                              frequencyAnalysis.peakOrderDay
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div className="text-sm text-gray-400">
                        Peak Order Day
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Favorite Item */}
              {statistics.mostOrderedItem && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Most Ordered Item
                  </h3>
                  <p className="text-[rgba(234,219,102,1)] font-medium">
                    {statistics.mostOrderedItem}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">
              Save as Template
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Usual Order"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[rgba(234,219,102,1)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="e.g., Perfect for lunch break"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[rgba(234,219,102,1)]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
