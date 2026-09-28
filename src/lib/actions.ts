"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createCategory,
  createOccasion,
  createOrder,
  createProduct,
  deleteCategory,
  deleteOccasion,
  deleteProduct,
  getCategoryBySlug,
  getOccasionBySlug,
  getProductBySlug,
  updateCategory,
  updateOccasion,
  updateOrderStatus,
  updateProduct,
} from "./data";
import { db, dbReady } from "./db";
import { ADMIN_COOKIE, checkAdminPassword, createSessionToken, isAdminRequest } from "./auth";
import { slugify } from "./utils";
import type { CartItem } from "./types";

async function requireAdmin() {
  if (!(await isAdminRequest())) {
    throw new Error("Unauthorized");
  }
}

async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  let slug = slugify(base);
  let i = 2;
  while (await exists(slug)) {
    slug = `${slugify(base)}-${i}`;
    i++;
  }
  return slug;
}

async function getExistingSlug(table: "products" | "occasions", id: number): Promise<string | undefined> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT slug FROM ${table} WHERE id = ?`, args: [id] });
  return res.rows[0] ? String(res.rows[0][0]) : undefined;
}

// ---------- Auth ----------
export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- Products ----------
export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const occasionIds = formData.getAll("occasionIds").map((v) => Number(v));

  const id = await createProduct({
    name,
    slug: await uniqueSlug(name, async (s) => !!(await getProductBySlug(s))),
    description: String(formData.get("description") ?? ""),
    price: Number(formData.get("price") ?? 0),
    mrp: formData.get("mrp") ? Number(formData.get("mrp")) : null,
    images: images.length ? images : ["https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"],
    categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
    occasionIds,
    stock: Number(formData.get("stock") ?? 20),
    rating: Number(formData.get("rating") ?? 4.5),
    reviewsCount: Number(formData.get("reviewsCount") ?? 0),
    badge: String(formData.get("badge") ?? ""),
    featured: formData.get("featured") === "on",
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect(`/admin/products/${id}/edit?created=1`);
}

export async function updateProductAction(id: number, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const occasionIds = formData.getAll("occasionIds").map((v) => Number(v));
  const existingSlug = await getExistingSlug("products", id);

  await updateProduct(id, {
    name,
    slug: existingSlug ?? (await uniqueSlug(name, async (s) => !!(await getProductBySlug(s)))),
    description: String(formData.get("description") ?? ""),
    price: Number(formData.get("price") ?? 0),
    mrp: formData.get("mrp") ? Number(formData.get("mrp")) : null,
    images: images.length ? images : [],
    categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
    occasionIds,
    stock: Number(formData.get("stock") ?? 0),
    rating: Number(formData.get("rating") ?? 4.5),
    reviewsCount: Number(formData.get("reviewsCount") ?? 0),
    badge: String(formData.get("badge") ?? ""),
    featured: formData.get("featured") === "on",
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect(`/admin/products/${id}/edit?saved=1`);
}

export async function deleteProductAction(id: number) {
  await requireAdmin();
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

// ---------- Occasions ----------
export async function createOccasionAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  await createOccasion({
    name,
    slug: await uniqueSlug(name, async (s) => !!(await getOccasionBySlug(s))),
    tagline: String(formData.get("tagline") ?? ""),
    image: String(formData.get("image") ?? ""),
    fromColor: String(formData.get("fromColor") ?? "#f43f7d"),
    toColor: String(formData.get("toColor") ?? "#ec4899"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidatePath("/admin/occasions");
  revalidatePath("/");
  redirect("/admin/occasions?created=1");
}

export async function updateOccasionAction(id: number, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const existingSlug = await getExistingSlug("occasions", id);
  await updateOccasion(id, {
    name,
    slug: existingSlug ?? (await uniqueSlug(name, async (s) => !!(await getOccasionBySlug(s)))),
    tagline: String(formData.get("tagline") ?? ""),
    image: String(formData.get("image") ?? ""),
    fromColor: String(formData.get("fromColor") ?? "#f43f7d"),
    toColor: String(formData.get("toColor") ?? "#ec4899"),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidatePath("/admin/occasions");
  revalidatePath("/");
  redirect("/admin/occasions?saved=1");
}

export async function deleteOccasionAction(id: number) {
  await requireAdmin();
  await deleteOccasion(id);
  revalidatePath("/admin/occasions");
  revalidatePath("/");
}

// ---------- Categories ----------
export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  await createCategory({
    name,
    slug: await uniqueSlug(name, async (s) => !!(await getCategoryBySlug(s))),
    icon: String(formData.get("icon") ?? "Gift"),
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function updateCategoryAction(id: number, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  await updateCategory(id, {
    name,
    slug: await uniqueSlug(name, async (s) => {
      const existing = await getCategoryBySlug(s);
      return !!existing && existing.id !== id;
    }),
    icon: String(formData.get("icon") ?? "Gift"),
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function deleteCategoryAction(id: number) {
  await requireAdmin();
  await deleteCategory(id);
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

// ---------- Orders ----------
export async function placeOrderAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const itemsRaw = String(formData.get("items") ?? "[]");
  let items: CartItem[] = [];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "Your cart data was invalid. Please try again." };
  }
  if (!items.length) return { error: "Your cart is empty." };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const id = await createOrder({
    items,
    customerName: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    pincode: String(formData.get("pincode") ?? ""),
    giftMessage: String(formData.get("giftMessage") ?? "") || null,
    total,
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect(`/order-success/${id}`);
}

export async function updateOrderStatusAction(id: number, status: string) {
  await requireAdmin();
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
