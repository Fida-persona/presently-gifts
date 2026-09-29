import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 hover:bg-rose-50">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Order #{order.id}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-lg font-semibold mb-3">Customer</h2>
          <p className="text-sm">{order.customerName}</p>
          <p className="text-sm text-ink-900/60">{order.email}</p>
          <p className="text-sm text-ink-900/60">{order.phone}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-lg font-semibold mb-3">Shipping Address</h2>
          <p className="text-sm text-ink-900/70">{order.address}</p>
          <p className="text-sm text-ink-900/70">{order.city} - {order.pincode}</p>
          {order.giftMessage && (
            <p className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs italic text-rose-600">&ldquo;{order.giftMessage}&rdquo;</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-rose-50">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-ink-900/50">Qty {item.qty} × {formatCurrency(item.price)}</p>
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
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
