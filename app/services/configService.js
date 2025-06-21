// Simple configuration service
export const getConfig = () => {
  return {
    defaultGSTRate: 5,
    defaultDiscountType: "none",
    defaultDiscountValue: 0,
    allowUserPriceControls: false, // Disable price controls for customer-facing app
    restaurantName: "Shehjar",
    currency: "₹",
  };
};
