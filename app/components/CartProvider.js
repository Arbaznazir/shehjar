"use client";

import { CartProvider as CartContextProvider } from "../context/CartContext";
import Cart from "./Cart";

export function CartProvider({ children }) {
  return (
    <CartContextProvider>
      {children}
      <Cart />
    </CartContextProvider>
  );
}
