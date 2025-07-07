"use client";

import { PaymentStatus } from "@/lib/firebase/payment-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  paymentName: z.string().min(2, {
    message: "Payment name must be at least 2 characters.",
  }),
  fullAmount: z.coerce.number().min(1, {
    message: "Amount must be greater than 0.",
  }),
  installmentCount: z.coerce.number().min(1, {
    message: "Installment count must be at least 1.",
  }),
  paymentStatus: z.enum(["Pending", "Paid", "Overdue"] as const),
});

interface PaymentFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}

export function PaymentForm({ onSubmit, defaultValues }: PaymentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentName: defaultValues?.paymentName || "",
      fullAmount: defaultValues?.fullAmount || 0,
      installmentCount: defaultValues?.installmentCount || 1,
      paymentStatus: defaultValues?.paymentStatus || "Pending",
    },
  });

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit(values);
      form.reset();
      toast.success("Payment created successfully");
    } catch (error) {
      toast.error("Failed to create payment");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="paymentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Name</FormLabel>
              <FormControl>
                <Input placeholder="Venue Payment" {...field} />
              </FormControl>
              <FormDescription>
                Enter a descriptive name for this payment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10000" {...field} />
              </FormControl>
              <FormDescription>
                Enter the total amount for this payment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installmentCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Installments</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="3" {...field} />
              </FormControl>
              <FormDescription>
                How many installments would you like to split this payment into?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Current status of this payment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Payment</Button>
      </form>
    </Form>
  );
} 