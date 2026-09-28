import Link from "next/link";
import { getOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Orders</h1>
      <p className="mt-1 text-sm text-ink-900/50">{orders.length} orders placed</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-900/40">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rose-100 bg-cream-100/60 text-left text-xs uppercase tracking-wide text-ink-900/45">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-rose-50 last:border-0 hover:bg-cream-100/40">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-rose-600 hover:underline">
                      #{o.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{o.customerName || "Guest"}</p>
                    <p className="text-xs text-ink-900/40">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-900/60">{o.items.length} item(s)</td>
                  <td className="px-5 py-3 font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-5 py-3 text-ink-900/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
