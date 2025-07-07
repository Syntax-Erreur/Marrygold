import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddPaymentTypeForm } from "@/components/budget/AddPaymentTypeForm";

interface PaymentType {
  name: string;
  amount: string;
  category: string;
}

interface PaymentTypesListProps {
  eventName: string;
  paymentTypes: PaymentType[];
  onAddPayment: (data: { name: string; amount: number; category: string }) => Promise<void>;
}

const PaymentTypesList: React.FC<PaymentTypesListProps> = ({
  eventName,
  paymentTypes,
  onAddPayment,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

 
  const groupedPayments = paymentTypes.reduce((acc, payment) => {
    const category = payment.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(payment);
    return acc;
  }, {} as Record<string, PaymentType[]>);

  return (
    <div className="bg-white min-w-60 pt-6 pb-6 rounded-xl max-md:max-w-full">
      <div className="w-full px-6 max-md:max-w-full">
        <div className="flex items-center gap-2.5 text-base text-[#252525]">
          <div className="bg-[#FFFBE8] border border-[#677500] text-[#677500] text-sm font-medium px-4 py-2 rounded-lg">
            {eventName}
          </div>
          <div className="font-semibold ml-2.5 text-base">
            Payment Types
          </div>
        </div>
        
        <div className="mt-6 space-y-6">
          {Object.entries(groupedPayments).map(([category, payments]) => (
            <div key={category} className="space-y-2">
              
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <div
                    key={`${category}-${index}`}
                    className="flex w-full items-center"
                  >
                    <div className="bg-[#F6F6F6] flex w-full items-center justify-between">
                      <div className="font-medium text-[#252525] text-sm py-4 px-6 w-[385px]">
                        {payment.name}
                      </div>
                      <div className="text-right font-semibold text-[#252525] text-sm py-4 pr-6 ml-auto w-[303px]">
                        {payment.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {paymentTypes.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No payment types added yet
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            className="bg-[#FF33A0] hover:bg-[#FF33A0]/90 text-white py-[17.5px] px-12 rounded-lg font-inter text-[14px] font-semibold"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            <span className="font-inter text-[14px] font-semibold">Add New Payment Types</span>
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#252525]">Add New Payment Type</DialogTitle>
          </DialogHeader>
          <AddPaymentTypeForm 
            onSubmit={onAddPayment}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentTypesList;
