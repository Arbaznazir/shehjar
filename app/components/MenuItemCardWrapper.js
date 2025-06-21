"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { getFormattedPrice } from "../services/menuService";
import Image from "next/image";

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

export default function MenuItemCardWrapper({
  item,
  gstRate,
  discountType,
  discountValue,
}) {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0].size : null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFlyAnimation, setShowFlyAnimation] = useState(false);
  const [buttonState, setButtonState] = useState("default"); // 'default', 'loading', 'success'

  // Calculate base and final prices
  const getBasePrice = () => {
    if (selectedVariant && item.variants) {
      const variant = item.variants.find((v) => v.size === selectedVariant);
      return variant ? variant.price : item.price;
    }
    return item.price;
  };

  const getFinalPrice = () => {
    const basePrice = getBasePrice();
    let finalPrice = basePrice;

    // Apply discount if applicable
    if (discountType === "percentage" && discountValue > 0) {
      finalPrice = basePrice * (1 - discountValue / 100);
    } else if (discountType === "flat" && discountValue > 0) {
      finalPrice = Math.max(0, basePrice - discountValue);
    }

    // Apply GST
    const gstMultiplier = 1 + gstRate / 100;
    return finalPrice * gstMultiplier;
  };

  // Format prices for display
  const getDisplayPrice = () => {
    return getFormattedPrice(getFinalPrice());
  };

  const getOriginalPriceDisplay = () => {
    const basePrice = getBasePrice();
    const hasDiscount =
      (discountType === "percentage" && discountValue > 0) ||
      (discountType === "flat" && discountValue > 0);

    if (hasDiscount) {
      const originalWithGST = basePrice * (1 + gstRate / 100);
      return getFormattedPrice(originalWithGST);
    }
    return null;
  };

  // Calculate savings percentage
  const getSavings = () => {
    const originalWithGST = getBasePrice() * (1 + gstRate / 100);
    const finalPrice = getFinalPrice();
    const savingsPercent =
      ((originalWithGST - finalPrice) / originalWithGST) * 100;

    return savingsPercent > 0 ? Math.round(savingsPercent) : 0;
  };

  // Handle adding to cart with enhanced animations
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setButtonState("loading");
    setShowFlyAnimation(true);

    // Add to cart
    addToCart(item, quantity, selectedVariant);

    // Show success state
    setTimeout(() => {
      setButtonState("success");
    }, 400);

    // Reset states after animations complete
    setTimeout(() => {
      setIsAddingToCart(false);
      setButtonState("default");
      setShowFlyAnimation(false);
      setQuantity(1);
    }, 1200);
  };

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl relative ${
        isExpanded ? "ring-2 ring-[rgba(234,219,102,0.5)]" : ""
      } ${isAddingToCart ? "animate-add-to-cart" : ""}`}
    >
      {/* Flying animation element */}
      {showFlyAnimation && (
        <div className="absolute top-4 right-4 z-10 animate-item-fly-to-cart pointer-events-none">
          <div className="w-8 h-8 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] rounded-full flex items-center justify-center text-black font-bold text-sm">
            +{quantity}
          </div>
        </div>
      )}
      {/* Item Image */}
      <div className="relative h-48 bg-gray-800">
        {item.image ? (
          <Image
            src={`/images/menu/${item.image}`}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-5xl">
            {(item.category && categoryIcons[item.category.toLowerCase()]) ||
              "🍽️"}
          </div>
        )}
        {/* Favorite Heart Icon */}
        <button
          onClick={() => toggleFavorite(item)}
          className="absolute top-2 left-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group"
        >
          <svg
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite(item.id)
                ? "text-red-500 fill-current"
                : "text-white group-hover:text-red-300"
            }`}
            fill={isFavorite(item.id) ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {item.isVeg && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Veg
          </div>
        )}
        {!item.isVeg && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
            Non-Veg
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
        {item.description && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-2 mt-2">
          {item.prepTime && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400 border border-blue-800/30">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {item.prepTime}
            </span>
          )}
          {item.nutrition?.calories && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-800/30">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {item.nutrition.calories} cal
            </span>
          )}
          {item.spiceLevel && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${
                item.spiceLevel === "Mild"
                  ? "bg-yellow-900/30 text-yellow-400 border-yellow-800/30"
                  : item.spiceLevel === "Medium"
                  ? "bg-orange-900/30 text-orange-400 border-orange-800/30"
                  : "bg-red-900/30 text-red-400 border-red-800/30"
              }`}
            >
              🌶️ {item.spiceLevel}
            </span>
          )}
        </div>

        {/* Expandable Details */}
        {(item.ingredients || item.nutrition || item.allergens) && (
          <div className="mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-sm text-[rgba(234,219,102,1)] hover:text-[rgba(234,219,102,0.8)] transition-colors"
            >
              <svg
                className={`w-4 h-4 mr-1 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {isExpanded ? "Hide Details" : "View Details"}
            </button>

            {isExpanded && (
              <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700 animate-fadeIn">
                {/* Nutritional Information */}
                {item.nutrition && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Nutrition (per serving)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.calories}
                        </div>
                        <div className="text-gray-400">Calories</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.protein}g
                        </div>
                        <div className="text-gray-400">Protein</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.carbs}g
                        </div>
                        <div className="text-gray-400">Carbs</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.fat}g
                        </div>
                        <div className="text-gray-400">Fat</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.fiber}g
                        </div>
                        <div className="text-gray-400">Fiber</div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded text-center">
                        <div className="font-medium text-white">
                          {item.nutrition.sodium}mg
                        </div>
                        <div className="text-gray-400">Sodium</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {item.ingredients && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {item.allergens && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      Allergen Information
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-800/30"
                        >
                          ⚠️ {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Price and Variant Selector */}
        <div className="mt-3">
          {item.variants && item.variants.length > 0 ? (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {item.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => handleVariantChange(variant.size)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedVariant === variant.size
                        ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">
                  {getDisplayPrice()}
                </span>
                {getOriginalPriceDisplay() && (
                  <span className="ml-2 text-sm line-through text-gray-500">
                    {getOriginalPriceDisplay()}
                  </span>
                )}
              </div>
              {getSavings() > 0 && (
                <div className="text-green-500 text-xs mt-1">
                  Save {getSavings()}%
                </div>
              )}
              <div className="text-gray-400 text-xs mt-1">
                Incl. {gstRate}% GST
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                buttonState === "default"
                  ? "bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] hover:scale-105"
                  : buttonState === "loading"
                  ? "bg-gray-600 text-white scale-95"
                  : "bg-green-600 text-white scale-105 animate-button-success"
              } ${isAddingToCart ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-center">
                {buttonState === "loading" && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {buttonState === "success" && (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
                <span>
                  {buttonState === "default" && "Add to Order"}
                  {buttonState === "loading" && "Adding..."}
                  {buttonState === "success" && "Added!"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
