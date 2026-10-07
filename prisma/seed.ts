import { prisma } from "../lib/prisma";

const image = (url: string) =>
  `${url}?auto=format&fit=crop&w=1200&q=80`;

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description:
      "Everyday technology, audio gear, accessories, and smart devices.",
  },
  {
    name: "Clothing",
    slug: "clothing",
    description:
      "Modern everyday clothing designed for comfort and style.",
  },
  {
    name: "Footwear",
    slug: "footwear",
    description:
      "Sneakers and everyday footwear for work, weekends, and everything between.",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description:
      "Thoughtful pieces to make your home more comfortable and functional.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Practical and stylish accessories for everyday life.",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description:
      "Simple skincare and self-care essentials.",
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description:
      "Gear and accessories for active lifestyles and everyday workouts.",
  },
  {
    name: "Bags",
    slug: "bags",
    description:
      "Functional bags for commuting, travel, school, and everyday use.",
  },
];

const products = [
  // =========================================================
  // ELECTRONICS
  // =========================================================
  {
    name: "Studio Wireless Headphones",
    slug: "studio-wireless-headphones",
    description:
      "Comfortable wireless headphones with rich sound, soft ear cushions, and a clean minimalist design.",
    price: "129.99",
    stock: 42,
    categorySlug: "electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944",
    ],
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Compact wireless speaker with clear sound and a portable design for your room, desk, or weekend trips.",
    price: "79.99",
    stock: 35,
    categorySlug: "electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab",
    ],
  },
  {
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    description:
      "A compact mechanical keyboard with a satisfying tactile feel and a clean desk-friendly design.",
    price: "94.99",
    stock: 28,
    categorySlug: "electronics",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      "https://images.unsplash.com/photo-1595225476474-87563907a212",
    ],
  },
  {
    name: "Minimal Desk Lamp",
    slug: "minimal-desk-lamp",
    description:
      "Modern adjustable desk lamp that brings focused lighting to your workspace.",
    price: "54.99",
    stock: 31,
    categorySlug: "electronics",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15",
    ],
  },

  // =========================================================
  // CLOTHING
  // =========================================================
  {
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-t-shirt",
    description:
      "A versatile everyday cotton T-shirt with a comfortable regular fit and timeless look.",
    price: "24.99",
    stock: 85,
    categorySlug: "clothing",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    ],
  },
  {
    name: "Relaxed Overshirt",
    slug: "relaxed-overshirt",
    description:
      "A lightweight overshirt designed for easy layering throughout the year.",
    price: "59.99",
    stock: 46,
    categorySlug: "clothing",
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    ],
  },
  {
    name: "Everyday Hoodie",
    slug: "everyday-hoodie",
    description:
      "Soft everyday hoodie with a relaxed silhouette and comfortable brushed interior.",
    price: "64.99",
    stock: 52,
    categorySlug: "clothing",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    ],
  },
  {
    name: "Lightweight Jacket",
    slug: "lightweight-jacket",
    description:
      "A clean lightweight jacket made for transitional weather and everyday layering.",
    price: "89.99",
    stock: 24,
    categorySlug: "clothing",
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    ],
  },

  // =========================================================
  // FOOTWEAR
  // =========================================================
  {
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    description:
      "Clean low-top sneakers with a versatile silhouette that works with everyday outfits.",
    price: "89.99",
    stock: 38,
    categorySlug: "footwear",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    ],
  },
  {
    name: "Everyday Running Shoes",
    slug: "everyday-running-shoes",
    description:
      "Lightweight running shoes designed for comfortable everyday movement and training.",
    price: "109.99",
    stock: 29,
    categorySlug: "footwear",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    ],
  },
  {
    name: "Canvas Low Tops",
    slug: "canvas-low-tops",
    description:
      "Simple canvas sneakers with a timeless low-top profile.",
    price: "54.99",
    stock: 61,
    categorySlug: "footwear",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    ],
  },

  // =========================================================
  // HOME & LIVING
  // =========================================================
  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    description:
      "Minimal ceramic mug with a comfortable handle and timeless everyday design.",
    price: "18.99",
    stock: 73,
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    ],
  },
  {
    name: "Minimal Table Clock",
    slug: "minimal-table-clock",
    description:
      "Simple modern table clock designed to complement a clean desk or bedside table.",
    price: "32.99",
    stock: 34,
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
    ],
  },
  {
    name: "Soft Knit Throw",
    slug: "soft-knit-throw",
    description:
      "Soft textured throw blanket for adding warmth and comfort to your living space.",
    price: "49.99",
    stock: 27,
    categorySlug: "home-living",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
      "https://images.unsplash.com/photo-1600369671236-e74521d4b7ad",
    ],
  },

  // =========================================================
  // ACCESSORIES
  // =========================================================
  {
    name: "Minimal Leather Wallet",
    slug: "minimal-leather-wallet",
    description:
      "Slim everyday wallet with a clean profile and enough space for essential cards and cash.",
    price: "44.99",
    stock: 48,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    ],
  },
  {
    name: "Classic Sunglasses",
    slug: "classic-sunglasses",
    description:
      "Timeless sunglasses with a versatile frame designed for everyday wear.",
    price: "39.99",
    stock: 56,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    ],
  },
  {
    name: "Everyday Watch",
    slug: "everyday-watch",
    description:
      "Minimal everyday watch with a clean dial and understated design.",
    price: "119.99",
    stock: 19,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    ],
  },

  // =========================================================
  // BEAUTY
  // =========================================================
  {
    name: "Daily Face Cleanser",
    slug: "daily-face-cleanser",
    description:
      "Gentle daily cleanser designed to leave skin feeling fresh and comfortable.",
    price: "22.99",
    stock: 64,
    categorySlug: "beauty",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
    ],
  },
  {
    name: "Hydrating Face Cream",
    slug: "hydrating-face-cream",
    description:
      "Lightweight moisturizing cream for a simple everyday skincare routine.",
    price: "29.99",
    stock: 45,
    categorySlug: "beauty",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    ],
  },
  {
    name: "Aromatic Candle",
    slug: "aromatic-candle",
    description:
      "A softly scented candle designed to create a calm atmosphere at home.",
    price: "26.99",
    stock: 39,
    categorySlug: "beauty",
    images: [
      "https://images.unsplash.com/photo-1602874801006-e26f9e5f2f70",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59",
    ],
  },

  // =========================================================
  // SPORTS & FITNESS
  // =========================================================
  {
    name: "Insulated Water Bottle",
    slug: "insulated-water-bottle",
    description:
      "Reusable insulated bottle designed to keep drinks cool during workouts and daily commutes.",
    price: "34.99",
    stock: 72,
    categorySlug: "sports-fitness",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      "https://images.unsplash.com/photo-1523362628745-0c100150b504",
    ],
  },
  {
    name: "Training Duffel Bag",
    slug: "training-duffel-bag",
    description:
      "Spacious duffel bag with practical compartments for gym sessions and short trips.",
    price: "69.99",
    stock: 26,
    categorySlug: "sports-fitness",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c",
    ],
  },
  {
    name: "Yoga Mat",
    slug: "yoga-mat",
    description:
      "Comfortable non-slip exercise mat suitable for stretching, yoga, and home workouts.",
    price: "39.99",
    stock: 41,
    categorySlug: "sports-fitness",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
      "https://images.unsplash.com/photo-1599447292180-45fd84092ef4",
    ],
  },

  // =========================================================
  // BAGS
  // =========================================================
  {
    name: "Everyday Backpack",
    slug: "everyday-backpack",
    description:
      "Clean everyday backpack with enough room for your laptop, accessories, and daily essentials.",
    price: "74.99",
    stock: 37,
    categorySlug: "bags",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3",
    ],
  },
  {
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    description:
      "Durable canvas tote with a simple silhouette for everyday shopping and carrying essentials.",
    price: "29.99",
    stock: 68,
    categorySlug: "bags",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    ],
  },
  {
    name: "Travel Weekender",
    slug: "travel-weekender",
    description:
      "Spacious weekender bag designed for short trips, overnight stays, and weekend adventures.",
    price: "99.99",
    stock: 18,
    categorySlug: "bags",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // ---------------------------------------------------------
  // Categories
  // ---------------------------------------------------------

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });

    categoryMap.set(category.slug, createdCategory.id);
  }

  console.log(`✓ Seeded ${categories.length} categories`);

  // ---------------------------------------------------------
  // Products
  // ---------------------------------------------------------

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(
        `Category "${product.categorySlug}" not found for product "${product.name}"`,
      );
    }

    const createdProduct = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId,
      },
    });

    // Keep image seeding idempotent.
    //
    // We replace the product's existing seeded images so running
    // the seed multiple times doesn't create duplicates.
    await prisma.productImage.deleteMany({
      where: {
        productId: createdProduct.id,
      },
    });

    await prisma.productImage.createMany({
      data: product.images.map((url, index) => ({
        url: image(url),
        alt: `${product.name} product image ${index + 1}`,
        position: index,
        productId: createdProduct.id,
      })),
    });
  }

  console.log(`✓ Seeded ${products.length} products`);

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------

  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const imageCount = await prisma.productImage.count();

  console.log("");
  console.log("🎉 Database seed completed!");
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Products:   ${productCount}`);
  console.log(`   Images:     ${imageCount}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

