"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { updateCategoryAction, deleteCategoryAction } from "@/lib/actions";
import DeleteButton from "./DeleteButton";

export default function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const action = updateCategoryAction.bind(null, category.id);

  if (editing) {
    return (
      <form
        action={async (fd) => {
          await action(fd);
          setEditing(false);
        }}
        className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
      >
        <input
          name="name"
          defaultValue={category.name}
          className="flex-1 rounded-lg border border-rose-200 px-3 py-1.5 text-sm outline-none"
        />
        <input
          name="icon"
          defaultValue={category.icon}
          placeholder="Icon name"
          className="w-32 rounded-lg border border-rose-200 px-3 py-1.5 text-sm outline-none"
        />
        <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white">
          <Check size={14} />
        </button>
        <button type="button" onClick={() => setEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose-100">
          <X size={14} />
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium">{category.name}</p>
        <p className="text-xs text-ink-900/40">/{category.slug}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setEditing(true)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-900/40 hover:bg-rose-50 hover:text-rose-600">
          <Pencil size={14} />
        </button>
        <DeleteButton
          action={deleteCategoryAction.bind(null, category.id)}
          confirmText={`Delete "${category.name}"? Products keep their data but lose this category.`}
        />
      </div>
    </div>
  );
}
