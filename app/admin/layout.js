"use client";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Admin layout that applies to all admin pages
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Add print script to enable printing functionality
  useEffect(() => {
    // Ensure print functionality works
    if (typeof window !== "undefined") {
      console.log("Admin layout loaded - print functionality available");

      // Close sidebar by default on mobile
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };

      // Initial check
      handleResize();

      // Listen for window resize
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Menu items for admin sidebar
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Orders", href: "/admin/orders", icon: "📋" },
    { label: "Tables", href: "/admin/table-manager", icon: "🪑" },
    { label: "Menu", href: "/admin/menu-manager", icon: "🍽️" },
    { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
    { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-full shadow-lg border border-gray-700 focus:outline-none"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Admin Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-black border-r border-gray-800 min-h-screen fixed z-40 transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/images/Shehjar Logo.png"
              alt="Shehjar Logo"
              className="h-16 w-16"
            />
          </Link>
          <div className="text-center mt-2">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Admin Panel
            </h1>
            <div className="text-xs text-gray-400">Manage your restaurant</div>
          </div>
        </div>

        <nav className="mt-6 overflow-y-auto max-h-[calc(100vh-220px)]">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-900 hover:text-[rgba(234,219,102,1)] transition-colors ${
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                      ? "bg-gray-900 text-[rgba(234,219,102,1)] border-l-4 border-[rgba(234,219,102,1)] pl-5"
                      : ""
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <Link
            href="/"
            className="flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm"
          >
            <span className="mr-2">🏠</span>
            Return to Website
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out flex-1 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
