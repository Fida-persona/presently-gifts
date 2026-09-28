"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total());

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl">🎁</span>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Your cart is empty</h1>
        <p className="text-sm text-ink-900/60">Looks like you haven&apos;t found the perfect gift yet.</p>
        <Link href="/products" className="mt-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
          Browse Gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-8 flex items-center gap-3">
        <ShoppingBag size={26} /> Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-4"
              >
                <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-rose-50">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <Link href={`/products/${item.slug}`} className="font-medium text-ink-900 hover:text-rose-600">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.productId)} className="text-ink-900/30 hover:text-rose-600 shrink-0">
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-rose-100 px-1">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose-50"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose-50"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-display font-semibold">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-2xl border border-rose-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-900/60">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-ink-900/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t border-rose-100 pt-2 font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-5 block w-full rounded-full bg-rose-600 py-3 text-center text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
