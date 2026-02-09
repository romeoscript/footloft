"use client";
import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const router = useRouter();
  const navigate = (path) => router.push(path);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const getProductsData = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data && !data.error) {
        // Map backend 'id' and 'images' to match frontend expects if needed
        // The frontend expects _id and image array
        const mappedData = data.map((item) => ({
          ...item,
          _id: item.id, // Use DB id as _id for compatibility
          image: item.images, // Use DB images as image for compatibility
        }));
        setProducts(mappedData);
      } else {
        toast.error(data.error || "Failed to load products");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching products");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select product size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          try {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          } catch (error) {}
        }
      }
    }
    return totalAmount;
  };

  const value = {
    currency,
    delivery_fee,
    products,
    navigate,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    updateQuantity,
    cartItems,
    getCartCount,
    getCartAmount,
    getProductsData,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
