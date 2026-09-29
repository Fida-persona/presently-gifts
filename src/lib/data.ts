import {
  db,
  dbReady,
  rowToObject,
  OccasionRow,
  CategoryRow,
  ProductRow,
  OrderRow,
  UserRow,
  GiftWrapRow,
} from "./db";
import type { InValue } from "@libsql/client";
import type { Occasion, Category, Product, Order, CartItem, User, GiftWrap } from "./types";

function toOccasion(r: OccasionRow): Occasion {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline ?? "",
    image: r.image ?? "",
    fromColor: r.from_color,
    toColor: r.to_color,
    sortOrder: r.sort_order,
  };
}

function toCategory(r: CategoryRow): Category {
  return { id: r.id, name: r.name, slug: r.slug, icon: r.icon };
}

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    price: r.price,
    mrp: r.mrp,
    images: JSON.parse(r.images || "[]"),
    categoryId: r.category_id,
    occasionIds: JSON.parse(r.occasion_ids || "[]"),
    stock: r.stock,
    rating: r.rating,
    reviewsCount: r.reviews_count,
    badge: r.badge,
    featured: !!r.featured,
    createdAt: r.created_at,
  };
}

function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    userId: r.user_id,
    items: JSON.parse(r.items || "[]") as CartItem[],
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    city: r.city,
    pincode: r.pincode,
    giftMessage: r.gift_message,
    giftWrapName: r.gift_wrap_name,
    giftWrapPrice: r.gift_wrap_price ?? 0,
    total: r.total,
    status: r.status,
    createdAt: r.created_at,
  };
}

function toUser(r: UserRow): User {
  return { id: r.id, name: r.name, email: r.email };
}

function toGiftWrap(r: GiftWrapRow): GiftWrap {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    image: r.image ?? "",
    price: r.price,
    sortOrder: r.sort_order,
  };
}

// ---------- Occasions ----------
export async function getOccasions(): Promise<Occasion[]> {
  await dbReady;
  const res = await db.execute(`SELECT * FROM occasions ORDER BY sort_order ASC, id ASC`);
  return res.rows.map((r) => toOccasion(rowToObject<OccasionRow>(res.columns, r)));
}

export async function getOccasionBySlug(slug: string): Promise<Occasion | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM occasions WHERE slug = ?`, args: [slug] });
  return res.rows[0] ? toOccasion(rowToObject<OccasionRow>(res.columns, res.rows[0])) : null;
}

export async function getOccasionById(id: number): Promise<Occasion | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM occasions WHERE id = ?`, args: [id] });
  return res.rows[0] ? toOccasion(rowToObject<OccasionRow>(res.columns, res.rows[0])) : null;
}

export async function createOccasion(data: Omit<Occasion, "id">): Promise<number> {
  await dbReady;
  const res = await db.execute({
    sql: `INSERT INTO occasions (name, slug, tagline, image, from_color, to_color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [data.name, data.slug, data.tagline, data.image, data.fromColor, data.toColor, data.sortOrder],
  });
  return Number(res.lastInsertRowid);
}

export async function updateOccasion(id: number, data: Omit<Occasion, "id">) {
  await dbReady;
  await db.execute({
    sql: `UPDATE occasions SET name=?, slug=?, tagline=?, image=?, from_color=?, to_color=?, sort_order=? WHERE id=?`,
    args: [data.name, data.slug, data.tagline, data.image, data.fromColor, data.toColor, data.sortOrder, id],
  });
}

export async function deleteOccasion(id: number) {
  await dbReady;
  await db.execute({ sql: `DELETE FROM occasions WHERE id = ?`, args: [id] });
}

// ---------- Categories ----------
export async function getCategories(): Promise<Category[]> {
  await dbReady;
  const res = await db.execute(`SELECT * FROM categories ORDER BY name ASC`);
  return res.rows.map((r) => toCategory(rowToObject<CategoryRow>(res.columns, r)));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM categories WHERE slug = ?`, args: [slug] });
  return res.rows[0] ? toCategory(rowToObject<CategoryRow>(res.columns, res.rows[0])) : null;
}

export async function createCategory(data: Omit<Category, "id">): Promise<number> {
  await dbReady;
  const res = await db.execute({
    sql: `INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)`,
    args: [data.name, data.slug, data.icon],
  });
  return Number(res.lastInsertRowid);
}

