import prisma from "@/lib/prisma";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Cache product fetching for 1 hour
export const getProducts = unstable_cache(
  async () => {
    const products = await prisma.product.findMany();
    // Transform to match frontend expectations if needed
    return products.map((item) => ({
      ...item,
      _id: item.id,
      image: item.images,
    }));
  },
  ["products-list"],
  { revalidate: 3600, tags: ["products"] },
);

export const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany();
  },
  ["categories-list"],
  { revalidate: 3600, tags: ["categories"] },
);

export const getSubCategories = unstable_cache(
  async () => {
    return await prisma.subCategory.findMany();
  },
  ["subcategories-list"],
  { revalidate: 3600, tags: ["subcategories"] },
);

export const getProductById = cache(async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
  });
});
