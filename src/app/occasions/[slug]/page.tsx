import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getOccasionBySlug, getOccasions, getProducts } from "@/lib/data";
import type { ProductFilters } from "@/lib/data";

type Params = { slug: string };
type SearchParams = { category?: string; min?: string; max?: string; sort?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const occasion = await getOccasionBySlug(slug);
  return { title: occasion ? `${occasion.name} Gifts — Presently` : "Presently" };
}

export default async function OccasionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const occasion = await getOccasionBySlug(slug);
  if (!occasion) notFound();

  const categories = await getCategories();
  const occasions = await getOccasions();

  const filters: ProductFilters = {
    occasionSlug: slug,
    categorySlug: sp.category,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (sp.sort as ProductFilters["sort"]) ?? "popular",
  };
  const products = await getProducts(filters);

  return (
    <div>
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <Image src={occasion.image} alt={occasion.name} fill priority className="object-cover" sizes="100vw" />
        <div
          className="absolute inset-0 flex items-center"
          style={{ background: `linear-gradient(90deg, ${occasion.fromColor}dd, ${occasion.toColor}66)` }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Occasion</p>
            <h1 className="mt-1 font-display text-3xl sm:text-5xl font-semibold text-white">{occasion.name}</h1>
            <p className="mt-2 max-w-md text-sm sm:text-base text-white/85">{occasion.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <p className="mb-6 text-sm text-ink-900/50">{products.length} gifts for {occasion.name}</p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <FiltersSidebar categories={categories} occasions={occasions} />
          <div className="flex-1">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
