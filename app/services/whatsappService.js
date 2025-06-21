import { restaurantInfo } from "../data/restaurantInfo";

// Get admin WhatsApp number from restaurant info
const getAdminWhatsAppNumber = () => {
  // Using the dedicated WhatsApp number
  // Remove any non-digit characters and ensure it starts with country code
  const whatsappNumber = restaurantInfo.whatsappNumber.replace(/[^\d]/g, "");
  // Add country code if not present (assuming India +91)
  return whatsappNumber.startsWith("91")
    ? whatsappNumber
    : `91${whatsappNumber}`;
};

// Format order items for WhatsApp message
const formatOrderItems = (items) => {
  return items
    .map((item) => {
      let itemName = item.name;
      let itemPrice = item.price;

      // Handle variants
      if (item.selectedVariant && item.variants) {
        const variant = item.variants.find(
          (v) => v.size === item.selectedVariant
        );
        if (variant) {
          itemPrice = variant.price;
          itemName = `${item.name} (${item.selectedVariant})`;
        }
      }

      const totalPrice = itemPrice * item.quantity;
      let itemDetails = `${item.quantity} x ${itemName} - ₹${totalPrice}`;

      // Add nutritional info if available
      if (item.nutrition && item.nutrition.calories) {
        const totalCalories = item.nutrition.calories * item.quantity;
        itemDetails += ` (${totalCalories} cal)`;
      }

      // Add prep time if available
      if (item.prepTime) {
        itemDetails += ` [${item.prepTime}]`;
      }

      return itemDetails;
    })
    .join("\n");
};

// Calculate estimated preparation time for order
const calculateOrderPrepTime = (items) => {
  if (!items || items.length === 0) return 15;

  const prepTimes = items.map((item) => {
    if (!item.prepTime) return 15; // Default 15 minutes if not specified

    // Parse prep time (e.g., "15-20 mins" -> take average)
    const timeMatch = item.prepTime.match(/(\d+)(?:-(\d+))?/);
    if (timeMatch) {
      const min = parseInt(timeMatch[1]);
      const max = timeMatch[2] ? parseInt(timeMatch[2]) : min;
      return (min + max) / 2;
    }
    return 15;
  });

  // Maximum prep time + 5 minutes buffer for multiple items
  const maxPrepTime = Math.max(...prepTimes);
  const buffer = items.length > 1 ? 5 : 0;
  return Math.round(maxPrepTime + buffer);
};

// Calculate total nutritional information for order
const calculateOrderNutrition = (items) => {
  return items.reduce(
    (summary, item) => {
      if (item.nutrition) {
        summary.calories += (item.nutrition.calories || 0) * item.quantity;
        summary.protein += (item.nutrition.protein || 0) * item.quantity;
        summary.carbs += (item.nutrition.carbs || 0) * item.quantity;
        summary.fat += (item.nutrition.fat || 0) * item.quantity;
        summary.fiber += (item.nutrition.fiber || 0) * item.quantity;
        summary.sodium += (item.nutrition.sodium || 0) * item.quantity;
      }
      return summary;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    }
  );
};

// Generate WhatsApp message for order
const generateOrderMessage = (order) => {
  const orderItems = formatOrderItems(order.items);
  const customerLocation = order.customerInfo.address || "Kuchmulla"; // Default location
  const estimatedPrepTime = calculateOrderPrepTime(order.items);
  const nutritionSummary = calculateOrderNutrition(order.items);

  let message = `🍽️ *NEW ORDER RECEIVED*

📱 *Customer Phone:* ${order.customerInfo.phone}
📍 *Location:* ${customerLocation}
👤 *Name:* ${order.customerInfo.name}

📋 *ORDER DETAILS:*
${orderItems}

💰 *Total Amount:* ₹${order.total}
⏰ *Estimated Prep Time:* ${estimatedPrepTime} minutes`;

  // Add nutritional summary if available
  if (nutritionSummary.calories > 0) {
    message += `

🥗 *NUTRITIONAL SUMMARY:*
🔥 Calories: ${Math.round(nutritionSummary.calories)}
🥩 Protein: ${Math.round(nutritionSummary.protein)}g
🍞 Carbs: ${Math.round(nutritionSummary.carbs)}g
🧈 Fat: ${Math.round(nutritionSummary.fat)}g`;
  }

  message += `

🏪 *Order Type:* ${order.isInRestaurant ? "Dine-in" : "Delivery"}
💳 *Payment:* ${
    order.paymentMethod === "payAfterDelivery"
      ? order.isInRestaurant
        ? "Pay after feast"
        : "Cash on delivery"
      : "Paid online"
  }

📧 *Email:* ${order.customerInfo.email || "Not provided"}
📝 *Special Instructions:* ${order.customerInfo.specialInstructions || "None"}

🕐 *Order Time:* ${new Date(order.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  })}

*Order ID:* #${order.id}

---
*SHEHJAR Restaurant*
*Traditional Restaurant & Bakery*`;

  return encodeURIComponent(message);
};

// Send order to WhatsApp
export const sendOrderToWhatsApp = (order) => {
  try {
    const adminWhatsApp = getAdminWhatsAppNumber();
    const message = generateOrderMessage(order);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, "_blank");

    return true;
  } catch (error) {
    console.error("Error sending order to WhatsApp:", error);
    return false;
  }
};

// Get admin WhatsApp number for display
export const getAdminWhatsAppForDisplay = () => {
  return restaurantInfo.whatsappNumber;
};

// Generate WhatsApp message for table reservation
const generateReservationMessage = (reservation) => {
  const reservationDate = new Date(reservation.date);
  const formattedDate = reservationDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeSlot =
    reservation.preferredTime === "lunch"
      ? "Lunch (12:00 PM - 3:00 PM)"
      : "Dinner (7:00 PM - 10:00 PM)";

  const message = `🍽️ *TABLE RESERVATION REQUEST*

👤 *Name:* ${reservation.name}
📱 *Phone:* ${reservation.phone}
👥 *Number of Guests:* ${reservation.guests}
📅 *Date:* ${formattedDate}
🕐 *Preferred Time:* ${timeSlot}

🕐 *Request Time:* ${new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  })}

*Reservation ID:* #${reservation.id}

---
*SHEHJAR Restaurant*
*Traditional Restaurant & Bakery*
*Please confirm this reservation*`;

  return encodeURIComponent(message);
};

// Send table reservation to WhatsApp
export const sendReservationToWhatsApp = (reservation) => {
  try {
    const adminWhatsApp = getAdminWhatsAppNumber();
    const message = generateReservationMessage(reservation);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, "_blank");

    return true;
  } catch (error) {
    console.error("Error sending reservation to WhatsApp:", error);
    return false;
  }
};
