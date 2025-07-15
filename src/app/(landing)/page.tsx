"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import EventsFlow from "@/components/landing/EventFlow"
import Image from "next/image"
import { fetchUserEvents, DEFAULT_EVENTS } from "@/lib/firebase/event-service"
import type { FirestoreEventData } from "@/types/event"
import { toast } from "sonner"
import { setupDefaultEventsForUser } from "@/lib/default-events"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

const WeddingPlanner: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInitials, setUserInitials] = useState<string>("");
  const [events, setEvents] = useState<(FirestoreEventData & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {

        const initials = user.email.split('@')[0].charAt(0).toUpperCase();
        setUserInitials(initials);
      }
    });

    const loadEvents = async () => {
      try {
        setIsLoading(true)

        if (auth.currentUser) {
          const userEvents = await fetchUserEvents(auth.currentUser.uid)

          if (userEvents.length === 0) {
            // await setupDefaultEventsForUser(auth.currentUser.uid)
            const updatedEvents = await fetchUserEvents(auth.currentUser.uid)
            setEvents(updatedEvents)
          } else {
            setEvents(userEvents)
          }
        } else {
          setEvents(DEFAULT_EVENTS.map(e => ({
            ...e,
            id: `template-${e.name.toLowerCase()}`,
            createdAt: new Date().toISOString()
          })))
        }
      } catch (error) {
        console.error("Error loading events:", error)
        toast.error("Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()

    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="overflow-hidden pb-[30px] md:pb-[59px] wedding-planner-container relative">
      {/* Vector lines with improved positioning - hide on small screens, show on medium+ */}
      {/* <img 
        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743223989/Vector_2_yxm5qh.png" 
        className="hidden md:block absolute left-0 top-[10%] z-10 w-[30%] max-w-[350px]" 
        alt="Vector line 2"
        style={{ transform: "rotate(-10deg)" }}
      />
      <img 
        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743223985/Vector_1_w0dvjx.png" 
        className="hidden md:block absolute left-[10%] top-[40%] z-10 w-[60%] max-w-[600px]" 
        alt="Vector line 1"
      />
      <img 
        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743223993/Vector_3_y1p4nz.png" 
        className="hidden md:block absolute right-[5%] top-[25%] z-10 w-[25%] max-w-[300px]" 
        alt="Vector line 3"
        style={{ transform: "rotate(15deg)" }}
      /> */}

      <div
        className="hidden md:block absolute rounded-[21.33px] opacity-80 bg-gradient-radial from-[#67E8F9] to-[#C084FC] blur-[100px] pointer-events-none z-0"
        style={{
          width: '1042.82px',
          height: '815.18px',
          left: '250px',
          top: '350px',
          transform: 'rotate(-135deg)',
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-20 pt-2  rounded-[20px] md:rounded-[40px] max-md:max-w-full">
        <div className="w-full max-w-full md:max-w-[1568px]">


          <div className="flex w-full items-center justify-between py-4 md:py-6 z-50 relative">
            <div className="text-[#252525] text-[16px] md:text-[19px] font-bold tracking-[0.15em] uppercase font-jakarta">logo</div>



            <div className="hidden md:flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                <Image
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                  className="w-4 md:w-5 h-4 md:h-5"
                  alt="Ceremony list icon"
                  width={20}
                  height={20}
                />
                <span className="text-[#252525] text-xs md:text-sm font-medium">Ceremony List</span>
              </div>
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                <Image
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                  className="w-4 md:w-5 h-4 md:h-5"
                  alt="Share icon"
                  width={20}
                  height={20}
                />
                <span className="text-[#252525] text-xs md:text-sm font-medium">Share</span>
              </div>
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                <Image
                  src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277185/marrygold/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7_ssdldy.svg"
                  className="w-4 md:w-5 h-4 md:h-5"
                  alt="Support icon"
                  width={20}
                  height={20}
                />
                <span className="text-[#252525] text-xs md:text-sm font-medium">Support</span>
              </div>

              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-[rgba(255,225,246,1)] flex items-center justify-center text-[rgba(255,51,160,1)] font-medium hover:bg-[rgba(255,225,246,0.8)] transition-colors cursor-pointer">
                      {userInitials}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-[rgba(255,51,160,1)]">
                          {auth.currentUser?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          {auth.currentUser?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <User className="w-4 h-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        signOut(auth).then(() => {
                          toast.success("Logged out successfully");
                        }).catch((error) => {
                          toast.error("Error logging out");
                        });
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>


            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
              >
                <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden absolute top-[60px] left-0 right-0 bg-white shadow-lg z-40 rounded-b-lg border-t border-gray-200 animate-slideDown">
              <div className="flex flex-col py-4">
                <div className="flex items-center gap-2 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                    {userInitials}
                  </div>
                </div>
                <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
                  <Image
                    src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                    className="w-5 h-5"
                    alt="Ceremony list icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#252525] text-sm font-medium">Ceremony List</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
                  <Image
                    src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277174/marrygold/899c24019f6b0ba80bc257c75303a5335bf84a13_gbmuzk.svg"
                    className="w-5 h-5"
                    alt="Share icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#252525] text-sm font-medium">Share</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
                  <Image
                    src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277185/marrygold/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7_ssdldy.svg"
                    className="w-5 h-5"
                    alt="Support icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#252525] text-sm font-medium">Support</span>
                </a>
              </div>
            </div>
          )}


          <div className="w-full max-w-full mt-6 md:mt-[107px] main-content-container">

            <div className="w-full max-w-full text-center md:text-left md:w-[649px] relative mb-10 md:mb-0">
              {/* Adding mobile-optimized gradient background */}
              {/* <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-[60px] rounded-3xl transform -translate-y-1/4 md:hidden"></div> */}

              {/* Desktop gradient (hidden on mobile) */}
              <div className="hidden md:block absolute w-[400px] h-[400px] -right-[650px] -top-[8em] rounded-[21.33px] opacity-20 bg-gradient-to-br from-[#67E8F9] to-[#C084FC] blur-[100px] pointer-events-none"></div>

              <h1 className="text-[rgba(37,37,37,1)] text-[32px] md:text-[48px] leading-[38px] md:leading-[53px] tracking-[-0.04em] max-md:max-w-full max-md:leading-[38px]">
                <span style={{ fontFamily: "'Sorts Mill Goudy', serif" }}>Plan Your Dream</span>
                <br />
                <span style={{ fontFamily: "'Sorts Mill Goudy', serif", color: "rgba(255,51,160,1)" }}>Wedding</span>
              </h1>
              <p className="font-dm-sans text-[#888] text-[16px] md:text-[19px] font-light leading-[24px] md:leading-[30px] mt-3 md:mt-5 max-w-[90%] mx-auto md:mx-0 md:max-w-full">
                Plan Your Dream Wedding with ease! From creating guest lists and tracking budgets to managing ceremonies and sharing updates, our wedding management software simplifies every detail of your special day. Start planning now              </p>
            </div>

            <div className="w-full mt-8 md:mt-10 relative" style={{ height: "100vh", maxHeight: "1000px", overflow: "visible" }}>

              <ReactFlowProvider>
                <EventsFlow events={events} isLoading={isLoading} />
              </ReactFlowProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WeddingPlanner />
    </ReactFlowProvider>
  )
}


