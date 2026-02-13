"use client";
import React from "react";

const NewsletterBox = () => {
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800 font-prata">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Stay ahead of the trends. Subscribe to get updates on new arrivals,
        exclusive sales, and everything Footloft.
      </p>

      <form className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded-sm overflow-hidden border-gray-300 focus-within:border-black transition-colors">
        <input
          className="w-full sm:flex-1 outline-none text-gray-700 py-3"
          type="email"
          placeholder="Enter your email id"
          required
        />
        <button
          className="bg-black text-white text-xs px-10 py-4 hover:bg-gray-800 transition-colors tracking-widest"
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
