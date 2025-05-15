"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { isAuthenticated, login } from "../../services/authService";

// pull in the env vars defined in .env.local
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // if already logged in, go straight to /admin
  useEffect(() => {
    if (isAuthenticated()) router.push("/admin");
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      login(username);
      router.push("/admin");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
              Admin Login
            </h1>
            <p className="text-gray-400">
              Sign in to access the restaurant management dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="dish-card p-8 rounded-lg">
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
