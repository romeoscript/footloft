"use client";
import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "../assets/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext } from "../context/ShopContext";
import { signOutUser } from "@/app/actions";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const { setShowSearch, navigate, getCartCount } = useContext(ShopContext);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-all px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Link href="/">
          <Image
            className="w-36"
            src={assets.logo}
            alt="Logo"
            width={144}
            height={40}
            priority
          />
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink href="/" label="HOME" pathname={pathname} />
          <NavLink href="/collection" label="COLLECTION" pathname={pathname} />
          <NavLink href="/about" label="ABOUT" pathname={pathname} />
          <NavLink href="/contact" label="CONTACT" pathname={pathname} />
        </ul>

        <div className="flex items-center gap-6">
          <Image
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            className="w-5 cursor-pointer"
            src={assets.search_icon}
            alt="Search"
            width={20}
            height={20}
          />
          <div className="group relative">
            <Image
              onClick={() => {
                if (user) return;
                navigate("/login");
              }}
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
              width={20}
              height={20}
            />

            {/* Dropdown: only when logged in */}
            {user && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={handleSignOut}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link href="/cart" className="relative">
            <Image
              className="w-5 min-w-5"
              src={assets.cart_icon}
              alt="Cart"
              width={20}
              height={20}
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
          <Image
            onClick={() => setVisible(true)}
            className="w-5 cursor-pointer sm:hidden"
            src={assets.menu_icon}
            alt="Menu"
            width={20}
            height={20}
          />
        </div>
      </div>

      {/* Sidebar Menu For Small Screens - Moved OUTSIDE for full-screen visibility */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white z-[1000] transition-all duration-500 ease-in-out shadow-2xl ${visible ? "w-full sm:w-[380px]" : "w-0"}`}
      >
        <div className="flex flex-col h-screen bg-white text-gray-800">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <Image
              className="w-28 opacity-90"
              src={assets.logo}
              alt="Logo"
              width={112}
              height={32}
            />
            <div
              onClick={() => setVisible(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <Image
                className="w-3"
                src={assets.cross_icon}
                alt="Close"
                width={12}
                height={12}
              />
            </div>
          </div>

          {/* User Actions Section */}
          <div className="px-8 py-8 flex flex-col gap-6 bg-[#fbfbfb]">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
              Account & Activity
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  navigate("/login");
                  setVisible(false);
                }}
                className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-sm hover:border-gray-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={assets.profile_icon}
                    alt=""
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">
                    Profile
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  navigate("/orders");
                  setVisible(false);
                }}
                className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-sm hover:border-gray-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={assets.cart_icon}
                    alt=""
                    width={16}
                    height={16}
                    className="opacity-70 group-hover:opacity-100"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">
                    Orders
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col flex-1 px-8 py-10 gap-1 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
              Explore Collections
            </p>

            <MobileNavLink
              href="/"
              label="Home"
              onClick={() => setVisible(false)}
            />
            <MobileNavLink
              href="/collection"
              label="Collections"
              onClick={() => setVisible(false)}
            />
            <MobileNavLink
              href="/about"
              label="Our Story"
              onClick={() => setVisible(false)}
            />
            <MobileNavLink
              href="/contact"
              label="Contact Us"
              onClick={() => setVisible(false)}
            />
          </div>

          {/* Footer of Sidebar */}
          <div className="p-8 border-t border-gray-50 bg-[#fbfbfb]">
            <div className="flex items-center gap-4 opacity-50">
              <p className="text-[9px] font-bold tracking-[0.1em] uppercase">
                © 2026 FOOTLOFT BOUTIQUE
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

// Mobile Navigation Link Component
const MobileNavLink = ({ href, label, onClick }) => (
  <Link
    onClick={onClick}
    href={href}
    className="group flex items-center justify-between py-4 border-b border-gray-50 last:border-none"
  >
    <span className="text-[15px] font-outfit font-light tracking-[0.05em] text-gray-700 group-hover:text-black transition-colors uppercase">
      {label}
    </span>
    <Image
      src={assets.dropdown_icon}
      className="-rotate-90 opacity-20 group-hover:opacity-100 transition-all group-hover:translate-x-1"
      alt=""
      width={12}
      height={12}
    />
  </Link>
);

const NavLink = ({ href, label, pathname }) => (
  <Link href={href} className="flex flex-col items-center gap-1 group">
    <p className="tracking-widest text-[#1a1a1a] font-medium text-xs hover:text-black transition-colors">
      {label}
    </p>
    <hr
      className={`w-2/4 border-none h-[1.5px] bg-[#1a1a1a] transition-all duration-300 ${
        pathname === href
          ? "w-2/4 opacity-100"
          : "w-0 opacity-0 group-hover:w-2/4 group-hover:opacity-50"
      }`}
    />
  </Link>
);
