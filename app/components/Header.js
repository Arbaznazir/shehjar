"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "../admin/services/authService";
import { restaurantInfo } from "../data/restaurantInfo";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartItems, getCartItemsCount, isCartOpen, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check if user is logged in as admin
    const checkAdmin = () => {
      setIsAdmin(isAuthenticated());
    };

    window.addEventListener("scroll", handleScroll);
    checkAdmin();

    // Set up interval to check admin status periodically
    const interval = setInterval(checkAdmin, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2">
                <Image
                  src="/images/Shehjar Logo.png"
                  alt={restaurantInfo.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
                {restaurantInfo.name}
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleCartClick}
              className="text-white hover:text-[rgba(234,219,102,1)] focus:outline-none mr-6 relative"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[rgba(234,219,102,1)] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
            >
              Menu
            </Link>
            <Link
              href="/gallery"
              className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
            >
              Contact
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
              >
                Login
              </Link>
            )}
            <Link
              href="#reservation"
              className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Reservation
            </Link>
            <button
              onClick={handleCartClick}
              className="text-white hover:text-[rgba(234,219,102,1)] focus:outline-none relative"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 bg-black">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/gallery"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-white hover:text-[rgba(234,219,102,1)] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                href="#reservation"
                className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-full text-sm font-bold hover:opacity-90 transition-opacity inline-block w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Reservation
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
