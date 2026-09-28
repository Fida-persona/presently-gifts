"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-rose-100 px-5 py-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <ShoppingBag size={18} /> Your Cart
              </h2>
              <button onClick={closeCart} className="rounded-full p-1.5 hover:bg-rose-50">
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
                <span className="text-5xl">🎁</span>
                <p className="text-ink-900/60 text-sm">Your cart is empty. Let&apos;s find the perfect gift!</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
                >
                  Browse Gifts
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-rose-50">
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <Link href={`/products/${item.slug}`} onClick={closeCart} className="text-sm font-medium line-clamp-2 hover:text-rose-600">
                              {item.name}
                            </Link>
                            <button onClick={() => removeItem(item.productId)} className="shrink-0 text-ink-900/30 hover:text-rose-600">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-rose-100">
                              <button
                                onClick={() => updateQty(item.productId, item.qty - 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-rose-50"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-4 text-center text-xs font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.productId, item.qty + 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-rose-50"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-rose-100 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-ink-900/60">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink-900">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-ink-900/40">Shipping & taxes calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full rounded-full bg-rose-600 py-3 text-center text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
