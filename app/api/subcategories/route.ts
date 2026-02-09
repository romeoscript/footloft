import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      orderBy: { name: "asc" },
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
