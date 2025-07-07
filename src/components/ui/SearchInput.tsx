import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
  
}) => {
  return (
    <div className="bg-white border flex w-full items-center px-3 py-3 rounded-lg border-[rgba(231,231,231,1)]">
      <Search className="h-4 w-4 text-[#888] mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full outline-none text-sm text-[#888] font-normal"
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
