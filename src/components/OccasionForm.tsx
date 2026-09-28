"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Occasion } from "@/lib/types";

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

export default function OccasionForm({
  action,
  occasion,
}: {
  action: (formData: FormData) => void;
  occasion?: Occasion;
}) {
  const [preview, setPreview] = useState(occasion?.image ?? "");

  return (
    <form action={action} className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/occasions" className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 hover:bg-rose-50">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {occasion ? "Edit Occasion" : "New Occasion"}
        </h1>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Name</label>
          <input
            name="name"
            required
            defaultValue={occasion?.name}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Tagline</label>
          <input
            name="tagline"
            defaultValue={occasion?.tagline}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Image URL</label>
          <input
            name="image"
            required
            defaultValue={occasion?.image}
            onChange={(e) => setPreview(e.target.value)}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
          {preview && (
            <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-xl bg-rose-50">
              <Image src={preview} alt="preview" fill sizes="128px" className="object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Gradient From</label>
            <input
              name="fromColor"
              type="color"
              defaultValue={occasion?.fromColor ?? "#f43f7d"}
              className="h-10 w-full rounded-xl border border-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Gradient To</label>
            <input
              name="toColor"
              type="color"
              defaultValue={occasion?.toColor ?? "#ec4899"}
              className="h-10 w-full rounded-xl border border-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={occasion?.sortOrder ?? 0}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
      </div>

      <SubmitButton label={occasion ? "Save Changes" : "Create Occasion"} />
    </form>
  );
}
