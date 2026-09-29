import { db } from "./db";
import { slugify } from "./utils";
import type { InValue } from "@libsql/client";

function img(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

// Verified-working Unsplash photo ids grouped by theme.
const IMG = {
  giftBox: [
    "photo-1513151233558-d860c5398176",
    "photo-1549465220-1a8b9238cd48",
    "photo-1608755728617-aefab37d2edd",
    "photo-1512909006721-3d6018887383",
    "photo-1577217534079-41d6bb68ac50",
  ],
  birthday: [
    "photo-1607344645866-009c320b63e0",
    "photo-1558636508-e0db3814bd1d",
    "photo-1530103862676-de8c9debad1d",
    "photo-1578985545062-69928b1d9587",
  ],
  wedding: [
    "photo-1464349095431-e9a21285b5f3",
    "photo-1519225421980-715cb0215aed",
    "photo-1519741497674-611481863552",
  ],
  flowers: [
    "photo-1518895949257-7621c3c786d7",
    "photo-1487070183336-b863922373d4",
    "photo-1487530811176-3780de880c2d",
    "photo-1589095181425-c038b3871b6a",
    "photo-1567696153798-9111f9cd3d0d",
    "photo-1511285560929-80b456fea0bc",
    "photo-1490750967868-88aa4486c946",
  ],
  chocolate: [
    "photo-1481391032119-d89fee407e44",
    "photo-1511381939415-e44015466834",
    "photo-1606313564200-e75d5e30476c",
  ],
  candle: [
    "photo-1602874801007-bd458bb1b8b6",
    "photo-1640095889747-2090ee12fa7d",
    "photo-1603006905003-be475563bc59",
  ],
  plant: [
    "photo-1493552152660-f915ab47ae9d",
    "photo-1485955900006-10f4d324d411",
    "photo-1603436326446-74e2d65f3168",
  ],
  jewelry: [
    "photo-1588444968576-f8fe92ce56fd",
    "photo-1600862754152-80a263dd564f",
    "photo-1601121141461-9d6647bca1ed",
  ],
  watch: ["photo-1523275335684-37898b6baf30"],
  teddy: ["photo-1648311128165-848a00883496", "photo-1654959245667-ab62c8d00c26"],
  cake: ["photo-1621303837174-89787a7d4729"],
  fireworks: [
    "photo-1533134242443-d4fd215305ad",
    "photo-1467810563316-b5476525c0f9",
    "photo-1482575832494-771f74bf6857",
  ],
  home: [
    "photo-1484154218962-a197022b5858",
    "photo-1616593871468-2a9452218369",
    "photo-1632119580908-ae947d4c7691",
  ],
  baby: ["photo-1544367567-0f2fcb009e0b", "photo-1522771930-78848d9293e8"],
  graduation: [
    "photo-1519689680058-324335c77eba",
    "photo-1541339907198-e08756dedf3f",
    "photo-1627556704302-624286467c65",
    "photo-1523240795612-9a054b0db644",
  ],
  friendship: ["photo-1543269865-cbf427effbad"],
  mothersday: [
    "photo-1613789613119-b13a927ec2dd",
    "photo-1600220092657-06baceb1dca9",
    "photo-1613789630741-ba1fce27fa1b",
  ],
  fathersday: ["photo-1601193708180-afe6737e5636"],
  stationery: [
    "photo-1580567754748-e77fff0a7e3e",
    "photo-1582319193453-d841c7a5e586",
  ],
  tech: ["photo-1517336714731-489689fd1ca8", "photo-1505740420928-5e560c06d30e"],
  accessory: ["photo-1572635196237-14b3f281503f"],
  hamper: [
    "photo-1664849079284-a1e098364d8a",
    "photo-1664849173063-8d8244ac3933",
    "photo-1617394391227-4cb6cba53b12",
  ],
  mug: ["photo-1514228742587-6b1558fcca3d"],
  perfume: ["photo-1541643600914-78b084683601"],
};

type OccasionSeed = {
  name: string;
  tagline: string;
  image: string;
  from: string;
  to: string;
};

const OCCASIONS: OccasionSeed[] = [
  { name: "Birthday", tagline: "Make their day unforgettable", image: img(IMG.birthday[0]), from: "#f43f7d", to: "#fb923c" },
  { name: "Anniversary", tagline: "Celebrate every year of love", image: img(IMG.wedding[2]), from: "#e11d67", to: "#f2c879" },
  { name: "Wedding", tagline: "Gifts for the happily ever after", image: img(IMG.wedding[2]), from: "#c98a2c", to: "#f2c879" },
  { name: "Valentine's Day", tagline: "Say it with something special", image: img(IMG.flowers[3]), from: "#e11d67", to: "#f43f7d" },
  { name: "New Year", tagline: "Ring in fresh beginnings", image: img(IMG.fireworks[1]), from: "#7c3aed", to: "#e11d67" },
  { name: "Housewarming", tagline: "Welcome them home in style", image: img(IMG.home[0]), from: "#c98a2c", to: "#0f766e" },
  { name: "Baby Shower", tagline: "Celebrate the newest arrival", image: img(IMG.baby[1]), from: "#60a5fa", to: "#f9a8d4" },
  { name: "Graduation", tagline: "Cheers to the next chapter", image: img(IMG.graduation[1]), from: "#1d4ed8", to: "#e0ac4d" },
  { name: "Friendship Day", tagline: "For the ones who get you", image: img(IMG.friendship[0]), from: "#f59e0b", to: "#e11d67" },
  { name: "Mother's Day", tagline: "Thank the one who gave you everything", image: img(IMG.mothersday[0]), from: "#f43f7d", to: "#f2c879" },
  { name: "Father's Day", tagline: "Gifts as solid as he is", image: img(IMG.fathersday[0]), from: "#1e3a5f", to: "#c98a2c" },
  { name: "Get Well Soon", tagline: "Brighten their road to recovery", image: img(IMG.flowers[5]), from: "#22c55e", to: "#60a5fa" },
  { name: "Congratulations", tagline: "Celebrate every win", image: img(IMG.giftBox[3]), from: "#e0ac4d", to: "#e11d67" },
  { name: "Retirement", tagline: "Toast to a well-earned rest", image: img(IMG.home[1]), from: "#0f766e", to: "#c98a2c" },
  { name: "Corporate Gifting", tagline: "Bulk gifting that leaves an impression", image: img(IMG.tech[0]), from: "#1e293b", to: "#e0ac4d" },
];

const CATEGORIES: { name: string; icon: string }[] = [
  { name: "Flowers & Bouquets", icon: "Flower2" },
  { name: "Chocolates & Sweets", icon: "Candy" },
  { name: "Cakes", icon: "CakeSlice" },
  { name: "Personalized Gifts", icon: "Sparkles" },
  { name: "Home & Decor", icon: "Lamp" },
  { name: "Jewelry & Accessories", icon: "Gem" },
  { name: "Soft Toys", icon: "Heart" },
  { name: "Plants", icon: "Leaf" },
  { name: "Gift Hampers", icon: "PackageOpen" },
  { name: "Candles & Fragrances", icon: "Flame" },
  { name: "Stationery", icon: "NotebookPen" },
  { name: "Tech & Gadgets", icon: "Headphones" },
];

const GIFT_WRAPS: { name: string; description: string; image: string; price: number }[] = [
  { name: "Classic Kraft & Twine", description: "Rustic kraft paper finished with natural twine.", image: img(IMG.giftBox[2]), price: 0 },
  { name: "Gold Ribbon Elegance", description: "Soft blush wrap with a hand-tied gold ribbon.", image: img(IMG.giftBox[1]), price: 49 },
  { name: "Rose Gold Deluxe", description: "Premium rose gold wrap for extra-special occasions.", image: img(IMG.giftBox[3]), price: 79 },
  { name: "Festive Blue & Gold", description: "Deep blue wrap with a metallic gold bow.", image: img(IMG.giftBox[0]), price: 49 },
];

const BADGES = ["Bestseller", "New", "Trending", "", "", ""];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// Occasions/products retired from the catalog — cleaned up even on databases
// seeded before this list changed.
const RETIRED_OCCASION_SLUGS = ["diwali", "christmas", "raksha-bandhan"];
const RETIRED_PRODUCT_SLUGS = [
  "diwali-sweets-dry-fruit-hamper",
  "floating-diyas-set-12pc",
  "rakhi-dry-fruit-combo",
  "designer-rakhi-set-pack-of-3",
  "christmas-ornament-gift-box",
];

export async function seedIfEmpty() {
  // gift_wraps is the newest table — its presence marks "this database has
  // already been migrated to the current catalog/schema version."
  const wrapCountRes = await db.execute(`SELECT COUNT(*) as c FROM gift_wraps`);
  if (Number(wrapCountRes.rows[0][0]) > 0) return;

  for (const slug of RETIRED_OCCASION_SLUGS) {
    await db.execute({ sql: `DELETE FROM occasions WHERE slug = ?`, args: [slug] });
  }
  for (const slug of RETIRED_PRODUCT_SLUGS) {
    await db.execute({ sql: `DELETE FROM products WHERE slug = ?`, args: [slug] });
  }

  // Upserts keyed on slug so concurrent processes hitting this at once never
  // collide on UNIQUE constraints.
  const occasionIds: Record<string, number> = {};
  for (let i = 0; i < OCCASIONS.length; i++) {
    const o = OCCASIONS[i];
    const res = await db.execute({
      sql: `INSERT INTO occasions (name, slug, tagline, image, from_color, to_color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name=excluded.name, tagline=excluded.tagline, image=excluded.image,
          from_color=excluded.from_color, to_color=excluded.to_color, sort_order=excluded.sort_order
        RETURNING id`,
      args: [o.name, slugify(o.name), o.tagline, o.image, o.from, o.to, i],
    });
    if (res.rows[0]) occasionIds[o.name] = Number(res.rows[0][0]);
  }

  const categoryIds: Record<string, number> = {};
  for (const c of CATEGORIES) {
    const res = await db.execute({
      sql: `INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name=excluded.name, icon=excluded.icon
        RETURNING id`,
      args: [c.name, slugify(c.name), c.icon],
    });
    if (res.rows[0]) categoryIds[c.name] = Number(res.rows[0][0]);
  }

  const oc = (names: string[]) => names.map((n) => occasionIds[n]);

  type ProductSeed = {
    name: string;
    category: string;
    occasions: string[];
    price: number;
    mrp?: number;
    images: string[];
    desc: string;
  };

  const products: ProductSeed[] = [
    // Flowers & Bouquets
    { name: "Red Rose Bouquet — 20 Stems", category: "Flowers & Bouquets", occasions: ["Valentine's Day", "Anniversary"], price: 899, mrp: 1199, images: [img(IMG.flowers[3]), img(IMG.flowers[0])], desc: "A hand-tied bouquet of 20 fresh red roses wrapped in premium kraft paper, finished with satin ribbon." },
    { name: "Mixed Tulip Basket", category: "Flowers & Bouquets", occasions: ["Birthday", "Get Well Soon"], price: 1099, mrp: 1399, images: [img(IMG.flowers[2]), img(IMG.flowers[6])], desc: "A cheerful basket of multicolour tulips arranged by our in-house florists, perfect for brightening any room." },
    { name: "Sunflower Delight Bunch", category: "Flowers & Bouquets", occasions: ["Get Well Soon", "Congratulations"], price: 799, images: [img(IMG.flowers[6]), img(IMG.flowers[1])], desc: "Ten sun-kissed sunflowers bundled with seasonal greens — pure happiness in a bouquet." },
    { name: "White Orchid Elegance", category: "Flowers & Bouquets", occasions: ["Anniversary", "Wedding"], price: 1799, mrp: 2199, images: [img(IMG.flowers[4]), img(IMG.flowers[2])], desc: "Exotic white orchid stems arranged in a minimalist glass vase for an elegant, long-lasting gift." },
    { name: "Lily Charm Bunch", category: "Flowers & Bouquets", occasions: ["Mother's Day", "Get Well Soon"], price: 949, images: [img(IMG.flowers[1]), img(IMG.flowers[5])], desc: "Fragrant Asiatic lilies paired with eucalyptus for a soft, romantic bouquet." },
    { name: "Pink Rose & Baby's Breath Box", category: "Flowers & Bouquets", occasions: ["Valentine's Day", "Mother's Day"], price: 1249, mrp: 1499, images: [img(IMG.flowers[2]), img(IMG.flowers[3])], desc: "Pastel pink roses nestled in baby's breath, boxed in a signature Presently hat-box." },

    // Chocolates & Sweets
    { name: "Belgian Chocolate Truffle Box (24pc)", category: "Chocolates & Sweets", occasions: ["Birthday", "Anniversary"], price: 1099, mrp: 1299, images: [img(IMG.chocolate[1]), img(IMG.chocolate[0])], desc: "24 handcrafted Belgian truffles in assorted flavours — hazelnut, dark, and salted caramel." },
    { name: "Assorted Dry Fruit Chocolate Hamper", category: "Chocolates & Sweets", occasions: ["Corporate Gifting"], price: 1499, mrp: 1799, images: [img(IMG.chocolate[2]), img(IMG.hamper[0])], desc: "Premium chocolates layered with roasted almonds, cashews and pistachios in a festive box." },
    { name: "Dark Chocolate Bar Collection", category: "Chocolates & Sweets", occasions: ["Corporate Gifting", "Congratulations"], price: 699, images: [img(IMG.chocolate[0]), img(IMG.chocolate[2])], desc: "A set of six single-origin dark chocolate bars, 55%–85% cocoa, for the connoisseur." },
    { name: "Chocolate Dipped Strawberry Box", category: "Chocolates & Sweets", occasions: ["Valentine's Day", "Anniversary"], price: 899, images: [img(IMG.chocolate[1]), img(IMG.flowers[3])], desc: "Fresh strawberries hand-dipped in Belgian chocolate, boxed same-day for peak freshness." },
    { name: "Ferrero Rocher Celebration Tower", category: "Chocolates & Sweets", occasions: ["Birthday"], price: 1299, mrp: 1599, images: [img(IMG.chocolate[2]), img(IMG.giftBox[1])], desc: "A tiered tower of 32 Ferrero Rocher pieces, ready to be the centerpiece of any celebration." },

    // Cakes
    { name: "Chocolate Truffle Cake (1kg)", category: "Cakes", occasions: ["Birthday", "Anniversary"], price: 899, images: [img(IMG.cake[0]), img(IMG.birthday[0])], desc: "Rich layers of chocolate sponge with silky truffle ganache, baked fresh to order." },
    { name: "Red Velvet Cream Cake (1kg)", category: "Cakes", occasions: ["Birthday", "Valentine's Day"], price: 999, mrp: 1149, images: [img(IMG.cake[0]), img(IMG.birthday[3])], desc: "Classic red velvet sponge with cream-cheese frosting, a crowd favourite for any celebration." },
    { name: "Black Forest Cake (1.5kg)", category: "Cakes", occasions: ["Birthday", "Congratulations"], price: 1099, images: [img(IMG.cake[0]), img(IMG.birthday[0])], desc: "Cherry-studded chocolate sponge layered with whipped cream, topped with chocolate shavings." },
    { name: "Butterscotch Delight Cake (1kg)", category: "Cakes", occasions: ["Birthday", "Congratulations"], price: 849, images: [img(IMG.cake[0]), img(IMG.birthday[2])], desc: "Caramelised butterscotch sponge folded with crunchy praline for the perfect bite." },

    // Personalized Gifts
    { name: "Customized Photo Coffee Mug", category: "Personalized Gifts", occasions: ["Birthday", "Anniversary", "Friendship Day"], price: 449, images: [img(IMG.mug[0]), img(IMG.giftBox[0])], desc: "A ceramic mug printed with your favourite photo and a custom message — dishwasher safe." },
    { name: "Engraved Wooden Photo Frame", category: "Personalized Gifts", occasions: ["Anniversary", "Wedding", "Retirement"], price: 799, mrp: 999, images: [img(IMG.giftBox[3]), img(IMG.home[2])], desc: "Solid oak frame laser-engraved with names and a date, holds a 6x8in print." },
    { name: "Personalized Name Necklace", category: "Personalized Gifts", occasions: ["Birthday", "Valentine's Day"], price: 1299, images: [img(IMG.jewelry[1]), img(IMG.jewelry[0])], desc: "A dainty gold-plated necklace with any name or word custom-cut in a flowing script." },
    { name: "Custom Caricature Portrait (Framed)", category: "Personalized Gifts", occasions: ["Birthday", "Retirement", "Congratulations"], price: 1599, images: [img(IMG.giftBox[4]), img(IMG.stationery[1])], desc: "A hand-illustrated caricature from your photo, delivered framed and ready to hang." },
    { name: "Monogrammed Leather Wallet", category: "Personalized Gifts", occasions: ["Father's Day", "Corporate Gifting"], price: 1199, mrp: 1399, images: [img(IMG.accessory[0]), img(IMG.giftBox[3])], desc: "Genuine leather bifold wallet with hand-stamped initials, gift-boxed." },

    // Home & Decor
    { name: "Ceramic Vase Duo Set", category: "Home & Decor", occasions: ["Housewarming"], price: 1099, images: [img(IMG.home[2]), img(IMG.home[0])], desc: "Two hand-glazed ceramic vases in complementary tones, a chic addition to any shelf." },
    { name: "Fairy Light String Decor (10m)", category: "Home & Decor", occasions: ["Housewarming"], price: 599, images: [img(IMG.home[1]), img(IMG.home[2])], desc: "Warm-white LED fairy lights on copper wire, battery powered with 8 twinkle modes." },
    { name: "Abstract Canvas Wall Art", category: "Home & Decor", occasions: ["Housewarming", "Retirement"], price: 1899, mrp: 2299, images: [img(IMG.home[1]), img(IMG.home[2])], desc: "A gallery-wrapped canvas print with a modern abstract palette, ready to hang." },
    { name: "Aromatic Reed Diffuser Set", category: "Home & Decor", occasions: ["Housewarming", "Corporate Gifting"], price: 749, images: [img(IMG.candle[2]), img(IMG.home[0])], desc: "A ceramic reed diffuser with a signature sandalwood-vanilla fragrance, lasts up to 90 days." },
    { name: "Handcrafted Brass Wind Chime", category: "Home & Decor", occasions: ["Housewarming"], price: 649, images: [img(IMG.home[0]), img(IMG.home[2])], desc: "A soothing brass wind chime, hand-cast by local artisans for gentle everyday melodies." },

    // Jewelry & Accessories
    { name: "Rose Gold Pendant Necklace", category: "Jewelry & Accessories", occasions: ["Anniversary", "Valentine's Day"], price: 2199, mrp: 2599, images: [img(IMG.jewelry[0]), img(IMG.jewelry[1])], desc: "A rose-gold plated pendant set with a cubic zirconia centre stone, on an adjustable chain." },
    { name: "Sterling Silver Drop Earrings", category: "Jewelry & Accessories", occasions: ["Wedding", "Anniversary"], price: 1499, images: [img(IMG.jewelry[1]), img(IMG.jewelry[2])], desc: "925 sterling silver drop earrings with a polished finish, light enough for all-day wear." },
    { name: "Classic Pearl Strand Necklace", category: "Jewelry & Accessories", occasions: ["Wedding", "Mother's Day"], price: 2499, mrp: 2999, images: [img(IMG.jewelry[2]), img(IMG.jewelry[0])], desc: "Freshwater pearls hand-strung into a timeless necklace with a sterling silver clasp." },
    { name: "Men's Chronograph Watch", category: "Jewelry & Accessories", occasions: ["Father's Day", "Graduation", "Retirement"], price: 3299, mrp: 3999, images: [img(IMG.watch[0]), img(IMG.accessory[0])], desc: "A stainless-steel chronograph watch with a leather strap, water resistant to 30m." },
    { name: "Layered Charm Bracelet", category: "Jewelry & Accessories", occasions: ["Friendship Day", "Birthday"], price: 899, images: [img(IMG.jewelry[1]), img(IMG.jewelry[2])], desc: "A trio of layered chain bracelets with heart and star charms, gold-plated." },

    // Soft Toys
    { name: "Giant Teddy Bear (3ft)", category: "Soft Toys", occasions: ["Birthday", "Valentine's Day"], price: 1799, mrp: 2199, images: [img(IMG.teddy[0]), img(IMG.teddy[1])], desc: "An extra-huggable 3-foot teddy bear in soft brushed plush, a showstopper gift." },
    { name: "Bunny Plush Companion", category: "Soft Toys", occasions: ["Baby Shower", "Birthday"], price: 699, images: [img(IMG.teddy[1]), img(IMG.baby[1])], desc: "A floppy-eared bunny plush made from hypoallergenic fabric, safe from birth." },
    { name: "Panda Cuddle Toy (18in)", category: "Soft Toys", occasions: ["Birthday", "Baby Shower"], price: 899, images: [img(IMG.teddy[0]), img(IMG.teddy[1])], desc: "A soft panda plush with embroidered details, machine washable." },
    { name: "Unicorn Sparkle Plush", category: "Soft Toys", occasions: ["Birthday"], price: 749, images: [img(IMG.teddy[1]), img(IMG.teddy[0])], desc: "A rainbow-maned unicorn plush that sparkles under light — a favourite for kids' birthdays." },

    // Plants
    { name: "Money Plant in Ceramic Pot", category: "Plants", occasions: ["Housewarming", "Congratulations"], price: 549, images: [img(IMG.plant[0]), img(IMG.plant[1])], desc: "A low-maintenance money plant said to bring prosperity, potted in a hand-painted ceramic pot." },
    { name: "Succulent Trio Gift Set", category: "Plants", occasions: ["Get Well Soon", "Corporate Gifting"], price: 699, images: [img(IMG.plant[1]), img(IMG.plant[2])], desc: "Three easy-care succulents in matching terracotta pots, packaged in a gift tray." },
    { name: "Peace Lily Plant", category: "Plants", occasions: ["Get Well Soon", "Housewarming"], price: 649, images: [img(IMG.plant[2]), img(IMG.plant[0])], desc: "A air-purifying peace lily known for its elegant white blooms, low-light tolerant." },
    { name: "Miniature Bonsai Tree", category: "Plants", occasions: ["Retirement", "Congratulations"], price: 1299, mrp: 1499, images: [img(IMG.plant[0]), img(IMG.plant[2])], desc: "A 5-year trained ficus bonsai in a glazed ceramic tray, a symbol of patience and growth." },

    // Gift Hampers
    { name: "Birthday Surprise Hamper", category: "Gift Hampers", occasions: ["Birthday"], price: 1599, images: [img(IMG.hamper[0]), img(IMG.giftBox[2])], desc: "Chocolates, a mini cake, balloons and a greeting card bundled into one joyful hamper." },
    { name: "Spa & Wellness Hamper", category: "Gift Hampers", occasions: ["Mother's Day", "Get Well Soon"], price: 1799, images: [img(IMG.hamper[0]), img(IMG.candle[0])], desc: "Bath salts, scented candles and a plush towel curated for a relaxing at-home spa day." },
    { name: "Gourmet Snacks & Coffee Basket", category: "Gift Hampers", occasions: ["Corporate Gifting", "Congratulations"], price: 1699, images: [img(IMG.hamper[0]), img(IMG.stationery[0])], desc: "Artisan coffee, crackers and preserves packed into a rustic wicker basket." },
    { name: "New Baby Care Hamper", category: "Gift Hampers", occasions: ["Baby Shower"], price: 1499, images: [img(IMG.baby[1]), img(IMG.hamper[0])], desc: "Baby-safe essentials — lotion, soft toy, and swaddle — wrapped in a keepsake basket." },

    // Candles & Fragrances
    { name: "Scented Soy Candle Trio", category: "Candles & Fragrances", occasions: ["Housewarming", "Anniversary"], price: 899, images: [img(IMG.candle[2]), img(IMG.candle[0])], desc: "Three hand-poured soy candles in vanilla, sandalwood, and citrus scents." },
    { name: "Aromatherapy Candle Gift Set", category: "Candles & Fragrances", occasions: ["Get Well Soon", "Mother's Day"], price: 999, mrp: 1199, images: [img(IMG.candle[0]), img(IMG.candle[1])], desc: "Lavender and chamomile candles designed to calm and unwind, in a keepsake tin." },
    { name: "Luxury Fragrance Candle (Amber Oud)", category: "Candles & Fragrances", occasions: ["Anniversary", "Corporate Gifting"], price: 1199, images: [img(IMG.candle[1]), img(IMG.candle[2])], desc: "A long-burning amber oud candle in a frosted glass jar with a matte gold lid." },

    // Stationery
    { name: "Leather-Bound Journal Set", category: "Stationery", occasions: ["Graduation", "Corporate Gifting"], price: 649, images: [img(IMG.stationery[0]), img(IMG.stationery[1])], desc: "A refillable leather journal paired with a matching pen, perfect for new beginnings." },
    { name: "Calligraphy Starter Kit", category: "Stationery", occasions: ["Birthday", "Graduation"], price: 799, images: [img(IMG.stationery[1]), img(IMG.stationery[0])], desc: "Everything needed to start calligraphy — nibs, ink, and a guided practice book." },
    { name: "Wooden Desk Organizer Set", category: "Stationery", occasions: ["Corporate Gifting", "Congratulations"], price: 899, images: [img(IMG.stationery[0]), img(IMG.home[2])], desc: "A sleek walnut-finish organizer for pens, cards and everyday desk clutter." },
    { name: "Personalized Notebook & Pen Set", category: "Stationery", occasions: ["Graduation", "Friendship Day"], price: 549, images: [img(IMG.stationery[1]), img(IMG.mug[0])], desc: "A hardbound notebook with a name embossed on the cover, paired with a metal pen." },

    // Tech & Gadgets
    { name: "Wireless Earbuds Pro", category: "Tech & Gadgets", occasions: ["Birthday", "Corporate Gifting", "Graduation"], price: 2499, mrp: 2999, images: [img(IMG.tech[1]), img(IMG.tech[0])], desc: "Active noise-cancelling wireless earbuds with 30-hour battery life via case." },
    { name: "Portable Bluetooth Speaker", category: "Tech & Gadgets", occasions: ["Birthday", "Friendship Day"], price: 1899, images: [img(IMG.tech[0]), img(IMG.tech[1])], desc: "A splash-proof speaker with rich bass and 12-hour playtime, in a compact form." },
    { name: "Smart Digital Photo Frame", category: "Tech & Gadgets", occasions: ["Anniversary", "Retirement"], price: 3499, mrp: 3999, images: [img(IMG.tech[1]), img(IMG.home[1])], desc: "A Wi-Fi photo frame that lets family upload memories remotely, in a walnut frame." },
    { name: "Fitness Tracker Band", category: "Tech & Gadgets", occasions: ["Birthday", "Corporate Gifting"], price: 1599, images: [img(IMG.tech[0]), img(IMG.watch[0])], desc: "Track steps, heart rate and sleep with a lightweight band and 7-day battery." },

    // Extra occasion-specific
    { name: "Signature Eau de Parfum", category: "Personalized Gifts", occasions: ["Anniversary", "Valentine's Day", "Corporate Gifting"], price: 1999, mrp: 2399, images: [img(IMG.perfume[0]), img(IMG.giftBox[4])], desc: "A long-lasting unisex fragrance with notes of amber, bergamot and musk." },
    { name: "New Year Celebration Hamper", category: "Gift Hampers", occasions: ["New Year"], price: 1699, images: [img(IMG.fireworks[2]), img(IMG.hamper[0])], desc: "Sparkling cider, chocolates and party favours to ring in the new year in style." },
    { name: "Congratulations Balloon Bouquet", category: "Home & Decor", occasions: ["Congratulations", "Graduation"], price: 649, images: [img(IMG.birthday[1]), img(IMG.giftBox[3])], desc: "A vibrant bunch of helium balloons with a 'Congratulations' foil centrepiece." },
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const catId = categoryIds[p.category];
    const occIds = oc(p.occasions);
    const rating = 4 + ((i * 7) % 10) / 10; // 4.0 - 4.9
    const reviews = 12 + ((i * 37) % 260);
    const badge = pick(BADGES, i);
    const stock = i % 11 === 0 ? 3 : 8 + ((i * 5) % 40);
    const args: InValue[] = [
      p.name,
      slugify(p.name),
      p.desc,
      p.price,
      p.mrp ?? null,
      JSON.stringify(p.images),
      catId,
      JSON.stringify(occIds),
      stock,
      Math.round(rating * 10) / 10,
      reviews,
      badge,
      i % 5 === 0 ? 1 : 0,
    ];
    await db.execute({
      sql: `INSERT INTO products (name, slug, description, price, mrp, images, category_id, occasion_ids, stock, rating, reviews_count, badge, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name=excluded.name, description=excluded.description, price=excluded.price,
          mrp=excluded.mrp, images=excluded.images, category_id=excluded.category_id, occasion_ids=excluded.occasion_ids,
          badge=excluded.badge, featured=excluded.featured`,
      args,
    });
  }

  for (let i = 0; i < GIFT_WRAPS.length; i++) {
    const w = GIFT_WRAPS[i];
    await db.execute({
      sql: `INSERT INTO gift_wraps (name, slug, description, image, price, sort_order) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET name=excluded.name, description=excluded.description, image=excluded.image,
          price=excluded.price, sort_order=excluded.sort_order`,
      args: [w.name, slugify(w.name), w.description, w.image, w.price, i],
    });
  }
}
