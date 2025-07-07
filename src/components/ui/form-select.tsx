import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormSelectProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: {
    label: string
    value: string
  }[]
}

export function FormSelect({ label, placeholder, value, onChange, options }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#252525]">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(
          "w-full h-[52px]",
          "rounded-lg border border-[#E5E7EB]",
          "text-sm text-[#252525] placeholder-[#8F8F8F]",
          "focus:outline-none focus:ring-2 focus:ring-[#FF4F9A] focus:border-transparent"
        )}>
          <SelectValue placeholder={placeholder} />
         </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm text-[#252525]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 