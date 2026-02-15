import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM || "Footloft <onboarding@resend.dev>";

type AddressJson = {
  firstName?: string;
  lastName?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  phone?: string;
};

function buildReceiptHtml(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; size: string; price: number }>;
  amount: number;
  paymentMethod: string;
  address: AddressJson;
  createdAt: Date;
}): string {
  const {
    orderId,
    customerName,
    items,
    amount,
    paymentMethod,
    address,
    createdAt,
  } = params;
  const dateStr = new Date(createdAt).toLocaleDateString("en-NG", {
    dateStyle: "long",
  });
  const rows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:10px;border-bottom:1px solid #eee">${i.quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #eee">${i.size}</td>
          <td style="padding:10px;border-bottom:1px solid #eee">₦${i.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td>
        </tr>`,
    )
    .join("");
  const addressBlock = [
    address.street,
    [address.city, address.state, address.zipcode].filter(Boolean).join(", "),
    address.country,
    address.phone,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Footloft Order</title>
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f5f5f5;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
    <div style="background:#111;color:#fff;padding:24px;text-align:center">
      <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:0.05em">FOOTLOFT</h1>
      <p style="margin:8px 0 0;font-size:12px;opacity:0.9">Order confirmation</p>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 16px;font-size:16px;color:#333">Hi ${customerName},</p>
      <p style="margin:0 0 20px;font-size:14px;color:#555">Thank you for your order. Here are the details.</p>
      <p style="margin:0 0 8px;font-size:12px;color:#888">Order ID: <strong style="color:#333">${orderId}</strong></p>
      <p style="margin:0 0 20px;font-size:12px;color:#888">Date: ${dateStr}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f9f9f9">
            <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Item</th>
            <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Qty</th>
            <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Size</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #eee">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:16px 0 0;font-size:16px;font-weight:600;text-align:right">Total: ₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#888;text-align:right">Payment: ${paymentMethod}</p>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #eee">
        <p style="margin:0 0 6px;font-size:12px;color:#888">Delivery address</p>
        <p style="margin:0;font-size:14px;color:#333">${addressBlock}</p>
      </div>
    </div>
    <div style="background:#f9f9f9;padding:16px 24px;text-align:center">
      <p style="margin:0;font-size:12px;color:#888">Questions? Reply to this email or contact us.</p>
      <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:#111">FOOTLOFT</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderReceipt(
  orderId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping receipt email");
    return { ok: false, error: "Email not configured" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!order) return { ok: false, error: "Order not found" };

    const address = order.address as AddressJson;
    const email = address?.email;
    if (!email || typeof email !== "string") {
      return { ok: false, error: "No email on order" };
    }

    const customerName =
      [address.firstName, address.lastName].filter(Boolean).join(" ") ||
      "Customer";
    const html = buildReceiptHtml({
      orderId: order.id,
      customerName,
      customerEmail: email,
      items: order.items.map((i) => ({
        name: i.product?.name ?? "Product",
        quantity: i.quantity,
        size: i.size,
        price: i.price,
      })),
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      address,
      createdAt: order.createdAt,
    });

    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your Footloft order #${order.id.slice(-8)}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { ok: false, error: String(error) };
    }
    return { ok: true };
  } catch (e) {
    console.error("sendOrderReceipt error:", e);
    return { ok: false, error: String(e) };
  }
}

const ADMIN_EMAILS = ["jacintaujunwa1@gmail.com", "uliagam184@gmail.com"];

function buildAdminNotificationHtml(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; size: string; price: number }>;
  amount: number;
  paymentMethod: string;
  address: AddressJson;
  createdAt: Date;
}) {
  const {
    orderId,
    customerName,
    customerEmail,
    items,
    amount,
    paymentMethod,
    address,
    createdAt,
  } = params;
  const dateStr = new Date(createdAt).toLocaleString("en-NG", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const rows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee">${i.name} (${i.size})</td>
      <td style="padding:8px; border-bottom:1px solid #eee">${i.quantity}</td>
      <td style="padding:8px; border-bottom:1px solid #eee; text-align:right">₦${i.price.toLocaleString()}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="font-family:sans-serif; max-width:600px; margin:0 auto; border:1px solid #eee; padding:20px; color:#333">
      <h2 style="color:#111; border-bottom:2px solid #111; padding-bottom:10px">New Order Received!</h2>
      <p style="font-size:16px">A new order <strong>#${orderId}</strong> was placed on Footloft.</p>
      
      <div style="background:#f9f9f9; padding:15px; border-radius:4px; margin:20px 0">
        <h3 style="margin-top:0; font-size:14px; color:#666; text-transform:uppercase">Customer Details</h3>
        <p style="margin:5px 0"><strong>Name:</strong> ${customerName}</p>
        <p style="margin:5px 0"><strong>Email:</strong> ${customerEmail}</p>
        <p style="margin:5px 0"><strong>Phone:</strong> ${address.phone || "N/A"}</p>
        <p style="margin:5px 0"><strong>Address:</strong> ${address.street}, ${address.city}, ${address.state}</p>
      </div>

      <h3 style="font-size:14px; color:#666; text-transform:uppercase">Order Items</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px">
        <thead style="background:#f5f5f5">
          <tr>
            <th style="padding:8px; text-align:left">Item</th>
            <th style="padding:8px; text-align:left">Qty</th>
            <th style="padding:8px; text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="text-align:right; border-top:2px solid #eee; padding-top:10px">
        <p style="font-size:18px; margin:0"><strong>Total Amount: ₦${amount.toLocaleString()}</strong></p>
        <p style="font-size:14px; color:#666; margin:5px 0">Payment Method: ${paymentMethod}</p>
      </div>

      <div style="margin-top:30px; font-size:12px; color:#999; text-align:center; border-top:1px solid #eee; padding-top:20px">
        <p>Order Date: ${dateStr}</p>
        <p>This is an automated notification for Footloft Admins.</p>
      </div>
    </div>
  `;
}

export async function sendAdminOrderNotification(
  orderId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY)
    return { ok: false, error: "Email not configured" };

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) return { ok: false, error: "Order not found" };

    const address = order.address as AddressJson;
    const customerName =
      [address.firstName, address.lastName].filter(Boolean).join(" ") ||
      "Customer";

    const html = buildAdminNotificationHtml({
      orderId: order.id,
      customerName,
      customerEmail: address.email || "N/A",
      items: order.items.map((i) => ({
        name: i.product?.name ?? "Product",
        quantity: i.quantity,
        size: i.size,
        price: i.price,
      })),
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      address,
      createdAt: order.createdAt,
    });

    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAILS,
      subject: `🚨 NEW ORDER ALERT: #${order.id.slice(-8)} from ${customerName}`,
      html,
    });

    if (error) {
      console.error("Resend Admin Error:", error);
      return { ok: false, error: String(error) };
    }
    return { ok: true };
  } catch (e) {
    console.error("sendAdminOrderNotification error:", e);
    return { ok: false, error: String(e) };
  }
}
