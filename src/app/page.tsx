import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import OccasionGrid from "@/components/OccasionGrid";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getOccasions, getCategories, getProducts } from "@/lib/data";

export default async function Home() {
  const occasions = await getOccasions();
  const categories = await getCategories();
  const featured = (await getProducts({ featured: true, sort: "rating" })).slice(0, 8);
  const trending = (await getProducts({ sort: "popular" })).slice(0, 8);

  return (
    <>
      <Hero occasions={occasions} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <RevealOnScroll className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Browse by</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Shop by Occasion</h2>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </RevealOnScroll>
        <OccasionGrid occasions={occasions} />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Handpicked</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Featured Gifts</h2>
            </div>
            <Link href="/products?featured=1" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </RevealOnScroll>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <RevealOnScroll className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Shop by type</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Categories</h2>
          </div>
        </RevealOnScroll>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c, i) => (
            <RevealOnScroll key={c.id} delay={Math.min(i * 0.04, 0.3)} className="shrink-0">
              <Link
                href={`/products?category=${c.slug}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-rose-100 bg-white px-5 py-2.5 text-sm font-medium text-ink-900/75 transition-colors hover:border-rose-300 hover:text-rose-600"
              >
                {c.name}
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Popular right now</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Trending Gifts</h2>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </RevealOnScroll>
          <ProductGrid products={trending} />
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </>
  );
}
