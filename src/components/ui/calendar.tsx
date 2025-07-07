"use client"

import * as React from "react"
import type { ButtonHTMLAttributes } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'selected' | 'onSelect'> {
  selected?: Date | null
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  showOutsideDays?: boolean
  initialFocus?: boolean
}

interface CalendarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean
  isDisabled?: boolean
  isOutsideMonth?: boolean
  isToday?: boolean
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
  showOutsideDays = true,
  initialFocus,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())
  
  const days = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const CalendarButton = React.memo(({ isSelected, isDisabled, isOutsideMonth, isToday: isTodayDate, className, ...buttonProps }: CalendarButtonProps) => (
    <button
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-9 w-9 p-0 font-normal",
        isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
        isOutsideMonth && "text-muted-foreground opacity-50",
        isTodayDate && !isSelected && "bg-accent text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
        className
      )}
      disabled={isDisabled}
      {...buttonProps}
    />
  ))
  CalendarButton.displayName = "CalendarButton"

  return (
    <div 
      className={cn("p-3", className)} 
      {...props}
    >
      <div className="flex items-center justify-between px-1 mb-4">
        <CalendarButton onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </CalendarButton>
        <div className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <CalendarButton onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </CalendarButton>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-muted-foreground text-center text-[0.8rem] font-medium"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const isSelected = selected ? isSameDay(day, selected) : false
          const isDisabled = disabled?.(day)
          const isOutsideMonth = !isSameMonth(day, currentMonth)
          
          if (!showOutsideDays && isOutsideMonth) {
            return <div key={dayIdx} />
          }

          return (
            <CalendarButton
              key={dayIdx}
              onClick={() => !isDisabled && onSelect?.(day)}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isOutsideMonth={isOutsideMonth}
              isToday={isToday(day)}
            >
              {format(day, "d")}
            </CalendarButton>
          )
        })}
      </div>
    </div>
  )
}
