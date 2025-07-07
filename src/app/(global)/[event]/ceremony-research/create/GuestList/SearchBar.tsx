
import React from "react";
import {  Plus } from "lucide-react";
import { useParams } from "next/navigation";

const SearchBar: React.FC = () => {
  const { event } = useParams();
  return (
    <div className="bg-white flex w-full items-center justify-between px-12 py-6 border-t border-gray-100 max-md:px-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#FFFBE8] border border-[#677500] text-[#677500] text-sm font-medium px-4 py-2 rounded-lg">
            {event}
          </div>
          <div className="text-xl font-semibold text-[#1E1E1E]">
            Ceremonies Research
          </div>
        </div>
        <div className="ml-6">
         
       
        </div>
      </div>
      <button type="submit" className="bg-[#FF33A0] text-white flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium">
        <Plus size={18} />
        <span>Publish Article</span>
      </button>
    </div>
  );
};

export default SearchBar;
