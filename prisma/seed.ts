import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Load the Cloudinary mapping
const MAPPING_FILE = path.join(
  process.cwd(),
  "assets",
  "cloudinary_mapping.json",
);
const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));

// Helper to get Cloudinary URL
const getUrl = (filename: string) => mapping[filename] || filename;

const products_raw = [
  {
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 100,
    images: ["p_img1.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: BigInt(1716634345448),
  },
  {
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 200,
    images: ["p_img2_1.png", "p_img2_2.png", "p_img2_3.png", "p_img2_4.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    date: BigInt(1716621345448),
  },
  {
    name: "Premium Leather Oxford Shoes",
    description:
      "Handcrafted from Italian calfskin, these Oxford shoes offer a timeless silhouette with deep-brown polished finish, perfect for formal occasions and business excellence.",
    price: 450,
    images: ["luxury_mens_oxford_1770636997708.png"],
    category: "Men",
    subCategory: "Footwear",
    sizes: ["40", "41", "42", "43", "44"],
    bestseller: true,
    date: BigInt(1716669545448),
  },
  {
    name: "Elegant Stiletto Heels",
    description:
      "Sophisticated nude leather stilettos designed for ultimate poise. Features a sleek minimalist design and premium padding for all-day luxury.",
    price: 380,
    images: ["luxury_womens_stiletto_1770637011275.png"],
    category: "Women",
    subCategory: "Footwear",
    sizes: ["36", "37", "38", "39", "40"],
    bestseller: true,
    date: BigInt(1716670645448),
  },
  {
    name: "Minimalist White Sneakers",
    description:
      "Premium white leather sneakers that combine street-style comfort with high-fashion luxury. Clean lines and subtle textures make it a versatile closet staple.",
    price: 290,
    images: ["luxury_white_sneaker_1770637025828.png"],
    category: "Men",
    subCategory: "Footwear",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    bestseller: true,
    date: BigInt(1716671745448),
  },
  {
    name: "Men Tapered Fit Flat-Front Trousers",
    description:
      "A versatile addition to any wardrobe, these tapered trousers offer a structured yet comfortable fit, ideal for transition from office to evening.",
    price: 190,
    images: ["p_img7.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "L", "XL"],
    bestseller: false,
    date: BigInt(1716621542448),
  },
  {
    name: "Women Palazzo Pants with Waist Belt",
    description:
      "Elegant and breezy palazzo pants featuring a flattering high-waist design and a matching belt for a sophisticated boutique look.",
    price: 190,
    images: ["p_img20.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: false,
    date: BigInt(1716633245448),
  },
  {
    name: "Men Slim Fit Relaxed Denim Jacket",
    description:
      "A modern take on a classic, this denim jacket features a tailored slim fit with relaxed details, perfect for layering in any season.",
    price: 350,
    images: ["p_img52.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: false,
    date: BigInt(1716668445448),
  },
  {
    name: "Women Zip-Front Relaxed Fit Jacket",
    description:
      "Classic winter jacket designed for style and warmth. Features high-quality materials and a modern silhouette.",
    price: 270,
    images: ["p_img21.png"],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: false,
    date: BigInt(1716634345448),
  },
  {
    name: "Boy Round Neck Pure Cotton T-shirt",
    description: "Comfortable and durable everyday wear for active kids.",
    price: 180,
    images: ["p_img23.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: false,
    date: BigInt(1716636545448),
  },
];

// Map image filenames to Cloudinary URLs
const products = products_raw.map((p) => ({
  ...p,
  images: p.images.map((img) => getUrl(img)),
}));

const CATEGORY_NAMES = ["Men", "Women", "Kids"];
const SUBCATEGORY_NAMES = ["Topwear", "Bottomwear", "Winterwear", "Footwear"];

async function main() {
  console.log("Seeding database...");

  // Clear existing
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();

  // Seed categories and subcategories (for admin and dynamic filters)
  for (const name of CATEGORY_NAMES) {
    await prisma.category.create({ data: { name } });
  }
  for (const name of SUBCATEGORY_NAMES) {
    await prisma.subCategory.create({ data: { name } });
  }

  // Create products
  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }

  // Create a default admin user
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@footloftcloset.com",
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
