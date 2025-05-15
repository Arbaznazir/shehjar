"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { isAuthenticated, logout } from "./services/authService";
import Image from "next/image";

export default function AdminDashboard() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState({
    total: 0,
    pendingApproval: 0,
    pendingPayment: 0,
    approved: 0,
    completed: 0,
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Use replace instead of push to prevent back button issues
      router.replace("/admin/login");
    } else {
      setIsUserAuthenticated(true);
    }
    setIsLoading(false);

    // Load notifications and order stats
    const loadDashboardData = () => {
      try {
        // Load notifications
        const notificationsData = localStorage.getItem("adminNotifications");
        if (notificationsData) {
          const parsedNotifications = JSON.parse(notificationsData);
          setNotifications(
            parsedNotifications.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        }

        // Load orders for stats
        const ordersData = localStorage.getItem("shehjarOrders");
        if (ordersData) {
          const parsedOrders = JSON.parse(ordersData);

          // Calculate stats
          const stats = {
            total: parsedOrders.length,
            pendingApproval: parsedOrders.filter(
              (o) => o.status === "pendingApproval"
            ).length,
            pendingPayment: parsedOrders.filter(
              (o) => o.status === "pendingPayment"
            ).length,
            approved: parsedOrders.filter((o) =>
              ["approved", "preparing", "ready"].includes(o.status)
            ).length,
            completed: parsedOrders.filter((o) => o.status === "completed")
              .length,
          };

          setOrders(stats);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));

    setNotifications(updatedNotifications);
    localStorage.setItem(
      "adminNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "newOrder":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-900/30 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your restaurant's menu and content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/dashboard"
            className="dish-card p-6 rounded-lg hover-lift"
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Analytics Dashboard
            </h2>
            <p className="text-gray-400 mb-4">
              View sales data, orders, and export monthly reports.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </Link>

          <Link
            href="/admin/table-manager"
            className="dish-card p-6 rounded-lg hover-lift"
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Table Manager
            </h2>
            <p className="text-gray-400 mb-4">
              Monitor active tables, orders, and payment status.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </Link>

          <Link
            href="/admin/menu-manager"
            className="dish-card p-6 rounded-lg hover-lift"
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Menu Manager
            </h2>
            <p className="text-gray-400 mb-4">
              Add, edit, or remove menu items and categories.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </Link>

          <Link
            href="/admin/settings"
            className="dish-card p-6 rounded-lg hover-lift"
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Settings
            </h2>
            <p className="text-gray-400 mb-4">
              Configure GST rates, discounts, and global settings.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </Link>

          <Link
            href="/admin/image-uploader"
            className="dish-card p-6 rounded-lg hover-lift"
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Image Uploader
            </h2>
            <p className="text-gray-400 mb-4">
              Upload and manage images for menu items.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </Link>

          <div
            className="dish-card p-6 rounded-lg hover-lift cursor-pointer"
            onClick={handleLogout}
          >
            <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Logout
            </h2>
            <p className="text-gray-400 mb-4">
              Sign out from the admin dashboard.
            </p>
            <div className="bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] h-1 w-16 rounded-full"></div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Total Orders</div>
              <div className="text-2xl font-bold">{orders.total}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Pending Approval</div>
              <div className="text-2xl font-bold text-yellow-500">
                {orders.pendingApproval}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Pending Payment</div>
              <div className="text-2xl font-bold text-purple-500">
                {orders.pendingPayment}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-blue-500">
                {orders.approved}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/admin/orders" className="block">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:bg-gray-800 transition-colors h-full">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Manage Orders</h3>
                    <p className="text-sm text-gray-400">
                      View and process customer orders
                    </p>
                  </div>
                </div>
                {(orders.pendingApproval > 0 || orders.pendingPayment > 0) && (
                  <div className="mt-4 bg-blue-900/20 p-2 rounded text-sm">
                    <span className="text-blue-400">
                      {orders.pendingApproval + orders.pendingPayment} order(s)
                      need attention
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <Link href="/menu" className="block">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:bg-gray-800 transition-colors h-full">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Menu Editor</h3>
                    <p className="text-sm text-gray-400">
                      Update menu items and prices
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
            Notifications
          </h2>
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-500 rounded-full text-xs">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-gray-400 hover:text-[rgba(234,219,102,1)]"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="p-2 max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-12 h-12 text-gray-600 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="mt-2 text-gray-400 text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={
                        notification.type === "newOrder"
                          ? `/admin/orders`
                          : "/admin"
                      }
                      className={`block p-3 rounded-md ${
                        notification.read
                          ? "bg-gray-900 hover:bg-gray-800"
                          : "bg-blue-900/20 hover:bg-blue-900/30"
                      }`}
                    >
                      <div className="flex">
                        {getNotificationIcon(notification.type)}
                        <div className="ml-3">
                          <p
                            className={`text-sm ${
                              notification.read
                                ? "text-gray-300"
                                : "text-white font-medium"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
