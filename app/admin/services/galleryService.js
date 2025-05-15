/**
 * Gallery Service
 * Handles image gallery operations for the admin panel
 * In a production environment, this would interact with a backend API
 */

// Mock storage for gallery images
let galleryImages = [
  {
    id: "gallery-1",
    name: "Dish Presentation",
    description: "Beautiful presentation of our signature dish",
    url: "/images/homepage_main_course.jpg",
    category: "food",
    createdAt: "2023-05-15T12:30:00Z",
    width: 1200,
    height: 800,
  },
  {
    id: "gallery-2",
    name: "Restaurant Interior",
    description: "Elegant ambiance of our dining space",
    url: "/images/normal.jpg",
    category: "restaurant",
    createdAt: "2023-04-18T10:15:00Z",
    width: 1600,
    height: 1067,
  },
  {
    id: "gallery-3",
    name: "Dessert Special",
    description: "Exquisite dessert presentation",
    url: "/images/homepage_desert.jpg",
    category: "food",
    createdAt: "2023-06-02T15:45:00Z",
    width: 1400,
    height: 933,
  },
];

// Image categories for organization
export const imageCategories = [
  { id: "all", name: "All Images" },
  { id: "food", name: "Food & Dishes" },
  { id: "restaurant", name: "Restaurant" },
  { id: "events", name: "Events" },
  { id: "staff", name: "Staff" },
];

/**
 * Get all gallery images, optionally filtered by category
 */
export const getGalleryImages = (category = null) => {
  // If no category filter or "all" category, return all images
  if (!category || category === "all") {
    return [...galleryImages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Filter by category
  return galleryImages
    .filter((img) => img.category === category)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get a single gallery image by ID
 */
export const getGalleryImageById = (id) => {
  return galleryImages.find((img) => img.id === id) || null;
};

/**
 * Add a new gallery image
 * In production, this would handle file upload to a server
 */
export const addGalleryImage = (imageData) => {
  const newImage = {
    id: `gallery-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...imageData,
  };

  galleryImages = [newImage, ...galleryImages];
  return newImage;
};

/**
 * Update an existing gallery image
 */
export const updateGalleryImage = (id, updates) => {
  const index = galleryImages.findIndex((img) => img.id === id);
  if (index === -1) return null;

  galleryImages[index] = {
    ...galleryImages[index],
    ...updates,
  };

  return galleryImages[index];
};

/**
 * Delete a gallery image
 */
export const deleteGalleryImage = (id) => {
  const index = galleryImages.findIndex((img) => img.id === id);
  if (index === -1) return false;

  galleryImages = galleryImages.filter((img) => img.id !== id);
  return true;
};

/**
 * Optimize an image (simulated)
 * In production, this would use a server-side image processing library
 */
export const optimizeImage = (file, maxWidth = 1200) => {
  // This is a mock function. In production, you would:
  // 1. Resize the image to a reasonable size (e.g., max width 1200px)
  // 2. Compress the image to reduce file size
  // 3. Convert to an efficient format like WebP if supported
  // 4. Generate responsive sizes for different device widths

  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // Generate a mock optimized image response
      resolve({
        original: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        optimized: {
          name: file.name,
          size: Math.round(file.size * 0.6), // Simulate 40% size reduction
          type: "image/webp", // Simulate conversion to WebP
          width: Math.min(maxWidth, 1200),
          height: Math.round((Math.min(maxWidth, 1200) / 1200) * 800),
        },
      });
    }, 800);
  });
};