export async function updateCategory(id: number, data: Omit<Category, "id">) {
  await dbReady;
  await db.execute({
    sql: `UPDATE categories SET name=?, slug=?, icon=? WHERE id=?`,
    args: [data.name, data.slug, data.icon, id],
  });
}

export async function deleteCategory(id: number) {
  await dbReady;
  await db.execute({ sql: `DELETE FROM categories WHERE id = ?`, args: [id] });
}

// ---------- Products ----------
export type ProductFilters = {
  occasionSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: "popular" | "price_asc" | "price_desc" | "newest" | "rating";
  featured?: boolean;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await dbReady;
  const res = await db.execute(`SELECT * FROM products`);
  let products = res.rows.map((r) => toProduct(rowToObject<ProductRow>(res.columns, r)));

  if (filters.occasionSlug) {
    const occ = await getOccasionBySlug(filters.occasionSlug);
    if (occ) products = products.filter((p) => p.occasionIds.includes(occ.id));
    else products = [];
  }
  if (filters.categorySlug) {
    const cat = await getCategoryBySlug(filters.categorySlug);
    if (cat) products = products.filter((p) => p.categoryId === cat.id);
    else products = [];
  }
  if (typeof filters.minPrice === "number") {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (filters.featured) {
    products = products.filter((p) => p.featured);
  }

  switch (filters.sort) {
    case "price_asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    default:
      products.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM products WHERE slug = ?`, args: [slug] });
  return res.rows[0] ? toProduct(rowToObject<ProductRow>(res.columns, res.rows[0])) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM products WHERE id = ?`, args: [id] });
  return res.rows[0] ? toProduct(rowToObject<ProductRow>(res.columns, res.rows[0])) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId ||
          p.occasionIds.some((o) => product.occasionIds.includes(o)))
    )
    .slice(0, limit);
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<number> {
  await dbReady;
  const args: InValue[] = [
    data.name,
    data.slug,
    data.description,
    data.price,
    data.mrp,
    JSON.stringify(data.images),
    data.categoryId,
    JSON.stringify(data.occasionIds),
    data.stock,
    data.rating,
    data.reviewsCount,
    data.badge,
    data.featured ? 1 : 0,
  ];
  const res = await db.execute({
    sql: `INSERT INTO products (name, slug, description, price, mrp, images, category_id, occasion_ids, stock, rating, reviews_count, badge, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args,
  });
  return Number(res.lastInsertRowid);
}

export async function updateProduct(id: number, data: Omit<Product, "id" | "createdAt">) {
  await dbReady;
  const args: InValue[] = [
    data.name,
    data.slug,
    data.description,
    data.price,
    data.mrp,
    JSON.stringify(data.images),
    data.categoryId,
    JSON.stringify(data.occasionIds),
    data.stock,
    data.rating,
    data.reviewsCount,
    data.badge,
    data.featured ? 1 : 0,
    id,
  ];
  await db.execute({
    sql: `UPDATE products SET name=?, slug=?, description=?, price=?, mrp=?, images=?, category_id=?, occasion_ids=?, stock=?, rating=?, reviews_count=?, badge=?, featured=? WHERE id=?`,
    args,
  });
}

export async function deleteProduct(id: number) {
  await dbReady;
  await db.execute({ sql: `DELETE FROM products WHERE id = ?`, args: [id] });
}

export async function decrementStock(id: number, qty: number) {
  await dbReady;
  await db.execute({
    sql: `UPDATE products SET stock = MAX(stock - ?, 0) WHERE id = ?`,
    args: [qty, id],
  });
}

// ---------- Orders ----------
export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Promise<number> {
  await dbReady;
  const res = await db.execute({
    sql: `INSERT INTO orders (user_id, items, customer_name, email, phone, address, city, pincode, gift_message, gift_wrap_name, gift_wrap_price, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'placed')`,
    args: [
      data.userId,
      JSON.stringify(data.items),
      data.customerName,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.pincode,
      data.giftMessage,
      data.giftWrapName,
      data.giftWrapPrice,
      data.total,
    ],
  });
  for (const item of data.items) {
    await decrementStock(item.productId, item.qty);
  }
  return Number(res.lastInsertRowid);
}

export async function getOrders(): Promise<Order[]> {
  await dbReady;
  const res = await db.execute(`SELECT * FROM orders ORDER BY created_at DESC`);
  return res.rows.map((r) => toOrder(rowToObject<OrderRow>(res.columns, r)));
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    args: [userId],
  });
  return res.rows.map((r) => toOrder(rowToObject<OrderRow>(res.columns, r)));
}

export async function getOrderById(id: number): Promise<Order | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM orders WHERE id = ?`, args: [id] });
  return res.rows[0] ? toOrder(rowToObject<OrderRow>(res.columns, res.rows[0])) : null;
}

