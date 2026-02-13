import React from "react";
import Image from "next/image";
import Title from "@/components/Title";
import { assets } from "@/assets/assets";
import NewsletterBox from "@/components/NewsletterBox";

const Contact = () => {
    return (
        <div>
            <div className="text-center text-2xl pt-10 border-t">
                <Title text1={"CONTACT"} text2={"US"} />
            </div>

            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
                <Image
                    className="w-full md:max-w-[480px]"
                    src={assets.contact_img}
                    alt=""
                    width={480}
                    height={480}
                />
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className=" font-semibold text-xl text-gray-600">Our Store</p>
                    <p className=" text-gray-500">
                        No 34 Enugu Road behind millipat hotel
                    </p>
                    <p className=" text-gray-500">
                        Tel: 07080136124, 0814 359 0972 <br /> Email: Contact@footloft.com
                    </p>
                    <p className=" font-semibold text-xl text-gray-600">
                        Careers at Footloft
                    </p>
                    <p className=" text-gray-500">
                        Learn more about our teams and job openings.
                    </p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
                        Explore Jobs
                    </button>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
};

export default Contact;
