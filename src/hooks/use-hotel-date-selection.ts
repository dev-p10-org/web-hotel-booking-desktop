import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBooking } from "@/components/booking-provider"

const hotelId = import.meta.env.VITE_HOTEL_ID || "hotel-pesan"
const baseUrl = import.meta.env.VITE_BASE_URL || "https://api-instant.pesan.io"


// Interface for hotel data
interface HotelData {
  hotelId: string
  hotelImageUrls: string[]
  hotelLocation: string
  hotelName: string
  hotelUsername: string
  hotelRating: number
  night: number
  rooms: any[]
  name: string
  address: string
  checkinTime: string
  checkoutTime: string
  generalTel: string
}

export function useHotelDateSelection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedDates, setSelectedDates } = useBooking()
  const [hotel, setHotel] = useState<HotelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)

 


  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        // Get today and tomorrow's date for default availability check
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Format dates for API
        const formatDateForApi = (date: Date) => {
          return date.toISOString().split("T")[0]
        }

        const checkinDate = formatDateForApi(today)
        const checkoutDate = formatDateForApi(tomorrow)

        // Use the available-rooms API to fetch hotel details with availability
        const response = await fetch(`${baseUrl}/guest/hotels/${hotelId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch hotel details")
        }

        const data = await response.json()
        if (data.data) {
          setHotel(data.data) // Get the first hotel from the response
        } else {
          throw new Error("Hotel not found")
        }
      } catch (error) {
        console.error("Error fetching hotel:", error)
        setError("Failed to load hotel details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (hotelId) {
      fetchHotelDetails()
    }
  }, [hotelId, baseUrl])

  // Set default dates if not already selected
  useEffect(() => {
    if (!selectedDates.checkIn && !selectedDates.checkOut) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      setSelectedDates({
        checkIn: today,
        checkOut: tomorrow,
      })
    }
  }, [selectedDates.checkIn, selectedDates.checkOut, setSelectedDates])

  const handleDateSelectCheckIn = (date: Date | undefined) => {
    if (!date) return

    // Create a copy of the current selected dates
    const updatedDates = {
      ...selectedDates,
      checkIn: date,
    }

    // If checkout is before the new check-in OR undefined, update checkout to check-in +1 day
    if (!selectedDates.checkOut || selectedDates.checkOut <= date) {
      const nextDay = new Date(date)
      nextDay.setDate(date.getDate() + 1)

      updatedDates.checkOut = nextDay
    }

    setSelectedDates(updatedDates)
    setCheckInOpen(false)
  }

  const handleDateSelectCheckOut = (date: Date | undefined) => {
    if (!date) return

    // Ensure checkout date is after checkin date
    if (selectedDates.checkIn && date > selectedDates.checkIn) {
      setSelectedDates({
        ...selectedDates,
        checkOut: date,
      })
    }
    setCheckOutOpen(false)
  }

  const handleContinue = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      // Format dates as YYYY-MM-DD for URL parameters
      const formatDateForUrl = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      const checkinFormatted = formatDateForUrl(selectedDates.checkIn)
      const checkoutFormatted = formatDateForUrl(selectedDates.checkOut)

      // Construct URL with parameters to return to hotel detail page
      navigate(`/hotel-rooms?checkin=${checkinFormatted}&checkout=${checkoutFormatted}`)
    }
  }

  // Calculate number of nights
  const getNights = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      return Math.ceil((selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  // Format date to Indonesian format
  const formatDateIndonesian = (date: Date | null) => {
    if (!date) return ""

    // Get day name in Indonesian
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const dayName = dayNames[date.getDay()]

    // Get month name in Indonesian
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ]
    const monthName = monthNames[date.getMonth()]

    return `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`
  }

  return {
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
    getNights,
    formatDateIndonesian,
  }
}
