"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { getFormattedPrice } from "../admin/services/menuService";
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
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0].size : null
  );
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Handle adding to cart
  const handleAddToCart = () => {
    addToCart(item, quantity, selectedVariant);
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        isExpanded ? "ring-2 ring-[rgba(234,219,102,0.5)]" : ""
      }`}
    >
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
              className="px-3 py-1 bg-gradient-to-r from-[rgba(182,155,76,0.8)] to-[rgba(234,219,102,0.8)] text-black rounded hover:from-[rgba(182,155,76,1)] hover:to-[rgba(234,219,102,1)] transition-all text-sm font-medium"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
