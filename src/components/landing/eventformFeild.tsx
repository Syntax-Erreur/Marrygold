"use client"

import { ChevronDown } from "lucide-react"

type EventFormFieldProps = {
  label: string
  type: "text" | "select" | "datetime-local" | "number"
  placeholder?: string
  options?: string[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  prefix?: string
}

export default function EventFormField({
  label,
  type,
  placeholder,
  options,
  value,
  onChange,
  className,
  prefix,
}: EventFormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-sm font-normal text-gray-800">{label}</label>
      {type === "text" ? (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none text-gray-600 placeholder:text-gray-400"
        />
      ) : type === "datetime-local" ? (
        <input
          type="datetime-local"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none text-gray-600 placeholder:text-gray-400"
        />
      ) : type === "number" ? (
        <div className="relative">
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </div>
          )}
          <input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none text-gray-600 placeholder:text-gray-400 ${prefix ? 'pl-8' : ''}`}
            min="0"
            step="0.01"
          />
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none appearance-none bg-white text-gray-600 cursor-pointer"
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  )
}

