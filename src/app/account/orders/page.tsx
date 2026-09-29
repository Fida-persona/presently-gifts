import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  placed: "bg-blue-50 text-blue-600",
  processing: "bg-amber-50 text-amber-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-rose-50 text-rose-600",
};

export default async function MyOrdersPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in?next=/account/orders");

  const orders = await getOrdersByUserId(userId);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-rose-200 py-20 text-center">
          <PackageSearch size={36} className="text-ink-900/30" />
          <p className="text-ink-900/60">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="mt-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            Browse Gifts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-rose-100 bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id}</p>
                  <p className="text-xs text-ink-900/45">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? "bg-cream-100"}`}>
                  {order.status}
                </span>
              </div>
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
                <p className="mt-3 text-xs text-ink-900/50">🎁 Gift wrapped: {order.giftWrapName}</p>
              )}
              <div className="mt-4 flex justify-between border-t border-rose-100 pt-4 text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
