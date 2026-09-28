import type { Metadata } from "next";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getOccasions, getProducts } from "@/lib/data";
import type { ProductFilters } from "@/lib/data";

export const metadata: Metadata = { title: "All Gifts — Presently" };

type SearchParams = {
  category?: string;
  occasion?: string;
  min?: string;
  max?: string;
  sort?: string;
  q?: string;
  featured?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const categories = await getCategories();
  const occasions = await getOccasions();

  const filters: ProductFilters = {
    categorySlug: sp.category,
    occasionSlug: sp.occasion,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    q: sp.q,
    featured: sp.featured === "1",
    sort: (sp.sort as ProductFilters["sort"]) ?? "popular",
  };

  const products = await getProducts(filters);

  let heading = "All Gifts";
  if (sp.q) heading = `Results for "${sp.q}"`;
  else if (sp.featured === "1") heading = "Bestsellers";
  else if (sp.category) heading = categories.find((c) => c.slug === sp.category)?.name ?? heading;
  else if (sp.occasion) heading = occasions.find((o) => o.slug === sp.occasion)?.name ?? heading;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">{heading}</h1>
        <p className="mt-1 text-sm text-ink-900/50">{products.length} gifts found</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FiltersSidebar categories={categories} occasions={occasions} showOccasions />
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
