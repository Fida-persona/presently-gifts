"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category, Occasion } from "@/lib/types";

const PRICE_BANDS = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: 999999 },
];

export default function FiltersSidebar({
  categories,
  occasions,
  showOccasions = false,
}: {
  categories: Category[];
  occasions?: Occasion[];
  showOccasions?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCategory = searchParams.get("category");
  const activeOccasion = searchParams.get("occasion");
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");
  const sort = searchParams.get("sort") ?? "popular";

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function togglePriceBand(band: (typeof PRICE_BANDS)[number]) {
    if (minPrice === String(band.min) && maxPrice === String(band.max)) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("min");
      params.delete("max");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("min", String(band.min));
      params.set("max", String(band.max));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const hasActiveFilters = activeCategory || activeOccasion || minPrice || maxPrice;

  const content = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-semibold">Filters</p>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs font-medium text-rose-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-900/40">Sort by</p>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {showOccasions && occasions && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-900/40">Occasion</p>
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => (
              <button
                key={o.id}
                onClick={() => setParam("occasion", activeOccasion === o.slug ? null : o.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeOccasion === o.slug
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-rose-100 bg-white text-ink-900/70 hover:border-rose-300"
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-900/40">Category</p>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                checked={activeCategory === c.slug}
                onChange={() => setParam("category", activeCategory === c.slug ? null : c.slug)}
                className="h-4 w-4 accent-rose-600"
              />
              <span className="text-sm text-ink-900/75">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-900/40">Price</p>
        <div className="space-y-2">
          {PRICE_BANDS.map((band) => (
            <label key={band.label} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                checked={minPrice === String(band.min) && maxPrice === String(band.max)}
                onChange={() => togglePriceBand(band)}
                className="h-4 w-4 accent-rose-600"
              />
              <span className="text-sm text-ink-900/75">{band.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      <aside className="hidden lg:block w-64 shrink-0">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="mb-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose-50">
              <X size={18} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
