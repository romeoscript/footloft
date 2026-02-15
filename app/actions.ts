"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { containsProfanity } from "@/lib/utils";
import { sendOrderReceipt, sendAdminOrderNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AuthError } from "next-auth";

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

export async function signInWithCredentials(email: string, password: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !password) return { error: "Email and password required" };

  try {
    await signIn("credentials", {
      email: trimmed,
      password,
      redirect: false,
    });

    // Fetch the session to get the role
    const session = await auth();
    return {
      success: true,
      role: session?.user?.role,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
      return { error: "Something went wrong" };
    }
    throw error;
  }
}

export async function getAdminStats() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const [totalOrders, totalProducts, totalUsers, revenueData, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          paymentStatus: true,
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: revenueData._sum.amount || 0,
    recentOrders,
  };
}

export async function publishPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: true,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

export async function saveDraft(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (containsProfanity(content)) {
    throw new Error("Content contains profanity");
  }

  const post = await prisma.post.upsert({
    where: {
      id: parseInt(postId ?? "-1"),
      author: {
        email: session.user.email!,
      },
    },
    update: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
    },
    create: {
      title: title.trim(),
      content: content?.trim(),
      published: false,
      author: {
        connect: {
          email: session.user.email!,
        },
      },
    },
  });

  revalidatePath(`/posts/${post.id}`);
  revalidatePath("/posts");
  redirect(`/posts/${post.id}`);
}

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
  [key: string]: string | number | boolean | null | undefined; // To satisfy Prisma's Json type without using 'any'
}

export async function placeOrder(orderData: {
  amount: number;
  address: Address;
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  paymentMethod: string;
}) {
  const session = await auth();
  const userId = session?.user ? parseInt(session.user.id!) : null;

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        amount: orderData.amount,
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
        items: {
          create: orderData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
        },
      },
    });

    sendOrderReceipt(order.id).catch((err) =>
      console.error("Receipt email failed:", err),
    );

    sendAdminOrderNotification(order.id).catch((err) =>
      console.error("Admin notification failed:", err),
    );

    revalidatePath("/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order error:", error);
    return { success: false, error: "Failed to place order" };
  }
}

export async function getShippingRates() {
  return await prisma.shippingRate.findMany({
    orderBy: {
      state: "asc",
    },
  });
}

export async function upsertShippingRate(state: string, rate: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.shippingRate.upsert({
    where: { state },
    update: { rate },
    create: { state, rate },
  });
}

export async function deleteShippingRate(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.shippingRate.delete({
    where: { id },
  });
}
