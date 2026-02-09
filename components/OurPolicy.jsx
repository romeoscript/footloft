import React from "react";
import Image from "next/image";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <Image
          className="w-12 m-auto mb-5"
          src={assets.exchange_icon}
          alt="Exchange Policy"
          width={48}
          height={48}
        />
        <p className="font-semibold text-gray-800">Easy Exchange Policy</p>
        <p className="text-gray-400 mt-1">
          We offer hassle free exchange policy
        </p>
      </div>
      <div>
        <Image
          className="w-12 m-auto mb-5"
          src={assets.quality_icon}
          alt="Quality Policy"
          width={48}
          height={48}
        />
        <p className="font-semibold text-gray-800">7 Days Return Policy</p>
        <p className="text-gray-400 mt-1">
          We provide 7 days free return policy{" "}
        </p>
      </div>
      <div>
        <Image
          className="w-12 m-auto mb-5"
          src={assets.support_img}
          alt="Support"
          width={48}
          height={48}
        />
        <p className="font-semibold text-gray-800">Best customer support</p>
        <p className="text-gray-400 mt-1">we provide 24/7 customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
