"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { placeOrderAction } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const router = useRouter();
  const [state, formAction, pending] = useActionState(placeOrderAction, undefined);

  useEffect(() => {
    if (items.length === 0) router.replace("/products");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form action={formAction} className="lg:col-span-2 space-y-5">
          <input type="hidden" name="items" value={JSON.stringify(items)} />

          <div className="rounded-2xl border border-rose-100 bg-white p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Shipping Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="name" required />
              <Field label="Phone Number" name="phone" type="tel" required />
              <Field label="Email" name="email" type="email" required className="sm:col-span-2" />
              <Field label="Address" name="address" required className="sm:col-span-2" />
              <Field label="City" name="city" required />
              <Field label="Pincode" name="pincode" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Gift Message (optional)</label>
              <textarea
                name="giftMessage"
                rows={3}
                placeholder="Add a personal note to include with the gift..."
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{state.error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-700 disabled:opacity-60"
          >
            <Lock size={15} /> {pending ? "Placing order..." : `Place Order — ${formatCurrency(total)}`}
          </motion.button>
          <p className="text-center text-xs text-ink-900/40">
            This is a demo checkout — no real payment will be processed.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-rose-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-rose-50">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-ink-900/50">Qty {item.qty}</p>
                </div>
                <span className="text-xs font-semibold">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-rose-100 pt-4 text-sm">
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
          <Link href="/cart" className="mt-4 block text-center text-xs font-medium text-rose-600 hover:underline">
            Edit cart
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-ink-900/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
      />
    </div>
  );
}
