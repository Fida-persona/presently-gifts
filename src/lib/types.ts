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
  items: CartItem[];
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  giftMessage: string | null;
  total: number;
  status: string;
  createdAt: string;
};
