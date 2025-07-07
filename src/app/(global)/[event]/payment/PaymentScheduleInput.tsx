'use client'

import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FormInput } from "@/components/ui/form-input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface PaymentScheduleInputProps {
  installments: {
    amount: string
    date: string
  }[]
  onInstallmentChange: (index: number, field: 'amount' | 'date', value: string) => void
}

export function PaymentScheduleInput({ installments, onInstallmentChange }: PaymentScheduleInputProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium text-[#252525]">Payment Schedule</h3>
      <div className="space-y-4">
        {installments.map((installment, index) => (
          <div key={index} className="grid grid-cols-2 gap-5">
            <FormInput
              label={`Installment ${index + 1} Amount`}
              placeholder="Enter Amount"
              suffix="$"
              value={installment.amount}
              onChange={(value) => onInstallmentChange(index, 'amount', value)}
            />
            <div className="relative">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#252525]">
                  {`Installment ${index + 1} Date`}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "w-full h-[52px] px-4 text-left",
                        "rounded-lg border border-[#E5E7EB]",
                        "text-sm text-[#252525] placeholder-[#8F8F8F]",
                        "focus:outline-none focus:ring-2 focus:ring-[#FF4F9A] focus:border-transparent",
                        "relative"
                      )}
                    >
                      {installment.date ? format(new Date(installment.date), "dd - MM - yyyy") : "DD - MM - YYYY"}
                      <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F8F8F] pointer-events-none" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                       selected={installment.date ? new Date(installment.date) : undefined}
                      onSelect={(date) => onInstallmentChange(index, 'date', date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 