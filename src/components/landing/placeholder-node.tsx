"use client"

import type React from "react"
import { useCallback, type ReactNode, forwardRef, useState, useRef, useEffect } from "react"
import { useReactFlow, useNodeId, Handle, Position } from "@xyflow/react"
import { BaseNode } from "@/components/landing/base-node"
import { EllipsisVerticalIcon } from "lucide-react"
import Popup from "./Popup"
import { createPortal } from "react-dom"
import Image from "next/image"

export interface EventNodeData {
  title?: string
  date?: string
  attendees?: number
  bgColor?: string
  label?: string
  [key: string]: unknown
}

// Define a type for form data received from modal
export interface EventFormData {
  eventName: string
  eventTag: string
  tables: string
  peoplePerTable: string
  themeColorIndex: number | null
}

// Map color index to background color class
// const themeColorMap: Record<number, string> = {
//   0: "bg-[rgba(255,251,232,1)]", // Yellow
//   1: "bg-[rgba(225,243,252,1)]", // Blue
//   2: "bg-[rgba(255,225,246,1)]", // Pink
//   3: "bg-[rgba(235,255,236,1)]", // Green
//   4: "bg-[rgba(245,235,255,1)]", // Purple
// }

// Add a global variable to store the last form submission
let lastFormSubmission: EventFormData | null = null;

// Function to set form data when modal submits
export const setLastFormSubmission = (formData: EventFormData) => {
  lastFormSubmission = formData;
};

// Function to get and clear form data
export const getAndClearLastFormSubmission = () => {
  const data = lastFormSubmission;
  lastFormSubmission = null;
  return data;
};

export type EventNodeProps = {
  selected?: boolean
  data?: EventNodeData
  children?: ReactNode
}

// Add this helper function at the top of the file
// const calculateNewNodePosition = (nodes: Node[], lastNodeId: string) => {
//   const lastNode = nodes.find(n => n.id === lastNodeId);
//   if (!lastNode) return { x: 1040, y: 400 }; // Default position if no last node

//   // Get all vertical positions
//   const existingYPositions = nodes
//     .filter(n => Math.abs(n.position.x - lastNode.position.x) < 50) // Nodes in same column
//     .map(n => n.position.y);

//   // Find first available vertical gap
//   let newY = lastNode.position.y;
//   const spacing = 120; // Vertical spacing between nodes
  
//   while (existingYPositions.some(y => Math.abs(y - newY) < spacing)) {
//     newY += spacing;
//   }

//   // If we're getting too far down, create a new column
//   if (newY > 800) {
//     return {
//       x: lastNode.position.x + 300, // Move to new column
//       y: 40 // Start from top
//     };
//   }

//   return {
//     x: lastNode.position.x,
//     y: newY
//   };
// };

