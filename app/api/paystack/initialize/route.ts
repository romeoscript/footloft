import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

export async function POST(request: Request) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json(
      { error: "Paystack is not configured. Set PAYSTACK_SECRET_KEY." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      amount,
      email,
      address,
      items,
    }: {
      amount: number;
      email: string;
      address: Address;
      items: Array<{ productId: string; quantity: number; size: string; price: number }>;
    } = body;

    if (!amount || amount <= 0 || !email || !address || !items?.length) {
      return NextResponse.json(
        { error: "Missing amount, email, address, or items" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user ? parseInt(session.user.id!) : null;

    const order = await prisma.order.create({
      data: {
        userId,
        amount: Number(amount),
        address,
        paymentMethod: "Paystack",
        paymentStatus: false,
        status: "Pending",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
        },
      },
    });

    const amountInKobo = Math.round(Number(amount) * 100);
    const reference = `ft_${order.id}_${Date.now()}`;

    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "";
    const callbackUrl = origin ? `${origin}/place-order/verify` : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/place-order/verify`;

    const res = await fetch(PAYSTACK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderId: order.id,
        },
        currency: "NGN",
      }),
    });

    const data = await res.json();
    if (!data.status || !data.data?.authorization_url) {
      console.error("Paystack initialize error:", data);
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
