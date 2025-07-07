import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ label, placeholder, value, onChange }: DatePickerProps) {
  const date = value ? new Date(value) : undefined

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#252525]">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full h-[52px] px-4 text-left",
              "rounded-lg border border-[#E5E7EB]",
              "text-sm text-[#252525] placeholder-[#8F8F8F]",
              "focus:outline-none focus:ring-2 focus:ring-[#FF4F9A] focus:border-transparent"
            )}
          >
            {date ? format(date, "dd - MM - yyyy") : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
             selected={date}
            onSelect={(date) => onChange(date ? date.toISOString() : "")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 