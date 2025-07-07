'use client';

import React, { useEffect, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import EventList from "./EventList";
import { db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
}

interface Installment {
  amount: number;
  date: string;
  status: string;
}

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

const BudgetPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [globalBudget, setGlobalBudget] = useState<Budget | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all events
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        let eventsList = eventsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          totalBudget: Number(doc.data().totalBudget) || 0,
          totalSpending: 0,
          name: doc.data().name.toLowerCase() // Ensure lowercase for consistency
        })) as Event[];

        console.log("Initial events list:", eventsList);

        // 2. Fetch all payments for each event
        const eventPaymentsPromises = eventsList.map(async (event) => {
          const paymentsQuery = query(
            collection(db, "payments"),
            where("eventId", "==", event.id)
          );
          
          const paymentsSnapshot = await getDocs(paymentsQuery);
          const payments = paymentsSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Payment[];

          console.log(`Payments for event ${event.name}:`, payments);

          // Calculate total spending from payments
          const totalSpending = payments.reduce((sum, payment) => {
            const paymentAmount = Number(payment.amount) || 0;
            console.log(`Amount for payment ${payment.id}:`, paymentAmount);
            return sum + paymentAmount;
          }, 0);

          console.log(`Total spending calculated for ${event.name}:`, totalSpending);

          return {
            ...event,
            totalSpending
          };
        });

        // Wait for all payment calculations
        eventsList = await Promise.all(eventPaymentsPromises);
        console.log("Final events list with spending:", eventsList);

        // 3. Calculate global budget totals
        const totalBudget = eventsList.reduce((sum, event) => {
          console.log(`Adding budget for ${event.name}:`, event.totalBudget);
          return sum + (event.totalBudget || 0);
        }, 0);
        const totalSpending = eventsList.reduce((sum, event) => {
          console.log(`Adding spending for ${event.name}:`, event.totalSpending);
          return sum + (event.totalSpending || 0);
        }, 0);

        console.log("Global totals:", { totalBudget, totalSpending });

        // 4. Update or create global budget
        const budgetQuery = query(
          collection(db, "budgets"),
          where("userId", "==", user.uid),
          where("isGlobal", "==", true)
        );
        
        const budgetSnapshot = await getDocs(budgetQuery);
        
        if (!budgetSnapshot.empty) {
          const budgetDoc = budgetSnapshot.docs[0];
          await updateDoc(doc(db, "budgets", budgetDoc.id), {
            totalBudget,
            totalSpending,
            updatedAt: new Date().toISOString()
          });
          setGlobalBudget({
            ...budgetDoc.data() as Budget,
            id: budgetDoc.id,
            totalBudget,
            totalSpending
          });
        } else {
          const newBudgetRef = await addDoc(collection(db, "budgets"), {
            userId: user.uid,
            totalBudget,
            totalSpending,
            isGlobal: true,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          });
          
          setGlobalBudget({
            id: newBudgetRef.id,
            userId: user.uid,
            totalBudget,
            totalSpending,
            updatedAt: new Date().toISOString()
          });
        }

        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching budget data:", error);
        toast.error("Failed to load budget data");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [user?.uid]);

  const calculatePercentage = (spending: number, budget: number): string => {
    if (budget <= 0) return '0%';
    if (spending <= 0) return '0%';
    const percentage = Math.round((spending / budget) * 100);
    return `${percentage}%`;
  };

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading budget data...</span>
    </div>;
  }

  return (
    <div className="bg-[rgba(249,249,249,1)] overflow-hidden pb-[70px]">
      <div className="flex w-full flex-col items-center max-md:max-w-full">
        <Header />
        <div className="w-full max-w-[1644px] px-4 flex justify-between items-center">
          <SearchBar 
            onAddEvent={async (data) => {
              if (!user?.uid) return;
              
              try {
  
                const newEventRef = await addDoc(collection(db, "events"), {
                  userId: user.uid,
                  name: data.name,
                  totalBudget: Number(data.totalBudget) || 0,
                  totalSpending: 0,
                  tag: data.name.toLowerCase(),
                  createdAt: new Date().toISOString()
                });

  
                const newEvent = {
                  id: newEventRef.id,
                  userId: user.uid,
                  name: data.name,
                  totalBudget: Number(data.totalBudget) || 0,
                  totalSpending: 0,
                  tag: data.name.toLowerCase(),
                  createdAt: new Date().toISOString()
                };
                
                setEvents(prevEvents => [...prevEvents, newEvent]);

         
                if (globalBudget) {
                  const newTotalBudget = globalBudget.totalBudget + (Number(data.totalBudget) || 0);
                  await updateDoc(doc(db, "budgets", globalBudget.id), {
                    totalBudget: newTotalBudget,
                    updatedAt: new Date().toISOString()
                  });
                  setGlobalBudget({
                    ...globalBudget,
                    totalBudget: newTotalBudget
                  });
                }
              } catch (error) {
                console.error("Error creating event:", error);
                throw error;
              }
            }}
          />
        </div>
        <div className="flex flex-col items-center w-full max-w-[1644px] px-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Welcome to Your Budget Planner</h3>
              <p className="text-gray-600">Click on any default event to start managing your budget</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            
              </div>
            </div>
          ) : (
            <EventList 
              globalBudget={globalBudget} 
              events={events.map(event => ({
                ...event,
                totalBudget: event.totalSpending || 0,
                percentage: calculatePercentage(event.totalSpending, event.totalBudget)
              }))} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
