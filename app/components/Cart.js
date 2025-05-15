"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { getFormattedPrice } from "../admin/services/menuService";
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
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getFormattedCartTotal,
    getCartItemsCount,
  } = useCart();

  const totalItems = getCartItemsCount();

  if (!isCartOpen) {
    return (
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black p-3 rounded-full shadow-lg hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all z-50"
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
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-gray-900 h-full overflow-auto p-4 shadow-xl animate-slide-in-right">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Your Order</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-300 hover:text-white"
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

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
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
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black rounded hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-700">
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

                return (
                  <div
                    key={item.cartItemId}
                    className="py-4 flex items-start gap-3"
                  >
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
                          {(item.category &&
                            categoryIcons[item.category.toLowerCase()]) ||
                            "🍽️"}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
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

                      {item.selectedVariant && (
                        <p className="text-sm text-gray-400">
                          Size: {item.selectedVariant}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-600 rounded">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(
                                item.cartItemId,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItemQuantity(
                                item.cartItemId,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium text-white">
                          {getFormattedPrice(itemPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Subtotal</span>
                <span className="font-medium text-white">
                  {getFormattedCartTotal()}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Taxes and delivery calculated at checkout
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded hover:from-[rgba(182,155,76,0.9)] hover:to-[rgba(234,219,102,0.9)] transition-all text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add some animation styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
