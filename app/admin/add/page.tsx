"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

interface CategoryItem {
    id: string;
    name: string;
}

const AddProduct = () => {
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
    const [image4, setImage4] = useState<File | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [subCategories, setSubCategories] = useState<CategoryItem[]>([]);

    const fetchCategories = async () => {
        try {
            const [catRes, subRes] = await Promise.all([
                axios.get("/api/admin/categories"),
                axios.get("/api/admin/subcategories"),
            ]);
            setCategories(catRes.data);
            setSubCategories(subRes.data);

            if (catRes.data.length > 0) setCategory(catRes.data[0].name);
            if (subRes.data.length > 0) setSubCategory(subRes.data[0].name);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load categories");
        }
    };

    React.useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const images = [image1, image2, image3, image4].filter((img) => img !== null);

            if (images.length === 0) {
                toast.error("Please upload at least one image");
                setLoading(false);
                return;
            }

            // Upload images to Cloudinary via our upload API concurrently
            const uploadPromises = images.map(async (image) => {
                const formData = new FormData();
                formData.append("file", image);
                const uploadResponse = await axios.post("/api/upload", formData);
                return uploadResponse.data.success ? uploadResponse.data.url : null;
            });

            const results = await Promise.all(uploadPromises);
            const uploadedImageUrls = results.filter((url) => url !== null) as string[];

            // Create product
            const productData = {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                bestseller,
                sizes,
                images: uploadedImageUrls,
            };

            const response = await axios.post("/api/products", productData);
            if (response.data.success) {
                toast.success("Product added successfully!");
                setName("");
                setDescription("");
                setPrice("");
                setImagesToNull();
                setBestseller(false);
                setSizes([]);
            }
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to add product");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const setImagesToNull = () => {
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
    };

    const toggleSize = (size: string) => {
        setSizes((prev: string[]) =>
            prev.includes(size) ? prev.filter((s: string) => s !== size) : [...prev, size],
        );
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start gap-3 bg-white p-8 rounded-lg shadow-sm border border-slate-200"
        >
            <div className="w-full">
                <p className="mb-2 font-medium text-gray-700">Upload Images</p>
                <div className="flex gap-2">
                    {[
                        { img: image1, setImg: setImage1, id: "image1" },
                        { img: image2, setImg: setImage2, id: "image2" },
                        { img: image3, setImg: setImage3, id: "image3" },
                        { img: image4, setImg: setImage4, id: "image4" },
                    ].map((item) => (
                        <label key={item.id} htmlFor={item.id} className="cursor-pointer">
                            <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md overflow-hidden hover:border-black transition-all">
                                {item.img ? (
                                    <Image
                                        className="w-full h-full object-cover"
                                        src={URL.createObjectURL(item.img)}
                                        alt=""
                                        width={80}
                                        height={80}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-30">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                onChange={(e) =>
                                    item.setImg(e.target.files ? e.target.files[0] : null)
                                }
                                type="file"
                                id={item.id}
                                hidden
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-[500px]">
                <p className="mb-2 font-medium text-gray-700">Product Name</p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black transition-all"
                    type="text"
                    placeholder="Ex: Men Premium Leather Oxford"
                    required
                />
            </div>

            <div className="w-full max-w-[500px]">
                <p className="mb-2 font-medium text-gray-700">Product Description</p>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black transition-all"
                    rows={4}
                    placeholder="Enter product details..."
                    required
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-8 w-full">
                <div>
                    <p className="mb-2 font-medium text-gray-700">Category</p>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-2 font-medium text-gray-700">Sub Category</p>
                    <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                    >
                        {subCategories.map((sub) => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-2 font-medium text-gray-700">Product Price</p>
                    <input
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-black"
                        type="number"
                        placeholder="25"
                        required
                    />
                </div>
            </div>

            <div>
                <p className="mb-2 font-medium text-gray-700">Product Sizes</p>
                <div className="flex gap-3">
                    {["S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44"].map(
                        (size) => (
                            <div
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`flex items-center justify-center w-10 h-10 cursor-pointer border rounded-md transition-all ${sizes.includes(size)
                                    ? "bg-black text-white border-black"
                                    : "bg-slate-50 border-slate-200 text-gray-600 hover:border-gray-400"
                                    }`}
                            >
                                <p className="text-xs font-bold">{size}</p>
                            </div>
                        ),
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-2 items-center cursor-pointer">
                <input
                    onChange={() => setBestseller((prev: boolean) => !prev)}
                    checked={bestseller}
                    type="checkbox"
                    id="bestseller"
                    className="w-4 h-4 cursor-pointer"
                />
                <label className="cursor-pointer text-gray-700" htmlFor="bestseller">
                    Add to Bestseller
                </label>
            </div>

            <button
                disabled={loading}
                type="submit"
                className="w-48 py-3 mt-4 bg-black text-white font-bold rounded-md hover:opacity-90 transition-all disabled:opacity-50"
            >
                {loading ? "Adding Product..." : "ADD PRODUCT"}
            </button>
        </form>
    );
};

export default AddProduct;
