'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BudgetCard from "./BudgetCard";
import BudgetChart from "./BudgetChart";
import PaymentTypesList from "./PaymentTypesList";
import Header from "./Header";
import { db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

interface Payment {
  id: string;
  name: string;
  amount: number;
  category: string;
  eventId: string;
  userId: string;
  isPaid: boolean;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  budget: number;
  totalSpending: number;
  userId: string;
  createdAt: string;
  themeColorIndex: number;
  budgetTarget?: number;
}

interface BudgetData {
  totalSpending: number;
  budgetTarget: number;
  remainingBudget: number;
  budgetProgress: number;
}

const EventBudgetPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const params = useParams();
  const router = useRouter();
  const eventName = params.event as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Event[];
        
        setAllEvents(eventsList);
      } catch (error) {
        console.error("Error fetching all events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !eventName) return;

    const fetchEventData = async () => {
      try {
        setLoading(true);
        const eventQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid),
          where("name", "==", decodeURIComponent(eventName))
        );
        
        const eventSnapshot = await getDocs(eventQuery);
        
        if (!eventSnapshot.empty) {
          const eventDoc = eventSnapshot.docs[0];
          const eventData = eventDoc.data() as Event;
          setEvent({
            ...eventData,
            id: eventDoc.id
          });

          const paymentsQuery = query(
            collection(db, "payments"),
            where("eventId", "==", eventDoc.id)
          );
          
          const paymentsSnapshot = await getDocs(paymentsQuery);
          const paymentsList = paymentsSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Payment[];
          
          setPayments(paymentsList);

           const totalSpending = paymentsList.reduce((sum, payment) => sum + (payment.amount || 0), 0);
          
           if (totalSpending !== eventData.totalSpending) {
            await updateDoc(doc(db, "events", eventDoc.id), {
              totalSpending,
              updatedAt: new Date().toISOString()
            });
            
             setEvent(prev => prev ? { ...prev, totalSpending } : null);
          }
        } else {
          toast.error("Event not found");
          router.push('/budget');  
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [user?.uid, eventName, router]);

  const onAddPayment = async (paymentData: { name: string; amount: number; category: string }) => {
    if (!user?.uid || !event?.id) {
      toast.error("Please log in to add payments");
      return;
    }

    try {
      const newPayment = {
        eventId: event.id,
        userId: user.uid,
        name: paymentData.name,
        amount: paymentData.amount,
        category: paymentData.category,
        isPaid: false,
        createdAt: new Date().toISOString()
      };

      const paymentRef = await addDoc(collection(db, "payments"), newPayment);
      
      setPayments(prev => [...prev, { ...newPayment, id: paymentRef.id }]);

      const newTotalSpending = (event.totalSpending || 0) + paymentData.amount;
      await updateDoc(doc(db, "events", event.id), {
        totalSpending: newTotalSpending,
        updatedAt: new Date().toISOString()
      });

      setEvent(prev => prev ? { ...prev, totalSpending: newTotalSpending } : null);
      toast.success("Payment added successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view budgets</p>
        </div>
      </div>
    );
  }

  const getEventIcon = (eventName: string) => {
    const iconMap: Record<string, string> = {
      'haldi': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/6c59624b96633f59e5e076b4ba7b5cb1f9d68777",
      'sangeeth': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/245e75eeb521326c7a319bc2fff1c0d5820e0d6f",
      'engagement': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/0a33b28c1d4f221aa5c55b426036738590946b2f",
      'default': "https://cdn.builder.io/api/v1/image/assets/9c8e999af23648e3b852e3b10fee19a0/5ccb10e8ab826da7d67dcbec4c7f56a13b6790ff"
    };
    return iconMap[eventName.toLowerCase()] || iconMap.default;
  };

  const getEventBgColor = (themeColorIndex: number) => {
    const bgColorMap: Record<number, string> = {
      0: "bg-[rgba(255,251,232,1)]", 
      1: "bg-[rgba(232,235,255,1)]", 
      2: "bg-[rgba(225,243,252,1)]", 
      3: "bg-[rgba(255,225,246,1)]", 
      4: "bg-[rgba(235,255,236,1)]", 
      5: "bg-[rgba(245,235,255,1)]", 
    };
    return bgColorMap[themeColorIndex] || bgColorMap[0];
  };

  const totalSpending = event?.totalSpending || 0;
  const budgetTarget = event?.budgetTarget || 0;
  const remainingBudget = budgetTarget - totalSpending;
  const budgetProgress = event ? Math.round((totalSpending / budgetTarget) * 100) : 0;

  const budgetData: BudgetData = {
    totalSpending,
    budgetTarget,
    remainingBudget,
    budgetProgress,
  };

  return (
    <div className="bg-[#F9F9F9] pb-12">
      <Header />
      <main className="px-6 mt-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allEvents.map((evt) => (
            <div 
              key={evt.id}
              onClick={() => router.push(`/${encodeURIComponent(evt.name)}/budget`)}
              className="cursor-pointer"
            >
              <BudgetCard
                title={evt.name}
                totalBudget={evt.budgetTarget || evt.budget || 0}
                totalSpending={evt.totalSpending || 0}
                iconSrc={getEventIcon(evt.name)}
                iconBgColor={getEventBgColor(evt.themeColorIndex)}
                isHighlighted={evt.name.toLowerCase() === decodeURIComponent(eventName).toLowerCase()}
                isLoading={loading}
                showSpendingAsMain={true}
              />
            </div>
          ))}
        </section>

        {event && (
          <section className="flex flex-col lg:flex-row gap-6 mt-6">
            <PaymentTypesList
              eventName={event.name}
              paymentTypes={payments.map(p => ({
                name: p.name,
                amount: `${p.amount}$`,
                category: p.category
              }))}
              onAddPayment={onAddPayment}
            />

            <BudgetChart
              eventName={`${event.name} Budget`}
              budget={`${event.totalSpending || 0}$/${event.budget || 0}$`}
              iconSrc={getEventIcon(event.name)}
              paymentTypes={payments.map((payment, index) => ({
                name: payment.name,
                value: payment.amount,
                color: [
                  "#6174F1", "#76CA66", "#FFA053", "#22C3E6", "#985FEA", "#FB5A3F"
                ][index % 6]  
              }))}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default EventBudgetPage;
