import Image from "next/image";
import React from "react";

interface BudgetCardProps {
  title: string;
  totalBudget: number;
  totalSpending: number;
  iconSrc: string;
  iconBgColor: string;
  isHighlighted?: boolean;
  isLoading?: boolean;
  showSpendingAsMain?: boolean;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  title,
  totalBudget,
  totalSpending,
  iconSrc,
  iconBgColor,
  isHighlighted = false,
  isLoading = false,
  showSpendingAsMain = false,
}) => {
  const percentage = totalBudget > 0 ? Math.min(Math.round((totalSpending / totalBudget) * 100), 100) : 0;
  const displayAmount = showSpendingAsMain ? totalSpending : totalBudget;
  const formattedAmount = `${displayAmount.toLocaleString()}$`;
  const formattedPercentage = `${percentage}%`;

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-[#34C759]";
  };

  if (isLoading) {
    return (
      <div className="bg-white border animate-pulse flex flex-col w-[300px] px-6 py-5 rounded-lg border-[rgba(231,231,231,1)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="ml-auto h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isHighlighted ? "bg-[#FFFBE8]" : "bg-white"
      } border flex flex-col w-[300px] px-6 py-5 rounded-lg border-[rgba(231,231,231,1)] hover:shadow-md transition-shadow`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`${iconBgColor} flex items-center justify-center w-12 h-12 rounded-full`}
            >
              <Image
                src={iconSrc}
                className="w-6 h-6"
                alt={`${title} icon`}
                width={20}
                height={20}
              />
            </div>
            <div className="text-[#252525] text-base font-semibold capitalize">
              {title}
            </div>
          </div>
          <div className="text-[#252525] text-base font-semibold">
            {formattedAmount}
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="flex items-center justify-between text-xs text-[#252525] font-normal">
            <div>Total Spending</div>
            <div>{formattedPercentage}</div>
          </div>
          <div className="bg-[#F3F3F3] w-full h-2 mt-1.5 rounded-full">
            <div 
              className={`${getProgressColor(percentage)} h-2 rounded-full transition-all duration-300`} 
              style={{ width: `${percentage}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
