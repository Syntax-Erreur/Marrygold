'use client'

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaymentFormData } from "./Form"
import React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface PaymentTableProps {
  payments: PaymentFormData[]
}

 

// Mock data
 

export default function PaymentTable({ payments }: PaymentTableProps) {
  const [pageSize, setPageSize] = useState(20)
 
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MM-dd-yyyy")
  }

  const filteredData = payments.map((payment, index) => ({
    id: index + 1,
    name: payment.paymentName,
    amount: payment.fullAmount,
    type: "Food",
    percentage: "10%",
    installments: payment.installments.map((inst, i) => ({
      number: String(i + 1).padStart(2, '0'),
      amount: inst.amount,
      status: i === 0 ? 'Done' : 'InProgress',
      remindDate: formatDate(inst.date),
      payableDate: formatDate(inst.date)
    }))
  }))

  return (
    <div className={cn("mt-6", inter.className)}>
      <div className="bg-white rounded-lg overflow-hidden pb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-8 py-3 px-3">
                  <Checkbox className="rounded" />
                </TableHead>
                <TableHead className="py-3 px-3 min-w-[40px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-[#252525] uppercase">#</span>
                    <Image 
                      src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310626/marrygold/column-sorting_rz0xzo.png" 
                      alt="Sort" 
                      width={12} 
                      height={12}
                    />
                  </div>
                </TableHead>
                <TableHead className="py-3 px-3 min-w-[120px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Payment Name</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-right min-w-[80px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Amount</span>
                </TableHead>
                <TableHead className="py-3 px-3 min-w-[100px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Payment Type</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-right min-w-[80px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">% of Budget</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-center min-w-[80px] border-l border-gray-200">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Installments</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-right min-w-[80px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Amount</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-center min-w-[100px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Status</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-center min-w-[100px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Remind Date</span>
                </TableHead>
                <TableHead className="py-3 px-3 text-center min-w-[100px]">
                  <span className="text-[11px] font-medium text-[#252525] uppercase">Payable Date</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((payment) => (
                <React.Fragment key={payment.id}>
                  <TableRow className="border-b border-gray-200">
                    <TableCell className="py-2 px-3">
                      <Checkbox className="rounded" />
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <span className="text-sm text-[#252525]">{payment.id}</span>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <span className="text-sm font-medium text-[#252525]">{payment.name}</span>
                    </TableCell>
                    <TableCell className="py-3 px-3 text-right">
                      <span className="text-sm text-[#252525]">${payment.amount}</span>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <Select defaultValue={payment.type}>
                        <SelectTrigger className="h-9 bg-[#FFFBE8] border-0">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#677500]" />
                            <span className="text-sm text-[#677500]">{payment.type}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Venue">Venue</SelectItem>
                          <SelectItem value="Decoration">Decoration</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-3 px-3 text-right">
                      <span className="text-sm text-[#252525]">{payment.percentage}</span>
                    </TableCell>
                    <TableCell colSpan={5} className={cn(
                      "border-l border-gray-200",
                      payment.installments.length === 0 && "border-l-0"
                    )} />
                  </TableRow>
                  {payment.installments.map((inst) => (
                    <TableRow key={`${payment.id}-${inst.number}`} className="border-b border-gray-200">
                      <TableCell colSpan={6} />
                      <TableCell className="py-3 px-3 text-center border-l border-gray-200">
                        <span className="text-sm font-medium text-[#252525]">{inst.number}</span>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-right">
                        <span className="text-sm text-[#252525]">${inst.amount}</span>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-3 py-1.5",
                          inst.status === "Done" 
                            ? "bg-[#E1FCEF] text-[#14804A]" 
                            : "bg-[#FCF2E6] text-[#AA5B00]"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            inst.status === "Done" ? "bg-[#14804A]" : "bg-[#AA5B00]"
                          )} />
                          <span className="text-sm">{inst.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-center">
                        <span className="text-sm text-[#252525]">{inst.remindDate}</span>
                      </TableCell>
                      <TableCell className="py-3 px-3 text-center">
                        <span className="text-sm text-[#252525]">{inst.payableDate}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-0.5 rounded-lg px-3 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#252525]">
            1-1 of 1
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#252525]">Rows per page:</span>
              <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="h-7 w-[50px] text-[11px]">
                  <SelectValue>{pageSize}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={String(size)} className="text-[11px]">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200">
                <ChevronsLeft className="w-3 h-3" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200">
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[11px] text-[#252525] mx-2">1/1</span>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200">
                <ChevronRight className="w-3 h-3" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200">
                <ChevronsRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
