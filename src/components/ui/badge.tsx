import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  color?: string;
  borderColor?: string;
  bgColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  color,
  borderColor,
  bgColor,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return "bg-[rgba(255,251,232,1)] border-[rgba(103,117,0,1)] text-[rgba(37,37,37,1)]";
      case "outline":
        return "bg-transparent border-current";
      case "secondary":
        return "bg-secondary text-secondary-foreground";
      case "destructive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-[rgba(255,251,232,1)] border-[rgba(103,117,0,1)] text-[rgba(37,37,37,1)]";
    }
  };

  return (
    <div
      className={cn(
        "self-stretch border h-10 gap-2.5 text-base font-semibold whitespace-nowrap leading-[48px] px-2.5 rounded-lg border-solid",
        getVariantStyles(),
        className,
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: color,
      }}
    >
      {children}
    </div>
  );
};

export default Badge;