export const EventNode = forwardRef<HTMLDivElement, EventNodeProps>(({ selected, data = {} }, ref) => {
  const id = useNodeId()
  console.log(id)
  const {  } = useReactFlow()
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  const isSelected = selected === true

  // Track window width for responsive adjustments
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showPopup &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as HTMLElement)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPopup(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Add portal container for popup
  useEffect(() => {
    const portalContainer = document.createElement('div');
    portalContainer.id = 'popup-portal';
    document.body.appendChild(portalContainer);
    return () => {
      document.body.removeChild(portalContainer);
    };
  }, []);


  // Update the Add Event button click handler
  if (data?.label === "Add New Event") {
    return (
      <BaseNode 
        ref={ref} 
        selected={isSelected} 
        className={`w-full sm:w-[260px] bg-white border-none rounded-2xl ${windowWidth < 768 ? 'scale-90' : ''}`}
      >
        <div className="bg-[rgba(246,246,246,1)] overflow-hidden text-[15px] text-[rgba(37,37,37,1)] font-bold leading-none px-[70px] py-4 max-md:px-5 rounded-t-2xl">
          Add New Event
        </div>
        <div className="flex justify-center py-4">
          <button 
            onClick={() => {
              // Only trigger the modal, don't create nodes yet
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('openCreateEventModal');
                window.dispatchEvent(event);
              }
            }}
            className="bg-[rgba(246,246,246,1)] flex w-14 items-center justify-center gap-2.5 h-14 p-4 rounded-[57px] hover:bg-gray-200 transition-colors"
          >
            <Image
              width={24}
              height={24}
              src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/53a270e400cbb67b7ec2e144818544ab552b6c46?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Add icon"
            />
          </button>
        </div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ top: "50%", transform: "translateY(-50%)", visibility: "hidden" }}
        />
      </BaseNode>
    )
  }

  return (
    <BaseNode
      ref={(el) => {
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      selected={isSelected}
      className={`w-full sm:w-[260px] pb-[34px] bg-white border-none shadow-sm rounded-2xl overflow-visible ${windowWidth < 768 ? 'scale-90' : ''}`}
      style={{
        position: "relative",
        maxWidth: windowWidth < 768 ? "230px" : "260px",
      }}
    >
      <div
        className={`${data?.bgColor || "bg-[rgba(255,251,232,1)]"} overflow-visible text-[15px] font-bold leading-none p-4 max-md:pr-5 flex justify-between items-center relative z-[999] rounded-t-2xl`}
      >
        <span>{data?.title || "Event"}</span>
        <div className="relative" style={{ zIndex: 9999 }}>
          <button 
            ref={buttonRef}
            className="flex items-center p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer relative z-[9999]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked, event data:', data);
              setShowPopup(!showPopup);
            }}
            aria-label="More options"
            title="More options"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-[#333333]" />
          </button>
          {buttonRef.current && createPortal(
            <Popup 
              isOpen={showPopup} 
              onClose={() => setShowPopup(false)} 
              anchorEl={buttonRef.current}
              eventData={{
                title: data?.title || "Event",
                id: id || undefined
              }}
            />,
            document.getElementById('popup-portal') || document.body
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px] font-normal tracking-[-0.19px] mt-[23px] mx-[15px] max-md:mx-2.5 relative z-20">
        <div className="bg-[rgba(246,246,246,1)] self-stretch flex items-center gap-2.5 justify-center my-auto p-2.5 rounded-[147px]">
          <Image
            width={20}
            height={20}
            src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/faf9c25c2e96fb766b68966b68e379988a91dac4?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto rounded-[5px]"
            alt="Calendar icon"
          />
          <div className="self-stretch my-auto">{data?.date || "06 - 01 - 2024"}</div>
        </div>
        <div className="bg-[rgba(246,246,246,1)] self-stretch flex items-center gap-2.5 justify-center my-auto p-2.5 rounded-[147px]">
          <Image
            width={20}
            height={20}
            src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/de6b9f826dfc069b7d2ef29558ba81d651586fc9?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="Attendees icon"
          />
          <div className="self-stretch my-auto">{data?.attendees || 24} Attendance</div>
        </div>
      </div>

      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            background: "#fff",
            border: "2px solid #666",
            width: "10px",
            height: "10px",
            visibility: "visible",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            background: "#fff",
            border: "2px solid #666",
            width: "10px",
            height: "10px",
            visibility: "visible",
          }}
        />
      </>
    </BaseNode>
  )
})

EventNode.displayName = "EventNode"

export type PlaceholderNodeProps = {
  selected?: boolean
  children?: ReactNode
}

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(({ selected, }, ref) => {
  const id = useNodeId()
  const { setNodes, setEdges } = useReactFlow()

  const isSelected = selected === true

  const handleClick = useCallback(() => {
    if (!id) return

    setEdges((edges) => edges.map((edge) => (edge.target === id ? { ...edge, animated: false } : edge)))

    // Instead of directly creating an event node, trigger the modal
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('openCreateEventModal');
      window.dispatchEvent(event);
    }
  }, [id, setEdges])

  return (
    <BaseNode
      ref={ref}
      selected={isSelected}
      className="w-[150px] border-none bg-[rgba(246,246,246,1)] p-2 flex items-center justify-center rounded-[57px] hover:bg-gray-200 text-[rgba(37,37,37,1)] font-bold cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center">
        <Image
          width={24}
          height={24}
          src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/53a270e400cbb67b7ec2e144818544ab552b6c46?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-6"
          alt="Add icon"
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          background: "#fff",
          border: "1px solid #999",
          width: "8px",
          height: "8px",
          visibility: "visible",
        }}
      />
    </BaseNode>
  )
})

PlaceholderNode.displayName = "PlaceholderNode"
