// Simple menu service functions
import { menuData } from "../data/menuData";

export const getFormattedPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "₹0.00";
  }
  return `₹${price.toFixed(2)}`;
};

// Get menu categories
export const getMenuCategories = () => {
  const categoryMap = {
    starters: "Starters",
    rockAndRoll: "Rock & Roll",
    pizza: "Pizza",
    pizzaToppings: "Pizza Toppings",
    burgers: "Burgers",
    sandwiches: "Sandwiches",
    momos: "Momos",
    rice: "Rice",
    tandoori: "Tandoori",
    indian: "Indian",
    breads: "Breads",
    wazwan: "Wazwan",
    continental: "Continental",
    pasta: "Pasta",
    chineseMeals: "Chinese Meals",
    tea: "Tea",
    coffee: "Coffee",
    beverages: "Beverages",
    desserts: "Desserts",
  };

  return Object.keys(menuData).map((key) => ({
    id: key,
    name: categoryMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
  }));
};

// Get menu items by category
export const getMenuItemsByCategory = (category) => {
  return menuData[category] || [];
};

// Get all menu items
export const getAllMenuItems = () => {
  const allItems = [];
  Object.values(menuData).forEach((categoryItems) => {
    allItems.push(...categoryItems);
  });
  return allItems;
};

// Search menu items
export const searchMenuItems = (query) => {
  const allItems = getAllMenuItems();
  const searchTerm = query.toLowerCase();

  return allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm)
  );
};

// GST rates
export const gstRates = () => [
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
];

// Calculate final price with GST and discount
export const calculateFinalPrice = (
  basePrice,
  gstRate = 5,
  discountType = "none",
  discountValue = 0
) => {
  let price = basePrice;

  // Apply GST
  const gstAmount = (price * gstRate) / 100;
  price = price + gstAmount;

  // Apply discount
  if (discountType === "percentage" && discountValue > 0) {
    const discountAmount = (price * discountValue) / 100;
    price = price - discountAmount;
  } else if (discountType === "flat" && discountValue > 0) {
    price = Math.max(0, price - discountValue);
  }

  return Math.round(price * 100) / 100; // Round to 2 decimal places
};
