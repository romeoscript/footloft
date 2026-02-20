import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    if (
      typeof (prisma as { category?: { findMany: unknown } }).category
        ?.findMany !== "function"
    ) {
      return NextResponse.json(
        {
          error:
            "Prisma client missing Category. Run: npx prisma generate, then restart the dev server.",
        },
        { status: 503 },
      );
    }
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "desc",
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
    const body = await request.json();
    const { name, image } = body as { name?: string; image?: string | null };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        image: image && typeof image === "string" ? image : undefined,
      },
    });

    revalidateTag("categories");
    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    if ((error as { code?: string }).code === "P2002") {
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
