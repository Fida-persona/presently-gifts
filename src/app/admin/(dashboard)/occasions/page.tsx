import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getOccasions } from "@/lib/data";
import { deleteOccasionAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminOccasionsPage() {
  const occasions = await getOccasions();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Occasions</h1>
          <p className="mt-1 text-sm text-ink-900/50">{occasions.length} occasions live on the storefront</p>
        </div>
        <Link
          href="/admin/occasions/new"
          className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} /> Add Occasion
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {occasions.map((o) => (
          <div key={o.id} className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white">
            <div className="relative h-28 w-full">
              <Image src={o.image} alt={o.name} fill sizes="200px" className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-900/0 opacity-0 transition-all group-hover:bg-ink-900/40 group-hover:opacity-100">
                <Link
                  href={`/admin/occasions/${o.id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-900 hover:bg-rose-50"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteButton
                  action={deleteOccasionAction.bind(null, o.id)}
                  confirmText={`Delete "${o.name}"? Products keep their data but lose this tag.`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-900 hover:bg-rose-50 hover:text-rose-600"
                />
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium line-clamp-1">{o.name}</p>
              <p className="text-xs text-ink-900/45 line-clamp-1">{o.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
