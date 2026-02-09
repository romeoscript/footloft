"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <AdminHeader />
            <div className="flex w-full">
                <Sidebar />
                <div className="w-[82%] p-8 bg-slate-50 min-h-[calc(100vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
