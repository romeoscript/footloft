"use client";
import React, { useContext } from "react";
import { category_data, products } from "../assets/assets";
import Image from "next/image";
import Link from "next/link";

const CategorySection = () => {
  // Calculate product counts
  const getProductCount = (name) => {
    if (name === "Footwear") {
      return products.filter((p) => p.subCategory === "Footwear").length;
    }
    return products.filter((p) => p.category === name).length;
  };

  return (
    <div className="my-10 px-4 sm:px-0">
      <div className="text-center py-4 mb-4">
        <div className="inline-flex gap-2 items-center mb-2">
          <p className="text-gray-400 font-outfit uppercase tracking-[0.4em] text-[10px] md:text-xs">
            BROWSE OUR
          </p>
          <p className="w-6 md:w-10 h-[1px] bg-gray-300"></p>
        </div>
        <h2 className="font-prata text-3xl md:text-4xl text-[#1a1a1a]">
          Premium Categories
        </h2>
      </div>

      {/* Category List - Tiny Circles */}
      <div className="flex justify-center gap-4 md:gap-12 lg:gap-20 mt-2 flex-wrap">
        {category_data.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="relative w-24 h-24 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full overflow-hidden border-2 border-white shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-gray-200">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="text-center">
              <p className="text-[#1a1a1a] font-outfit text-xs md:text-sm lg:text-base font-semibold uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-gray-500">
                {item.name}
              </p>
              <p className="text-gray-400 text-[10px] md:text-xs lg:text-sm font-outfit mt-1">
                {getProductCount(item.name)} Items
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
