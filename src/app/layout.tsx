import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getOccasions } from "@/lib/data";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Presently — Gifts for Every Occasion",
  description:
    "Curated gifts for birthdays, anniversaries, weddings, festivals and every moment worth celebrating.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const occasions = await getOccasions();
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream-50 text-ink-900 antialiased">
        <Navbar occasions={occasions} />
        <main className="flex-1">{children}</main>
        <Footer occasions={occasions} />
        <CartDrawer />
      </body>
    </html>
  );
}
