// Restaurant information data

export const restaurantInfo = {
  name: "SHEHJAR",
  tagline: "Traditional Restaurant & Bakery",
  address: "LEVEL-I & II BUS STAND TRAL-192123",
  phone: ["01933-250090", "7006588395", "9596023508"],
  whatsappNumber: "7006588395", // Admin WhatsApp for orders
  social: {
    website: "www.shehjarfoods.com",
    instagram: "shehjar_restaurant",
    facebook: "shehjarfoods",
    email: "sales@shehjaroriginal.com",
  },
  businessHours: {
    monday: "9:00 AM - 10:00 PM",
    tuesday: "9:00 AM - 10:00 PM",
    wednesday: "9:00 AM - 10:00 PM",
    thursday: "9:00 AM - 10:00 PM",
    friday: "9:00 AM - 10:00 PM",
    saturday: "9:00 AM - 11:00 PM",
    sunday: "9:00 AM - 11:00 PM",
  },
};

// Function to get formatted address
export const getFormattedAddress = () => {
  return restaurantInfo.address;
};

// Function to get primary phone number
export const getPrimaryPhone = () => {
  return restaurantInfo.phone[0];
};

// Function to get all phone numbers as formatted string
export const getAllPhones = () => {
  return restaurantInfo.phone.join(", ");
};

// Function to get social media links
export const getSocialLinks = () => {
  return restaurantInfo.social;
};
