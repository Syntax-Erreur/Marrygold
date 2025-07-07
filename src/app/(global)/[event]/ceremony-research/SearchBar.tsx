
'use client'
import { Search, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";


export default function SearchBar() {
  const router = useRouter();
  const { event } = useParams()
  const handleClick = () => {
    router.push(`/${event}/ceremony-research/create`);
  };
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
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-[320px] text-sm placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>
      <button className="bg-[#FF33A0] text-white flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium" onClick={handleClick} >
        <Plus size={18} />
        <span>Add New Article</span>
      </button>
    </div>
  );
};
