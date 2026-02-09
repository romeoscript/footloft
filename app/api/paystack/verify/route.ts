import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference", success: false }, { status: 400 });
  }

  if (!PAYSTACK_SECRET) {
    return NextResponse.json(
      { error: "Paystack is not configured", success: false },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const data = await res.json();
    if (!data.status || data.data?.status !== "success") {
      return NextResponse.json(
        { error: data.message || "Payment verification failed", success: false },
        { status: 400 }
      );
    }

    const orderId = data.data?.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: "Invalid payment data", success: false },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: true,
        status: "Order Placed",
      },
    });

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { error: "Verification failed", success: false },
      { status: 500 }
    );
  }
}
