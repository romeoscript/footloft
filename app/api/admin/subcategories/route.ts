import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    if (typeof (prisma as { subCategory?: { findMany: unknown } }).subCategory?.findMany !== "function") {
      return NextResponse.json(
        { error: "Prisma client missing SubCategory. Run: npx prisma generate, then restart the dev server." },
        { status: 503 }
      );
    }
    const subCategories = await prisma.subCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(subCategories);
  } catch (error: unknown) {
    console.error("Error fetching sub-categories:", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, subCategory });
  } catch (error: any) {
    console.error("Error creating sub-category:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Sub-category already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
