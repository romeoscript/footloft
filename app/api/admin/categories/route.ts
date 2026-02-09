import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    if (typeof (prisma as { category?: { findMany: unknown } }).category?.findMany !== "function") {
      return NextResponse.json(
        { error: "Prisma client missing Category. Run: npx prisma generate, then restart the dev server." },
        { status: 503 }
      );
    }
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories);
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
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

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
