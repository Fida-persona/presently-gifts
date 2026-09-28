import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { deleteProductAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminProductsPage() {
  const products = await getProducts({ sort: "newest" });
  const categories = await getCategories();
  const categoryName = (id: number | null) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-900/50">{products.length} products in your catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-100 bg-cream-100/60 text-left text-xs uppercase tracking-wide text-ink-900/45">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-rose-50 last:border-0 hover:bg-cream-100/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-rose-50">
                      <Image src={p.images[0]} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <span className="font-medium line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-900/60">{categoryName(p.categoryId)}</td>
                <td className="px-5 py-3 font-medium">{formatCurrency(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock <= 5 ? "font-medium text-rose-600" : "text-ink-900/60"}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">
                  {p.featured ? (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">Yes</span>
                  ) : (
                    <span className="text-xs text-ink-900/30">No</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-900/40 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteButton
                      action={deleteProductAction.bind(null, p.id)}
                      confirmText={`Delete "${p.name}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
