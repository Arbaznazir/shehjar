import { menuData, menuCategories } from "../../data/menuData";

// Flatten all menu items from the menu data object
export const menuItems = Object.values(menuData).flat();

// Export the categories for reuse
export { menuCategories };
