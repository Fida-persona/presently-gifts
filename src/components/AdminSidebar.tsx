"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PartyPopper,
  Tags,
  ShoppingCart,
  LogOut,
  Gift,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/occasions", label: "Occasions", icon: PartyPopper },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/gift-wraps", label: "Gift Wraps", icon: Gift },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-rose-100 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-gold-500 text-white">
          <Gift size={16} />
        </span>
        <span className="font-display text-lg font-semibold">Presently</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-rose-50 text-rose-600" : "text-ink-900/65 hover:bg-cream-100"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-rose-100 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-900/65 hover:bg-cream-100"
        >
          <ExternalLink size={17} /> View Store
        </Link>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-900/65 hover:bg-rose-50 hover:text-rose-600">
            <LogOut size={17} /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
