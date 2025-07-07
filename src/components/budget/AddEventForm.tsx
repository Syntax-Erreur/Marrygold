"use client";

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
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Event name must be at least 2 characters"),
  totalBudget: z.number().min(1, "Budget must be greater than 0"),
  tables: z.number().min(1, "Must have at least 1 table"),
  peoplePerTable: z.number().min(1, "Must have at least 1 person per table"),
  tag: z.string().min(1, "Tag is required"),
  themeColorIndex: z.number().min(0)
});

interface AddEventFormProps {
  // onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  onClose: () => void;
}

export function AddEventForm({ onClose }: AddEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      totalBudget: 1000,
      tables: 1,
      peoplePerTable: 8,
      tag: "",
      themeColorIndex: 0
    }
  });

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    try {
      // await onSubmit(values);
      form.reset();
      toast.success("Event created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create event");
      console.error(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className={cn(
        "w-[500px] bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]",
        "flex flex-col"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F5F5F5]">
          <h2 className="text-[20px] font-semibold text-[#252525]">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-[#8F8F8F] hover:text-[#252525] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a name for your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter budget amount" 
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the total budget for this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Tables</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peoplePerTable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>People per Table</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="haldi">Haldi</SelectItem>
                        <SelectItem value="sangeet">Sangeet</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="reception">Reception</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#FF33A0] hover:bg-[#FF33A0]/80"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 