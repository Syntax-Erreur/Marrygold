
'use client'
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)



  return (
    <div className=" bg-gray-50">
      <header className="flex items-center justify-between px-4 sm:px-8 md:px-[4.625em] py-4 md:py-6 border-b relative">
        <Link href="/" className="text-[#252525] text-[16px] md:text-[19px] font-bold tracking-[0.15em] uppercase font-jakarta">LOGO</Link>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              width={20}
              height={20}
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Ceremony list icon"
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Ceremony List</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              width={20}
              height={20}
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Share icon"
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Share</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              width={20}
              height={20}
              src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Support icon"
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Support</span>
          </div>
          <div className="ml-2 md:ml-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743256112/Avatar_kdd9nj.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-white shadow-lg z-40 rounded-b-lg border-t border-gray-200 animate-slideDown">
          <div className="flex flex-col py-4">
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                width={20}
                height={20}
                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                className="w-5 h-5"
                alt="Ceremony list icon"
              />
              <span className="text-[#252525] text-sm font-medium">Ceremony List</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                width={20}
                height={20}
                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                className="w-5 h-5"
                alt="Share icon"
              />
              <span className="text-[#252525] text-sm font-medium">Share</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                width={20}
                height={20}
                src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7"
                className="w-5 h-5"
                alt="Support icon"
              />
              <span className="text-[#252525] text-sm font-medium">Support</span>
            </a>
          </div>
        </div>
      )}



    </div>
  );
};

export default Header;


