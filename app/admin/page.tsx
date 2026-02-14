"use client";

import React, { useEffect, useState } from "react";
import { getAdminStats } from "../actions";
import { toast } from "react-toastify";

interface Order {
    id: string;
    address: {
        firstName: string;
        lastName: string;
        email: string;
    };
    user?: {
        email: string;
    };
    amount: number;
    status: string;
    createdAt: string;
}

interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: Order[];
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data as unknown as AdminStats);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Revenue", value: `₦${stats?.totalRevenue.toLocaleString()}` },
        { label: "Total Orders", value: stats?.totalOrders.toString() },
        { label: "Total Products", value: stats?.totalProducts.toString() },
        { label: "Active Users", value: stats?.totalUsers.toString() },
    ];

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-hover hover:border-gray-400"
                    >
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mt-4 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order: Order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-700 font-mono">#{order.id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4 text-sm text-gray-700">
                                            <div>{order.address.firstName} {order.address.lastName}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email || order.address.email}</div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-black">₦{order.amount.toLocaleString()}</td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                                                    "bg-amber-100 text-amber-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                        No orders found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
