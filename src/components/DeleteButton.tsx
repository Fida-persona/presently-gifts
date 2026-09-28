"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  confirmText = "Are you sure you want to delete this?",
  className,
}: {
  action: () => Promise<void>;
  confirmText?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className={className ?? "flex h-8 w-8 items-center justify-center rounded-full text-ink-900/40 hover:bg-rose-50 hover:text-rose-600"}
    >
      <Trash2 size={15} />
    </button>
  );
}
