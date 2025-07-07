"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEventForm } from "./AddEventForm";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AddEventDialogProps {
  // onSubmit: (data: { name: string; totalBudget: number }) => Promise<void>;
  children: React.ReactNode;
}

export function AddEventDialog({ children }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent">
        <VisuallyHidden>
          <DialogTitle>Add New Event</DialogTitle>
        </VisuallyHidden>
        <AddEventForm 
          // onSubmit={onSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 