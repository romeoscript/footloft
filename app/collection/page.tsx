"use client";
import React, { useContext, useEffect, useState } from 'react'
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

const Collection = () => {

    const { products, search, showSearch } = useContext(ShopContext);

    const [filterProducts, setFilterProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<string[]>([]);
    const [subCategory, setSubCategory] = useState<string[]>([]);
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


    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

            {/* Filter Options */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS<Image className={`h-3 sm:hidden ${showFilter ? ' rotate-90' : ''}`} src={assets.dropdown_icon} alt="" width={12} height={12} /></p>

                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'><input className='w-3' value={"Men"} onChange={toggleCategory} type="checkbox" /> Men </p>
                        <p className='flex gap-2'><input className='w-3' value={"Women"} onChange={toggleCategory} type="checkbox" /> Women </p>
                        <p className='flex gap-2'><input className='w-3' value={"Kids"} onChange={toggleCategory} type="checkbox" /> Kids </p>
                    </div>
                </div>

                {/* Sub Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'><input className='w-3' value={"Topwear"} onChange={toggleSubCategory} type="checkbox" /> Topwear </p>
                        <p className='flex gap-2'><input className='w-3' value={"Bottomwear"} onChange={toggleSubCategory} type="checkbox" /> Bottomwear </p>
                        <p className='flex gap-2'><input className='w-3' value={"Winterwear"} onChange={toggleSubCategory} type="checkbox" /> Winterwear </p>
                    </div>

                </div>
            </div>

            {/* Right Side */}
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
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {
                        filterProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection
