"use client";
import React, { useState, useEffect } from "react";
import { hero_slides } from "../assets/assets";
import Image from "next/image";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hero_slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-200 bg-[#fdfdfd] overflow-hidden min-h-[400px] sm:min-h-[450px]">
      {/* Hero Left Side - Text Content */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-8 sm:py-0 px-8 sm:px-12 relative overflow-hidden bg-white">
        <div key={currentSlide} className="animate-fade-in w-full max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <p className="w-6 md:w-9 h-[1px] bg-[#1a1a1a]"></p>
            <p className="font-outfit font-medium text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#1a1a1a]/60">
              {hero_slides[currentSlide].subtitle}
            </p>
          </div>

          <h1 className="font-prata text-4xl md:text-5xl lg:text-6xl leading-tight text-[#1a1a1a] mb-4">
            {hero_slides[currentSlide].title}
          </h1>

          <p className="font-outfit text-gray-500 text-xs md:text-sm mb-6 max-w-xs leading-relaxed tracking-wide">
            {hero_slides[currentSlide].description}
          </p>

          <div className="flex items-center gap-3 group cursor-pointer w-fit">
            <p className="font-outfit font-semibold text-[10px] md:text-xs uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">
              EXPLORE COLLECTION
            </p>
            <div className="w-8 h-[1px] bg-[#1a1a1a] group-hover:w-12 transition-all duration-300"></div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-8 sm:left-12 flex gap-2">
            {hero_slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-[1.5px] transition-all duration-500 ${
                  currentSlide === index
                    ? "w-10 bg-[#1a1a1a]"
                    : "w-4 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Right Side - Image Display */}
      <div className="w-full sm:w-1/2 relative min-h-[300px] sm:min-h-[450px] overflow-hidden bg-[#f9f9f9]">
        {hero_slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                currentSlide === index ? "scale-110" : "scale-100"
              }`}
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
            />
            {/* Subtle Overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-black/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
