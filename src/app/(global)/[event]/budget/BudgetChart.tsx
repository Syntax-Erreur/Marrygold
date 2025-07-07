import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Image from "next/image";

interface PaymentType {
  name: string;
  value: number;
  color: string;
}

interface BudgetChartProps {
  eventName: string;
  budget: string;
  iconSrc: string;
  paymentTypes: PaymentType[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({
  eventName,
  budget,
  iconSrc,
  paymentTypes,
}) => {
  return (
    <Card className="w-[564px] bg-white border border-[rgba(231,231,231,1)] rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="70%" key={`chart-${eventName}`}>
            <PieChart>
              <Pie
                data={paymentTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
              >
                {paymentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}$`, '']}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-wrap justify-between mt-4">
            {paymentTypes.map((type, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-1 p-1">
                <div className={`w-3 h-3 rounded-full bg-[${type.color}]`} />
                <span className="text-xs">{type.name}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-[#FFFBE8] border border-[rgba(231,231,231,1)] flex items-center justify-between mt-4 px-6 py-[13px] rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white flex items-center justify-center w-14 h-14 rounded-full">
                <Image
                  src={iconSrc}
                  width={24}
                  height={24}
                  alt={`${eventName} icon`}
                  priority
                />
              </div>
              <div className="text-[#252525] text-base font-semibold">
                {eventName}
              </div>
            </div>
            <div className="text-[#252525] text-base font-semibold">
              {budget}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
