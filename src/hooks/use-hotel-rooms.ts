import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useBooking } from "@/components/booking-provider"

const baseUrl = import.meta.env.VITE_BASE_URL || "https://api-instant.pesan.io"
const hotelId = import.meta.env.VITE_HOTEL_ID || "hotel-pesan"


// API response interfaces
export interface RoomFacilityCategory {
  facilityCategoryName: string
  facilities: string[]
}

export interface RoomData {
  images: string[]
  rating: number
  roomId: string
  roomName: string
  breakfastInclude: boolean
  price: number
  qty: number
  roomDescription: string
  maxGuest: number
  night: number
  roomFacilityCategories: RoomFacilityCategory[]
  roomFacilities: string[]
  ratePlans: any[]
}

export interface HotelFacility {
  facilityName: string
  facilityImageUrl: string
  facilityCategory: string
}

export interface HotelFacilityCategory {
  facilityCategoryName: string
  facilityCategoryImageUrl: string
  facilities: string[]
}

export interface HotelDetailData {
  hotelId: string
  hotelImageUrls: string[]
  hotelLocation: string
  hotelName: string
  hotelUsername: string
  hotelRating: number
  night: number
  hotelFacilityCategories: HotelFacilityCategory[]
  hotelFacilities: HotelFacility[]
  minPrice: number
  rooms: RoomData[]
  termandcondition: string
}

export interface HotelDetailResponse {
  data: HotelDetailData[]
  meta: {
    total_data: number
    message: string
    success_code: string
    status_code: number
    page: number
    per_page: number
    total_page: number
  }
}

// Function to format price in IDR
export const formatIDR = (priceIDR: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceIDR)
}

// Mock data for hotel details

// Default facility categories with fallback icons
export const defaultFacilityCategories = []

export const getRatePlanPrice = (room: any, ratePlanCode?: string | null) => {
  if (!room || room.qty === 0) return Number.POSITIVE_INFINITY // Return Infinity for rooms with no availability

  if (room.ratePlans && room.ratePlans.length > 0) {
    if (ratePlanCode) {
      // Find the specific rate plan
      const selectedPlan = room.ratePlans.find((plan: any) => plan.code === ratePlanCode)
      if (selectedPlan) return selectedPlan.price
    }
    // Default to first rate plan
    return room.ratePlans[0].price
  }

  return room ? room.price : 0 // Fallback to room.price if no rate plans
}

