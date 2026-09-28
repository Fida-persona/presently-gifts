import { Plus } from "lucide-react";
import { getCategories } from "@/lib/data";
import { createCategoryAction } from "@/lib/actions";
import CategoryRow from "@/components/CategoryRow";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Categories</h1>
      <p className="mt-1 text-sm text-ink-900/50">{categories.length} product categories</p>

      <form action={createCategoryAction} className="mt-6 flex items-center gap-2 rounded-2xl border border-rose-100 bg-white p-4">
        <input
          name="name"
          required
          placeholder="New category name"
          className="flex-1 rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
        <input
          name="icon"
          placeholder="Icon (optional)"
          defaultValue="Gift"
          className="w-36 rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
        <button type="submit" className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
          <Plus size={15} /> Add
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
