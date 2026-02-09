"use client";
import React, { useContext, useEffect, useState, useCallback } from 'react'
import Image from 'next/image';
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import { ShopContext } from '@/context/ShopContext'
import { assets } from '@/assets/assets'

interface Product {
    _id: string;
    image: string[];
    name: string;
    price: number;
    category: string;
    subCategory: string;
}

import { useSearchParams } from 'next/navigation';

const Collection = () => {

    const { products, search, showSearch } = useContext(ShopContext);
    const searchParams = useSearchParams();

    const [filterProducts, setFilterProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subCategory, setSubCategory] = useState<string[]>([]);

    useEffect(() => {
        const cat = searchParams.get('category');
        const sub = searchParams.get('subcategory');

        if (cat) setCategory([cat]);
        if (sub) setSubCategory([sub]);
    }, [searchParams]);

    const [showFilter, setShowFilter] = useState(false);
    const [sortType, setSortType] = useState('relavent')

    const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(a => a !== e.target.value))
        }
        else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(a => a !== e.target.value))
        }
        else {
            setSubCategory(prev => [...prev, e.target.value])
        }

    }

    const applyFilter = () => {

        let productsCopy = products.slice()

        if (showSearch && search) {
            productsCopy = productsCopy.filter((item: Product) => item.name.toLowerCase().includes(search.toLowerCase()))
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter((item: Product) => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item: Product) => subCategory.includes(item.subCategory));
        }

        setFilterProducts(productsCopy)

    }

    const sortProduct = () => {

        const fpCopy = filterProducts.slice();

        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
                break;

            case 'high-low':
                setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
                break;

            default:
                applyFilter();
                break;
        }

    }

    useEffect(() => {
        applyFilter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, subCategory, search, showSearch, products])

    useEffect(() => {
        sortProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortType])



    const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize visible products when filterProducts changes
    useEffect(() => {
        if (filterProducts.length > 0) {
            setVisibleProducts(filterProducts.slice(0, 10));
        } else {
            setVisibleProducts([]);
        }
    }, [filterProducts]);

    const loadMore = useCallback(() => {
        if (loading || visibleProducts.length >= filterProducts.length) return;

        setLoading(true);
        // Simulate network delay for smoother feel, or just append immediately
        setTimeout(() => {
            const nextBatch = filterProducts.slice(visibleProducts.length, visibleProducts.length + 10);
            setVisibleProducts(prev => [...prev, ...nextBatch]);
            setLoading(false);
        }, 500);
    }, [loading, visibleProducts.length, filterProducts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        const sentinel = document.getElementById('sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [loadMore]);

    return (
        <div className='flex flex-col sm:flex-row gap-8 pt-6 border-t border-gray-100'>

            {/* Filter Panel */}
            <div className='min-w-[240px]'>
                {/* Mobile Filter Header */}
                <div
                    onClick={() => setShowFilter(!showFilter)}
                    className='flex items-center justify-between py-4 px-5 bg-[#fbfbfb] border border-gray-100 rounded-sm cursor-pointer sm:hidden mb-4 active:bg-gray-100 transition-colors'
                >
                    <div className='flex items-center gap-3'>
                        <span className='text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]'>Show Filters</span>
                        <div className='flex gap-1'>
                            {(category.length > 0 || subCategory.length > 0) && (
                                <span className='w-1.5 h-1.5 bg-[#1a1a1a] rounded-full'></span>
                            )}
                        </div>
                    </div>
                    <Image
                        className={`h-2.5 transition-transform duration-500 ease-in-out ${showFilter ? 'rotate-180' : ''}`}
                        src={assets.dropdown_icon}
                        alt="dropdown"
                        width={10}
                        height={10}
                    />
                </div>

                {/* Filter Controls */}
                <div className={`${showFilter ? 'block' : 'hidden'} sm:block space-y-10 animate-fade-in px-2 sm:px-0`}>

                    {/* Category Filter Group */}
                    <div className='bg-white'>
                        <h3 className='text-[10px] font-extrabold uppercase tracking-[0.3em] mb-6 text-gray-300'>Categories</h3>
                        <div className='grid grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-2'>
                            {["Men", "Women", "Kids"].map((cat) => (
                                <label key={cat} className='flex items-center group cursor-pointer'>
                                    <div className='relative flex items-center justify-center'>
                                        <input
                                            type="checkbox"
                                            value={cat}
                                            checked={category.includes(cat)}
                                            onChange={toggleCategory}
                                            className='peer appearance-none w-5 h-5 border border-gray-200 rounded-[2px] cursor-pointer transition-all duration-300 checked:bg-[#1a1a1a] checked:border-[#1a1a1a]'
                                        />
                                        <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className='ml-4 text-[12px] font-outfit uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a] transition-all duration-300 select-none'>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Type Filter Group */}
                    <div className='bg-white pt-8 border-t border-gray-50'>
                        <h3 className='text-[10px] font-extrabold uppercase tracking-[0.3em] mb-6 text-gray-300'>Apparel Type</h3>
                        <div className='grid grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-2'>
                            {["Topwear", "Bottomwear", "Winterwear", "Footwear"].map((sub) => (
                                <label key={sub} className='flex items-center group cursor-pointer'>
                                    <div className='relative flex items-center justify-center'>
                                        <input
                                            type="checkbox"
                                            value={sub}
                                            checked={subCategory.includes(sub)}
                                            onChange={toggleSubCategory}
                                            className='peer appearance-none w-5 h-5 border border-gray-200 rounded-[2px] cursor-pointer transition-all duration-300 checked:bg-[#1a1a1a] checked:border-[#1a1a1a]'
                                        />
                                        <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className='ml-4 text-[12px] font-outfit uppercase tracking-widest text-gray-500 group-hover:text-[#1a1a1a] transition-all duration-300 select-none'>
                                        {sub}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Product Grid */}
            <div className='flex-1'>

                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />

                    {/* Product Sort */}
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2' name="" id="">
                        <option value="relavent">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Map Products */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 animate-fade-in'>
                    {
                        visibleProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                        ))
                    }
                </div>

                {/* Sentinel for Infinite Scroll */}
                <div id="sentinel" className="h-10 w-full flex justify-center items-center mt-10">
                    {loading && <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>}
                </div>
            </div>
        </div>
    )

}

export default Collection
