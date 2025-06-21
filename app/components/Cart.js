"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { getFormattedPrice } from "../services/menuService";
import Image from "next/image";
import Link from "next/link";

// Food icons for each category
const categoryIcons = {
  starters: "🍲",
  rockAndRoll: "🌯",
  pizza: "🍕",
  pizzaToppings: "🧀",
  burgers: "🍔",
  sandwiches: "🥪",
  momos: "🥟",
  rice: "🍚",
  tandoori: "🍗",
  indian: "🍛",
  breads: "🥖",
  wazwan: "🍖",
  continental: "🍝",
  pasta: "🍝",
  chineseMeals: "🥡",
  tea: "🍵",
  coffee: "☕",
  beverages: "🥤",
  desserts: "🍰",
};

export default function Cart() {
  const {
    cartItems,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getFormattedCartTotal,
    getCartItemsCount,
    getWishlistItemsCount,
    saveForLater,
    moveToCart,
    removeFromWishlist,
    clearWishlist,
  } = useCart();

  const [removingItems, setRemovingItems] = React.useState(new Set());
  const [updatingItems, setUpdatingItems] = React.useState(new Set());
  const [showWishlist, setShowWishlist] = React.useState(false);
  const totalItems = getCartItemsCount();
  const wishlistItems = getWishlistItemsCount();

  // Calculate estimated preparation time
  const calculateEstimatedPrepTime = () => {
    if (cartItems.length === 0) return 0;

    // Extract prep times and find the maximum (kitchen works in parallel)
    const prepTimes = cartItems.map((item) => {
      if (!item.prepTime) return 15; // Default 15 minutes if not specified

      // Parse prep time (e.g., "15-20 mins" -> take average)
      const timeMatch = item.prepTime.match(/(\d+)(?:-(\d+))?/);
      if (timeMatch) {
        const min = parseInt(timeMatch[1]);
        const max = timeMatch[2] ? parseInt(timeMatch[2]) : min;
        return (min + max) / 2;
      }
      return 15;
    });

    // Maximum prep time + 5 minutes buffer for multiple items
    const maxPrepTime = Math.max(...prepTimes);
    const buffer = cartItems.length > 1 ? 5 : 0;
    return Math.round(maxPrepTime + buffer);
  };

  // Calculate total calories
  const calculateTotalCalories = () => {
    return cartItems.reduce((total, item) => {
      const calories = item.nutrition?.calories || 0;
      return total + calories * item.quantity;
    }, 0);
  };

  // Enhanced remove function with animation - FIXED to use cartId consistently
  const handleRemoveItem = (item) => {
    const itemId = item.cartId;
    if (!itemId) {
      console.error("No cartId found for item:", item);
      return;
    }

    setRemovingItems((prev) => new Set(prev).add(itemId));
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  // Enhanced quantity update with animation - FIXED to use cartId consistently
  const handleQuantityUpdate = (item, newQuantity) => {
    if (newQuantity < 1) return;

    const itemId = item.cartId; // Use cartId for updateQuantity
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    updateQuantity(itemId, newQuantity); // Use updateQuantity instead of updateCartItemQuantity
    setTimeout(() => {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 200);
  };

  if (!isCartOpen) {
    return (
      <button
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black p-4 rounded-full shadow-xl hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all z-50 transform hover:scale-110 ${
          totalItems > 0 ? "animate-floating-cart" : ""
        }`}
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-cart-count-pulse font-bold shadow-lg">
              {totalItems}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end animate-fadeIn"
      style={{ top: "64px" }}
    >
      <div
        className="w-full max-w-lg bg-gray-900 flex flex-col shadow-xl animate-slide-in-cart border-l-2 border-[rgba(234,219,102,0.3)]"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">
                {showWishlist ? "Saved Items" : "Your Order"}
              </h2>

              {/* Toggle between Cart and Wishlist */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setShowWishlist(false)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    !showWishlist
                      ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Cart ({totalItems})
                </button>
                <button
                  onClick={() => setShowWishlist(true)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    showWishlist
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Saved ({wishlistItems})
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {showWishlist ? (
            // Wishlist View
            wishlist.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <p className="text-gray-400 text-lg mb-2">No saved items</p>
                <p className="text-gray-500 text-sm">
                  Items you save for later will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => {
                  const itemPrice =
                    item.selectedVariant && item.variants
                      ? item.variants.find(
                          (v) => v.size === item.selectedVariant
                        )?.price || item.price
                      : item.price;

                  return (
                    <div
                      key={item.wishlistId}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={`/images/menu/${item.image}`}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xl">
                              {categoryIcons[item.category?.toLowerCase()] ||
                                "🍽️"}
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-grow min-w-0 pr-2">
                              <h3 className="font-medium text-white truncate">
                                {item.name}
                              </h3>
                              {item.selectedVariant && (
                                <p className="text-sm text-gray-400">
                                  Size: {item.selectedVariant}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                removeFromWishlist(item.wishlistId)
                              }
                              className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-900/20 rounded flex-shrink-0"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-white font-medium">
                                {getFormattedPrice(itemPrice * item.quantity)}
                              </span>
                            </div>
                            <button
                              onClick={() => moveToCart(item.wishlistId)}
                              className="px-3 py-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black text-sm font-medium rounded hover:opacity-90 transition-all"
                            >
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : // Cart View
          cartItems.length === 0 ? (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm mb-4">
                Add some delicious items to get started
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium hover:opacity-90 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                // Determine the price based on whether the item has a variant
                let itemPrice;
                if (item.selectedVariant && item.variants) {
                  const variant = item.variants.find(
                    (v) => v.size === item.selectedVariant
                  );
                  itemPrice = variant ? variant.price : item.price;
                } else {
                  itemPrice = item.price;
                }

                const itemId = item.cartId;

                return (
                  <div
                    key={itemId}
                    className={`bg-gray-800 rounded-lg p-4 border border-gray-700 transition-all duration-300 ${
                      removingItems.has(itemId)
                        ? "animate-cart-item-remove opacity-50"
                        : ""
                    } ${
                      updatingItems.has(itemId) ? "animate-price-update" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={`/images/menu/${item.image}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">
                            {categoryIcons[item.category?.toLowerCase()] ||
                              "🍽️"}
                          </div>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-grow min-w-0 pr-2">
                            <h3 className="font-semibold text-white text-base leading-tight mb-1">
                              {item.name}
                            </h3>
                            {item.selectedVariant && (
                              <p className="text-sm text-gray-400">
                                Size: {item.selectedVariant}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => saveForLater(item.cartId)}
                              className="text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110 p-1.5 rounded-lg hover:bg-blue-900/20"
                              title="Save for later"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 p-1.5 rounded-lg hover:bg-red-900/20"
                              title="Remove item"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item, item.quantity - 1)
                              }
                              className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="px-3 py-1.5 text-white font-semibold min-w-[2.5rem] text-center bg-gray-600 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityUpdate(item, item.quantity + 1)
                              }
                              className="px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-gray-600 transition-all duration-200"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                          <span className="text-lg font-bold text-[rgba(234,219,102,1)] ml-3">
                            {getFormattedPrice(itemPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom for cart view */}
        {!showWishlist && cartItems.length > 0 && (
          <div className="flex-shrink-0 bg-gray-900 border-t border-gray-700 p-4">
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-[rgba(234,219,102,1)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Order Summary
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Prep Time
                  </span>
                  <span className="text-[rgba(234,219,102,1)] font-medium">
                    {calculateEstimatedPrepTime()} mins
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-300">
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Calories
                  </span>
                  <span className="text-green-400 font-medium">
                    {calculateTotalCalories()} cal
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-300">
                  <span>Total Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>

                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Subtotal</span>
                    <span className="text-xl font-bold text-[rgba(234,219,102,1)]">
                      {getFormattedCartTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full px-6 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-bold text-center hover:opacity-90 transition-all duration-200 shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-red-500 hover:text-red-400 transition-all duration-200 text-sm"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Footer */}
        {showWishlist && wishlist.length > 0 && (
          <div className="flex-shrink-0 bg-gray-900 border-t border-gray-700 p-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearWishlist}
                className="px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:border-red-500 hover:text-red-400 transition-all duration-200"
              >
                Clear Saved
              </button>
              <button
                onClick={() => {
                  wishlist.forEach((item) => moveToCart(item.wishlistId));
                  setShowWishlist(false);
                }}
                className="px-4 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-medium hover:opacity-90 transition-all duration-200"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
