"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export default function AdminLogin() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If they’re already signed in, send to /admin
  useEffect(() => {
    if (session) {
      router.replace("/admin/orders");
    }
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
    } else {
      // on success, session is set and effect above will redirect
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-3xl text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-800 text-red-200 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2 text-gray-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 bg-gray-800 text-white rounded"
        />

        <label className="block mb-2 text-gray-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 bg-gray-800 text-white rounded"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded font-bold"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
