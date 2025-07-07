'use client'
import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { PaymentScheduleInput } from "./PaymentScheduleInput";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

export interface PaymentFormData {
  paymentName: string;
  fullAmount: string;
  installmentCount: string;
  paymentStatus: string;
  installments: {
    amount: string;
    date: string;
  }[];
}

interface PaymentFormProps {
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
}

const installmentOptions = [
  { label: "1 Installment", value: "1" },
  { label: "2 Installments", value: "2" },
  { label: "3 Installments", value: "3" },
 
];

const statusOptions = [
  { label: "Done", value: "done" },
  { label: "In Progress", value: "inProgress" },
];

export default function PaymentForm({ onClose, onSubmit }: PaymentFormProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentName: "",
    fullAmount: "",
    installmentCount: "",
    paymentStatus: "",
    installments: []
  });
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleInputChange = (field: keyof PaymentFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof PaymentFormData) => (value: string) => {
    if (field === "installmentCount") {
      const count = parseInt(value);
      const amount = formData.fullAmount ? parseFloat(formData.fullAmount) : 0;
      const installmentAmount = (amount / count).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        installmentCount: value,
        installments: Array(count).fill(null).map(() => ({
          amount: installmentAmount,
          date: ""
        }))
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleInstallmentChange = (index: number, field: 'amount' | 'date', value: string) => {
    setFormData(prev => ({
      ...prev,
      installments: prev.installments.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      paymentName: "",
      fullAmount: "",
      installmentCount: "",
      paymentStatus: "",
      installments: []
    });
    setFirstPaymentDate(null);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className={cn(
        "w-[651px] bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]",
        "flex flex-col max-h-[90vh]",
        "transition-all duration-200 ease-in-out",
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      )}>
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F5F5]">
          <h2 className="text-[20px] font-semibold text-[#252525]">Add New Payment</h2>
          <button
            onClick={handleClose}
            className="text-[#8F8F8F] hover:text-[#252525] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              <FormInput
                label="Payment Name"
                placeholder="Enter Payment Name"
                value={formData.paymentName}
                onChange={handleInputChange("paymentName")}
              />
              <FormInput
                label="Full Amount"
                placeholder="Enter Full Amount"
                suffix="$"
                value={formData.fullAmount}
                onChange={handleInputChange("fullAmount")}
              />
              <FormSelect
                label="Expected Installment Count"
                placeholder="Select Installment Count"
                options={installmentOptions}
                value={formData.installmentCount}
                onChange={handleSelectChange("installmentCount")}
              />
              <FormSelect
                label="First Payment Status"
                placeholder="Select First Payment Status"
                options={statusOptions}
                value={formData.paymentStatus}
                onChange={handleSelectChange("paymentStatus")}
              />
            </div>

            {Boolean(formData.installmentCount) && Boolean(formData.fullAmount) && (
              <div className="pt-6">
                <PaymentScheduleInput
                  installments={formData.installments}
                  onInstallmentChange={handleInstallmentChange}
                />
              </div>
            )}

            <div className="pt-6 border-t border-[#F5F5F5] bg-white">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className={cn(
                    "h-[52px] min-w-[120px] px-6 rounded-lg",
                    "bg-[#F5F5F5] text-[#252525]",
                    "text-[14px] font-medium",
                    "hover:bg-[#EBEBEB] transition-colors"
                  )}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "h-[52px] min-w-[120px] px-6 rounded-lg",
                    "bg-pink-500 text-white",
                    "text-[14px] font-medium",
                    "hover:bg-pink-600 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Creating..." : "Create Payment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}