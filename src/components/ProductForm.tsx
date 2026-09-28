"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Category, Occasion, Product } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function ProductForm({
  action,
  categories,
  occasions,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  occasions: Occasion[];
  product?: Product;
}) {
  return (
    <form action={action} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 hover:bg-rose-50">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {product ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Product Name</label>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product?.description}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Price (₹)</label>
            <input
              name="price"
              type="number"
              min={0}
              required
              defaultValue={product?.price}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">MRP (₹)</label>
            <input
              name="mrp"
              type="number"
              min={0}
              defaultValue={product?.mrp ?? ""}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Stock</label>
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={product?.stock ?? 20}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Badge</label>
            <select
              name="badge"
              defaultValue={product?.badge ?? ""}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            >
              <option value="">None</option>
              <option value="Bestseller">Bestseller</option>
              <option value="New">New</option>
              <option value="Trending">Trending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Category</label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-ink-900/70">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-rose-600" />
              Show as Featured on homepage
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Occasions</label>
          <div className="flex flex-wrap gap-2 rounded-xl border border-rose-100 p-3">
            {occasions.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-1.5 rounded-full border border-rose-100 px-3 py-1.5 text-xs has-[:checked]:border-rose-600 has-[:checked]:bg-rose-50 has-[:checked]:text-rose-600"
              >
                <input
                  type="checkbox"
                  name="occasionIds"
                  value={o.id}
                  defaultChecked={product?.occasionIds.includes(o.id)}
                  className="h-3 w-3 accent-rose-600"
                />
                {o.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">
            Image URLs (one per line — first is the main image)
          </label>
          <textarea
            name="images"
            rows={3}
            required
            defaultValue={product?.images.join("\n")}
            placeholder="https://images.unsplash.com/..."
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Rating (0-5)</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              defaultValue={product?.rating ?? 4.5}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Reviews Count</label>
            <input
              name="reviewsCount"
              type="number"
              min={0}
              defaultValue={product?.reviewsCount ?? 0}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
      </div>

      <SubmitButton label={product ? "Save Changes" : "Create Product"} />
    </form>
  );
}
