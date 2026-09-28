"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

const COLORS: Record<string, string> = {
  placed: "bg-blue-50 text-blue-600",
  processing: "bg-amber-50 text-amber-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-rose-50 text-rose-600",
};

export default function OrderStatusSelect({ orderId, status }: { orderId: number; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateOrderStatusAction(orderId, e.target.value))}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize outline-none ${COLORS[status] ?? "bg-cream-100"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
