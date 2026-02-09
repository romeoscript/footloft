"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "@/assets/assets";
import Image from "next/image";

function getOrderImage(order: Order): React.ComponentProps<typeof Image>["src"] {
    const first = order.items[0]?.product?.images?.[0];
    return first || assets.cart_icon;
}

interface OrderItem {
    product: {
        name: string;
        images?: string[];
    };
    quantity: number;
    size: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    address: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: boolean;
    createdAt: string | Date;
    amount: number;
    status: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/admin/orders");
            if (response.data) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
        try {
            const response = await axios.post("/api/admin/orders", {
                orderId,
                status: e.target.value,
            });
            if (response.data.success) {
                toast.success("Order status updated");
                await fetchOrders();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-gray-800">Order Management</h2>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No orders found.</div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start p-5 border border-slate-200 rounded-md text-sm text-gray-700 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <div className="flex justify-center sm:justify-start">
                                <Image
                                    className="w-12 h-12 object-cover rounded"
                                    src={getOrderImage(order)}
                                    alt=""
                                    width={48}
                                    height={48}
                                />
                            </div>

                            <div>
                                <div className="font-bold text-black mb-2">
                                    {order.items.map((item: OrderItem, idx: number) => (
                                        <p key={idx}>
                                            {item.product.name} x {item.quantity} <span>({item.size})</span>
                                            {idx !== order.items.length - 1 && ","}
                                        </p>
                                    ))}
                                </div>
                                <p className="font-medium">
                                    {order.address.firstName + " " + order.address.lastName}
                                </p>
                                <div className="text-gray-500 mt-1">
                                    <p>{order.address.street + ","}</p>
                                    <p>
                                        {order.address.city +
                                            ", " +
                                            order.address.state +
                                            ", " +
                                            order.address.country +
                                            ", " +
                                            order.address.zipcode}
                                    </p>
                                </div>
                                <p className="mt-2 font-medium">{order.address.phone}</p>
                            </div>

                            <div>
                                <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                                <p className="mt-1">Method: {order.paymentMethod}</p>
                                <p className={`mt-1 font-bold ${order.paymentStatus ? 'text-green-600' : 'text-orange-600'}`}>
                                    Payment: {order.paymentStatus ? "Done" : "Pending"}
                                </p>
                                <p className="mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>

                            <p className="text-lg font-bold text-black sm:text-center self-center">
                                ₦{order.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </p>

                            <select
                                onChange={(e) => statusHandler(e, order.id)}
                                value={order.status}
                                className="p-2 font-bold border border-slate-300 rounded-md bg-white focus:outline-none focus:border-black self-center"
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
