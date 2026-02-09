"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { usePathname } from "next/navigation";

const SearchBar = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);

  useEffect(() => {
    if (pathname.includes("/collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [pathname, showSearch]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 outline-none bg-inherit text-sm"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search"
        />
        <Image
          className="w-4"
          src={assets.search_icon}
          alt="Search"
          width={16}
          height={16}
        />
      </div>
      <Image
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="Close"
        width={12}
        height={12}
      />
    </div>
  ) : null;
};

export default SearchBar;
