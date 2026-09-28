import { createClient, type Client, type Row } from "@libsql/client";
import { seedIfEmpty } from "./seed";

declare global {
  // eslint-disable-next-line no-var
  var __giftsDb: Client | undefined;
  // eslint-disable-next-line no-var
  var __giftsDbReady: Promise<void> | undefined;
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "TURSO_DATABASE_URL is not set. Create a Turso database and add TURSO_DATABASE_URL / TURSO_AUTH_TOKEN to your .env.local."
  );
}

export const db: Client = global.__giftsDb ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") global.__giftsDb = db;

async function init() {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS occasions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        tagline TEXT,
        image TEXT,
        from_color TEXT DEFAULT '#f43f5e',
        to_color TEXT DEFAULT '#ec4899',
        sort_order INTEGER DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT DEFAULT 'Gift'
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT DEFAULT '',
        price REAL NOT NULL,
        mrp REAL,
        images TEXT NOT NULL DEFAULT '[]',
        category_id INTEGER,
        occasion_ids TEXT NOT NULL DEFAULT '[]',
        stock INTEGER DEFAULT 20,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 0,
        badge TEXT DEFAULT '',
        featured INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        items TEXT NOT NULL DEFAULT '[]',
        customer_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        pincode TEXT,
        gift_message TEXT,
        total REAL,
        status TEXT DEFAULT 'placed',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
    ],
    "write"
  );
  await seedIfEmpty();
}

export const dbReady: Promise<void> = global.__giftsDbReady ?? init();
if (process.env.NODE_ENV !== "production") global.__giftsDbReady = dbReady;

/** Converts a libsql Row (array-like) into a plain object keyed by column name. */
export function rowToObject<T>(columns: string[], row: Row): T {
  const obj: Record<string, unknown> = {};
  columns.forEach((c, i) => {
    obj[c] = row[i];
  });
  return obj as T;
}

export type OccasionRow = {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  image: string | null;
  from_color: string;
  to_color: string;
  sort_order: number;
};

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type ProductRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number | null;
  images: string;
  category_id: number | null;
  occasion_ids: string;
  stock: number;
  rating: number;
  reviews_count: number;
  badge: string;
  featured: number;
  created_at: string;
};

export type OrderRow = {
  id: number;
  items: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  gift_message: string | null;
  total: number;
  status: string;
  created_at: string;
};
