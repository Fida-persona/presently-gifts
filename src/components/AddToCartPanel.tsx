"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export default function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      qty,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      qty,
      stock: product.stock,
    });
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-900/60">Quantity</span>
        <div className="flex items-center gap-3 rounded-full border border-rose-100 px-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-rose-50"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-rose-50"
          >
            <Plus size={14} />
          </button>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="text-xs font-medium text-rose-600">Only {product.stock} left!</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          disabled={outOfStock}
          className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-rose-600 py-3.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-ink-900/15 disabled:text-ink-900/30"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check size={16} /> Added to cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} /> {outOfStock ? "Out of stock" : "Add to Cart"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-ink-900/15 disabled:shadow-none"
        >
          <Zap size={16} /> Buy Now
        </motion.button>
      </div>
    </div>
  );
}
