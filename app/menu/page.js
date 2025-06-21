"use client";

import { useState, useEffect } from "react";
import {
  getMenuCategories,
  getMenuItemsByCategory,
  getFormattedPrice,
  searchMenuItems,
  getAllMenuItems,
  gstRates,
  calculateFinalPrice,
} from "../services/menuService";
import { getConfig } from "../services/configService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import MenuItemCardWrapper from "../components/MenuItemCardWrapper";

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

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [showPriceControls, setShowPriceControls] = useState(false);
  const [config, setConfig] = useState(null);

  // State for GST and discount, initially from config
  const [selectedGSTRate, setSelectedGSTRate] = useState(5);
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState(0);

  const { favorites } = useCart();
  const categories = getMenuCategories();

  // Load config on component mount
  useEffect(() => {
    const appConfig = getConfig();
    setConfig(appConfig);

    // Initialize state from config
    setSelectedGSTRate(appConfig.defaultGSTRate || 5);
    setDiscountType(appConfig.defaultDiscountType || "none");
    setDiscountValue(appConfig.defaultDiscountValue || 0);
  }, []);

  // Update search status when query changes
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setIsSearching(true);
      setDisplayedItems(searchMenuItems(searchQuery));
    } else {
      setIsSearching(false);
      setDisplayedItems(getMenuItemsByCategory(activeCategory));
    }
  }, [searchQuery, activeCategory]);

  // Update displayed items when category changes and not searching
  useEffect(() => {
    if (!isSearching) {
      setDisplayedItems(getMenuItemsByCategory(activeCategory));
    }
  }, [activeCategory, isSearching]);

  // Filter items if veg only is selected
  const filteredItems = showVegOnly
    ? displayedItems.filter((item) => item.isVeg)
    : displayedItems;

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle discount type change
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    if (e.target.value === "none") {
      setDiscountValue(0);
    }
  };

  // Handle discount value change
  const handleDiscountValueChange = (e) => {
    let value = parseFloat(e.target.value) || 0;

    // Constrain values based on type
    if (discountType === "percentage") {
      value = Math.min(100, Math.max(0, value));
    } else if (discountType === "flat") {
      value = Math.max(0, value);
    }

    setDiscountValue(value);
  };

  // Loading state
  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[rgba(234,219,102,1)]">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[50vh] mt-16">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-full w-full">
          <Image
            src="/images/menu_top.jpg"
            alt="Menu background"
            fill
            priority
            className="object-cover animate-slow-zoom"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 animate-fade-in-up">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/Shehjar Logo.png"
                alt="Shehjar Logo"
                width={80}
                height={80}
                className="animate-float"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] animate-text-shimmer drop-shadow-lg">
                Our Culinary Collection
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] mx-auto mb-6 glow-gold"></div>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-2 drop-shadow-lg animate-fade-in font-medium">
              Experience the authentic flavors of Kashmir and international
              cuisine
            </p>
            <p className="text-sm text-white italic animate-fade-in delay-300 drop-shadow-lg">
              All prices include {config.defaultGSTRate}% GST by default
            </p>
          </div>
        </div>
      </div>

      {/* Search and Price Controls Bar */}
      <div className="bg-black/90 shadow-md border-b border-gray-800 py-4 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-1/2 xl:w-1/3">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,1)] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>

            {/* Price Controls Toggle - Only show if allowed by admin config */}
            {config.allowUserPriceControls && (
              <div className="w-full md:w-auto">
                <button
                  onClick={() => setShowPriceControls(!showPriceControls)}
                  className="px-4 py-2 bg-gray-900 rounded-full text-sm border border-gray-800 text-[rgba(234,219,102,1)] hover:bg-gray-800 flex items-center w-full md:w-auto justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {showPriceControls
                    ? "Hide Price Controls"
                    : "Show Price Controls"}
                </button>
              </div>
            )}
          </div>

          {/* Expanded Price Controls - Only shown if allowed by admin and user toggled */}
          {config.allowUserPriceControls && showPriceControls && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 animate-fadeIn">
              <h3 className="text-md font-bold mb-3 text-[rgba(234,219,102,1)]">
                Price Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GST Rate Selection */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    GST Rate
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {gstRates().map((rate) => (
                      <button
                        key={rate.value}
                        onClick={() => setSelectedGSTRate(rate.value)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedGSTRate === rate.value
                            ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                      >
                        {rate.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Selection */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Discount
                  </label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <select
                      value={discountType}
                      onChange={handleDiscountTypeChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                    >
                      <option value="none">No Discount</option>
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>

                    {discountType !== "none" && (
                      <input
                        type="number"
                        min="0"
                        max={discountType === "percentage" ? "100" : undefined}
                        value={discountValue}
                        onChange={handleDiscountValueChange}
                        className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[rgba(234,219,102,0.5)]"
                        placeholder={discountType === "percentage" ? "%" : "₹"}
                        step={discountType === "percentage" ? "1" : "10"}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="mt-4 bg-gray-800/50 rounded p-3 text-sm">
                <p className="text-gray-300">
                  • Default prices include {config.defaultGSTRate}% GST
                  {selectedGSTRate !== config.defaultGSTRate &&
                    ` (currently showing with ${selectedGSTRate}% GST)`}
                </p>
                {discountType !== "none" && (
                  <p className="text-gray-300 flex items-center gap-1">
                    • Discount:
                    <span className="px-1.5 py-0.5 bg-green-900/50 border border-green-700/30 rounded text-green-400 font-medium">
                      {discountType === "percentage"
                        ? `${discountValue}%`
                        : `₹${discountValue.toFixed(2)}`}
                    </span>
                    <span className="text-green-500">
                      {discountType === "percentage"
                        ? ` off all prices`
                        : ` off each item`}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation - Hide when searching */}
      {!isSearching && (
        <div
          className={`bg-black/90 sticky top-16 z-10 shadow-md transition-all duration-300 border-t border-b border-gray-800 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-2">
              <h2
                className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] transition-all`}
              >
                {scrolled ? "Categories" : "Browse Our Menu"}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-900 px-3 py-2 rounded-full border border-gray-800">
                  <input
                    type="checkbox"
                    id="vegOnly"
                    checked={showVegOnly}
                    onChange={() => setShowVegOnly(!showVegOnly)}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="vegOnly"
                    className="text-sm font-medium flex items-center cursor-pointer text-gray-300"
                  >
                    <span className="inline-block w-4 h-4 bg-green-600 rounded-full mr-1"></span>
                    <span>Veg Only</span>
                  </label>
                </div>

                <div className="text-sm text-gray-400 bg-gray-900 px-3 py-2 rounded-full border border-gray-800">
                  <span className="text-red-500 mr-1">❤️</span>
                  <span>Favorites: {favorites.length}</span>
                </div>
              </div>
            </div>
            <div className="categories-container overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] text-black"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="mr-1">{categoryIcons[category.id]}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <div className="h-px flex-grow bg-gray-800"></div>
          <h2 className="text-3xl font-bold px-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgba(182,155,76,1)] to-[rgba(234,219,102,1)] flex items-center">
            {isSearching ? (
              <>
                <span className="text-4xl mr-2">🔍</span>
                Search Results
              </>
            ) : (
              <>
                <span className="text-4xl mr-2">
                  {categoryIcons[activeCategory]}
                </span>
                {categories.find((c) => c.id === activeCategory)?.name}
              </>
            )}
          </h2>
          <div className="h-px flex-grow bg-gray-800"></div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 dish-card rounded-lg">
            <div className="text-5xl mb-4">{isSearching ? "🔍" : "🍽️"}</div>
            <p className="text-gray-400">
              {isSearching
                ? `No results found for "${searchQuery}"`
                : "No items found in this category"}
            </p>
            {showVegOnly && (
              <p className="text-sm text-[rgba(234,219,102,1)] mt-2">
                Try disabling the "Veg Only" filter
              </p>
            )}
            {isSearching && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-[rgba(234,219,102,1)] hover:bg-gray-800"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="menu-item-enter menu-item-enter-active"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <MenuItemCardWrapper
                  item={item}
                  gstRate={selectedGSTRate}
                  discountType={discountType}
                  discountValue={discountValue}
                  categories={categories}
                />
              </div>
            ))}
          </div>
        )}

        {/* Search Results Count */}
        {isSearching && filteredItems.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Found {filteredItems.length} item
              {filteredItems.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-[rgba(234,219,102,1)] hover:bg-gray-800"
            >
              Clear Search & Browse Categories
            </button>
          </div>
        )}
      </div>

      <Footer />

      <style jsx global>{`
        .delay-300 {
          animation-delay: 300ms;
        }

        .glow-gold {
          box-shadow: 0 0 15px rgba(234, 219, 102, 0.8);
        }
      `}</style>
    </main>
  );
};

export default MenuPage;
