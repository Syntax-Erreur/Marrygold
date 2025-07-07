'use client'
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentForm, { PaymentFormData } from "./Form";
import { useParams } from "next/navigation";
interface PaymentHeaderProps {
  onOpenModal: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onSubmit: (data: PaymentFormData) => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({
  onOpenModal,
  isModalOpen,
  onCloseModal,
  onSubmit
}) => {
  const { event } = useParams();
  return (
    <>
      <div className="bg-white py-8 px-8 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <div className="bg-yellow-50 border border-yellow-700 text-sm font-medium px-4 py-2 rounded-md">
            {event}
          </div>
          <h1 className="text-2xl font-bold">Payment Reminder</h1>
          
          <div className="relative ml-4 flex-grow max-w-md">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              className="border border-gray-200 rounded-md pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
        
        <Button 
          onClick={onOpenModal}
          className="bg-pink-500 hover:bg-pink-600 rounded-md px-4 py-2 text-white flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Payment</span>
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={onCloseModal} />
          <div className="relative z-50 animate-in zoom-in-95 duration-200">
            <PaymentForm onClose={onCloseModal} onSubmit={onSubmit} />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentHeader;
