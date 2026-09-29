"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { GiftWrap } from "@/lib/types";

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

export default function GiftWrapForm({
  action,
  giftWrap,
}: {
  action: (formData: FormData) => void;
  giftWrap?: GiftWrap;
}) {
  const [preview, setPreview] = useState(giftWrap?.image ?? "");

  return (
    <form action={action} className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/gift-wraps" className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 hover:bg-rose-50">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {giftWrap ? "Edit Gift Wrap" : "New Gift Wrap"}
        </h1>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Name</label>
          <input
            name="name"
            required
            defaultValue={giftWrap?.name}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Description</label>
          <input
            name="description"
            defaultValue={giftWrap?.description}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Image URL</label>
          <input
            name="image"
            required
            defaultValue={giftWrap?.image}
            onChange={(e) => setPreview(e.target.value)}
            className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
          {preview && (
            <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-xl bg-rose-50">
              <Image src={preview} alt="preview" fill sizes="96px" className="object-cover" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Price (₹, 0 = free)</label>
            <input
              name="price"
              type="number"
              min={0}
              defaultValue={giftWrap?.price ?? 0}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-900/60">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={giftWrap?.sortOrder ?? 0}
              className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
      </div>

      <SubmitButton label={giftWrap ? "Save Changes" : "Create Gift Wrap"} />
    </form>
  );
}
