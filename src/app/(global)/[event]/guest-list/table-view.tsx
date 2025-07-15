"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Check,
  X,
  GripVertical,
  PlusCircle,
  RefreshCw,
  ChevronsDown,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Guest } from "@/lib/types/guest";
import {
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  collection,
  deleteField,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

interface Table {
  id: string;
  userId: string;
  name: string;
  eventId: string;
  capacity: number;
  guests: Guest[];
  createdAt: string;
}

interface TableWiseViewProps {
  guests: Guest[];
  userId: string;
  onRefreshData: () => void;
}

export default function TableWiseView({
  guests,
  userId,
  onRefreshData,
}: TableWiseViewProps) {
  const { event } = useParams();
  const eventName = decodeURIComponent(String(event)).toLowerCase();

  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);
  const [enableGuestAccess, setEnableGuestAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);

  // Filter guests based on current event, using case-insensitive comparison
  const filteredGuests = useMemo(() => {
    // First, check if guests array is populated
    if (!guests || guests.length === 0) {
      return [];
    }

    // Normalize the event name for case-insensitive comparison
    const normalizedEventName = eventName.toLowerCase();

    // Filter guests that have this event in their events array
    return guests.filter((guest) =>
      guest.events.some(
        (guestEvent) => guestEvent.toLowerCase() === normalizedEventName
      )
    );
  }, [guests, eventName]);

  // Get unassigned guests for this event
  const unassignedGuests = useMemo(() => {
    const tableGuestIds = tables.flatMap((table) =>
      table.guests.map((g) => g.id)
    );
    return filteredGuests.filter((guest) => !tableGuestIds.includes(guest.id));
  }, [filteredGuests, tables]);

  // Load tables from Firebase
  const loadTables = async () => {
    try {
      setIsLoading(true);

      const tablesRef = collection(db, "tables");

      // 1. Get the event using the name (eventName from slug)
      const eventQuery = query(
        collection(db, "events"),
        where("name", "==", eventName),
        where("userId", "==", userId)
      );
      const eventSnapshot = await getDocs(eventQuery);

      if (eventSnapshot.empty) {
        toast.error(`Event "${eventName}" not found`);
        return;
      }

      const eventDoc = eventSnapshot.docs[0];
      const eventId = eventDoc.id;
      const eventData = eventDoc.data();

      // 2. Check if tables already exist for this user & event
      const tableQuery = query(
        tablesRef,
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      );
      const tableSnapshot = await getDocs(tableQuery);

      if (tableSnapshot.empty) {
        // No tables exist, create from event info
        const numberOfTables = eventData?.tables || 2;
        const peoplePerTable = eventData?.peoplePerTable || 8;

        const defaultTables: Table[] = Array.from(
          { length: numberOfTables },
          (_, i) => {
            const tableId = `table_${eventId}_${i + 1}_${Date.now()}`;
            return {
              id: tableId,
              userId,
              eventId,
              name: `Table ${i + 1}`,
              capacity: peoplePerTable,
              guests: [],
              createdAt: new Date().toISOString(),
            };
          }
        );

        const batch = writeBatch(db);
        defaultTables.forEach((table) => {
          const tableRef = doc(db, "tables", table.id);
          batch.set(tableRef, {
            id: table.id,
            userId: table.userId,
            eventId: table.eventId,
            name: table.name,
            capacity: table.capacity,
            createdAt: table.createdAt,
          });
        });

        await batch.commit();
        setTables(defaultTables);
      } else {
        // Tables already exist
        const loadedTables: Table[] = [];

        tableSnapshot.forEach((doc) => {
          const tableData = doc.data();
          loadedTables.push({
            id: doc.id,
            userId: tableData.userId,
            eventId: tableData.eventId,
            name: tableData.name,
            capacity: tableData.capacity || 8,
            guests: [],
            createdAt: tableData.createdAt,
          });
        });

        setTables(loadedTables);
      }
    } catch (error) {
      console.error("Error loading tables:", error);
      toast.error("Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize tables with assigned guests
  const assignGuestsToTables = () => {
    if (tables.length === 0 || filteredGuests.length === 0) return;

    const updatedTables = tables.map((table) => {
      // Find guests assigned to this table
      const assignedGuests = filteredGuests.filter(
        (guest) => guest.tableId === table.id
      );

      return {
        ...table,
        guests: assignedGuests,
      };
    });

    setTables(updatedTables);
  };

  // Load tables when component mounts
  useEffect(() => {
    loadTables();
  }, [userId]);

  // Assign guests to tables when guests or tables change
  useEffect(() => {
    assignGuestsToTables();
  }, [filteredGuests, tables.length]);

  useEffect(() => {
    // Log for debugging
    console.log("Event name:", eventName);
    console.log("All guests:", guests);
    console.log("Filtered guests:", filteredGuests);
    console.log("Current tables:", tables);
  }, [eventName, guests, filteredGuests, tables]);

  const handleDragStart = (guest: Guest) => {
    setDraggedGuest(guest);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();

    if (!draggedGuest) return;

    const targetTable = tables.find((t) => t.id === tableId);

    if (!targetTable) return;

    // Check if the table is full
    if (targetTable.guests.length >= targetTable.capacity) {
      toast.error(`Table ${targetTable.name} is full`);
      return;
    }

    // If the guest is already assigned to this table, do nothing
    if (draggedGuest.tableId === tableId) {
      setDraggedGuest(null);
      return;
    }

    // Assign the guest to the table
    handleAssignGuest(draggedGuest.id, tableId);
  };

  const handleAssignGuest = async (
    guestId: string,
    tableId: string | undefined
  ) => {
    setIsLoading(true);

    try {
      const guest = guests.find((g) => g.id === guestId);
      if (!guest) return;

      // Create a copy of the guest with the tableId
      const updatedGuest = { ...guest, tableId };

      // Update in database
      const guestRef = doc(db, "guests", guestId);

      if (tableId) {
        // Assign to table
        await updateDoc(guestRef, { tableId });

        // Update local state
        const targetTable = tables.find((t) => t.id === tableId);
        if (targetTable) {
          // Remove from any current table
          const updatedTables = tables.map((table) => ({
            ...table,
            guests: table.guests.filter((g) => g.id !== guestId),
          }));

          // Add to new table
          const finalTables = updatedTables.map((table) => {
            if (table.id === tableId) {
              return {
                ...table,
                guests: [...table.guests, updatedGuest],
              };
            }
            return table;
          });

          setTables(finalTables);
          toast.success(`${guest.name} assigned to ${targetTable.name}`);
        }
      } else {
        // Unassign from table
        await updateDoc(guestRef, { tableId: deleteField() });

        // Update local state - remove from any table
        const updatedTables = tables.map((table) => ({
          ...table,
          guests: table.guests.filter((g) => g.id !== guestId),
        }));

        setTables(updatedTables);
        toast.success(`${guest.name} unassigned from table`);
      }

      // Trigger refresh of parent data
      onRefreshData();
    } catch (error) {
      console.error("Error assigning guest:", error);
      toast.error("Failed to assign guest");
    } finally {
      setIsLoading(false);
      setDraggedGuest(null);
    }
  };

  const handleTableCreation = async () => {
    if (!newTableName.trim()) {
      toast.error("Please provide a table name");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get the event ID
      const eventQuery = query(
        collection(db, "events"),
        where("name", "==", eventName),
        where("userId", "==", userId)
      );
      const eventSnapshot = await getDocs(eventQuery);

      if (eventSnapshot.empty) {
        toast.error(`Event "${eventName}" not found`);
        return;
      }

      const eventDoc = eventSnapshot.docs[0];
      const eventId = eventDoc.id;

      // 2. Create new table
      const newTableId = `table_${Date.now()}`;
      const newTable: Table = {
        id: newTableId,
        userId,
        eventId,
        name: newTableName,
        capacity: 8,
        guests: [],
        createdAt: new Date().toISOString(),
      };

      // 3. Add table to database
      await setDoc(doc(db, "tables", newTableId), {
        id: newTableId,
        userId,
        eventId,
        name: newTableName,
        capacity: 8,
        createdAt: new Date().toISOString(),
      });

      // 4. Update event's table count
      const eventRef = doc(db, "events", eventId);
      const eventDocData = await getDoc(eventRef);
      const currentTableCount = eventDocData.data()?.tables || 0;
      await updateDoc(eventRef, {
        tables: currentTableCount + 1,
      });

      setTables([...tables, newTable]);
      setNewTableName("");
      setIsCreatingTable(false);
      toast.success(`Table "${newTableName}" created`);
    } catch (error) {
      console.error("Error creating table:", error);
      toast.error("Failed to create table");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    const tableToDelete = tables.find((t) => t.id === tableId);
    if (!tableToDelete) return;

    if (tableToDelete.guests.length > 0) {
      const confirm = window.confirm(
        `Are you sure you want to delete ${tableToDelete.name}? This will unassign ${tableToDelete.guests.length} guests.`
      );
      if (!confirm) return;
    }

    setIsLoading(true);

    try {
      // Delete from database and unassign guests
      await deleteDoc(doc(db, "tables", tableId));

      // Unassign all guests from this table
      const batch = writeBatch(db);
      tableToDelete.guests.forEach((guest) => {
        const guestRef = doc(db, "guests", guest.id);
        batch.update(guestRef, { tableId: deleteField() });
      });

      await batch.commit();

      setTables(tables.filter((t) => t.id !== tableId));
      toast.success(`${tableToDelete.name} deleted`);
      onRefreshData();
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoGenerate = async () => {
    if (unassignedGuests.length === 0) {
      toast.error("No unassigned guests to place");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get the event ID
      const eventQuery = query(
        collection(db, "events"),
        where("name", "==", eventName),
        where("userId", "==", userId)
      );
      const eventSnapshot = await getDocs(eventQuery);

      if (eventSnapshot.empty) {
        toast.error(`Event "${eventName}" not found`);
        return;
      }

      const eventDoc = eventSnapshot.docs[0];
      const eventId = eventDoc.id;
      const eventData = eventDoc.data();

      // 2. Delete all existing tables for this event
      const tableQuery = query(
        collection(db, "tables"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      );
      const tableSnapshot = await getDocs(tableQuery);
      const batchDelete = writeBatch(db);

      tableSnapshot.forEach((doc) => {
        batchDelete.delete(doc.ref);
      });

      // Unassign all guests
      const guestBatch = writeBatch(db);
      filteredGuests.forEach((guest) => {
        const guestRef = doc(db, "guests", guest.id);
        guestBatch.update(guestRef, { tableId: deleteField() });
      });

      await Promise.all([batchDelete.commit(), guestBatch.commit()]);

      // 3. Create new tables based on event info or default
      const numberOfTables = Math.max(
        eventData?.tables || 2,
        Math.ceil(unassignedGuests.length / 8)
      );
      const peoplePerTable = eventData?.peoplePerTable || 8;

      const newTables: Table[] = Array.from(
        { length: numberOfTables },
        (_, i) => {
          const tableId = `table_${eventId}_${i + 1}_${Date.now()}`;
          return {
            id: tableId,
            userId,
            eventId,
            name: `Table ${i + 1}`,
            capacity: peoplePerTable,
            guests: [],
            createdAt: new Date().toISOString(),
          };
        }
      );

      // 4. Group guests by food preference for better matching
      const guestsToAssign = [...unassignedGuests];
      const vegGuests = guestsToAssign.filter(
        (g) => g.foodPreference === "Veg"
      );
      const nonVegGuests = guestsToAssign.filter(
        (g) => g.foodPreference === "Non Veg"
      );

      // 5. Helper function to assign guests to tables
      const assignGuestBatch = (guestBatch: Guest[], tablesList: Table[]) => {
        const updatedTables = [...tablesList];

        for (const guest of guestBatch) {
          // Find a table with available capacity
          const availableTable = updatedTables.find(
            (table) => table.guests.length < table.capacity
          );

          if (availableTable) {
            // Assign the guest to the first available table
            availableTable.guests.push(guest);
          }
        }

        return updatedTables;
      };

      // 6. Assign veg guests, then non-veg guests
      const tablesWithVegGuests = assignGuestBatch(vegGuests, newTables);
      const finalTables = assignGuestBatch(nonVegGuests, tablesWithVegGuests);

      // 7. Update in database
      const batch = writeBatch(db);

      // Add new tables
      for (const table of finalTables) {
        const tableRef = doc(db, "tables", table.id);
        batch.set(tableRef, {
          id: table.id,
          userId,
          name: table.name,
          eventId,
          capacity: table.capacity,
          createdAt: table.createdAt,
        });
      }

      // Update guest table assignments
      for (const table of finalTables) {
        for (const guest of table.guests) {
          const guestRef = doc(db, "guests", guest.id);
          batch.update(guestRef, { tableId: table.id });
        }
      }

      await batch.commit();

      setTables(finalTables);
      toast.success("Auto-generated seating plan");
      onRefreshData();
    } catch (error) {
      console.error("Error auto-generating seating plan:", error);
      toast.error("Failed to generate seating plan");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (table: Table) => {
    const isFull = table.guests.length >= table.capacity;
    return isFull ? "bg-red-100" : "bg-green-100";
  };

  return (
    <div className="py-4 px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Seating Arrangement for {eventName}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Enable Guest Access
            </label>
            <Switch
              checked={enableGuestAccess}
              onCheckedChange={setEnableGuestAccess}
              className={enableGuestAccess ? "bg-[#FF33A0]" : "bg-neutral-200"}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAutoGenerate}
            className="flex items-center gap> -2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || filteredGuests.length === 0}
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Auto-Generate Seating
          </Button>

          <Button
            onClick={() => setIsCreatingTable(true)}
            className="flex items-center gap-2 bg-[#FF33A0] hover:bg-[#e62e90] text-white"
            disabled={isLoading}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Table
          </Button>
        </div>
      </div>

      {isCreatingTable && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-3">Create New Table</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter table name"
              className="flex-1 px-4 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Button
              onClick={handleTableCreation}
              className="bg-[#FF33A0] hover:bg-[#e62e90] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Table"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreatingTable(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading && !tables.length ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Guests for {eventName}
          </h3>
          <p className="text-gray-500 mb-4">Add guests to this event first</p>
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Tables Created Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start by creating a new table or auto-generating a seating plan
          </p>
          <Button
            onClick={() => setIsCreatingTable(true)}
            className="bg-[#FF33A0] hover:bg-[#e62e90] text-white"
          >
            Add New Table
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tables.map((table) => {
            const isFull = table.guests.length >= table.capacity;

            return (
              <div
                key={table.id}
                className={`bg-white rounded-lg shadow border overflow-hidden ${
                  draggedGuest && !isFull
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, table.id)}
              >
                <div
                  className={`px-4 py-3 flex justify-between items-center ${getStatusColor(table)}`}
                >
                  <h3 className="font-semibold text-gray-900">
                    {table.name} ({table.guests.length}/{table.capacity})
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-gray-200"
                      onClick={() => handleDeleteTable(table.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  {table.guests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 italic">
                      No guests assigned to this table
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {table.guests.map((guest) => (
                        <li
                          key={guest.id}
                          className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                          draggable
                          onDragStart={() => handleDragStart(guest)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {guest.name}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {guest.events.map((event, idx) => (
                                  <span
                                    key={idx}
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      event.toLowerCase() === "haldi"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : event.toLowerCase() === "sangeet"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {event}
                                  </span>
                                ))}
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    guest.foodPreference === "Veg"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {guest.foodPreference}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
                            onClick={() =>
                              handleAssignGuest(guest.id, undefined)
                            }
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {!isFull && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-dashed border-gray-300 text-gray-600 hover:text-[#FF33A0] hover:border-[#FF33A0]"
                          disabled={unassignedGuests.length === 0 || isLoading}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Guest
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-2" align="center">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 px-2">
                          Select a guest to add
                        </h4>
                        <Command>
                          <CommandInput placeholder="Search guests..." />
                          <CommandEmpty>No guests found</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {unassignedGuests.map((guest) => (
                              <CommandItem
                                key={guest.id}
                                onSelect={() => {
                                  handleAssignGuest(guest.id, table.id);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span>{guest.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {guest.events.join(", ")} •{" "}
                                    {guest.foodPreference}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unassigned Guests Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mt-8">
        <div className="px-4 py-3 bg-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            Unassigned Guests ({unassignedGuests.length})
          </h3>
        </div>

        <div className="p-4">
          {unassignedGuests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              All guests have been assigned to tables
            </div>
          ) : (
            <div className="space-y-2">
              {unassignedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                  draggable
                  onDragStart={() => handleDragStart(guest)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {guest.name}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guest.events.map((event, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              event.toLowerCase() === "haldi"
                                ? "bg-yellow-100 text-yellow-800"
                                : event.toLowerCase() === "sangeet"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {event}
                          </span>
                        ))}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            guest.foodPreference === "Veg"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {guest.foodPreference}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        disabled={isLoading}
                      >
                        Assign to Table
                        <ChevronsDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search tables..." />
                        <CommandEmpty>No tables found</CommandEmpty>
                        <CommandGroup>
                          {tables
                            .filter(
                              (table) => table.guests.length < table.capacity
                            )
                            .map((table) => (
                              <CommandItem
                                key={table.id}
                                onSelect={() =>
                                  handleAssignGuest(guest.id, table.id)
                                }
                                className="cursor-pointer"
                              >
                                <Check className="mr-2 h-4 w-4 opacity-0" />
                                {table.name} ({table.guests.length}/
                                {table.capacity})
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
