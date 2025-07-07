import React from "react";

interface FormInputProps {
  label: string;
  placeholder: string;
  suffix?: React.ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  suffix,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#252525]">{label}</label>
      <div className="flex border bg-white justify-between items-center pl-3 pr-[15px] py-3.5 rounded-lg border-[#E7E7E7]">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full text-sm text-[#888] outline-none"
          value={value}
          onChange={onChange}
        />
        {suffix && <span className="text-sm text-[#888]">{suffix}</span>}
      </div>
    </div>
  );
};

export default FormInput;