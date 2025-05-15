"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background elements - decorative spices and utensils */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="animate-float-slow absolute top-[10%] left-[5%] w-20 h-20 rounded-full border border-[rgba(182,155,76,0.3)]"></div>
        <div className="animate-float-medium absolute top-[30%] right-[15%] w-32 h-32 rounded-full border border-[rgba(234,219,102,0.5)]"></div>
        <div className="animate-float-fast absolute bottom-[20%] left-[25%] w-24 h-24 rounded-full border border-[rgba(182,155,76,0.4)]"></div>
      </div>

      {/* Logo */}
      <div className="mb-8 animate-float">
        <Image
          src="/images/Shehjar Logo.png"
          alt="Shehjar Logo"
          width={120}
          height={120}
          className="rounded-full border-4 border-[rgba(234,219,102,0.5)] shadow-gold"
        />
      </div>

      {/* 404 Text */}
      <h1 className="text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
        404
      </h1>

      {/* Message */}
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white text-center">
        This dish isn't on our menu
      </h2>

      <p className="text-gray-400 text-center max-w-md mb-8">
        The page you're looking for has wandered off from our restaurant. Why
        not try something from our exquisite menu instead?
      </p>

      {/* Return buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-full text-lg font-bold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-gold"
        >
          Back to Home
        </Link>
        <Link
          href="/menu"
          className="px-6 py-3 bg-transparent border-2 border-[rgba(234,219,102,1)] text-[rgba(234,219,102,1)] rounded-full text-lg font-bold hover:bg-[rgba(234,219,102,0.1)] transition-all duration-300"
        >
          View Our Menu
        </Link>
      </div>

      {/* Extra decorative elements */}
      <div className="mt-16 text-gray-600 text-center">
        <p>SHEHJAR — Traditional Restaurant & Bakery</p>
      </div>

      {/* Add some custom animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .shadow-gold {
          box-shadow: 0 4px 20px rgba(234, 219, 102, 0.3);
        }
      `}</style>
    </div>
  );
}
