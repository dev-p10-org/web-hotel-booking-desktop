import { createContext, useContext, useState, type ReactNode } from "react"

type BookingContextType = {
  selectedCity: string | null
  selectedDates: { checkIn: Date | null; checkOut: Date | null }
  selectedHotel: string | null
  selectedRoom: string | null
  selectedRooms: Record<
    string,
    {
      roomId: string
      ratePlanCode: string
      quantity: number
    }
  >
  guestInfo: {
    name: string
    email: string
    phone: string
    specialRequests: string
  }
  setSelectedCity: (city: string | null) => void
  setSelectedDates: (dates: { checkIn: Date | null; checkOut: Date | null }) => void
  setSelectedHotel: (hotel: string | null) => void
  setSelectedRoom: (room: string | null) => void
  setSelectedRooms: (
    rooms: Record<
      string,
      {
        roomId: string
        ratePlanCode: string
        quantity: number
      }
    >,
  ) => void
  setGuestInfo: (info: {
    name: string
    email: string
    phone: string
    specialRequests: string
  }) => void
  resetBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null
    checkOut: Date | null
  }>({
    checkIn: null,
    checkOut: null,
  })
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedRooms, setSelectedRooms] = useState<
    Record<
      string,
      {
        roomId: string
        ratePlanCode: string
        quantity: number
      }
    >
  >({})
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const resetBooking = () => {
    setSelectedCity(null)
    setSelectedDates({ checkIn: null, checkOut: null })
    setSelectedHotel(null)
    setSelectedRoom(null)
    setSelectedRooms({})
    setGuestInfo({
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    })
  }

  return (
    <BookingContext.Provider
      value={{
        selectedCity,
        selectedDates,
        selectedHotel,
        selectedRoom,
        selectedRooms,
        guestInfo,
        setSelectedCity,
        setSelectedDates,
        setSelectedHotel,
        setSelectedRoom,
        setSelectedRooms,
        setGuestInfo,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
