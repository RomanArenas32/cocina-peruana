import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabores del Perú",
  description: "Auténtica cocina peruana en Azul, Buenos Aires",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${playfair.variable} antialiased`}
    >
      <body>
        <CartProvider>{children}</CartProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
