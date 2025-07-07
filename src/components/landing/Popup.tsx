"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  eventData?: {
    title?: string;
    id?: string;
  };
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, anchorEl, eventData }) => {
  const router = useRouter();
  console.log('Popup render:', { isOpen, hasAnchorEl: !!anchorEl, eventData });

  if (!anchorEl) {
    console.log('No anchorEl provided');
    return null;
  }

  const rect = anchorEl.getBoundingClientRect();
 

 
  const getMenuItems = () => {
    const eventName = eventData?.title?.toLowerCase() || '';
 
    if (eventName === 'dashboard') {
      return [
        {
          id: "overview",
          iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png",
          text: "Overview",
          href: "/dashboard"
        },
        {
          id: "settings",
          iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442899/Cardholder_mhamqi.png",
          text: "Settings",
          href: "/settings"
        }
      ];
    }

 
    return [
      {
        id: "guest-list",
        iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png",
        text: "Guest List",
        href: `/${eventName}/guest-list`
      },
      {
        id: "ceremony-research",
        iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442207/Vector_zjnfjw.png",
        text: "Ceremony Research",
        href: `/${eventName}/ceremony-research`
      },
      {
        id: "mood-board",
        iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743442899/Cardholder_mhamqi.png",
        text: "Mood Board",
        href: `/${eventName}/mood-board`
      },
      {
        id: "payment-reminder",
        iconSrc: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743443082/Wallet_Money_ntauva.png",
        text: "Payment Reminder",
        href: `/${eventName}/payment`
      },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: rect.bottom + 8,
            left: rect.left - 180,
            zIndex: 9999,
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 w-[220px] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-white opacity-100" />
          <nav className="p-1.5 relative">
            <ul className="list-none p-0 m-0 space-y-0.5">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer rounded-md"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                >
                  <div className="relative w-4 h-4 mr-2">
                    <Image
                      src={item.iconSrc}
                      alt={item.text}
                      sizes="(max-width: 768px) 100vw, 200px"
                      fill
                      className="object-contain"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[#252525]">{item.text}</span>
                </motion.div>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