export function useHotelRooms(searchParams: URLSearchParams) {
  const {
    selectedCity,
    selectedDates,
    selectedHotel,
    setSelectedHotel,
    setSelectedRoom,
    setSelectedCity,
    setSelectedDates,
    setSelectedRooms,
  } = useBooking()

  const [hotel, setHotel] = useState<any>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [paramsProcessed, setParamsProcessed] = useState(false)
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({})
  const [facilityCategories, setFacilityCategories] = useState(defaultFacilityCategories)
  const [selectedRatePlan, setSelectedRatePlan] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [selectedRoomsState, setSelectedRoomsState] = useState<
    Record<
      string,
      {
        roomId: string
        ratePlanCode: string
        quantity: number
      }
    >
  >({})

  // Process URL parameters only once
  useEffect(() => {
    console.log(debug, {
    hotelId,
    selectedCity,
    selectedDates,
    selectedHotel,
    searchParams,
    setSelectedCity,
    setSelectedDates,
    setSelectedHotel,
    paramsProcessed,
    setSelectedRooms,
    })
    
    if (paramsProcessed) return

    let shouldRedirect = false
    let redirectUrl = ""

    // Check if we need to update dates from URL
    const checkinParam = searchParams.get("checkin")
    const checkoutParam = searchParams.get("checkout")

    if (checkinParam && checkoutParam) {
      try {
        const checkIn = new Date(checkinParam)
        const checkOut = new Date(checkoutParam)

        // Only update if dates are different or not set
        if (
          !selectedDates.checkIn ||
          !selectedDates.checkOut ||
          selectedDates.checkIn.getTime() !== checkIn.getTime() ||
          selectedDates.checkOut.getTime() !== checkOut.getTime()
        ) {
          setSelectedDates({
            checkIn,
            checkOut,
          })
        }
      } catch (e) {
        console.error("Invalid date format in URL parameters:", e)
        shouldRedirect = true
        redirectUrl = hotelId ? `/select-date` : "/"
      }
    } else if (!selectedDates.checkIn || !selectedDates.checkOut) {
      shouldRedirect = true
      redirectUrl = hotelId ? `/select-date` : "/"
    }

    if (shouldRedirect) {
      return { shouldRedirect, redirectUrl }
    }

    // Fetch hotel details from API
    const fetchHotelDetails = async () => {
      try {
        const checkin = checkinParam || (selectedDates.checkIn ? format(selectedDates.checkIn, "yyyy-MM-dd") : "")
        const checkout = checkoutParam || (selectedDates.checkOut ? format(selectedDates.checkOut, "yyyy-MM-dd") : "")

        const response = await fetch(
          `${baseUrl}/guest/rooms/available-rooms?checkinDate=${checkin}&checkoutDate=${checkout}&hotelId=${hotelId}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch hotel details")
        }

        const data: HotelDetailResponse = await response.json()

        if (data.data && data.data.length > 0) {
          const hotelData = data.data[0]
          setHotel(hotelData)
          setSelectedHotel(hotelData)

          // Process facility categories from API response
          if (hotelData.hotelFacilityCategories && hotelData.hotelFacilityCategories.length > 0) {
            // Map API facility categories to our display format
            const apiCategories = hotelData.hotelFacilityCategories.map((category) => {
              // Find matching default category to get services
              const matchingDefault = defaultFacilityCategories.find(
                (c) => c.facilityCategoryName.toLowerCase() === category.facilityCategoryName.toLowerCase(),
              )

              return {
                facilityCategoryName: category.facilityCategoryName,
                facilityCategoryImageUrl: category.facilityCategoryImageUrl,
                icon: matchingDefault?.icon || null, // We'll use the image URL instead of an icon
                services: category.facilities || matchingDefault?.services || [],
              }
            })

            // Merge with default categories, prioritizing API data
            const mergedCategories = [...defaultFacilityCategories]

            // Replace defaults with API data where available
            apiCategories.forEach((apiCategory) => {
              const existingIndex = mergedCategories.findIndex(
                (c) => c.facilityCategoryName.toLowerCase() === apiCategory.facilityCategoryName.toLowerCase(),
              )

              if (existingIndex >= 0) {
                mergedCategories[existingIndex] = {
                  ...mergedCategories[existingIndex],
                  facilityCategoryImageUrl: apiCategory.facilityCategoryImageUrl,
                  services:
                    apiCategory.services.length > 0 ? apiCategory.services : mergedCategories[existingIndex].services,
                }
              } else if (mergedCategories.length < 5) {
                // Add new category if we have space
                mergedCategories.push(apiCategory)
              }
            })

            // Limit to 5 categories
            setFacilityCategories(mergedCategories.slice(0, 5))
          }

          if (hotelId !== selectedHotel) {
            setSelectedHotel(hotelId)
          }
        } else {
          // Fallback to mock data if API returns empty data
          return { shouldRedirect: true, redirectUrl: "/" }
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error)
        // Fallback to mock data if API fails
        return { shouldRedirect: true, redirectUrl: "/" }
      }

      setParamsProcessed(true)
      return { shouldRedirect: false, redirectUrl: "/" }
    }

    fetchHotelDetails()
  }, [
    hotelId,
    selectedCity,
    selectedDates,
    selectedHotel,
    searchParams,
    setSelectedCity,
    setSelectedDates,
    setSelectedHotel,
    paramsProcessed,
    setSelectedRooms,
  ])

  const handleRoomSelect = (roomId: string) => {
    if (selectedRoomId === roomId) {
      // If already selected, deselect it
      setSelectedRoomId(null)
      setSelectedRoom(null)
      setSelectedRatePlan(null)
    } else {
      // If not selected, select it and set quantity to 1
      setSelectedRoomId(roomId)
      setSelectedRoom(roomId)
      setRoomQuantities((prev) => ({
        ...prev,
        [roomId]: 1,
      }))

      // If the room has rate plans, select the first one by default
      const room = hotel.rooms.find((r: any) => (r.roomId || r.id) === roomId)
      if (room && room.ratePlans && room.ratePlans.length > 0) {
        setSelectedRatePlan(room.ratePlans[0].code)
      } else {
        setSelectedRatePlan(null)
      }
    }
  }

  const handleRatePlanSelect = (roomId: string, ratePlanCode: string) => {
    const roomRatePlanKey = `${roomId}-${ratePlanCode}`

    setSelectedRoomsState((prev) => {
      // Check if this room-rateplan combination is already selected
      if (prev[roomRatePlanKey]) {
        // If already selected, remove it
        const { [roomRatePlanKey]: removed, ...rest } = prev
        return rest
      } else {
        // If not selected, add it with quantity 1
        return {
          ...prev,
          [roomRatePlanKey]: {
            roomId,
            ratePlanCode,
            quantity: 1,
          },
        }
      }
    })

    // Keep the old selectedRoomId and selectedRatePlan for UI highlighting
    if (selectedRoomId === roomId && selectedRatePlan === ratePlanCode) {
      setSelectedRoomId(null)
      setSelectedRoom(null)
      setSelectedRatePlan(null)
    } else {
      setSelectedRoomId(roomId)
      setSelectedRoom(roomId)
      setSelectedRatePlan(ratePlanCode)
    }
  }

  const handleQuantityChange = (roomId: string, ratePlanCode: string, change: number) => {
    const roomRatePlanKey = `${roomId}-${ratePlanCode}`

    setSelectedRoomsState((prev) => {
      if (!prev[roomRatePlanKey]) return prev

      const currentQty = prev[roomRatePlanKey].quantity
      const newQty = Math.max(0, Math.min(5, currentQty + change))

      // If quantity becomes 0, remove this selection
      if (newQty === 0) {
        const { [roomRatePlanKey]: removed, ...rest } = prev
        return rest
      }

      // Otherwise update the quantity
      return {
        ...prev,
        [roomRatePlanKey]: {
          ...prev[roomRatePlanKey],
          quantity: newQty,
        },
      }
    })
  }

  const handleToggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((name) => name !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
  }

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const handleImageNavigation = (direction: "next" | "prev") => {
    if (!hotel) return

    const imageCount = hotel.hotelImageUrls?.length || hotel.images?.length || 0
    if (direction === "next") {
      setActiveImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1))
    } else {
      setActiveImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1))
    }
  }

  const saveBookingData = () => {
    if (Object.keys(selectedRoomsState).length === 0) return false

    // Save the selected rooms data to the booking context
    setSelectedRooms(selectedRoomsState)

    // Format selected rooms data for localStorage
    const roomsForStorage = Object.entries(selectedRoomsState)
      .map(([key, selection]) => {
        const [roomId, ratePlanCode] = key.split("-")
        const room = hotel.rooms.find((r: any) => (r.roomId || r.id) === roomId)

        if (!room) return null

        // Find the selected rate plan
        const selectedRatePlan =
          room.ratePlans?.find((plan: any) => plan.code === ratePlanCode) || room.ratePlans?.[0] || {}

        // Add order field to each rate plan (order = quantity selected for the selected plan, 0 for others)
        const ratePlansWithOrder = (room.ratePlans || []).map((plan: any) => ({
          ...plan,
          order: plan.code === ratePlanCode ? selection.quantity : 0, // Set order to quantity for selected plan, 0 for others
        }))

        return {
          breakfastInclude: room.breakfastInclude || selectedRatePlan.breakfast || false,
          images: room.images || [],
          maxGuest: room.maxGuest || 2,
          night: hotel.night || 1,
          order: selection.quantity, // Set order to quantity at room level too
          price: selectedRatePlan.price || room.price,
          qty: selection.quantity,
          ratePlans: ratePlansWithOrder || [
            {
              name: room.roomName || "Standard Room",
              code: ratePlanCode || "DEFAULT",
              isClosed: false,
              price: room.price,
              breakfast: room.breakfastInclude || false,
              order: selection.quantity, // Set order to quantity for fallback case
            },
          ],
          rating: room.rating || 0,
          roomDescription: room.roomDescription || "",
          roomFacilities: room.roomFacilities || [],
          roomFacilityCategories: room.roomFacilityCategories || [],
          roomId: room.roomId || roomId,
          roomName: room.roomName || "Standard Room",
        }
      })
      .filter(Boolean)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart_order_room", JSON.stringify(roomsForStorage))
    }

    // Save selected dates to localStorage
    if (typeof window !== "undefined" && selectedDates.checkIn && selectedDates.checkOut) {
      // Format dates as YYYY-M-DD
      const formatDateForStorage = (date: Date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }

      const datesForStorage = {
        checkin: formatDateForStorage(selectedDates.checkIn),
        checkout: formatDateForStorage(selectedDates.checkOut),
      }

      localStorage.setItem("selected_date", JSON.stringify(datesForStorage))

      // Save hotel data to localStorage
      const hotelDataForStorage = {
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        hotelLocation: hotel.hotelLocation,
        hotelUsername: hotel.hotelUsername,
        hotelRating: hotel.hotelRating,
        hotelImageUrls: hotel.hotelImageUrls || [],
        hotelFacilities: hotel.hotelFacilities || [],
        hotelFacilityCategories: hotel.hotelFacilityCategories || [],
        minPrice: hotel.minPrice,
        night: hotel.night || 1,
        rooms: hotel.rooms || [],
        termandcondition: hotel.termandcondition || "",
      }

      localStorage.setItem("hotel_data", JSON.stringify(hotelDataForStorage))
    }

    return true
  }

  const nights =
    selectedDates.checkIn && selectedDates.checkOut
      ? Math.ceil((selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  return {
    hotel,
    showFullDescription,
    activeImageIndex,
    selectedRoomId,
    roomQuantities,
    facilityCategories,
    selectedRatePlan,
    expandedCategories,
    selectedRoomsState,
    nights,
    handleRoomSelect,
    handleRatePlanSelect,
    handleQuantityChange,
    handleToggleCategory,
    handleToggleDescription,
    handleImageNavigation,
    saveBookingData,
    setActiveImageIndex,
  }
}
