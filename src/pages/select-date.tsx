"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { MapPin, CalendarDays } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHotelDateSelection } from "@/hooks/use-hotel-date-selection"
import { SelectDateLoading } from "@/components/skeleton-select-date"

export default function HotelSelectDatePage() {

  // Use our custom hook
  const {
    hotel,
    loading,
    error,
    checkInOpen,
    checkOutOpen,
    selectedDates,
    setCheckInOpen,
    setCheckOutOpen,
    handleDateSelectCheckIn,
    handleDateSelectCheckOut,
    handleContinue,
    formatDateIndonesian,
  } = useHotelDateSelection()

  if (loading) {
    return <SelectDateLoading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu className="bg-transparent" />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col justify-center items-center h-full">

        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-500" />
            </div>
            <span className="text-2xl font-semibold">{hotel?.name || "Hotel Pesan.io"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 mb-2 font-medium">Check-In</div>
              <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center gap-3 py-3 border-b border-gray-200 focus:outline-none">
                    <CalendarDays className="h-5 w-5 text-primary-500" />
                    <span className="text-lg font-medium">
                      {selectedDates.checkIn ? formatDateIndonesian(selectedDates.checkIn) : "Pilih tanggal check-in"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDates.checkIn || undefined}
                    onSelect={handleDateSelectCheckIn}
                    disabled={(date) => {
                      const yesterday = new Date()
                      yesterday.setDate(yesterday.getDate() - 1)
                      return date < yesterday
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 mb-2 font-medium">Check-Out</div>
              <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center gap-3 py-3 border-b border-gray-200 focus:outline-none">
                    <CalendarDays className="h-5 w-5 text-primary-500" />
                    <span className="text-lg font-medium">
                      {selectedDates.checkOut
                        ? formatDateIndonesian(selectedDates.checkOut)
                        : "Pilih tanggal check-out"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDates.checkOut || undefined}
                    onSelect={handleDateSelectCheckOut}
                    disabled={(date) => !selectedDates.checkIn || date <= selectedDates.checkIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedDates.checkIn || !selectedDates.checkOut}
            className="w-full py-6 text-lg text-white bg-primary-500 hover:bg-primary-600 rounded-lg mt-8"
          >
            Cari Kamar
          </Button>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-6">{error}</div>}
        </div>
      </main>

      <footer className="border-t py-6 bg-white mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PesanBooking. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
