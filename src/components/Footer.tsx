import Link from "next/link";
import { Gift, Globe, Camera, Send, Mail } from "lucide-react";
import type { Occasion } from "@/lib/types";

export default function Footer({ occasions }: { occasions: Occasion[] }) {
  return (
    <footer className="mt-20 border-t border-rose-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white">
                <Gift size={18} />
              </span>
              <span className="font-display text-xl font-semibold text-ink-900">Presently</span>
            </Link>
            <p className="mt-3 text-sm text-ink-900/60 max-w-xs">
              Thoughtfully curated gifts for every occasion — from birthdays to boardrooms.
            </p>
            <div className="mt-4 flex gap-3 text-ink-900/50">
              <Globe size={18} className="hover:text-rose-600 transition-colors cursor-pointer" />
              <Camera size={18} className="hover:text-rose-600 transition-colors cursor-pointer" />
              <Send size={18} className="hover:text-rose-600 transition-colors cursor-pointer" />
              <Mail size={18} className="hover:text-rose-600 transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/40 mb-3">
              Occasions
            </p>
            <ul className="space-y-2">
              {occasions.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <Link href={`/occasions/${o.slug}`} className="text-sm text-ink-900/65 hover:text-rose-600 transition-colors">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/40 mb-3">
              Shop
            </p>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-ink-900/65 hover:text-rose-600 transition-colors">All Gifts</Link></li>
              <li><Link href="/products?featured=1" className="text-sm text-ink-900/65 hover:text-rose-600 transition-colors">Bestsellers</Link></li>
              <li><Link href="/cart" className="text-sm text-ink-900/65 hover:text-rose-600 transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/40 mb-3">
              Company
            </p>
            <ul className="space-y-2">
              <li><span className="text-sm text-ink-900/65">About Us</span></li>
              <li><span className="text-sm text-ink-900/65">Shipping & Returns</span></li>
              <li><span className="text-sm text-ink-900/65">Contact</span></li>
              <li><Link href="/admin" className="text-sm text-ink-900/40 hover:text-rose-600 transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-rose-100 pt-6 text-center text-xs text-ink-900/40">
          © {new Date().getFullYear()} Presently. Demo storefront — all products are sample data.
        </div>
      </div>
    </footer>
  );
}
