import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "./components/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SHEHJAR - Traditional Restaurant & Bakery",
  description: "Delicious cuisine from SHEHJAR - Fastfood, Restaurant, Bakery",
  icons: {
    icon: [
      { url: "/images/Shehjar Logo.png" },
      { url: "/images/Shehjar Logo.png", sizes: "16x16", type: "image/png" },
      { url: "/images/Shehjar Logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: {
      url: "/images/Shehjar Logo.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/Shehjar Logo.png" />
      </head>
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
