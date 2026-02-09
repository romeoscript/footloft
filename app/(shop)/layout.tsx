import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopContextProvider from "@/context/ShopContext";
import { getProducts } from "@/lib/data";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const products = await getProducts();

    return (
        <ShopContextProvider products={products}>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <ToastContainer />
                <Navbar />
                <SearchBar />
                <ScrollToTop />
                {children}
                <Footer />
            </div>
        </ShopContextProvider>
    );
}
