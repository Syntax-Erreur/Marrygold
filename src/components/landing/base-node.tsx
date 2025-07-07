import { forwardRef, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  bgColor?: string;
}

export const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ className, selected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl bg-white text-card-foreground overflow-visible",
        className,
        selected ? "shadow-lg z-50" : "shadow-sm z-10",
        "[&:not(:has(button:hover))]:cursor-grab [&:not(:has(button:hover))]:active:cursor-grabbing"
      )}
      tabIndex={0}
      {...props}
    />
  )
);

BaseNode.displayName = "BaseNode";