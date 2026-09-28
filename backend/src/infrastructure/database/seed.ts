// ============================================================
// SEED SCRIPT - 30+ products across categories
// Run: npm run seed
// ============================================================

import "dotenv/config";
import mongoose from "mongoose";
import { ProductModel } from "./models/ProductModel.js";
import { UserModel } from "./models/UserModel.js";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megamart";

const categories = [
  "Smartphones",
  "Watches",
  "Cosmetics",
  "Electronics",
  "Furniture",
  "Accessories",
];

const products = [
  // ── Smartphones ──────────────────────────────────────────
  {
    name: "Samsung Galaxy S22 Ultra",
    slug: "samsung-galaxy-s22-ultra",
    description:
      "The ultimate smartphone with 108MP camera, S Pen support, and a 6.8-inch Dynamic AMOLED display.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
    ],
    category: "Smartphones",
    brand: "Samsung",
    variants: [
      {
        sku: "SGS22U-8-256",
        size: "8GB/256GB",
        colour: "Phantom Black",
        price: 67999,
        stock: 15,
      },
      {
        sku: "SGS22U-12-256",
        size: "12GB/256GB",
        colour: "Phantom White",
        price: 74999,
        stock: 10,
      },
      {
        sku: "SGS22U-12-512",
        size: "12GB/512GB",
        colour: "Green",
        price: 82999,
        stock: 5,
      },
    ],
    tags: ["samsung", "galaxy", "s22", "flagship", "amoled"],
  },
  {
    name: "Samsung Galaxy M13",
    slug: "samsung-galaxy-m13",
    description:
      "Powerful mid-range smartphone with 50MP camera, 5000mAh battery and 6.6-inch display.",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",
    ],
    category: "Smartphones",
    brand: "Samsung",
    variants: [
      {
        sku: "SGM13-4-64",
        size: "4GB/64GB",
        colour: "Midnight Black",
        price: 10499,
        stock: 30,
      },
      {
        sku: "SGM13-4-128",
        size: "4GB/128GB",
        colour: "Aqua Green",
        price: 12499,
        stock: 25,
      },
    ],
    tags: ["samsung", "galaxy", "m13", "midrange"],
  },
  {
    name: "Samsung Galaxy M33 5G",
    slug: "samsung-galaxy-m33-5g",
    description:
      "5G ready mid-ranger with 6000mAh massive battery and 50MP main camera.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
    ],
    category: "Smartphones",
    brand: "Samsung",
    variants: [
      {
        sku: "SGM33-4-64",
        size: "4GB/64GB",
        colour: "Mystique Blue",
        price: 16999,
        stock: 20,
      },
      {
        sku: "SGM33-6-128",
        size: "6GB/128GB",
        colour: "Deep Ocean Blue",
        price: 19999,
        stock: 18,
      },
    ],
    tags: ["samsung", "5g", "m33", "battery"],
  },
  {
    name: "Samsung Galaxy M53 5G",
    slug: "samsung-galaxy-m53-5g",
    description:
      "108MP camera smartphone with stunning 6.7-inch display and 5000mAh battery.",
    images: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
    ],
    category: "Smartphones",
    brand: "Samsung",
    variants: [
      {
        sku: "SGM53-6-128",
        size: "6GB/128GB",
        colour: "Marshmallow Blue",
        price: 31999,
        stock: 12,
      },
      {
        sku: "SGM53-8-128",
        size: "8GB/128GB",
        colour: "Deep Ocean Blue",
        price: 34999,
        stock: 8,
      },
    ],
    tags: ["samsung", "galaxy", "m53", "108mp", "5g"],
  },
  {
    name: "iPhone 14 Pro",
    slug: "iphone-14-pro",
    description:
      "Dynamic Island, 48MP camera system, A16 Bionic chip. The most powerful iPhone ever.",
    images: [
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600",
    ],
    category: "Smartphones",
    brand: "Apple",
    variants: [
      {
        sku: "IP14P-128",
        size: "128GB",
        colour: "Deep Purple",
        price: 129900,
        stock: 8,
      },
      {
        sku: "IP14P-256",
        size: "256GB",
        colour: "Gold",
        price: 139900,
        stock: 6,
      },
      {
        sku: "IP14P-512",
        size: "512GB",
        colour: "Space Black",
        price: 159900,
        stock: 3,
      },
    ],
    tags: ["apple", "iphone", "ios", "flagship", "a16"],
  },
  {
    name: "Realme Narzo 50 Pro",
    slug: "realme-narzo-50-pro",
    description:
      "MediaTek Helio G96 powered smartphone with 90Hz display and 48MP triple camera.",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    ],
    category: "Smartphones",
    brand: "Realme",
    variants: [
      {
        sku: "RN50P-6-128",
        size: "6GB/128GB",
        colour: "Hyper Blue",
        price: 18999,
        stock: 22,
      },
      {
        sku: "RN50P-8-128",
        size: "8GB/128GB",
        colour: "Hyper Black",
        price: 21999,
        stock: 15,
      },
    ],
    tags: ["realme", "narzo", "midrange", "gaming"],
  },
  {
    name: "Xiaomi 11i HyperCharge",
    slug: "xiaomi-11i-hypercharge",
    description:
      "120W HyperCharge, Dimensity 920 5G processor, 6.67-inch FHD+ AMOLED display.",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600",
    ],
    category: "Smartphones",
    brand: "Xiaomi",
    variants: [
      {
        sku: "XMI11-6-128",
        size: "6GB/128GB",
        colour: "Stealth Black",
        price: 26999,
        stock: 18,
      },
      {
        sku: "XMI11-8-128",
        size: "8GB/128GB",
        colour: "Pacific Pearl",
        price: 29999,
        stock: 12,
      },
    ],
    tags: ["xiaomi", "hypercharge", "5g", "amoled"],
  },

  // ── Watches ──────────────────────────────────────────────
  {
    name: "Smart Wearable Pro X1",
    slug: "smart-wearable-pro-x1",
    description:
      "Advanced smartwatch with health monitoring, GPS, and 7-day battery life. AMOLED display.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    ],
    category: "Watches",
    brand: "TechWear",
    variants: [
      {
        sku: "SWP-X1-BLK",
        size: "44mm",
        colour: "Midnight Black",
        price: 8999,
        stock: 25,
      },
      {
        sku: "SWP-X1-SLV",
        size: "44mm",
        colour: "Silver",
        price: 9499,
        stock: 20,
      },
      {
        sku: "SWP-X1-GLD",
        size: "40mm",
        colour: "Rose Gold",
        price: 9999,
        stock: 15,
      },
    ],
    tags: ["smartwatch", "fitness", "gps", "amoled", "health"],
  },
  {
    name: "boAt Wave Call Smart Watch",
    slug: "boat-wave-call-smartwatch",
    description:
      "Bluetooth calling smartwatch with 1.69-inch HD display, 10 days battery, 100+ sports modes.",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    ],
    category: "Watches",
    brand: "boAt",
    variants: [
      { sku: "BWC-BLK", colour: "Active Black", price: 1799, stock: 50 },
      { sku: "BWC-BLU", colour: "Marine Blue", price: 1799, stock: 45 },
      { sku: "BWC-GRN", colour: "Forest Green", price: 1999, stock: 30 },
    ],
    tags: ["boat", "smartwatch", "calling", "fitness", "budget"],
  },
  {
    name: "Noise ColorFit Ultra 3",
    slug: "noise-colorfit-ultra-3",
    description:
      '1.96" AMOLED display, Bluetooth calling, built-in GPS and always-on display.',
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
    ],
    category: "Watches",
    brand: "Noise",
    variants: [
      { sku: "NCU3-BLK", colour: "Jet Black", price: 3999, stock: 35 },
      { sku: "NCU3-GLD", colour: "Gold", price: 4499, stock: 25 },
    ],
    tags: ["noise", "colorfit", "amoled", "gps", "calling"],
  },

  // ── Electronics ──────────────────────────────────────────
  {
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5",
    description:
      "Industry-leading noise cancellation, 30-hour battery, crystal clear hands-free calling.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    ],
    category: "Electronics",
    brand: "Sony",
    variants: [
      { sku: "SXWH5-BLK", colour: "Black", price: 26990, stock: 20 },
      { sku: "SXWH5-SLV", colour: "Silver", price: 26990, stock: 15 },
    ],
    tags: ["sony", "headphones", "noise-cancelling", "wireless", "premium"],
  },
  {
    name: 'Samsung 65" QLED 4K TV',
    slug: "samsung-65-qled-4k-tv",
    description:
      "Quantum Dot technology, Neo QLED with 4K resolution, Dolby Atmos, Smart TV.",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
    ],
    category: "Electronics",
    brand: "Samsung",
    variants: [
      {
        sku: "SQTV65-BLK",
        size: '65"',
        colour: "Black",
        price: 149999,
        stock: 5,
      },
      {
        sku: "SQTV55-BLK",
        size: '55"',
        colour: "Black",
        price: 99999,
        stock: 8,
      },
    ],
    tags: ["samsung", "qled", "4k", "tv", "smart-tv"],
  },
  {
    name: "Logitech MX Master 3S Mouse",
    slug: "logitech-mx-master-3s",
    description:
      "Advanced wireless mouse with 8K DPI sensor, quiet clicks, and ergonomic design.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    ],
    category: "Electronics",
    brand: "Logitech",
    variants: [
      { sku: "LMXM3S-BLK", colour: "Graphite", price: 9495, stock: 30 },
      { sku: "LMXM3S-GRY", colour: "Pale Grey", price: 9495, stock: 25 },
    ],
    tags: ["logitech", "mouse", "wireless", "ergonomic", "productivity"],
  },
  {
    name: "Apple AirPods Pro 2nd Gen",
    slug: "apple-airpods-pro-2",
    description:
      "Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio.",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    ],
    category: "Electronics",
    brand: "Apple",
    variants: [{ sku: "AAPP2-WHT", colour: "White", price: 24900, stock: 20 }],
    tags: ["apple", "airpods", "earbuds", "noise-cancelling", "ios"],
  },

  // ── Cosmetics ────────────────────────────────────────────
  {
    name: "Neutrogena Hydro Boost Gel",
    slug: "neutrogena-hydro-boost-gel",
    description:
      "Water gel moisturizer with hyaluronic acid. Instantly quenches dry skin.",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    ],
    category: "Cosmetics",
    brand: "Neutrogena",
    variants: [
      { sku: "NHB-50ML", size: "50ml", price: 899, stock: 60 },
      { sku: "NHB-100ML", size: "100ml", price: 1499, stock: 40 },
    ],
    tags: ["skincare", "moisturizer", "hydration", "neutrogena"],
  },
  {
    name: "Lakme Absolute Perfect Radiance",
    slug: "lakme-absolute-perfect-radiance",
    description:
      "Skin brightening day cream SPF 30 with micro crystals for a luminous glow.",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600"],
    category: "Cosmetics",
    brand: "Lakme",
    variants: [{ sku: "LAPR-50G", size: "50g", price: 449, stock: 80 }],
    tags: ["lakme", "skincare", "spf", "brightening", "cream"],
  },
  {
    name: "Maybelline Fit Me Foundation",
    slug: "maybelline-fit-me-foundation",
    description:
      "Matte + poreless foundation that controls shine for up to 12 hours.",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600",
    ],
    category: "Cosmetics",
    brand: "Maybelline",
    variants: [
      { sku: "MBFM-110", colour: "Porcelain", price: 495, stock: 45 },
      { sku: "MBFM-220", colour: "Natural Beige", price: 495, stock: 50 },
      { sku: "MBFM-330", colour: "Warm Caramel", price: 495, stock: 35 },
    ],
    tags: ["maybelline", "foundation", "makeup", "matte", "coverage"],
  },
  {
    name: "The Ordinary Niacinamide 10%",
    slug: "the-ordinary-niacinamide",
    description:
      "High-strength vitamin and mineral blemish formula. Reduces the appearance of blemishes and congestion.",
    images: [
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600",
    ],
    category: "Cosmetics",
    brand: "The Ordinary",
    variants: [{ sku: "TON-30ML", size: "30ml", price: 599, stock: 70 }],
    tags: ["theordinary", "niacinamide", "serum", "acne", "skincare"],
  },

  // ── Furniture ────────────────────────────────────────────
  {
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description:
      "Premium mesh office chair with lumbar support, adjustable armrests and 360° swivel.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    ],
    category: "Furniture",
    brand: "ComfortPro",
    variants: [
      { sku: "EOC-BLK", colour: "Black", price: 12999, stock: 15 },
      { sku: "EOC-GRY", colour: "Grey", price: 13999, stock: 10 },
    ],
    tags: ["office", "chair", "ergonomic", "mesh", "work-from-home"],
  },
  {
    name: "Scandinavian 2-Seater Sofa",
    slug: "scandinavian-2-seater-sofa",
    description:
      "Minimalist loveseat sofa with solid wood legs and premium fabric upholstery.",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
    category: "Furniture",
    brand: "HomeStyle",
    variants: [
      { sku: "S2S-BGE", colour: "Beige", price: 34999, stock: 6 },
      { sku: "S2S-GRY", colour: "Light Grey", price: 36999, stock: 4 },
      { sku: "S2S-BLU", colour: "Navy Blue", price: 38999, stock: 3 },
    ],
    tags: ["sofa", "furniture", "scandinavian", "minimalist", "living-room"],
  },
  {
    name: "Standing Study Desk",
    slug: "standing-study-desk",
    description:
      "Height adjustable standing desk with electric motor, memory presets, anti-collision.",
    images: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
    ],
    category: "Furniture",
    brand: "DeskPro",
    variants: [
      { sku: "SSD-WHT", colour: "White", price: 28999, stock: 8 },
      { sku: "SSD-BLK", colour: "Black", price: 29999, stock: 7 },
    ],
    tags: ["desk", "standing", "adjustable", "office", "ergonomic"],
  },

  // ── Accessories ──────────────────────────────────────────
  {
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description:
      "Genuine leather crossbody bag with multiple compartments and adjustable strap.",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"],
    category: "Accessories",
    brand: "LuxeBags",
    variants: [
      { sku: "LCB-BRN", colour: "Tan Brown", price: 3499, stock: 20 },
      { sku: "LCB-BLK", colour: "Jet Black", price: 3499, stock: 18 },
      { sku: "LCB-RED", colour: "Burgundy", price: 3999, stock: 12 },
    ],
    tags: ["bag", "leather", "crossbody", "womens", "accessories"],
  },
  {
    name: "Men's Bifold Leather Wallet",
    slug: "mens-bifold-leather-wallet",
    description:
      "Slim bifold wallet with RFID blocking, 8 card slots, and full-grain leather.",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    ],
    category: "Accessories",
    brand: "LuxeBags",
    variants: [
      { sku: "MBLW-BRN", colour: "Dark Brown", price: 1299, stock: 40 },
      { sku: "MBLW-BLK", colour: "Black", price: 1299, stock: 35 },
    ],
    tags: ["wallet", "leather", "rfid", "mens", "slim"],
  },
  {
    name: "Gold Layered Necklace Set",
    slug: "gold-layered-necklace-set",
    description:
      "18K gold plated layered necklace set with pendant. Tarnish resistant.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    ],
    category: "Accessories",
    brand: "ShineJewels",
    variants: [
      { sku: "GLN-SET-GLD", colour: "Gold", price: 799, stock: 55 },
      { sku: "GLN-SET-SLV", colour: "Silver", price: 699, stock: 48 },
    ],
    tags: ["jewellery", "necklace", "gold", "womens", "fashion"],
  },
  {
    name: "Polarized Aviator Sunglasses",
    slug: "polarized-aviator-sunglasses",
    description:
      "Classic aviator style with polarized UV400 protection lens. Metal frame.",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
    ],
    category: "Accessories",
    brand: "VisionEdge",
    variants: [
      { sku: "PAS-GLD-GRN", colour: "Gold/Green", price: 1299, stock: 30 },
      { sku: "PAS-SLV-BLK", colour: "Silver/Black", price: 1299, stock: 28 },
    ],
    tags: ["sunglasses", "aviator", "polarized", "uv-protection", "unisex"],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("📦 Connected to MongoDB for seeding...");

    // Clear existing data
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log("🗑️  Cleared existing products and users");

    // Insert products
    await ProductModel.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    // Create demo users
    const hashedPassword = await bcrypt.hash("Password123!", 12);
    await UserModel.insertMany([
      {
        name: "Demo User",
        email: "user@demo.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Admin User",
        email: "admin@demo.com",
        password: hashedPassword,
        role: "admin",
      },
    ]);
    console.log("✅ Created demo users (user@demo.com / admin@demo.com)");
    console.log("🔑 Password for both: Password123!");

    console.log("\n🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
