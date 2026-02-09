"use client";
import React from "react";

const AdminDashboard = () => {
    const stats = [
        { label: "Total Revenue", value: "₦12,450.00", change: "+12.5%" },
        { label: "Total Orders", value: "156", change: "+8%" },
        { label: "Total Products", value: "48", change: "Hold" },
        { label: "Active Users", value: "1,204", change: "+15%" },
    ];

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-hover hover:border-gray-400"
                    >
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${stat.change.startsWith("+")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mt-4 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                </div>
                <div className="p-6 text-center text-gray-400">
                    <p>Order history visualization coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
