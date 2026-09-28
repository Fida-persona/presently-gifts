import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, Undo2 } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import StarRating from "@/components/StarRating";
import ProductGrid from "@/components/ProductGrid";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getOccasionById, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { discountPercent, formatCurrency } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — Presently` : "Presently" };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const discount = discountPercent(product.price, product.mrp);
  const occasionTags = (
    await Promise.all(product.occasionIds.map((id) => getOccasionById(id)))
  ).filter((o): o is NonNullable<typeof o> => !!o);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-900/40">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-rose-600">All Gifts</Link>
        <ChevronRight size={12} />
        <span className="text-ink-900/70 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.badge && (
            <span className="mb-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} reviews={product.reviewsCount} size={16} />
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-3xl font-semibold text-ink-900">{formatCurrency(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="pb-1 text-base text-ink-900/40 line-through">{formatCurrency(product.mrp)}</span>
                <span className="pb-1 text-sm font-semibold text-rose-600">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-900/65">{product.description}</p>

          {occasionTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {occasionTags.map((o) => (
                <Link
                  key={o.id}
                  href={`/occasions/${o.slug}`}
                  className="rounded-full border border-rose-100 bg-white px-3 py-1 text-xs font-medium text-ink-900/70 hover:border-rose-300 hover:text-rose-600 transition-colors"
                >
                  {o.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-7 border-t border-rose-100 pt-6">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-rose-100 pt-6 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={20} className="text-rose-600" />
              <span className="text-[11px] text-ink-900/60">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={20} className="text-rose-600" />
              <span className="text-[11px] text-ink-900/60">Secure Packaging</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Undo2 size={20} className="text-rose-600" />
              <span className="text-[11px] text-ink-900/60">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <RevealOnScroll>
            <h2 className="mb-6 font-display text-2xl font-semibold text-ink-900">You may also like</h2>
          </RevealOnScroll>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
