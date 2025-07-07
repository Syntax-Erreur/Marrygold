'use client';

import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
 
 
interface Budget {
  id: string;
  totalBudget: number;
  totalSpending: number;
  userId: string;
  updatedAt: string;
}

interface Event {
  id: string;
  name: string;
  totalBudget: number;
  totalSpending: number;
  tag: string;
  userId: string;
  createdAt: string;
  themeColorIndex?: number;
}

interface EventListProps {
  globalBudget: Budget | null;
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchEvents = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.uid]);

  const getEventIcon = (eventName: string) => {
    const iconMap: Record<string, string> = {
      'haldi': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/6c59624b96633f59e5e076b4ba7b5cb1f9d68777",
      'sangeeth': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/245e75eeb521326c7a319bc2fff1c0d5820e0d6f",
      'engagement': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/0a33b28c1d4f221aa5c55b426036738590946b2f",
      'default': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/5ccb10e8ab826da7d67dcbec4c7f56a13b6790ff"
    };
    return iconMap[eventName.toLowerCase()] || iconMap.default;
  };

  const getEventBgColor = (themeColorIndex?: number) => {
    const bgColorMap: Record<number, string> = {
      0: "bg-[rgba(255,251,232,1)]",  
      1: "bg-[rgba(232,235,255,1)]", 
      2: "bg-[rgba(225,243,252,1)]", 
      3: "bg-[rgba(255,225,246,1)]", 
      4: "bg-[rgba(235,255,236,1)]", 
      5: "bg-[rgba(245,235,255,1)]", 
    };
    return bgColorMap[themeColorIndex || 0] || bgColorMap[0];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.name}
          totalBudget={event.totalBudget || 0}
          totalSpending={event.totalSpending || 0}
          iconSrc={getEventIcon(event.name)}
          iconBgColor={getEventBgColor(event.themeColorIndex)}
        />
      ))}
    </div>
  );
};

export default EventList;
