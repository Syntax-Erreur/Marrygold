"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"

interface GuestListControlsProps {
  onAddNewGuest?: () => void
  onOpenChatbot?: () => void
}

export default function GuestListControls({ onAddNewGuest, onOpenChatbot }: GuestListControlsProps) {
  return (
    <div className="bg-white w-full px-[74px] py-4">
       <div className="flex items-center">
        <div className="bg-[#FFFBE8] border border-[#677500] h-[40px] w-[90px] flex items-center justify-center rounded-lg">
          <span className="font-inter font-semibold text-base text-[#677500]">Haldi</span>
        </div>

        <h1 className="font-inter font-bold text-2xl text-[#252525] ml-6">Guest List</h1>

        <div className="relative ml-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name"
            className="pl-10 py-2 h-10 border-gray-200 w-[280px] focus:ring-0 focus:border-transparent"
          />
        </div>

        <div className="flex items-center ml-[73px] gap-2">
          <Button
            variant="outline"
            className="h-10 px-3 py-[17.5px] bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-sm flex gap-2 rounded-lg"
          >
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743509944/excel_ak3kks.png"
              alt="Excel"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            Extract to Excel
          </Button>
          <div className="w-2"></div>
          <Button
            variant="outline"
            className="h-10 px-3 py-[17.5px] bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-sm flex gap-2 rounded-lg"
          >
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="RSVP"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            Manage RSVP
          </Button>
          <div className="w-2"></div>
          <Button
            variant="outline"
            className="h-10 px-3 py-[17.5px] bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-inter font-semibold text-sm flex gap-2 rounded-lg"
          >
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="Send"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            Send to All
          </Button>
          <div className="w-2"></div>
          <Button
            className="h-10 px-3 py-[17.5px] bg-[#FF33A0] hover:bg-[#FF33A0]/90 text-white font-inter font-semibold text-sm flex gap-2 rounded-lg"
            onClick={onAddNewGuest}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add New Guest
          </Button>
        </div>
      </div>

      {/* Bottom section with view toggles */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <Button className="h-10 bg-[#252525] hover:bg-[#252525]/90 text-white font-semibold text-sm flex gap-2 rounded-lg">
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="User"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            Individual
          </Button>
          <div className="w-2"></div>
          <Button
            variant="outline"
            className="h-10 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-semibold text-sm flex gap-2 rounded-lg"
          >
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png"
              alt="Table"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            Table Wise
          </Button>
        </div>

        <Button
          variant="outline"
          className="h-10 bg-[#F6F6F6] border-[#E7E7E7] text-[#252525] font-semibold text-sm flex gap-2 rounded-lg"
          onClick={onOpenChatbot}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  )
}

