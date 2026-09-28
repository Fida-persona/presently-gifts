import Link from "next/link";
import { Package, ShoppingCart, IndianRupee, AlertTriangle, PartyPopper, ArrowUpRight } from "lucide-react";
import { getStats, getOrders, getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentOrders = (await getOrders()).slice(0, 5);
  const lowStockProducts = (await getProducts()).filter((p) => p.stock <= 5).slice(0, 5);

  const cards = [
    { label: "Total Products", value: stats.productCount, icon: Package, color: "text-rose-600 bg-rose-50" },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: IndianRupee, color: "text-green-600 bg-green-50" },
    { label: "Occasions Live", value: stats.occasionCount, icon: PartyPopper, color: "text-gold-600 bg-gold-400/10" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-900/50">Welcome back — here&apos;s what&apos;s happening in your store.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-rose-100 bg-white p-5">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${c.color}`}>
              <c.icon size={18} />
            </span>
            <p className="mt-3 text-xl font-semibold text-ink-900">{c.value}</p>
            <p className="text-xs text-ink-900/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-ink-900/40">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-cream-100"
                >
                  <div>
                    <p className="text-sm font-medium">#{o.id} · {o.customerName || "Guest"}</p>
                    <p className="text-xs text-ink-900/45">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(o.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600" />
            <h2 className="font-display text-lg font-semibold">Low Stock Alerts</h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-900/40">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}/edit`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-cream-100"
                >
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <span className="text-xs font-semibold text-rose-600">{p.stock} left</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
