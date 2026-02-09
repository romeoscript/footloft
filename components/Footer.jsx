import React from "react";
import Image from "next/image";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="mt-40">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
          <div>
            <Image
              className="mb-5 w-32"
              src={assets.logo}
              alt="Logo"
              width={128}
              height={40}
            />
            <p className="w-full md:w-2/3 text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>

          <div>
            <p className="text-xl font-medium mb-5 font-prata">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-black cursor-pointer transition-colors">
                Home
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">
                About us
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">
                Delivery
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">
                Privacy policy
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xl font-medium mb-5 font-prata">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li className="hover:text-black cursor-pointer transition-colors">
                +1-212-456-7890
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">
                Contact@foreveryou.com
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white">
          <hr className="border-gray-200" />
          <p className="py-5 text-sm text-center text-gray-500">
            Copyright 2024@ forever.com - All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
