'use client'
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormSelectProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#252525]">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border bg-white pl-3 pr-[15px] py-3.5 rounded-lg border-[#E7E7E7]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormSelect;