"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatCurrency, discountPercent } from "@/lib/utils";
import StarRating from "./StarRating";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const discount = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      qty: 1,
      stock: product.stock,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-rose-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.badge && (
              <span className="rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((v) => !v);
            }}
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition-transform hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart size={15} className={wishlisted ? "fill-rose-600 text-rose-600" : "text-ink-900/60"} />
          </button>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <span className="rounded-full bg-ink-900 px-3 py-1 text-xs font-medium text-white">
                Out of stock
              </span>
            </div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.03 }}
            className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2.5 text-xs font-semibold text-ink-900 opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 disabled:opacity-0"
            onClick={handleAdd}
            disabled={outOfStock}
          >
            <ShoppingBag size={14} /> Add to Cart
          </motion.button>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-ink-900/90 line-clamp-1">{product.name}</h3>
          <StarRating rating={product.rating} reviews={product.reviewsCount} />
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-ink-900">
              {formatCurrency(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-ink-900/40 line-through">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
