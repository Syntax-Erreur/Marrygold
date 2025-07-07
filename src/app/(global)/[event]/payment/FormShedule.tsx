"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Calendar icon component for reuse
const CalendarIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0415 9.91634C12.4327 9.91634 12.7498 9.59921 12.7498 9.20801C12.7498 8.81681 12.4327 8.49967 12.0415 8.49967C11.6503 8.49967 11.3332 8.81681 11.3332 9.20801C11.3332 9.59921 11.6503 9.91634 12.0415 9.91634Z"
      fill="#1C274C"
    />
    <path
      d="M12.0415 12.7497C12.4327 12.7497 12.7498 12.4325 12.7498 12.0413C12.7498 11.6501 12.4327 11.333 12.0415 11.333C11.6503 11.333 11.3332 11.6501 11.3332 12.0413C11.3332 12.4325 11.6503 12.7497 12.0415 12.7497Z"
      fill="#1C274C"
    />
    <path
      d="M9.20817 9.20801C9.20817 9.59921 8.89104 9.91634 8.49984 9.91634C8.10864 9.91634 7.7915 9.59921 7.7915 9.20801C7.7915 8.81681 8.10864 8.49967 8.49984 8.49967C8.89104 8.49967 9.20817 8.81681 9.20817 9.20801Z"
      fill="#1C274C"
    />
    <path
      d="M9.20817 12.0413C9.20817 12.4325 8.89104 12.7497 8.49984 12.7497C8.10864 12.7497 7.7915 12.4325 7.7915 12.0413C7.7915 11.6501 8.10864 11.333 8.49984 11.333C8.89104 11.333 9.20817 11.6501 9.20817 12.0413Z"
      fill="#1C274C"
    />
    <path
      d="M4.95817 9.91634C5.34937 9.91634 5.6665 9.59921 5.6665 9.20801C5.6665 8.81681 5.34937 8.49967 4.95817 8.49967C4.56697 8.49967 4.24984 8.81681 4.24984 9.20801C4.24984 9.59921 4.56697 9.91634 4.95817 9.91634Z"
      fill="#1C274C"
    />
    <path
      d="M4.95817 12.7497C5.34937 12.7497 5.6665 12.4325 5.6665 12.0413C5.6665 11.6501 5.34937 11.333 4.95817 11.333C4.56697 11.333 4.24984 11.6501 4.24984 12.0413C4.24984 12.4325 4.56697 12.7497 4.95817 12.7497Z"
      fill="#1C274C"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.95817 1.23926C5.25157 1.23926 5.48942 1.47711 5.48942 1.77051V2.31077C5.95834 2.30175 6.47494 2.30175 7.04312 2.30176H9.95647C10.5247 2.30175 11.0413 2.30175 11.5103 2.31077V1.77051C11.5103 1.47711 11.7481 1.23926 12.0415 1.23926C12.3349 1.23926 12.5728 1.47711 12.5728 1.77051V2.35636C12.7569 2.3704 12.9312 2.38805 13.0962 2.41023C13.9267 2.52188 14.5989 2.75713 15.129 3.28722C15.659 3.81731 15.8943 4.48948 16.0059 5.31995C16.1144 6.12689 16.1144 7.15795 16.1144 8.45968V9.9563C16.1144 11.258 16.1144 12.2891 16.0059 13.0961C15.8943 13.9265 15.659 14.5987 15.129 15.1288C14.5989 15.6589 13.9267 15.8941 13.0962 16.0058C12.2893 16.1143 11.2582 16.1143 9.9565 16.1143H7.04321C5.74148 16.1143 4.71038 16.1143 3.90345 16.0058C3.07298 15.8941 2.40081 15.6589 1.87072 15.1288C1.34063 14.5987 1.10538 13.9265 0.993725 13.0961C0.885234 12.2891 0.885243 11.2581 0.885254 9.9563V8.45971C0.885243 7.15797 0.885234 6.12689 0.993725 5.31995C1.10538 4.48948 1.34063 3.81731 1.87072 3.28722C2.40081 2.75713 3.07298 2.52188 3.90345 2.41023C4.06844 2.38805 4.24279 2.3704 4.42692 2.35636V1.77051C4.42692 1.47711 4.66477 1.23926 4.95817 1.23926ZM4.04502 3.46325C3.33238 3.55907 2.92179 3.73875 2.62202 4.03852C2.32225 4.3383 2.14256 4.74888 2.04675 5.46153C2.03052 5.58222 2.01696 5.70927 2.00561 5.84342H14.9941C14.9827 5.70927 14.9692 5.58222 14.9529 5.46153C14.8571 4.74888 14.6774 4.3383 14.3777 4.03852C14.0779 3.73875 13.6673 3.55907 12.9547 3.46325C12.2267 3.36539 11.2672 3.36426 9.9165 3.36426H7.08317C5.73251 3.36426 4.77295 3.36539 4.04502 3.46325ZM1.94775 8.49967C1.94775 7.89475 1.94798 7.36827 1.95702 6.90592H15.0427C15.0517 7.36827 15.0519 7.89475 15.0519 8.49967V9.91634C15.0519 11.267 15.0508 12.2266 14.9529 12.9545C14.8571 13.6671 14.6774 14.0777 14.3777 14.3775C14.0779 14.6773 13.6673 14.8569 12.9547 14.9528C12.2267 15.0506 11.2672 15.0518 9.9165 15.0518H7.08317C5.73251 15.0518 4.77295 15.0506 4.04502 14.9528C3.33238 14.8569 2.92179 14.6773 2.62202 14.3775C2.32225 14.0777 2.14256 13.6671 2.04675 12.9545C1.94888 12.2266 1.94775 11.267 1.94775 9.91634V8.49967Z"
      fill="#1C274C"
    />
  </svg>
);

 

 

