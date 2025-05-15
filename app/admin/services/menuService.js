import { menuItems } from "./menuData";
import { getConfig } from "./configService";

// Get GST rates from config
export const gstRates = () => {
  return getConfig().gstRates;
};

// Get default GST rate from config
export const DEFAULT_GST_RATE = () => {
  return getConfig().defaultGSTRate;
};

// Function to get all menu categories
export const getMenuCategories = () => {
  const categories = [
    { id: "starters", name: "Starters" },
    { id: "rockAndRoll", name: "Rock & Roll" },
    { id: "pizza", name: "Pizza" },
    { id: "pizzaToppings", name: "Pizza Toppings" },
    { id: "burgers", name: "Burgers" },
    { id: "sandwiches", name: "Sandwiches" },
    { id: "momos", name: "Momos" },
    { id: "rice", name: "Rice" },
    { id: "tandoori", name: "Tandoori" },
    { id: "indian", name: "Indian" },
    { id: "breads", name: "Breads" },
    { id: "wazwan", name: "Wazwan" },
    { id: "continental", name: "Continental" },
    { id: "pasta", name: "Pasta" },
    { id: "chineseMeals", name: "Chinese Meals" },
    { id: "tea", name: "Tea" },
    { id: "coffee", name: "Coffee" },
    { id: "beverages", name: "Beverages" },
    { id: "desserts", name: "Desserts" },
  ];

  return categories;
};

// Function to get all menu items
export const getAllMenuItems = () => {
  return menuItems;
};

// Function to get menu items by category
export const getMenuItemsByCategory = (category) => {
  return menuItems.filter((item) => item.category === category);
};

// Function to search menu items
export const searchMenuItems = (query) => {
  const searchTermLower = query.toLowerCase().trim();

  return menuItems.filter((item) => {
    // Check if the search term is in the item name or description
    const nameMatch = item.name.toLowerCase().includes(searchTermLower);
    const descMatch = item.description
      ? item.description.toLowerCase().includes(searchTermLower)
      : false;

    // If the item has variants, also check if the search term matches variant sizes
    const variantMatch = item.variants
      ? item.variants.some((variant) =>
          variant.size.toLowerCase().includes(searchTermLower)
        )
      : false;

    return nameMatch || descMatch || variantMatch;
  });
};

// Function to format price with currency
export const getFormattedPrice = (price) => {
  return `₹${price.toFixed(2)}`;
};

// Function to calculate base price (without GST)
export const calculateBasePrice = (
  priceWithGST,
  gstRateValue = DEFAULT_GST_RATE()
) => {
  // Formula: basePrice = priceWithGST / (1 + gstRate/100)
  return priceWithGST / (1 + gstRateValue / 100);
};

// Function to calculate price with new GST rate
export const recalculateWithNewGST = (
  originalPriceWithGST,
  oldGSTRate,
  newGSTRate
) => {
  // Step 1: Calculate the base price (without GST)
  const basePrice = calculateBasePrice(originalPriceWithGST, oldGSTRate);

  // Step 2: Calculate new price with new GST rate
  return basePrice * (1 + newGSTRate / 100);
};

// Function to apply discount (flat or percentage)
export const applyDiscount = (price, discountType, discountValue) => {
  if (
    !discountType ||
    discountType === "none" ||
    !discountValue ||
    discountValue <= 0
  ) {
    return price;
  }

  if (discountType === "flat") {
    // Flat discount - ensure discount doesn't exceed the price
    const validDiscountValue = Math.min(price, Math.max(0, discountValue));
    return price - validDiscountValue;
  } else if (discountType === "percentage") {
    // Percentage discount - cap at 100%
    const percentage = Math.min(100, Math.max(0, discountValue));
    return price * (1 - percentage / 100);
  }

  return price;
};

// Function to calculate final price with GST and discount
export const calculateFinalPrice = (
  price,
  gstRateValue = null,
  discountType = null,
  discountValue = null
) => {
  // Get config values if not provided
  const config = getConfig();
  const currentGSTRate =
    gstRateValue !== null ? gstRateValue : config.defaultGSTRate;
  const currentDiscountType =
    discountType !== null ? discountType : config.defaultDiscountType;
  const currentDiscountValue =
    discountValue !== null ? discountValue : config.defaultDiscountValue;

  // All our stored prices already include 5% GST by default (hardcoded in data)
  // If we're using a different GST rate, we need to recalculate
  let finalPrice = price;
  const storedGSTRate = 5; // This is the rate that prices in the data include

  if (currentGSTRate !== storedGSTRate) {
    finalPrice = recalculateWithNewGST(price, storedGSTRate, currentGSTRate);
  }

  // Apply discount if any
  if (currentDiscountType !== "none" && currentDiscountValue > 0) {
    finalPrice = applyDiscount(
      finalPrice,
      currentDiscountType,
      currentDiscountValue
    );
  }

  return finalPrice;
};

// Function to get vegetarian items only
export const getVegetarianItems = () => {
  return menuItems.filter((item) => item.isVeg);
};

// Function to get non-vegetarian items only
export const getNonVegetarianItems = () => {
  return menuItems.filter((item) => !item.isVeg);
};
