import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subcategory");
    const bestseller = searchParams.get("bestseller");
    const search = searchParams.get("search");

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        in: category.split(","),
      };
    }

    if (subCategory) {
      where.subCategory = {
        in: subCategory.split(","),
      };
    }

    if (bestseller === "true") {
      where.bestseller = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert BigInt to Number for JSON serialization
    const serializedProducts = products.map((product) => ({
      ...product,
      date: product.date ? Number(product.date) : null,
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name,
      description,
      price,
      images,
      category,
      subCategory,
      sizes,
      bestseller,
    } = data;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !subCategory ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        category,
        subCategory,
        sizes: sizes || [],
        bestseller: !!bestseller,
        date: BigInt(Date.now()),
      },
    });

    revalidateTag("products");
    return NextResponse.json(
      { success: true, productId: product.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
