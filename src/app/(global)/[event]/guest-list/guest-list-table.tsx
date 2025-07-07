"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Guest, EventType } from "@/lib/types/guest"
import { useParams } from "next/navigation"
import { addGuestToEvent, deleteGuest } from "@/lib/firebase/guest-service"
import { toast } from "sonner"

interface GuestListTableProps {
  guests: Guest[]
  searchQuery: string
  isLoading?: boolean
  error?: Error | null
  onGuestsDeleted?: () => void
}

export default function GuestListTable({ guests, searchQuery, isLoading, error, onGuestsDeleted }: GuestListTableProps) {
  const { event } = useParams()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [, setIsAddingGuest] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.mobileNumber.includes(searchQuery) ||
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddGuestToEvent = async (guestId: string) => {
    try {
      setIsAddingGuest(true)
      await addGuestToEvent(guestId, String(event))
      toast.success("Guest added to event successfully")
    } catch (error) {
      console.error("Error adding guest to event:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add guest to event")
    } finally {
      setIsAddingGuest(false)
    }
  }

  const totalItems = filteredGuests.length
  const pageCount = Math.ceil(totalItems / pageSize)
  const startIndex = pageIndex * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentPageItems = filteredGuests.slice(startIndex, endIndex)

  // Computed properties for checkbox state
  const pageItems = currentPageItems
  const pageItemIds = useMemo(() => new Set(pageItems.map(guest => guest.id)), [pageItems])

  const allCurrentPageSelected = useMemo(() =>
    pageItems.length > 0 &&
    pageItems.every(guest => selectedGuests.has(guest.id)),
    [selectedGuests, pageItems])

  const someCurrentPageSelected = useMemo(() =>
    !allCurrentPageSelected &&
    pageItems.some(guest => selectedGuests.has(guest.id)),
    [selectedGuests, pageItems, allCurrentPageSelected])

  // Toggle single guest selection
  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev)
      if (newSet.has(guestId)) {
        newSet.delete(guestId)
      } else {
        newSet.add(guestId)
      }
      return newSet
    })
  }

  // Toggle selection of all guests on current page
  const toggleAllCurrentPage = () => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev)

      // If all are selected, unselect them all
      if (allCurrentPageSelected) {
        pageItems.forEach(guest => {
          newSet.delete(guest.id)
        })
      }
      // Otherwise, select all on current page
      else {
        pageItems.forEach(guest => {
          newSet.add(guest.id)
        })
      }

      return newSet
    })
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedGuests(new Set())
  }


  const deleteSelectedGuests = async () => {
    setIsDeleting(true)

    try {

      const guestIdsToDelete = Array.from(selectedGuests)

      const deletePromises = guestIdsToDelete.map(async (id) => {
        await deleteGuest(id)
        return id
      })

      await Promise.all(deletePromises)

      const updatedGuests = guests.filter(guest => !selectedGuests.has(guest.id))

      setSelectedGuests(new Set())
      setIsDeleteDialogOpen(false)

      toast.success(`${selectedGuests.size} guest${selectedGuests.size > 1 ? 's' : ''} deleted successfully`)

      if (onGuestsDeleted) {
        onGuestsDeleted()
      }
    } catch (error) {
      console.error("Error deleting guests:", error)
      toast.error("Failed to delete guests")
    } finally {
      setIsDeleting(false)
    }
  }

  const firstPage = () => setPageIndex(0)
  const previousPage = () => setPageIndex(Math.max(0, pageIndex - 1))
  const nextPage = () => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))
  const lastPage = () => setPageIndex(pageCount - 1)

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading guests: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading guests...</p>
      </div>
    )
  }

  return (
    <div className="">
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Delete Guest{selectedGuests.size > 1 ? 's' : ''}</DialogTitle>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete {selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''}?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteSelectedGuests}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedGuests.size > 0 && (
        <div className="bg-white px-16 py-4 mb-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelections}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </Button>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 pt-6">
          <Table>
            <TableHeader className="bg-[#FCF7FC]/80">
              <TableRow className="border-none">
                <TableHead className="w-[50px] py-5 text-center">
                  <Checkbox
                    className="w-4 h-4 rounded"
                    checked={allCurrentPageSelected}

                    data-state={someCurrentPageSelected ? "indeterminate" : allCurrentPageSelected ? "checked" : "unchecked"}
                    onCheckedChange={toggleAllCurrentPage}
                  />
                </TableHead>
                <TableHead className="w-[50px] py-5 whitespace-nowrap font-medium tracking-[0.36px]">
                  <div className="flex items-center gap-1">
                    <span className="font-inter text-xs text-[#252525] uppercase">#</span>
                    <Image
                      src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310626/marrygold/column-sorting_rz0xzo.png"
                      alt="Sort"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-5 whitespace-nowrap">
                  <span className="font-inter font-medium text-xs leading-[18px] tracking-[0.08em] text-[#252525] uppercase">
                    GUEST NAME
                  </span>
                </TableHead>
                <TableHead className="py-5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525] uppercase">TABLE NO</span>
                    <Image
                      src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310626/marrygold/column-sorting_rz0xzo.png"
                      alt="Sort"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-inter font-medium text-xs leading-[18px] tracking-[0.03em] text-[#252525] uppercase">EVENTS</span>
                    <Image
                      src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743532190/info_jqqvct.png"
                      alt="Info"
                      width={4}
                      height={4}
                      className="w-4 h-4"
                    />
                  </div>
                </TableHead>
                <TableHead className="py-5 whitespace-nowrap">
                  <span className="font-inter font-medium text-xs leading-[18px] text-[#252525] uppercase">FOOD PREFERENCE</span>
                </TableHead>
                <TableHead className="py-5 whitespace-nowrap">
                  <span className="font-inter font-medium text-xs leading-[18px] text-[#252525] uppercase">MOBILE NUMBER</span>
                </TableHead>
                <TableHead className="py-5 whitespace-nowrap">
                  <span className="font-inter font-medium text-xs leading-[18px] text-[#252525] uppercase">EMAIL</span>
                </TableHead>
                <TableHead className="py-5 whitespace-nowrap">
                  <span className="font-inter font-medium text-xs leading-[18px] text-[#252525] uppercase">SEND INVITATION</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageItems.map((guest, index) => (
                <TableRow
                  key={guest.id}
                  className={`border-b border-gray-100 ${selectedGuests.has(guest.id) ? 'bg-gray-50' : ''}`}
                >
                  <TableCell className="py-4 text-center">
                    <Checkbox
                      className="w-4 h-4 rounded"
                      checked={selectedGuests.has(guest.id)}
                      onCheckedChange={() => toggleGuestSelection(guest.id)}
                    />
                  </TableCell>
                  <TableCell className="py-4 text-sm font-normal text-[#252525]">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525]">{startIndex + index + 1}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525]">{guest.name}</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525]">{guest.tableNumber || "-"}</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {guest.events.map((eventName: EventType) => (
                        <div
                          key={eventName}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 ${eventName === "Haldi"
                            ? "bg-[#FFFBE8] text-[#677500]"
                            : eventName === "Mehendi"
                              ? "bg-[#E1FCEF] text-[#14804A]"
                              : "bg-[#FCF2E6] text-[#AA5B00]"
                            }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${eventName === "Haldi"
                            ? "bg-[#677500]"
                            : eventName === "Mehendi"
                              ? "bg-[#14804A]"
                              : "bg-[#AA5B00]"
                            }`}></div>
                          <span className="font-inter font-medium text-xs leading-[18px]">{eventName}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-center">
                      {guest.foodPreference === "Veg" ? (
                        <div className="inline-flex items-center gap-1 bg-[#E1FCEF] rounded-lg px-5 py-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#14804A]"></div>
                          <span className="font-inter font-medium text-xs leading-[18px] text-[#14804A]">Veg</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-[#FCF2E6] rounded-lg px-5 py-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#AA5B00]"></div>
                          <span className="font-inter font-medium text-xs leading-[18px] text-[#AA5B00]">Non Veg</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525]">{guest.mobileNumber}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-inter font-medium text-xs leading-[18px] text-[#252525]">{guest.email || "-"}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button className="bg-[#252525] hover:bg-[#252525]/90 h-[34px] rounded-lg flex items-center gap-1.5 text-xs font-semibold px-5">
                      <Image
                        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743512453/Vector_sugdh7.png"
                        alt="WhatsApp"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="font-inter text-xs font-semibold">Send</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between py-6 px-5">
            <div className="text-xs font-medium text-[#252525] tracking-[0.36px]">
              {`${startIndex + 1}-${endIndex} of ${totalItems}`}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#252525] tracking-[0.36px]">Rows per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setPageIndex(0)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] text-xs">
                    <SelectValue>{pageSize}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={firstPage}
                  disabled={pageIndex === 0}
                  className="w-6 h-6 border border-gray-200 rounded-md p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={previousPage}
                  disabled={pageIndex === 0}
                  className="w-6 h-6 border border-gray-200 rounded-md p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="text-xs font-medium text-[#252525]">
                  {pageIndex + 1} / {pageCount}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={nextPage}
                  disabled={pageIndex === pageCount - 1}
                  className="w-6 h-6 border border-gray-200 rounded-md p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={lastPage}
                  disabled={pageIndex === pageCount - 1}
                  className="w-6 h-6 border border-gray-200 rounded-md p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
