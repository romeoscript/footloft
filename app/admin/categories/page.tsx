"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

interface CategoryItem {
    id: string;
    name: string;
    image?: string | null;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [subCategories, setSubCategories] = useState<CategoryItem[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [newSubCategory, setNewSubCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

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

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData);
        if (!res.data?.success || !res.data?.url) throw new Error("Upload failed");
        return res.data.url;
    };

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        setLoading(true);
        try {
            let imageUrl: string | undefined;
            if (newCategoryImage) {
                imageUrl = await uploadImage(newCategoryImage);
            }
            const response = await axios.post("/api/admin/categories", {
                name: newCategory.trim(),
                image: imageUrl ?? null,
            });
            if (response.data.success) {
                toast.success("Category added");
                setNewCategory("");
                setNewCategoryImage(null);
                fetchData();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to add category");
            } else {
                toast.error("Failed to add category");
            }
        } finally {
            setLoading(false);
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
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to add sub-category");
            } else {
                toast.error("Failed to add sub-category");
            }
        }
    };

    const openEdit = (cat: CategoryItem) => {
        setEditingCategory(cat);
        setEditName(cat.name);
        setEditImage(null);
        setEditImageUrl(cat.image ?? null);
    };

    const closeEdit = () => {
        setEditingCategory(null);
        setEditName("");
        setEditImage(null);
        setEditImageUrl(null);
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editName.trim()) return;
        setSavingEdit(true);
        try {
            let imageUrl: string | null = editImageUrl;
            if (editImage) {
                imageUrl = await uploadImage(editImage);
            }
            const response = await axios.patch(`/api/admin/categories/${editingCategory.id}`, {
                name: editName.trim(),
                image: imageUrl,
            });
            if (response.data.success) {
                toast.success("Category updated");
                closeEdit();
                fetchData();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to update category");
            } else {
                toast.error("Failed to update category");
            }
        } finally {
            setSavingEdit(false);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/categories/${id}`);
            toast.success("Category deleted");
            fetchData();
        } catch {
            toast.error("Failed to delete category");
        }
    };

    const deleteSubCategory = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/subcategories/${id}`);
            toast.success("Sub-category deleted");
            fetchData();
        } catch {
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
                    <form onSubmit={addCategory} className="space-y-3 mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Category name"
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition-all font-bold disabled:opacity-50"
                            >
                                ADD
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewCategoryImage(e.target.files?.[0] ?? null)}
                                className="text-sm"
                            />
                            {newCategoryImage && (
                                <span className="text-xs text-gray-500 truncate max-w-[120px]">{newCategoryImage.name}</span>
                            )}
                        </div>
                    </form>

                    <div className="space-y-2">
                        {loading && categories.length === 0 ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : categories.length === 0 ? (
                            <p className="text-gray-500 text-sm">No categories found.</p>
                        ) : (
                            categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-md group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {cat.image ? (
                                            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-slate-200">
                                                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-400 text-xs">
                                                No img
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-700 truncate">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(cat)}
                                            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-all"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteCategory(cat.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-all"
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
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
                        {loading && subCategories.length === 0 ? (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        ) : subCategories.length === 0 ? (
                            <p className="text-gray-500 text-sm">No sub-categories found.</p>
                        ) : (
                            subCategories.map((sub) => (
                                <div key={sub.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-md group">
                                    <span className="font-medium text-gray-700">{sub.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => deleteSubCategory(sub.id)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:text-red-700 p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Category Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeEdit}>
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Category</h3>
                        <form onSubmit={saveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {(editImageUrl || editImage) && (
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-100">
                                            {editImage ? (
                                                <Image src={URL.createObjectURL(editImage)} alt="" fill className="object-cover" sizes="80px" />
                                            ) : editImageUrl ? (
                                                <Image src={editImageUrl} alt="" fill className="object-cover" sizes="80px" />
                                            ) : null}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                setEditImage(f ?? null);
                                                if (!f) setEditImageUrl(null);
                                            }}
                                            className="text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditImage(null);
                                                setEditImageUrl(null);
                                            }}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    className="px-4 py-2 border border-slate-300 rounded-md text-gray-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingEdit}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:opacity-90 disabled:opacity-50 font-medium"
                                >
                                    {savingEdit ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
