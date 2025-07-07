'use client'
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "./Header";
import PaymentHeader from "./PaymentHeader";
import UploadSection from "./UploadSection";
import { useState } from "react";
import Table from "./Table";
import EmptyState from "./EmptyState";
import { PaymentFormData } from "./Form";
import { paymentService, Payment } from "@/lib/firebase/payment-service";
import { PaymentStatus } from "@/lib/firebase/payment-service";
import { Installment } from "@/lib/firebase/payment-service";

function convertToFormData(payment: Payment): PaymentFormData {
  return {
    paymentName: payment.paymentName,
    fullAmount: payment.fullAmount.toString(),
    installmentCount: payment.expectedInstallmentCount.toString(),
    paymentStatus: payment.firstPaymentStatus,
    installments: payment.installments.map(inst => ({
      amount: inst.amount.toString(),
      date: inst.date.toISOString().split('T')[0],
      status: 'pending'
    }))
  };
}

export default function PaymentReminder() {
  const params = useParams();
  const eventId = params.event as string;
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [eventId]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const fetchedPayments = await paymentService.getAllPayments(eventId);
      setPayments(fetchedPayments);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = async (data: PaymentFormData) => {
    try {
      setIsLoading(true);
      const paymentData = {
        paymentName: data.paymentName,
        fullAmount: Number(data.fullAmount),
        expectedInstallmentCount: Number(data.installmentCount),
        firstPaymentStatus: data.paymentStatus,
        currency: "$",
        installments: data.installments.map(inst => {
          const installment: Installment = {
            amount: Number(inst.amount),
            date: new Date(inst.date),
            status: "Pending"
          };
          return installment;
        })
      };

      await paymentService.createPayment(eventId, paymentData);
      await fetchPayments(); // Refresh the list
      setIsAddPaymentOpen(false);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError(err instanceof Error ? err.message : "Failed to add payment");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-[rgba(249,249,249,1)] p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(249,249,249,1)] overflow-hidden">
      <div className="flex w-full flex-col items-stretch max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="w-full max-md:max-w-full">
            <Header />
            <PaymentHeader 
              onOpenModal={() => setIsAddPaymentOpen(true)}
              isModalOpen={isAddPaymentOpen}
              onCloseModal={() => setIsAddPaymentOpen(false)}
              onSubmit={handleAddPayment}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : payments.length === 0 && !isAddPaymentOpen ? (
          <div className="px-6 pb-6">
            <EmptyState onCreatePayment={() => setIsAddPaymentOpen(true)} />
          </div>
        ) : null}

        {payments.length > 0 && (
          <div className="px-6 pb-6 bg-white pt-4">
            <Table payments={payments.map(convertToFormData)} />
          </div>
        )}
      </div>
    </div>
  );
}