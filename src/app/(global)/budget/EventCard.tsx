import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  id: string;
  title: string;
  totalBudget: number;
  totalSpending: number;
  iconSrc: string;
  iconBgColor: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  totalBudget,
  totalSpending,
  iconSrc,
  iconBgColor,
}) => {
  const router = useRouter();
  
  console.log(`EventCard values for ${title}:`, {
    totalBudget,
    totalSpending,
    id
  });
  
   const percentage = totalBudget > 0 ? Math.min(Math.round((totalSpending / totalBudget) * 100), 100) : 0;
  console.log(`Calculated percentage for ${title}:`, percentage);
  const formattedBudget = `${totalBudget.toLocaleString()}$`;
  const formattedPercentage = `${percentage}%`;

   const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-[#34C759]";
  };

  return (
    <div 
      onClick={() => router.push(`/${encodeURIComponent(title.toLowerCase())}/budget`)}
      className="bg-white border flex flex-col overflow-hidden items-stretch justify-center w-full px-6 py-[18px] rounded-lg border-[rgba(231,231,231,1)] border-solid hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`${iconBgColor} flex items-center justify-center w-14 h-14 rounded-full`}
            >
              <Image
                width={20}
                height={20}
                src={iconSrc}
                className="w-6 h-6 object-contain"
                alt={`${title} icon`}
              />
            </div>
            <div className="text-[#252525] text-base font-semibold tracking-[-0.3px] capitalize">
              {title}
            </div>
          </div>
          <div className="text-[#252525] text-base font-semibold tracking-[-0.3px]">
            {totalSpending.toLocaleString()}$
          </div>
        </div>
        <div className="w-full mt-[27px]">
          <div className="flex w-full items-center justify-between">
            <div className="text-xs text-[#252525] font-normal">Total Spending</div>
            <div className="text-xs text-[#252525] font-normal">{percentage}%</div>
          </div>
          <div className="bg-[rgba(231,231,231,1)] w-full mt-1.5 rounded-[32px]">
            <div
              className={`${getProgressColor(percentage)} h-2 rounded-[32px] transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
