import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-screen flex w-full overflow-hidden">
      <div className="w-[600px] flex flex-col items-start px-16 py-16">
        <div className="mb-8 text-2xl font-bold">
           Logo
        </div>
        
 
        {children}
      </div>

 
      <div className="hidden lg:flex flex-1 bg-[#F7F7F7] flex-col p-10 pl-24 overflow-hidden">
        <div className="max-w-2xl">
            <h2 className="text-[#2D2D2D] text-4xl font-bold mb-4">
            Hello! I’m Weddy, your Wedding Planning Partner!
          </h2>
          <p className="text-[#6B6B6B] text-sm mb-10">
          From guest lists to budget tracking, Weddy simplifies every detail of your special day. Start planning now! 🌸
          </p>
        </div>

 
        <div className="relative flex-1 w-full overflow-visible">
          <div className="absolute left-0 right-[-100px]">
            <div className="relative w-full rounded-xl overflow-hidden border-[3px] border-black shadow-xl">
              <Image
                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1744064303/Flow_Chart_vfpzpw.png"
                alt="Dashboard Preview"
                width={1600}
                height={1000}
                className="object-contain w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 