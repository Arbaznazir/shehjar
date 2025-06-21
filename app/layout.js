import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";

export const metadata = {
  title: "Shehjar - Authentic Kashmiri Cuisine",
  description:
    "Experience the authentic flavors of Kashmir at Shehjar restaurant. Traditional Kashmiri cuisine and international dishes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
