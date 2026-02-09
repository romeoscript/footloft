"use client";
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisble] = useState(false);
  const pathname = usePathname();

  const { setShowSearch, navigate, getCartCount } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link href="/">
        <img className="w-36" src={assets.logo} alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 ${pathname === "/" ? "active" : ""}`}
        >
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link
          href="/collection"
          className={`flex flex-col items-center gap-1 ${pathname === "/collection" ? "active" : ""}`}
        >
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link
          href="/about"
          className={`flex flex-col items-center gap-1 ${pathname === "/about" ? "active" : ""}`}
        >
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
        <Link
          href="/contact"
          className={`flex flex-col items-center gap-1 ${pathname === "/contact" ? "active" : ""}`}
        >
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </Link>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          className="w-5 cursor-pointer"
          src={assets.search_icon}
          alt=""
        />
        <div className="group relative">
          <img
            onClick={() => {
              navigate("/login");
            }}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt=""
          />

          {/* Dropdown Menu */}
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded">
              <p onClick={() => {}} className="cursor-pointer hover:text-black">
                My Profile
              </p>
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-black"
              >
                Orders
              </p>
              <p onClick={() => {}} className="cursor-pointer hover:text-black">
                Logout
              </p>
            </div>
          </div>
        </div>
        <Link href="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisble(true)}
          className="w-5 cursor-pointer sm:hidden"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* Sidebar Menu For Small Screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisble(false)}
            className="flex items-center gap-4 p-3 "
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <Link
            onClick={() => setVisble(false)}
            href="/"
            className="py-2 pl-6 border"
          >
            HOME
          </Link>
          <Link
            onClick={() => setVisble(false)}
            href="/collection"
            className="py-2 pl-6 border"
          >
            COLLECTION
          </Link>
          <Link
            onClick={() => setVisble(false)}
            href="/about"
            className="py-2 pl-6 border"
          >
            ABOUT
          </Link>
          <Link
            onClick={() => setVisble(false)}
            href="/contact"
            className="py-2 pl-6 border"
          >
            CONTACT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
