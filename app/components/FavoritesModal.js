"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import MenuItemCardWrapper from "./MenuItemCardWrapper";

export default function FavoritesModal({ isOpen, onClose }) {
  const { favorites, addToCart, removeFromFavorites } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  if (!isOpen) return null;

  const handleAddAllToCart = () => {
    favorites.forEach((item) => {
      addToCart(item, 1);
    });
    alert(`Added ${favorites.length} items to cart!`);
  };

  const handleAddSelectedToCart = () => {
    selectedItems.forEach((itemId) => {
      const item = favorites.find((fav) => fav.id === itemId);
      if (item) {
        addToCart(item, 1);
      }
    });
    setSelectedItems([]);
    alert(`Added ${selectedItems.length} selected items to cart!`);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClearFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      favorites.forEach((item) => removeFromFavorites(item.id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700 relative transform animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">
              My Favorites
              <span className="ml-2 text-sm bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                {favorites.length}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-900">
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 rounded-xl mx-4">
              <svg
                className="w-20 h-20 text-gray-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No favorites yet
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start adding items to your favorites by clicking the ❤️ heart
                icon on menu items. Your favorite dishes will appear here for
                quick access.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-700">
                <button
                  onClick={handleAddAllToCart}
                  className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add All to Cart ({favorites.length})
                </button>

                {selectedItems.length > 0 && (
                  <button
                    onClick={handleAddSelectedToCart}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Add Selected to Cart ({selectedItems.length})
                  </button>
                )}

                <button
                  onClick={() =>
                    setSelectedItems(favorites.map((item) => item.id))
                  }
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Select All
                </button>

                <button
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Clear Selection
                </button>

                <button
                  onClick={handleClearFavorites}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors ml-auto"
                >
                  Clear All Favorites
                </button>
              </div>

              {/* Favorites Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item) => (
                  <div key={item.id} className="relative">
                    {/* Selection Checkbox */}
                    <div className="absolute top-3 right-3 z-10">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-5 h-5 text-[rgba(234,219,102,1)] bg-gray-800 border-gray-600 rounded focus:ring-[rgba(234,219,102,0.5)] focus:ring-2 transition-colors"
                        />
                        <span className="ml-2 text-xs text-gray-300 bg-black/70 px-2 py-1 rounded">
                          {selectedItems.includes(item.id)
                            ? "Selected"
                            : "Select"}
                        </span>
                      </label>
                    </div>

                    {/* Menu Item Card */}
                    <MenuItemCardWrapper
                      item={item}
                      gstRate={5}
                      discountType="none"
                      discountValue={0}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-800 flex justify-between items-center">
            <span className="text-gray-400">
              {favorites.length} favorite item
              {favorites.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
