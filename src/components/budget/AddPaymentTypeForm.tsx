'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  amount: z.number().min(0, "Amount must be positive"),
  category: z.string().min(1, "Please select or enter a category"),
  otherCategory: z.string().optional(),
});

const categories = [
  "Food",
  "Venue",
  "Decoration",
  "Entertainment",
  "Gifts",
  "Transportation",
  "Attire",
  "Photography",
  "Other"
];

interface AddPaymentTypeFormProps {
  onSubmit: (data: { name: string; amount: number; category: string }) => Promise<void>;
  onClose: () => void;
}

export function AddPaymentTypeForm({ onSubmit, onClose }: AddPaymentTypeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      category: "",
      otherCategory: "",
    },
  });

  const selectedCategory = form.watch("category");

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const finalCategory = values.category === "Other" ? values.otherCategory : values.category;
      await onSubmit({
        name: values.name,
        amount: values.amount,
        category: finalCategory || "",
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-5 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#252525] font-medium">Payment Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter payment name" 
                  className="border-gray-200 focus-visible:ring-[#FF33A0]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[#FF33A0]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#252525] font-medium">Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="border-gray-200 focus-visible:ring-[#FF33A0]" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage className="text-[#FF33A0]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#252525] font-medium">Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-gray-200 focus:ring-[#FF33A0]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="hover:bg-[#FF33A0]/10 focus:bg-[#FF33A0]/10"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[#FF33A0]" />
            </FormItem>
          )}
        />

        {selectedCategory === "Other" && (
          <FormField
            control={form.control}
            name="otherCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#252525] font-medium">Specify Category</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter custom category" 
                    className="border-gray-200 focus-visible:ring-[#FF33A0]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-[#FF33A0]" />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            type="button"
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-[#FF33A0] hover:bg-[#FF33A0]/90 text-white"
          >
            Add Payment
          </Button>
        </div>
      </form>
    </Form>
  );
} 