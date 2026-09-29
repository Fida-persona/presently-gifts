import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import Confetti from "@/components/Confetti";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ClearCartOnMount />
      <Confetti />
      <CheckCircle2 size={56} className="mx-auto text-green-500" />
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">Order Placed!</h1>
      <p className="mt-2 text-ink-900/60">
        Thank you, {order.customerName.split(" ")[0] || "friend"} — your gift is on its way. Order #{order.id}
      </p>

      <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-6 text-left">
        <h2 className="font-display text-lg font-semibold mb-4">Order Details</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-rose-50">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                <p className="text-xs text-ink-900/50">Qty {item.qty}</p>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        {order.giftWrapName && (
          <div className="mt-4 flex justify-between border-t border-rose-100 pt-4 text-sm text-ink-900/60">
            <span>🎁 Gift Wrap — {order.giftWrapName}</span>
            <span>{order.giftWrapPrice > 0 ? formatCurrency(order.giftWrapPrice) : "Free"}</span>
          </div>
        )}
        <div className="mt-4 flex justify-between border-t border-rose-100 pt-4 font-semibold">
          <span>Total Paid</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
        <div className="mt-4 border-t border-rose-100 pt-4 text-sm text-ink-900/60">
          <p>Shipping to: {order.address}, {order.city} - {order.pincode}</p>
        </div>
      </div>

      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
