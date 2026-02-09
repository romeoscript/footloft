import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Link from "next/link";
import Image from "next/image";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      href={`/product/${id}`}
      className="text-gray-700 cursor-pointer group block"
    >
      <div className="overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          className="group-hover:scale-110 transition-transform duration-500 ease-in-out w-full h-auto object-cover"
          src={image[0]}
          alt={name}
          width={300}
          height={400}
        />
      </div>

      <div className="pt-3 pb-1">
        <p className="text-sm text-gray-800 line-clamp-1 group-hover:text-black transition-colors">
          {name}
        </p>
        <p className="text-sm font-medium text-[#1a1a1a] mt-1">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
