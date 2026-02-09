import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(subCategories);
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
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
