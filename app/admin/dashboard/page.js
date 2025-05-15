"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import {
  getOrders,
  getOrdersByMonth,
  getOrderStats,
  generateOrderCSV,
  getRecentOrders,
  getRevenueData,
} from "../../services/orderService";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    cancelRate: 0,
  });

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminUser = localStorage.getItem("adminAuth");
    if (!adminUser) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);

      // Get current month name
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentMonth = months[new Date().getMonth()];
      setSelectedMonth(currentMonth);

      // Load order data
      loadOrderData(currentMonth);

      // Load recent orders and revenue data
      const recent = getRecentOrders(5);
      setRecentOrders(recent);

      const revenue = getRevenueData();
      setRevenueData(revenue);

      // If we have revenue data, use it to update our metrics
      if (revenue && Object.keys(revenue.monthlyData).length > 0) {
        // Get current month data
        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;

        if (revenue.monthlyData[currentMonthKey]) {
          const monthData = revenue.monthlyData[currentMonthKey];

          // Update summary metrics with real revenue data
          setSummaryMetrics((prev) => ({
            ...prev,
            totalOrders: monthData.orderCount || prev.totalOrders,
            totalRevenue: monthData.totalRevenue || prev.totalRevenue,
            averageOrderValue:
              monthData.orderCount > 0
                ? monthData.totalRevenue / monthData.orderCount
                : prev.averageOrderValue,
          }));

          // Update top selling items
          if (revenue.topItems && revenue.topItems.length > 0) {
            setTopSellingItems(
              revenue.topItems.map((item) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                quantity: item.totalQuantity,
                revenue: item.totalRevenue,
              }))
            );
          }
        }
      }
    }
    setIsLoading(false);
  }, [router]);

  // Load order data for the selected month
  const loadOrderData = (month) => {
    // Get orders for the selected month
    const monthOrders = getOrdersByMonth(month);
    setOrderData(monthOrders);

    // Get statistics
    const stats = getOrderStats(month);
    setSummaryMetrics({
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      averageOrderValue: stats.averageOrderValue,
      cancelRate: stats.cancelRate,
    });

    setTopSellingItems(stats.topSellingItems);
    setCategoryRevenue(stats.revenueByCategory);
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    loadOrderData(month);
  };

  // Function to export data to CSV
  const exportToCSV = () => {
    // Generate CSV content
    const csv = generateOrderCSV(orderData);

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedMonth}_Orders.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <main className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Sales analytics and order insights for {selectedMonth}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Export {selectedMonth} Data
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Total Orders
              </h3>
              <div className="text-3xl font-bold text-white mb-2">
                {summaryMetrics.totalOrders}
              </div>
              <div className="text-[rgba(234,219,102,1)]">This month</div>
            </div>
            <div className="h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"></div>
          </div>

          <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Total Revenue
              </h3>
              <div className="text-3xl font-bold text-white mb-2">
                ₹{summaryMetrics.totalRevenue.toFixed(2)}
              </div>
              <div className="text-[rgba(234,219,102,1)]">Inc. 18% GST</div>
            </div>
            <div className="h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"></div>
          </div>

          <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Average Order
              </h3>
              <div className="text-3xl font-bold text-white mb-2">
                ₹{summaryMetrics.averageOrderValue.toFixed(2)}
              </div>
              <div className="text-[rgba(234,219,102,1)]">Per order value</div>
            </div>
            <div className="h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"></div>
          </div>

          <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">
                Cancellation Rate
              </h3>
              <div className="text-3xl font-bold text-white mb-2">
                {summaryMetrics.cancelRate.toFixed(1)}%
              </div>
              <div className="text-[rgba(234,219,102,1)]">
                Order cancellations
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]"></div>
          </div>
        </div>

        {/* Category Revenue */}
        <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Revenue by Category
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-gray-400">Category</th>
                  <th className="pb-3 text-gray-400 text-right">Revenue</th>
                  <th className="pb-3 text-gray-400 text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {categoryRevenue.map((category, index) => (
                  <tr
                    key={category.category}
                    className="border-b border-gray-800"
                  >
                    <td className="py-3 font-medium">{category.category}</td>
                    <td className="py-3 text-right text-[rgba(234,219,102,1)]">
                      ₹{category.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      {(
                        (category.revenue / summaryMetrics.totalRevenue) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Top Selling Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-gray-400">Item</th>
                  <th className="pb-3 text-gray-400">Category</th>
                  <th className="pb-3 text-gray-400 text-right">
                    Quantity Sold
                  </th>
                  <th className="pb-3 text-gray-400 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-gray-400">{item.category}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right text-[rgba(234,219,102,1)]">
                      ₹{item.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 border border-[rgba(182,155,76,0.3)] shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Recent Orders
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-gray-400">Order ID</th>
                  <th className="pb-3 text-gray-400">Date</th>
                  <th className="pb-3 text-gray-400">Items</th>
                  <th className="pb-3 text-gray-400 text-right">Total</th>
                  <th className="pb-3 text-gray-400 text-center">Status</th>
                  <th className="pb-3 text-gray-400">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-800 hover:bg-gray-900/50"
                  >
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right text-[rgba(234,219,102,1)]">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {order.paymentMethod || "Cash"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Replace the conditional export button with a link to orders page */}
          <div className="mt-4 text-center">
            <Link
              href="/admin/orders"
              className="text-[rgba(234,219,102,1)] hover:underline text-sm"
            >
              View All Orders →
            </Link>
          </div>
        </div>

        {/* Monthly Reports Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Monthly Reports
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ].map((month) => (
              <div
                key={month}
                className={`dish-card p-6 rounded-lg hover-lift cursor-pointer ${
                  month === selectedMonth
                    ? "border-2 border-[rgba(234,219,102,0.5)]"
                    : ""
                }`}
                onClick={() => setSelectedMonth(month)}
              >
                <h3 className="font-medium mb-2">{month} 2023</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {month === selectedMonth ? "Current View" : "Click to View"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMonth(month);
                      setTimeout(() => exportToCSV(), 100);
                    }}
                    className="text-xs px-2 py-1 bg-gray-800 rounded-md text-gray-300 hover:bg-gray-700"
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
