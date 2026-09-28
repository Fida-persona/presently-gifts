"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Menu, Search, ShoppingBag, X } from "lucide-react";
import type { Occasion } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";

export default function Navbar({ occasions }: { occasions: Occasion[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [occasionMenuOpen, setOccasionMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOccasionMenuOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-cream-50/90 backdrop-blur-md shadow-[0_2px_20px_rgba(190,18,87,0.08)]"
          : "bg-cream-50"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <motion.span
              whileHover={{ rotate: -12, scale: 1.1 }}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white shadow-md"
            >
              <Gift size={20} />
            </motion.span>
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink-900">
              Presently
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setOccasionMenuOpen(true)}
              onMouseLeave={() => setOccasionMenuOpen(false)}
            >
              <button className="px-3 py-2 text-sm font-medium text-ink-900/80 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50">
                Shop by Occasion
              </button>
              <AnimatePresence>
                {occasionMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-3 gap-1 rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl shadow-rose-900/10">
                      {occasions.map((o) => (
                        <Link
                          key={o.id}
                          href={`/occasions/${o.slug}`}
                          className="group flex items-center gap-3 rounded-xl p-2 hover:bg-rose-50 transition-colors"
                        >
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                            <Image src={o.image} alt={o.name} fill sizes="44px" className="object-cover transition-transform group-hover:scale-110" />
                          </span>
                          <span className="text-sm font-medium text-ink-900/85 group-hover:text-rose-600">
                            {o.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/products" className="px-3 py-2 text-sm font-medium text-ink-900/80 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50">
              All Gifts
            </Link>
            <Link href="/products?featured=1" className="px-3 py-2 text-sm font-medium text-ink-900/80 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50">
              Bestsellers
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={submitSearch} className="hidden md:flex items-center relative">
              <Search size={16} className="absolute left-3 text-ink-900/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search gifts, occasions..."
                className="w-56 lg:w-64 rounded-full border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </form>

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-rose-50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} className="text-ink-900/80" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-rose-50"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-rose-100 bg-white"
          >
            <div className="p-4 space-y-4">
              <form onSubmit={submitSearch} className="flex items-center relative">
                <Search size={16} className="absolute left-3 text-ink-900/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search gifts..."
                  className="w-full rounded-full border border-rose-100 bg-cream-50 py-2 pl-9 pr-3 text-sm outline-none"
                />
              </form>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-900/40">
                  Occasions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {occasions.map((o) => (
                    <Link
                      key={o.id}
                      href={`/occasions/${o.slug}`}
                      className="rounded-lg bg-cream-50 px-3 py-2 text-sm text-ink-900/80"
                    >
                      {o.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 border-t border-rose-100 pt-3">
                <Link href="/products" className="py-2 text-sm font-medium">All Gifts</Link>
                <Link href="/products?featured=1" className="py-2 text-sm font-medium">Bestsellers</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
