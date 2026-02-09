"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
}

const ListProducts = () => {
    const [list, setList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/products");
            if (response.data) {
                setList(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await axios.delete(`/api/products/${id}`);
            if (response.data.success) {
                toast.success("Product deleted successfully");
                fetchList();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-gray-800">All Products List</h2>

            <div className="flex flex-col gap-2">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-slate-50 text-sm font-bold text-gray-600 rounded-t-md">
                    <p>Image</p>
                    <p>Name</p>
                    <p>Category</p>
                    <p>Price</p>
                    <p className="text-center">Action</p>
                </div>

                {/* List Items */}
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading products...</div>
                ) : list.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No products found.</div>
                ) : (
                    list.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border rounded-md hover:bg-slate-50 transition-all text-sm group"
                        >
                            <Image
                                className="w-12 h-12 object-cover rounded shadow-sm"
                                src={item.images[0]}
                                alt=""
                                width={48}
                                height={48}
                            />
                            <p className="font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="hidden md:block text-gray-600">{item.category}</p>
                            <p className="hidden md:block font-bold">
                                ₦{item.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </p>
                            <div className="flex justify-center gap-2">
                                <Link
                                    href={`/admin/product/${item.id}`}
                                    className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Edit Product"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={() => removeProduct(item.id)}
                                    className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Delete Product"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListProducts;
