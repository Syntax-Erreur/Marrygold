import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import { AddEventDialog } from "@/components/budget/AddEventDialog";
 
interface SearchBarProps {
  onAddEvent: (data: { name: string; totalBudget: number }) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddEvent }) => {
  return (
    <div className="bg-white w-full py-4 px-[74px] max-md:px-5">
      <div className="flex w-full items-center justify-between max-md:flex-wrap">
        <div className="flex items-center gap-6 max-md:w-full max-md:mb-4">
          <h1 className="font-bold text-2xl text-[#252525]">
            Total Budget List
          </h1>
          <div className="relative">
            <div className="flex items-center bg-white border border-[#E7E7E7] rounded-lg py-4 pl-3 pr-5">
              <Image
                width={4}
                height={4}
                src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/564aeb084eddca66d641389c784759422f6e34ae?placeholderIfAbsent=true"
                className="w-4 h-4 mr-2"
                alt="Search icon"
              />
              <input
                type="text"
                placeholder="Search by name"
                className="text-sm text-[#888888] leading-5 font-normal outline-none w-full"
                style={{ lineHeight: "20px" }}
              />
            </div>
          </div>
        </div>
    
          <Button className="bg-[#FF33A0] text-white text-sm font-semibold rounded-lg px-3 py-3.5 h-[48px] hover:bg-[#FF33A0]/80">
            <Image
              width={6}
              height={6}
              src="https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/0033869c7f50595d1f681c8a40a7686e9dc71825?placeholderIfAbsent=true"
              className="w-6 h-6 mr-2"
              alt="Add icon"
            />
            Add New Event
          </Button>
 
      </div>
    </div>
  );
};

export default SearchBar;
