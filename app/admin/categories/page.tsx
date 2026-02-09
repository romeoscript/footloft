"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface CategoryItem {
    id: string;
    name: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [subCategories, setSubCategories] = useState<CategoryItem[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, subRes] = await Promise.all([
                axios.get("/api/admin/categories"),
                axios.get("/api/admin/subcategories"),
            ]);
            setCategories(catRes.data);
            setSubCategories(subRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            const response = await axios.post("/api/admin/categories", { name: newCategory });
            if (response.data.success) {
                toast.success("Category added");
                setNewCategory("");
                fetchData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to add category");
        }
    };

    const addSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubCategory.trim()) return;
        try {
            const response = await axios.post("/api/admin/subcategories", { name: newSubCategory });
            if (response.data.success) {
                toast.success("Sub-category added");
                setNewSubCategory("");
                fetchData();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to add sub-category");
        }
    };

    const deleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/categories/${id}`);
            toast.success("Category deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const deleteSubCategory = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/subcategories/${id}`);
            toast.success("Sub-category deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete sub-category");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Categories Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Categories</h3>
                    <form onSubmit={addCategory} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Add new category"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-all font-bold">
                            ADD
                        </button>
                    </form>

                    <div className="space-y-2">
                        {loading ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : categories.length === 0 ? (
                            <p className="text-gray-500 text-sm">No categories found.</p>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-md group">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sub-Categories Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Sub-Categories</h3>
                    <form onSubmit={addSubCategory} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            placeholder="Add new sub-category"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-all font-bold">
                            ADD
                        </button>
                    </form>

                    <div className="space-y-2">
                        {loading ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : subCategories.length === 0 ? (
                            <p className="text-gray-500 text-sm">No sub-categories found.</p>
                        ) : (
                            subCategories.map((sub) => (
                                <div key={sub.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-md group">
                                    <span className="font-medium text-gray-700">{sub.name}</span>
                                    <button
                                        onClick={() => deleteSubCategory(sub.id)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
