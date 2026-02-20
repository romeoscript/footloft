import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, image } = body as { name?: string; image?: string | null };

    const data: { name?: string; image?: string | null } = {};
    if (
      name !== undefined &&
      typeof name === "string" &&
      name.trim().length > 0
    ) {
      data.name = name.trim();
    }
    if (image !== undefined) {
      data.image =
        typeof image === "string" ? image : image === null ? null : undefined;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }
    if (data.name !== undefined && !data.name) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    revalidateTag("categories");
    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    console.error("Error updating category:", error);
    const err = error as { code?: string };
    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidateTag("categories");
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
