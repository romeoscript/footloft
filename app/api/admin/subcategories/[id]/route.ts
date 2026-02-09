import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.subCategory.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sub-category deleted",
    });
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
