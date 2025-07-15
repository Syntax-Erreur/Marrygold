"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { validateEvent, getGuestsByEvent } from "@/lib/firebase/guest-service";
import { toast } from "sonner";
import { AddGuestDialog } from "./add-guest-dialog";
import { exportGuestsToExcel } from "@/lib/utils/excel-export";
import { auth } from "@/lib/firebase";
import type { Guest } from "@/lib/types/guest";

const VIEW_ICONS = {
  individual: {
    active:
      "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310202/User_Rounded_hsrf2b.png",
    inactive:
      "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743967650/Vector_ivm2gu.png",
  },
  table: {
    active:
      "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743966471/Vector_hrrrwk.png",
    inactive:
      "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310366/marrygold/Vector_xlqand.png",
  },
};

interface GuestListControlsProps {
  onOpenChatbot: () => void;
  onSearch: (query: string) => void;
  onViewModeChange: (mode: "individual" | "table") => void;
  onRefreshData: () => void;
}

export default function GuestListControls({
  onOpenChatbot,
  onSearch,
  onViewModeChange,
  onRefreshData,
}: GuestListControlsProps) {
  const { event } = useParams();
  const normalizedEventName = decodeURIComponent(event as string).toLowerCase();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"individual" | "table">(
    "individual"
  );
  const [isValidEvent, setIsValidEvent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const checkEvent = async () => {
      try {
        const isValid = await validateEvent(normalizedEventName);
        setIsValidEvent(isValid);
        if (!isValid) {
          toast.error(`Event ${normalizedEventName} not found`);
        }
      } catch (error) {
        console.error("Error validating event:", error);
        setIsValidEvent(false);
      }
    };

    checkEvent();
  }, [normalizedEventName]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleViewModeChange = (mode: "individual" | "table") => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);

      if (!auth.currentUser) {
        toast.error("You must be logged in to export data");
        return;
      }

      const guests = await getGuestsByEvent(
        auth.currentUser.uid,
        normalizedEventName
      );

      if (guests.length === 0) {
        toast.error("No guests to export");
        return;
      }

      await exportGuestsToExcel(guests, normalizedEventName);
      onRefreshData();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export guest list");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="bg-white w-full px-18 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#FFFBE8] border border-[#677500] text-[#677500] text-sm font-medium px-3 py-1.5 rounded-lg">
            {normalizedEventName}
          </div>

          <h1 className="font-inter font-bold text-xl text-[#252525]">
            Guest List
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 py-2 h-10 border-gray-200 w-[220px] focus:ring-0 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 px-2.5 py-1.5 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-xs flex gap-1.5 rounded-lg"
            onClick={handleExportToExcel}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-1 border-2 border-[#252525] border-t-transparent rounded-full"></span>
                Exporting...
              </>
            ) : (
              <>
                <Image
                  width={20}
                  height={20}
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743509944/excel_ak3kks.png"
                  alt="Excel"
                  className="w-4 h-4"
                />
                Extract to Excel
              </>
            )}
          </Button>
          <div className="w-1"></div>
          <Button
            variant="outline"
            className="h-9 px-2.5 py-1.5 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-xs flex gap-1.5 rounded-lg"
          >
            <Image
              width={20}
              height={20}
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="RSVP"
              className="w-4 h-4"
            />
            Manage RSVP
          </Button>
          <div className="w-1"></div>
          <Button
            variant="outline"
            className="h-9 px-2.5 py-1.5 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-xs flex gap-1.5 rounded-lg"
          >
            <Image
              width={20}
              height={20}
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="Send"
              className="w-4 h-4"
            />
            Send to All
          </Button>
          <div className="w-1"></div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-9 px-2.5 py-1.5 bg-[#FF33A0] hover:bg-[#FF33A0]/90 text-white font-inter font-semibold text-xs flex gap-1.5 rounded-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18V6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add New Guest
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleViewModeChange("individual")}
            className={`h-9 ${
              viewMode === "individual"
                ? "bg-[#252525] text-white hover:bg-[#252525] hover:text-white"
                : "bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] hover:bg-[#F6F6F6]/90"
            } font-semibold text-xs flex gap-1.5 rounded-lg`}
          >
            <Image
              width={20}
              height={20}
              src={
                viewMode === "individual"
                  ? VIEW_ICONS.individual.active
                  : VIEW_ICONS.individual.inactive
              }
              alt="Individual view"
              className="w-4 h-4 object-contain"
            />
            Individual
          </Button>
          <div className="w-1"></div>
          <Button
            onClick={() => handleViewModeChange("table")}
            className={`h-9 ${
              viewMode === "table"
                ? "bg-[#252525] text-white hover:bg-[#252525] hover:text-white border-[#252525]"
                : "bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] hover:bg-[#F6F6F6]/90"
            } font-semibold text-xs flex gap-1.5 rounded-lg`}
          >
            <Image
              width={20}
              height={20}
              src={
                viewMode === "table"
                  ? VIEW_ICONS.table.active
                  : VIEW_ICONS.table.inactive
              }
              alt="Table view"
              className="w-4 h-4"
            />
            Table Wise
          </Button>
        </div>

        <Button
          variant="outline"
          className="h-9 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-semibold text-xs flex gap-1.5 rounded-lg"
          onClick={onOpenChatbot}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.98 10.79V14.79C17.98 15.05 17.97 15.3 17.94 15.54C17.71 18.24 16.12 19.58 13.19 19.58H12.79C12.54 19.58 12.3 19.7 12.15 19.9L10.95 21.5C10.42 22.21 9.56 22.21 9.03 21.5L7.83 19.9C7.7 19.73 7.41 19.58 7.19 19.58H6.79C3.6 19.58 2 18.79 2 14.79V10.79C2 7.86 3.35 6.27 6.04 6.04C6.28 6.01 6.53 6 6.79 6H13.19C16.38 6 17.98 7.6 17.98 10.79Z"
              stroke="#1E1E1E"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.98 6.79V10.79C21.98 13.73 20.63 15.31 17.94 15.54C17.97 15.3 17.98 15.05 17.98 14.79V10.79C17.98 7.6 16.38 6 13.19 6H6.79C6.53 6 6.28 6.01 6.04 6.04C6.27 3.35 7.86 2 10.79 2H17.19C20.38 2 21.98 3.6 21.98 6.79Z"
              stroke="#1E1E1E"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.495 13.25H13.505"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.995 13.25H10.005"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.495 13.25H6.505"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Talk With AI
        </Button>
      </div>

      <AddGuestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGuestAdded={() => {}}
      />
    </div>
  );
}
