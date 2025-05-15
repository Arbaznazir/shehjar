"use client";

import { useState } from "react";
import Image from "next/image";

export default function MenuSection({ category, items }) {
  const calculateGST = (price) => {
    const gstRate = 0.18; // 18% GST
    const gstAmount = price * gstRate;
    return (price + gstAmount).toFixed(2);
  };

  return (
    <div className="py-6" id="menu">
      <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)]">
        {category}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="menu-item bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image || "/images/default-food.jpg"}
                alt={item.name}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-0 right-0 bg-white px-2 py-1 m-2 rounded-md shadow">
                <span className="font-medium text-gray-800">
                  ₹{calculateGST(item.price)}
                </span>
                <span className="text-xs text-gray-500 block">
                  Inc. 18% GST
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-500 text-sm">Base: </span>
                  <span className="font-medium">₹{item.price.toFixed(2)}</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No items available in this category.
        </div>
      )}
    </div>
  );
}
