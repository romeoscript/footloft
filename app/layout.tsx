import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
// ...
<div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
  <ToastContainer />
  <Navbar />
  <SearchBar />
  <ScrollToTop />
  {children}
  <Footer />
</div>
        </ShopContextProvider >
      </body >
    </html >
  );
}