export async function updateOrderStatus(id: number, status: string) {
  await dbReady;
  await db.execute({ sql: `UPDATE orders SET status = ? WHERE id = ?`, args: [status, id] });
}

// ---------- Users ----------
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<number> {
  await dbReady;
  const res = await db.execute({
    sql: `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
    args: [data.name, data.email.toLowerCase().trim(), data.passwordHash],
  });
  return Number(res.lastInsertRowid);
}

export async function getUserByEmail(
  email: string
): Promise<(User & { passwordHash: string }) | null> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM users WHERE email = ?`,
    args: [email.toLowerCase().trim()],
  });
  if (!res.rows[0]) return null;
  const row = rowToObject<UserRow>(res.columns, res.rows[0]);
  return { ...toUser(row), passwordHash: row.password_hash };
}

export async function getUserById(id: number): Promise<User | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM users WHERE id = ?`, args: [id] });
  return res.rows[0] ? toUser(rowToObject<UserRow>(res.columns, res.rows[0])) : null;
}

// ---------- Gift Wraps ----------
export async function getGiftWraps(): Promise<GiftWrap[]> {
  await dbReady;
  const res = await db.execute(`SELECT * FROM gift_wraps ORDER BY sort_order ASC, id ASC`);
  return res.rows.map((r) => toGiftWrap(rowToObject<GiftWrapRow>(res.columns, r)));
}

export async function getGiftWrapById(id: number): Promise<GiftWrap | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM gift_wraps WHERE id = ?`, args: [id] });
  return res.rows[0] ? toGiftWrap(rowToObject<GiftWrapRow>(res.columns, res.rows[0])) : null;
}

export async function getGiftWrapBySlug(slug: string): Promise<GiftWrap | null> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM gift_wraps WHERE slug = ?`, args: [slug] });
  return res.rows[0] ? toGiftWrap(rowToObject<GiftWrapRow>(res.columns, res.rows[0])) : null;
}

export async function createGiftWrap(data: Omit<GiftWrap, "id">): Promise<number> {
  await dbReady;
  const res = await db.execute({
    sql: `INSERT INTO gift_wraps (name, slug, description, image, price, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [data.name, data.slug, data.description, data.image, data.price, data.sortOrder],
  });
  return Number(res.lastInsertRowid);
}

export async function updateGiftWrap(id: number, data: Omit<GiftWrap, "id">) {
  await dbReady;
  await db.execute({
    sql: `UPDATE gift_wraps SET name=?, slug=?, description=?, image=?, price=?, sort_order=? WHERE id=?`,
    args: [data.name, data.slug, data.description, data.image, data.price, data.sortOrder, id],
  });
}

export async function deleteGiftWrap(id: number) {
  await dbReady;
  await db.execute({ sql: `DELETE FROM gift_wraps WHERE id = ?`, args: [id] });
}

// ---------- Dashboard stats ----------
export async function getStats() {
  await dbReady;
  const [productRes, orderRes, revenueRes, lowStockRes, occasionRes] = await Promise.all([
    db.execute(`SELECT COUNT(*) as c FROM products`),
    db.execute(`SELECT COUNT(*) as c FROM orders`),
    db.execute(`SELECT COALESCE(SUM(total),0) as s FROM orders`),
    db.execute(`SELECT COUNT(*) as c FROM products WHERE stock <= 5`),
    db.execute(`SELECT COUNT(*) as c FROM occasions`),
  ]);
  return {
    productCount: Number(productRes.rows[0][0]),
    orderCount: Number(orderRes.rows[0][0]),
    revenue: Number(revenueRes.rows[0][0]),
    lowStock: Number(lowStockRes.rows[0][0]),
    occasionCount: Number(occasionRes.rows[0][0]),
  };
}
