"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getFormattedPrice } from "../services/menuService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart, favorites, and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shehjar-cart");
    const savedFavorites = localStorage.getItem("shehjar-favorites");
    const savedWishlist = localStorage.getItem("shehjar-wishlist");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Ensure all cart items have cartId property (migration for old data)
        const migratedCart = parsedCart.map((item) => {
          if (!item.cartId) {
            return {
              ...item,
              cartId: `${item.id}-${
                item.selectedVariant || "default"
              }-${Date.now()}`,
              cartItemId:
                item.cartItemId ||
                `${item.id}_${item.selectedVariant || "default"}_${Date.now()}`,
            };
          }
          return item;
        });
        setCartItems(migratedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
    }

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shehjar-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shehjar-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shehjar-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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
            cartId: `${item.id}-${selectedVariant || "default"}-${Date.now()}`,
            cartItemId: `${item.id}_${
              selectedVariant || "default"
            }_${Date.now()}`, // For backward compatibility
          },
        ];
      }
    });

    // Open cart when adding item
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId)
    );
  };

  // Update quantity
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shehjar-cart");
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = item.price;
      if (item.selectedVariant && item.variants) {
        const variant = item.variants.find(
          (v) => v.size === item.selectedVariant
        );
        if (variant) {
          itemPrice = variant.price;
        }
      }
      return total + itemPrice * item.quantity;
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

  // Favorites functions
  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === item.id);
      if (!isAlreadyFavorite) {
        return [...prevFavorites, { ...item, favoritedAt: Date.now() }];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (itemId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((item) => item.id !== itemId)
    );
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);
    if (isFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  // Wishlist functions
  const addToWishlist = (item, quantity = 1, selectedVariant = null) => {
    setWishlist((prevWishlist) => {
      const existingItemIndex = prevWishlist.findIndex(
        (wishItem) =>
          wishItem.id === item.id &&
          wishItem.selectedVariant === selectedVariant
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedWishlist = [...prevWishlist];
        updatedWishlist[existingItemIndex].quantity += quantity;
        return updatedWishlist;
      } else {
        // Add as new item
        return [
          ...prevWishlist,
          {
            ...item,
            quantity,
            selectedVariant,
            wishlistId: `${item.id}-${
              selectedVariant || "default"
            }-${Date.now()}`,
            savedAt: Date.now(),
          },
        ];
      }
    });
  };

  const removeFromWishlist = (wishlistId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.wishlistId !== wishlistId)
    );
  };

  const moveToCart = (wishlistId) => {
    const wishlistItem = wishlist.find(
      (item) => item.wishlistId === wishlistId
    );
    if (wishlistItem) {
      // Add to cart
      addToCart(
        wishlistItem,
        wishlistItem.quantity,
        wishlistItem.selectedVariant
      );
      // Remove from wishlist
      removeFromWishlist(wishlistId);
    }
  };

  const saveForLater = (cartId) => {
    const cartItem = cartItems.find((item) => item.cartId === cartId);
    if (cartItem) {
      // Add to wishlist
      addToWishlist(cartItem, cartItem.quantity, cartItem.selectedVariant);
      // Remove from cart
      removeFromCart(cartId);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("shehjar-wishlist");
  };

  const getWishlistItemsCount = () => {
    return wishlist.reduce((total, item) => total + item.quantity, 0);
  };

  // Quick re-order from wishlist
  const reorderFromWishlist = (items) => {
    items.forEach((item) => {
      addToCart(item, item.quantity, item.selectedVariant);
    });
  };

  // Backward compatibility function
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

  const value = {
    cartItems,
    favorites,
    wishlist,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemQuantity, // Backward compatibility
    clearCart,
    getCartTotal,
    getFormattedCartTotal,
    getCartItemsCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    saveForLater,
    clearWishlist,
    getWishlistItemsCount,
    reorderFromWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
