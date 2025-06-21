// Simple gallery service
const galleryImages = [
  {
    id: 1,
    filename: "homepage_top.jpg",
    title: "Restaurant Interior",
    category: "interior",
    isActive: true,
  },
  {
    id: 2,
    filename: "homepage_main_course.jpg",
    title: "Main Course",
    category: "food",
    isActive: true,
  },
  {
    id: 3,
    filename: "homepage_desert.jpg",
    title: "Desserts",
    category: "food",
    isActive: true,
  },
  {
    id: 4,
    filename: "about_top.jpg",
    title: "About Us",
    category: "interior",
    isActive: true,
  },
  {
    id: 5,
    filename: "contact_top.jpg",
    title: "Contact",
    category: "interior",
    isActive: true,
  },
  {
    id: 6,
    filename: "menu_top.jpg",
    title: "Menu",
    category: "food",
    isActive: true,
  },
];

export const getGalleryImages = () => {
  return galleryImages.filter((img) => img.isActive);
};

export const getGalleryCategories = () => {
  const categories = [...new Set(galleryImages.map((img) => img.category))];
  return categories;
};

export const imageCategories = [
  { id: "all", name: "All" },
  { id: "food", name: "Food" },
  { id: "interior", name: "Interior" },
];
