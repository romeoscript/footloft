import Image from "next/image";
import { assets } from "@/assets/assets";

const AdminHeader = () => {
    return (
        <div className="flex items-center justify-between py-2 px-[4%] border-b-2 border-slate-100">
            <div className="flex flex-col">
                <Image
                    className="w-[max(10vw,150px)]"
                    src={assets.logo}
                    alt="Logo"
                    width={150}
                    height={40}
                />
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase ml-auto -mt-1">
                    Admin Panel
                </p>
            </div>
            <button className="bg-black text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
                Logout
            </button>
        </div>
    );
};

export default AdminHeader;
