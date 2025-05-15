"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getFormattedPrice } from "../admin/services/menuService";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shehjarCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shehjarCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item, quantity = 1, selectedVariant = null) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedVariant === selectedVariant
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add as new item
        return [
          ...prevItems,
          {
            ...item,
            quantity,
            selectedVariant,
            cartItemId: `${item.id}_${
              selectedVariant || "default"
            }_${Date.now()}`,
          },
        ];
      }
    });

    // Open cart when adding item
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  // Update quantity
  const updateCartItemQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shehjarCart");
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let price;

      if (item.selectedVariant && item.variants) {
        const variant = item.variants.find(
          (v) => v.size === item.selectedVariant
        );
        price = variant ? variant.price : 0;
      } else {
        price = item.price;
      }

      return total + price * item.quantity;
    }, 0);
  };

  // Get cart formatted total
  const getFormattedCartTotal = () => {
    return getFormattedPrice(getCartTotal());
  };

  // Get total items in cart
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const contextValue = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getFormattedCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
