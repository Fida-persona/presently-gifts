export type Occasion = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  fromColor: string;
  toColor: string;
  sortOrder: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number | null;
  images: string[];
  categoryId: number | null;
  occasionIds: number[];
  stock: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  featured: boolean;
  createdAt: string;
};

export type CartItem = {
  productId: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
};

export type Order = {
  id: number;
  userId: number | null;
  items: CartItem[];
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  giftMessage: string | null;
  giftWrapName: string | null;
  giftWrapPrice: number;
  total: number;
  status: string;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type GiftWrap = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  sortOrder: number;
};