// Input field component for amount and date
 
 
// Payment section component with amount and date fields
interface PaymentSectionProps {
  title: string;
  amount: string;
  date: string;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  title,
  amount,
  date,
  onAmountChange,
  onDateChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <section className="space-y-4">
      <h3 className="text-[14px] font-medium text-[#252525]">{title}</h3>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[14px] font-medium text-[#252525]">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className={cn(
                "w-full h-[52px] px-3 rounded-lg",
                "border border-[#E0E0E0]",
                "text-[14px] font-medium text-[#252525]",
                "focus:outline-none focus:border-[#FF4F9A]",
                "placeholder:text-[#888888]"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888]">
              $
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] font-medium text-[#252525]">Payment Date</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full h-[52px] px-3 rounded-lg",
                  "border border-[#E0E0E0] bg-white",
                  "text-[14px] font-medium text-left",
                  "focus:outline-none focus:border-[#FF4F9A]",
                  "flex items-center justify-between"
                )}
              >
                {date || "DD - MM - YYYY"}
                <CalendarIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
   
                selected={date ? new Date(date) : undefined}
                onSelect={(date) => {
                  onDateChange(date ? format(date, "dd - MM - yyyy") : "");
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </section>
  );
};

interface PaymentScheduleInputProps {
  installments: {
    amount: string;
    date: string;
  }[];
  onInstallmentChange: (index: number, field: 'amount' | 'date', value: string) => void;
}

// Main component that combines everything
const PaymentScheduleInput: React.FC<PaymentScheduleInputProps> = ({
  installments,
  onInstallmentChange,
}) => {
  const titles = ['First Payment', 'Second Payment', 'Third Payment'];

  return (
    <div className="flex flex-col gap-8 px-2 mx-auto my-0 w-full   max-md:p-4 max-md:max-w-[991px] max-sm:p-2.5 max-sm:max-w-screen-sm">
      {installments.map((installment, index) => (
        <PaymentSection
          key={index}
          title={titles[index]}
          amount={installment.amount}
          date={installment.date}
          onAmountChange={(value) => onInstallmentChange(index, 'amount', value)}
          onDateChange={(value) => onInstallmentChange(index, 'date', value)}
        />
      ))}
    </div>
  );
};

export default PaymentScheduleInput;
