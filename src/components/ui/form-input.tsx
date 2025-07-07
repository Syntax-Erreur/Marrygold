import { cn } from "@/lib/utils"

interface FormInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  suffix?: string
}

export function FormInput({ label, placeholder, value, onChange, suffix }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#252525]">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-[52px] px-4",
            "rounded-lg border border-[#E5E7EB]",
            "text-sm text-[#252525] placeholder-[#8F8F8F]",
            "focus:outline-none focus:ring-2 focus:ring-[#FF4F9A] focus:border-transparent",
            suffix && "pr-10"
          )}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8F8F8F]">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
} 